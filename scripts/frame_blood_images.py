"""Reframe blood-collection photos as square catalogue images.

Existing product cards use square shots where the product fills the frame.
These source photos are wide studio shots, so the product looks small.
"""
from __future__ import annotations

import os
from collections import deque

from PIL import Image

ROOT = os.path.join("public", "blood-collection")
SIZE = 1200
# Manual crops as fractions (left, top, right, bottom) for shots where the
# product is a small part of a larger scene.
MANUAL = {
    "VAC_4mL_K2EDTA_Lavender_Box_100.jpg": (0.50, 0.08, 0.98, 0.72),
    "VAC_4.5mL_Sodium_Citrate_Blue_3.2_Percent_Box_100.jpg": (0.50, 0.08, 0.98, 0.72),
    "VAC_5mL_SST_Gold_Serum_Gel_Box_100.jpg": (0.12, 0.00, 0.62, 1.0),
    "Hypodermic_Needles_22G_Shown_With_Box.jpg": (0.18, 0.20, 0.99, 0.99),
    "Vacu_Lab_Safety_Blood_Collection_Needles.jpg": (0.02, 0.08, 0.98, 0.92),
}


def content_box(im: Image.Image, tol: int = 34):
    small = im.resize((im.width // 2, im.height // 2), Image.Resampling.BOX)
    w, h = small.size
    px = small.load()
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        i = y * w + x
        if seen[i]:
            return
        seen[i] = 1
        q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        r0, g0, b0 = px[x, y]
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            i = ny * w + nx
            if seen[i]:
                continue
            r, g, b = px[nx, ny]
            if abs(r - r0) + abs(g - g0) + abs(b - b0) <= tol:
                seen[i] = 1
                q.append((nx, ny))

    minx, miny, maxx, maxy = w, h, -1, -1
    for y in range(h):
        row = y * w
        for x in range(w):
            if seen[row + x]:
                continue
            if x < minx:
                minx = x
            if y < miny:
                miny = y
            if x > maxx:
                maxx = x
            if y > maxy:
                maxy = y
    if maxx < 0:
        return 0, 0, im.width, im.height
    scale_x = im.width / w
    scale_y = im.height / h
    return (
        int(minx * scale_x),
        int(miny * scale_y),
        int((maxx + 1) * scale_x),
        int((maxy + 1) * scale_y),
    )


def frame(src: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    """Keep the whole product and scale it to fill a square, like the other catalogue shots."""
    x0, y0, x1, y1 = box
    crop = src.crop((x0, y0, x1, y1))
    cw, ch = crop.size
    # Sample the backdrop so the square padding matches the photo, not a hard white cutout.
    corner = src.getpixel((2, 2))
    if isinstance(corner, int):
        corner = (corner, corner, corner)
    k = 0.96 * SIZE / max(cw, ch, 1)
    nw, nh = max(1, int(cw * k)), max(1, int(ch * k))
    resized = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (SIZE, SIZE), corner[:3])
    canvas.paste(resized, ((SIZE - nw) // 2, (SIZE - nh) // 2))
    return canvas


def main() -> None:
    for folder in ("tubes", "needles"):
        dirpath = os.path.join(ROOT, folder)
        for name in sorted(os.listdir(dirpath)):
            if not name.lower().endswith(".jpg"):
                continue
            path = os.path.join(dirpath, name)
            im = Image.open(path).convert("RGB")
            w, h = im.size
            if name in MANUAL:
                l, t, r, b = MANUAL[name]
                box = (int(l * w), int(t * h), int(r * w), int(b * h))
            else:
                x0, y0, x1, y1 = content_box(im)
                pad_x = int(0.03 * w)
                pad_y = int(0.03 * h)
                # Needle photos include a loose needle beside the box.
                if "Hypodermic" in name or "Sterile" in name:
                    pad_x = int(0.08 * w)
                box = (
                    max(0, x0 - pad_x),
                    max(0, y0 - pad_y),
                    min(w, x1 + pad_x),
                    min(h, y1 + pad_y),
                )
            out = frame(im, box)
            out.save(path, "JPEG", quality=90, optimize=True)
            print(f"{name}: {w}x{h} -> {SIZE}x{SIZE} crop {box}")


if __name__ == "__main__":
    main()
