"""Replace studio backdrops on blood-collection photos with pure white.

Keeps product pixels: white trays, labels, gloves, and clear plastic are not
keyed out by a loose brightness rule. Dark letterbox bars are removed as
solid edge bands only.
"""
from __future__ import annotations

import os
import sys

import cv2
import numpy as np

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "blood-collection")
OUT = os.path.join(ROOT, "_white")


def border_median(img: np.ndarray, n: int = 8) -> np.ndarray:
    ring = np.concatenate(
        [
            img[:n].reshape(-1, 3),
            img[-n:].reshape(-1, 3),
            img[:, :n].reshape(-1, 3),
            img[:, -n:].reshape(-1, 3),
        ]
    )
    return np.median(ring, axis=0).astype(np.int16)


def uniform_bands(img: np.ndarray, bg: np.ndarray, tol: int = 48, std_max: float = 34):
    h, w = img.shape[:2]
    b = img.astype(np.int16)

    def rows(seq):
        count = 0
        for i in seq:
            row = b[i]
            med = np.median(row, axis=0)
            if abs(med - bg).sum() <= tol and float(row.std()) < std_max:
                count += 1
            else:
                break
        return count

    def cols(seq):
        count = 0
        for i in seq:
            col = b[:, i]
            med = np.median(col, axis=0)
            if abs(med - bg).sum() <= tol and float(col.std()) < std_max:
                count += 1
            else:
                break
        return count

    return rows(range(h)), rows(range(h - 1, -1, -1)), cols(range(w)), cols(range(w - 1, -1, -1))


def connected_to_border(candidate: np.ndarray) -> np.ndarray:
    n, labels = cv2.connectedComponents(candidate.astype(np.uint8), connectivity=8)
    if n <= 1:
        return np.zeros(candidate.shape, dtype=bool)
    edge = np.unique(
        np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    )
    edge = edge[edge != 0]
    if edge.size == 0:
        return np.zeros(candidate.shape, dtype=bool)
    return np.isin(labels, edge)


def key_background(img: np.ndarray, bg: np.ndarray, t: int, chroma_limit: int) -> np.ndarray:
    b = img.astype(np.int16)
    diff = np.abs(b - bg).sum(axis=2)
    chroma = b.max(axis=2) - b.min(axis=2)
    cand = (diff <= t) & (chroma < chroma_limit)
    mask = connected_to_border(cand)
    mask = cv2.dilate(mask.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=1).astype(bool)
    mask = mask & (diff <= t + 24) & (chroma < chroma_limit)
    return mask


def pale_blue_mask(img: np.ndarray) -> np.ndarray:
    """Studio paper on these photos is a cool white: blue above red, still light.

    White labels, foam, and pink plastic are neutral or red-heavy, so they stay.
    """
    b = img[:, :, 0].astype(np.int16)
    g = img[:, :, 1].astype(np.int16)
    r = img[:, :, 2].astype(np.int16)
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    return (mn >= 168) & (mn < 252) & ((b - r) >= 8) & ((mx - mn) <= 80)


def whiten(img: np.ndarray) -> np.ndarray:
    bg = border_median(img)
    h, w = img.shape[:2]
    top, bot, left, right = uniform_bands(img, bg)
    bands = np.zeros((h, w), dtype=bool)
    if top:
        bands[:top] = True
    if bot:
        bands[h - bot :] = True
    if left:
        bands[:, :left] = True
    if right:
        bands[:, w - right :] = True

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 160)
    protect = cv2.dilate(edges, np.ones((3, 3), np.uint8), iterations=1).astype(bool)

    # Flood only through smooth backdrop. Edges of tubes, packs, and needles
    # block the fill so clear plastic is not punched out.
    pale = pale_blue_mask(img)
    candidate = bands | (pale & ~protect)
    mask = connected_to_border(candidate)
    # Pull the fill a couple of pixels onto a pale fringe so the cut line
    # does not leave a blue halo, without crossing onto coloured product.
    # Spread across every pale studio pixel that touches the cleared area.
    # Coloured caps and neutral white labels are not pale, so the fill stops there.
    # Large leftover cool regions are studio paper, not a label or cap.
    n_pale, pale_labels = cv2.connectedComponents(pale.astype(np.uint8), connectivity=8)
    for label in range(1, n_pale):
        blob = pale_labels == label
        if int(blob.sum()) > 2500:
            mask = mask | blob
    pale_left = pale & ~mask
    if pale_left.any():
        n, labels = cv2.connectedComponents(pale_left.astype(np.uint8), connectivity=8)
        if n > 1:
            edge = cv2.dilate(mask.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=1).astype(bool)
            touch = np.unique(labels[edge & pale_left])
            touch = touch[touch != 0]
            if touch.size:
                mask = mask | np.isin(labels, touch)
    out = img.copy()
    out[mask] = 255
    return out


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    targets = sys.argv[1:]
    if not targets:
        targets = []
        for folder in ("tubes", "needles", "legacy"):
            src = os.path.join(ROOT, folder)
            for name in sorted(os.listdir(src)):
                if name.lower().endswith((".jpg", ".jpeg")):
                    targets.append(os.path.join(src, name))
    for path in targets:
        img = cv2.imread(path)
        if img is None:
            print("skip", path)
            continue
        result = whiten(img)
        name = os.path.basename(path)
        dest = os.path.join(OUT, name)
        cv2.imwrite(dest, result, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        white = np.all(result == 255, axis=2).mean()
        print(f"{name} white {white:.0%}")


if __name__ == "__main__":
    main()
