from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class TrimConfig:
    tolerance: int = 28  # color distance tolerance (0..255-ish per channel)
    padding: int = 2  # pixels around cropped object
    sample_step: int = 16  # border sampling step (px)


def _clamp(v: int, lo: int, hi: int) -> int:
    return lo if v < lo else hi if v > hi else v


def _close_rgb(a: tuple[int, int, int], b: tuple[int, int, int], tol: int) -> bool:
    return abs(a[0] - b[0]) <= tol and abs(a[1] - b[1]) <= tol and abs(a[2] - b[2]) <= tol


def _uniq_keep_order(items: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    out: list[tuple[int, int, int]] = []
    seen: set[tuple[int, int, int]] = set()
    for it in items:
        if it in seen:
            continue
        seen.add(it)
        out.append(it)
    return out


def _sample_border_rgbs(pix, w: int, h: int, step: int) -> list[tuple[int, int, int]]:
    """
    Sample a set of RGB colors along the border.
    This helps handle non-uniform/gradient backgrounds.
    """
    step = max(1, step)
    samples: list[tuple[int, int, int]] = []

    # top + bottom
    for x in range(0, w, step):
        samples.append(pix[x, 0][:3])
        samples.append(pix[x, h - 1][:3])
    # left + right
    for y in range(0, h, step):
        samples.append(pix[0, y][:3])
        samples.append(pix[w - 1, y][:3])

    # Always include corners
    samples.extend([pix[0, 0][:3], pix[w - 1, 0][:3], pix[0, h - 1][:3], pix[w - 1, h - 1][:3]])
    return _uniq_keep_order(samples)


def _flood_clear_edges_rgba(
    pix,
    w: int,
    h: int,
    bg_samples: list[tuple[int, int, int]],
    tol: int,
) -> None:
    """
    Flood fill from image borders and set alpha=0 for pixels close to bg.
    Works in-place on a PIL pixel access object for an RGBA image.
    """
    from collections import deque

    q = deque()
    seen = set()

    def push(x: int, y: int):
        if x < 0 or y < 0 or x >= w or y >= h:
            return
        k = (x, y)
        if k in seen:
            return
        seen.add(k)
        q.append(k)

    # seed borders
    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, a = pix[x, y]
        if a == 0:
            continue
        rgb = (r, g, b)
        if any(_close_rgb(rgb, s, tol) for s in bg_samples):
            pix[x, y] = (r, g, b, 0)
            push(x + 1, y)
            push(x - 1, y)
            push(x, y + 1)
            push(x, y - 1)


def trim_png_to_cache(src: Path, dst: Path, *, config: TrimConfig | None = None) -> Path:
    """
    Create a trimmed/transparent version of src into dst.
    Uses border-based background removal so it won't delete interior details.
    """
    config = config or TrimConfig()
    dst.parent.mkdir(parents=True, exist_ok=True)

    from PIL import Image

    im = Image.open(src).convert("RGBA")
    w, h = im.size
    pix = im.load()

    # If the source already has transparency, do not try to "remove background".
    # Just crop by alpha to get rid of extra empty space.
    a0 = im.getchannel("A")
    mn0, mx0 = a0.getextrema()
    if mn0 == 0 and mx0 == 255:
        bbox0 = a0.getbbox()
        if bbox0:
            left, top, right, bottom = bbox0
            left = _clamp(left - config.padding, 0, w)
            top = _clamp(top - config.padding, 0, h)
            right = _clamp(right + config.padding, 0, w)
            bottom = _clamp(bottom + config.padding, 0, h)
            im = im.crop((left, top, right, bottom))
        im.save(dst, format="PNG", optimize=True)
        return dst

    bg_samples = _sample_border_rgbs(pix, w, h, config.sample_step)
    _flood_clear_edges_rgba(pix, w, h, bg_samples, config.tolerance)

    # Crop strictly by alpha so RGB leftovers don't affect bbox.
    bbox = im.getchannel("A").getbbox()
    if bbox:
        left, top, right, bottom = bbox
        left = _clamp(left - config.padding, 0, w)
        top = _clamp(top - config.padding, 0, h)
        right = _clamp(right + config.padding, 0, w)
        bottom = _clamp(bottom + config.padding, 0, h)
        im = im.crop((left, top, right, bottom))

    im.save(dst, format="PNG", optimize=True)
    return dst

