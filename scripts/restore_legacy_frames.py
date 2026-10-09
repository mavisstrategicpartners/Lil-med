"""Restore pre-whiten legacy catalogue crops.

Studio crops come from the original drive photos. Soft files come from the
75px catalogue thumbs, enlarged onto a white square the same way as before.
"""
from __future__ import annotations

import os
import shutil

from PIL import Image, ImageFilter

ROOT = r"public/blood-collection/legacy"
BATCH = r"public/batch 1"
DRIVE = r"public/drive-download-20260630T094004Z-3-001/disposable vacuum blood collection tube"
SIZE = 1200


def frame_square_from_photo(im: Image.Image, box, dest: str) -> None:
    im = im.convert("RGB")
    x0, y0, x1, y1 = box
    cw, ch = x1 - x0, y1 - y0
    if cw > ch:
        extra = cw - ch
        y0 = max(0, y0 - extra // 2)
        y1 = min(im.height, y0 + cw)
        y0 = y1 - cw
    elif ch > cw:
        extra = ch - cw
        x0 = max(0, x0 - extra // 2)
        x1 = min(im.width, x0 + ch)
        x0 = x1 - ch
    crop = im.crop((x0, y0, x1, y1)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    crop.save(dest, quality=92)
    print(dest, (x0, y0, x1, y1), crop.size)


def content_box(im: Image.Image):
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r < 248 or g < 248 or b < 248:
                found = True
                if x < minx:
                    minx = x
                if y < miny:
                    miny = y
                if x > maxx:
                    maxx = x
                if y > maxy:
                    maxy = y
    if not found:
        return 0, 0, w, h
    return minx, miny, maxx + 1, maxy + 1


def enlarge_thumb(src_name: str, out_name: str) -> None:
    im = Image.open(os.path.join(BATCH, src_name)).convert("RGB")
    x0, y0, x1, y1 = content_box(im)
    bw, bh = x1 - x0, y1 - y0
    pad_x = max(2, int(bw * 0.06))
    pad_y = max(2, int(bh * 0.06))
    x0 = max(0, x0 - pad_x)
    y0 = max(0, y0 - pad_y)
    x1 = min(im.width, x1 + pad_x)
    y1 = min(im.height, y1 + pad_y)
    crop = im.crop((x0, y0, x1, y1))
    cw, ch = crop.size
    target = int(SIZE * 0.92)
    scale = target / max(cw, ch)
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    scaled = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    scaled = scaled.filter(ImageFilter.UnsharpMask(radius=1.2, percent=160, threshold=2))
    canvas = Image.new("RGB", (SIZE, SIZE), (255, 255, 255))
    canvas.paste(scaled, ((SIZE - nw) // 2, (SIZE - nh) // 2))
    dest = os.path.join(ROOT, out_name)
    canvas.save(dest, quality=92, optimize=True)
    print(f"{out_name}: src {im.size} crop {cw}x{ch} placed {nw}x{nh}")


def main() -> None:
    thumbs = [
        ("capillary-tube.jpg", "Capillary Blood Collection Tube.jpg"),
        ("serum-clot-activator.jpg", "Disposable Blood Collection Tube (Serum Clot Activator Tube) .jpg"),
        ("edta-tube.jpg", "Disposable Vacuum Blood Collection Tube (EDTA Tube) .jpg"),
        ("glucose-tube.jpg", "Disposable Vacuum Blood Collection Tube (Glucose Tube) .jpg"),
        ("heparin-separator-gel.jpg", "Disposable Vacuum Blood Collection Tube (Heparin with Separator Gel Tube).jpg"),
        ("regular-tube.jpg", "Disposable Vacuum Blood Collection Tube (Regular Tube) .jpg"),
        ("micro-tubes.jpg", "Micro Blood Collection Tubes .jpg"),
    ]
    for out_name, src_name in thumbs:
        enlarge_thumb(src_name, out_name)

    studio = {}
    for name in os.listdir(DRIVE):
        path = os.path.join(DRIVE, name)
        studio[os.path.getsize(path)] = path
    needles = Image.open(studio[5497021])
    gold = Image.open(studio[4906213])

    frame_square_from_photo(needles, (1180, 500, 1980, 2400), os.path.join(ROOT, "tube-holder.jpg"))
    frame_square_from_photo(needles, (2500, 1400, 4200, 2350), os.path.join(ROOT, "butterfly-needle.jpg"))
    frame_square_from_photo(needles, (1150, 2050, 3050, 2900), os.path.join(ROOT, "multi-sample-needles.jpg"))
    frame_square_from_photo(gold, (1550, 480, 4000, 3250), os.path.join(ROOT, "serum-gel-clot-activator.jpg"))

    holder = needles.convert("RGB").crop((1280, 320, 3080, 2120)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    holder.save(os.path.join(ROOT, "tube-holder-sharp.jpg"), quality=92)
    print("tube-holder-sharp", holder.size)

    for src, dst in (
        ("butterfly-needle.jpg", "butterfly-needle-sharp.jpg"),
        ("multi-sample-needles.jpg", "multi-sample-needles-sharp.jpg"),
        ("serum-gel-clot-activator.jpg", "serum-gel-sharp.jpg"),
    ):
        shutil.copy(os.path.join(ROOT, src), os.path.join(ROOT, dst))
        print("copied", dst)


if __name__ == "__main__":
    main()
