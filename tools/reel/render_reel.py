"""Genera assets/video/showreel.mp4 al estilo «showreel de motion design»:
intro tipográfica con glitch, cortes rápidos con empuje de cámara, rótulos tipo HUD,
pantallas tipográficas entre capítulos y cierre con logo.

Uso: python tools/reel/render_reel.py <carpeta_fuentes> <carpeta_trabajo>
  carpeta_fuentes: Poppins-Black.ttf, Poppins-ExtraBold.ttf, JetBrainsMono.ttf
Necesita imageio-ffmpeg (pip install imageio-ffmpeg), Pillow y numpy.
"""
import math, os, random, subprocess, sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

ROOT = pathlib.Path(__file__).resolve().parents[2]
FONTS = pathlib.Path(sys.argv[1]); WORK = pathlib.Path(sys.argv[2]); WORK.mkdir(parents=True, exist_ok=True)
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H, FPS = 1280, 720, 25
random.seed(7)

NAVY = (16, 16, 29); BLUE = (153, 196, 228); BLUE_S = (46, 108, 160); PAPER = (244, 246, 250)
f_black = lambda s: ImageFont.truetype(str(FONTS / "Poppins-Black.ttf"), s)
f_xb = lambda s: ImageFont.truetype(str(FONTS / "Poppins-ExtraBold.ttf"), s)
f_mono = lambda s: ImageFont.truetype(str(FONTS / "JetBrainsMono.ttf"), s)
MONO = f_mono(19); MONO_S = f_mono(14)
LOGO = Image.open(ROOT / "assets/img/logo/logo-unical-light.png").convert("RGBA")
LEXUS_SRC = pathlib.Path(os.path.expanduser("~/Desktop/fotos/coches lexus"))
IMG = ROOT / "assets/img"

# ---------- material ----------
def extract(src, start, dur, name, w=W, h=H):
    out = WORK / name; out.mkdir(exist_ok=True)
    if not any(out.iterdir()):
        subprocess.run([FF, "-v", "error", "-ss", str(start), "-t", str(dur), "-i", str(src),
                        "-vf", f"fps={FPS},scale={int(w*1.12)}:{int(h*1.12)}:force_original_aspect_ratio=increase,crop={int(w*1.12)}:{int(h*1.12)}",
                        "-q:v", "3", str(out / "%04d.jpg")], check=True)
    return [Image.open(p).convert("RGB") for p in sorted(out.glob("*.jpg"))]

def still(path):
    im = Image.open(path).convert("RGB")
    s = max(W * 1.15 / im.width, H * 1.15 / im.height)
    return im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)

def frame_from(src, p, z0=1.0, z1=1.1, pan=(0, 0)):
    """Recorte con empuje de cámara (zoom z0→z1) y paneo; p en 0..1."""
    e = 1 - (1 - p) ** 2
    z = z0 + (z1 - z0) * e
    sw, sh = src.width, src.height
    cw, ch = sw / z / 1.0, sh / z / 1.0
    # ajustar a 16:9
    if cw / ch > W / H: cw = ch * W / H
    else: ch = cw * H / W
    cx = sw / 2 + pan[0] * (sw - cw) / 2 * (2 * e - 1)
    cy = sh / 2 + pan[1] * (sh - ch) / 2 * (2 * e - 1)
    box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
    return src.resize((W, H), Image.BILINEAR, box=box)

# ---------- post ----------
yy, xx = np.mgrid[0:H, 0:W]
VIG = (1 - 0.55 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4).clip(0.35, 1)[..., None].astype(np.float32)
GRAIN = [np.random.normal(0, 3.2, (H, W, 1)).astype(np.float32) for _ in range(4)]

def grade(im, n, vignette=True):
    a = np.asarray(im, dtype=np.float32)
    a = (a - 128) * 1.08 + 124          # contraste
    a[..., 2] *= 1.03                    # leve frío
    if vignette: a *= VIG
    a += GRAIN[n % len(GRAIN)]
    return a.clip(0, 255).astype(np.uint8)

def glitch(a, amt, n):
    rnd = random.Random(n)
    a = a.copy()
    for _ in range(int(6 * amt) + 1):
        y = rnd.randrange(0, H - 10); h = rnd.randrange(4, 50)
        a[y:y + h] = np.roll(a[y:y + h], rnd.randrange(-int(80 * amt) - 1, int(80 * amt) + 1), axis=1)
    sh = int(10 * amt)
    if sh:
        a[..., 0] = np.roll(a[..., 0], sh, axis=1); a[..., 2] = np.roll(a[..., 2], -sh, axis=1)
    return a

# ---------- HUD ----------
def tc(n):
    s = n / FPS
    return f"00:{int(s // 60):02d}:{int(s % 60):02d}:{n % FPS:02d}"

def brackets(d, pad=34, l=22, col=(255, 255, 255, 160)):
    for (x, y, sx, sy) in [(pad, pad, 1, 1), (W - pad, pad, -1, 1), (pad, H - pad, 1, -1), (W - pad, H - pad, -1, -1)]:
        d.line([(x, y), (x + l * sx, y)], fill=col, width=2); d.line([(x, y), (x, y + l * sy)], fill=col, width=2)

def hud(img, n, caption, chapter, local):
    im = img.convert("RGBA"); ov = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(ov)
    d.text((48, 40), "UNICAL / REEL·26", font=MONO_S, fill=(255, 255, 255, 190))
    d.text((W - 48, 40), tc(n), font=MONO_S, fill=(255, 255, 255, 190), anchor="ra")
    if caption:
        k = min(len(caption), int(local * 60))           # se escribe letra a letra
        d.rectangle([(48, H - 62), (54, H - 44)], fill=BLUE + (255,))
        d.text((64, H - 63), caption[:k], font=MONO, fill=(255, 255, 255, 235))
    if chapter: d.text((W - 48, H - 60), chapter, font=MONO_S, fill=BLUE + (230,), anchor="ra")
    return Image.alpha_composite(im, ov).convert("RGB")

# ---------- pantallas tipográficas ----------
def card_intro(p, n):
    im = Image.new("RGB", (W, H), NAVY if p > .4 else (6, 6, 12)); d = ImageDraw.Draw(im)
    rnd = random.Random(n // 2)
    if p < .42:   # líneas de sistema que se escriben
        lines = ["> INIT  UNICAL_GRAPHIC.SYS", "> LOC   41.51N 2.39E  CABRERA DE MAR", "> SINCE 25+ YEARS  //  3.000+ PROJECTS",
                 "> LOAD  PRINT · WRAP · STANDS · RETAIL", "> RENDER SHOWREEL_2026 ..."]
        t = p / .42
        for i, s in enumerate(lines):
            k = int(max(0, min(1, t * 1.6 - i * .22)) * len(s))
            txt = s[:k] + ("".join(rnd.choice("01#/%$@") for _ in range(3)) if 0 < k < len(s) else "")
            d.text((90, 250 + i * 34), txt, font=MONO, fill=BLUE if i == 4 else (200, 210, 225))
        d.line([(90, 230), (90 + int(1100 * t), 230)], fill=(60, 70, 95), width=1)
        a = np.asarray(im)
        if p > .36: a = glitch(a, 1.2, n)
        return a
    q = (p - .42) / .58
    size = 260
    while f_black(size).getlength("SHOWREEL") > W * .84: size -= 6
    big = f_black(size)
    s = 1.0 + 0.06 * q
    word = Image.new("RGBA", (W, H)); wd = ImageDraw.Draw(word)
    wd.text((W / 2, H / 2 + 10), "SHOWREEL", font=big, fill=BLUE + (255,), anchor="mm")
    word = word.resize((int(W * s), int(H * s)), Image.BICUBIC).crop((int(W * (s - 1) / 2), int(H * (s - 1) / 2), int(W * (s - 1) / 2) + W, int(H * (s - 1) / 2) + H))
    im.paste(word, (0, 0), word); d = ImageDraw.Draw(im)
    d.text((W / 2, 150), "UNICAL GRAPHIC  —  PRODUCCIÓN VISUAL", font=MONO, fill=(220, 228, 240), anchor="mm")
    d.text((W / 2, H - 150), "2026", font=f_xb(34), fill=PAPER, anchor="mm")
    brackets(d)
    a = np.asarray(im)
    if q < .12: a = glitch(a, 1.4 * (1 - q / .12), n)
    if q > .93: a = glitch(a, 1.6, n)
    return a

def card_grid(p, n):
    im = Image.new("RGB", (W, H), BLUE_S); d = ImageDraw.Draw(im)
    words = ["IMPRIMIMOS", "ROTULAMOS", "MONTAMOS", "INSTALAMOS"]
    f = f_xb(46)
    for r in range(9):
        unit = "   ".join(words[(r + i) % 4] for i in range(4)) + "   "
        uw = f.getlength(unit)
        off = (p * 520 * (1 if r % 2 else -1)) % uw
        x = -uw + off
        while x < W:
            d.text((x, 40 + r * 74), unit, font=f, fill=NAVY if r % 3 else PAPER); x += uw
    d.rectangle([(W / 2 - 260, H / 2 - 44), (W / 2 + 260, H / 2 + 44)], fill=NAVY)
    d.text((W / 2, H / 2), "LO HACEMOS REALIDAD", font=f_xb(34), fill=BLUE, anchor="mm")
    return np.asarray(im)

def card_loading(p, n, title):
    im = Image.new("RGB", (W, H), (8, 8, 14)); d = ImageDraw.Draw(im)
    rnd = random.Random(n)
    for c in range(6):
        for r in range(18):
            if rnd.random() < .5: d.text((60 + c * 200, 40 + r * 36), "".join(rnd.choice("▮▯0123456789ABCDEF") for _ in range(10)), font=MONO_S, fill=(70, 50, 30) if c % 2 else (40, 60, 85))
    bw, bh = 520, 110; x0, y0 = (W - bw) / 2, (H - bh) / 2
    d.rectangle([(x0, y0), (x0 + bw, y0 + bh)], fill=(8, 8, 14), outline=BLUE, width=2)
    d.text((W / 2, y0 + 30), "CARGANDO", font=MONO, fill=BLUE, anchor="mm")
    d.text((W / 2, y0 + 58), title, font=f_xb(22), fill=PAPER, anchor="mm")
    pr = min(1, p * 1.25)
    d.rectangle([(x0 + 30, y0 + 84), (x0 + 30 + (bw - 60) * pr, y0 + 92)], fill=BLUE)
    d.text((x0 + bw - 30, y0 + 70), f"{int(pr * 100):3d}%", font=MONO_S, fill=(180, 190, 205), anchor="ra")
    return np.asarray(im)

def card_number(p, n):
    im = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(im)
    v = int(3000 * (1 - (1 - min(1, p * 1.4)) ** 3))
    txt = "+" + f"{v:,}".replace(",", ".")
    d.text((W / 2, H / 2 - 30), txt, font=f_black(220), fill=PAPER, anchor="mm")
    d.text((W / 2, H / 2 + 120), "PROYECTOS ENTREGADOS", font=MONO, fill=BLUE, anchor="mm")
    brackets(d, col=BLUE + (200,))
    return np.asarray(im)

def card_outro(p, n):
    im = Image.new("RGB", (W, H), (6, 6, 12)); d = ImageDraw.Draw(im)
    a = min(1, p * 2.2) * (1 if p < .9 else (1 - p) / .1)
    lg = LOGO.copy(); lw = 520; lg = lg.resize((lw, int(LOGO.height * lw / LOGO.width)), Image.LANCZOS)
    alpha = lg.split()[3].point(lambda v: int(v * a)); lg.putalpha(alpha)
    im.paste(lg, (int((W - lw) / 2), int(H / 2 - 70)), lg)
    col = tuple(int(c * a) for c in (200, 210, 225))
    d.text((W / 2, H / 2 + 40), "UNICAL.ES  ·  937 50 23 04", font=MONO, fill=col, anchor="mm")
    d.text((W / 2, H / 2 + 70), "LO DISEÑAMOS · LO FABRICAMOS · LO INSTALAMOS", font=MONO_S, fill=tuple(int(c * a) for c in BLUE), anchor="mm")
    d.rectangle([(W / 2 - 7, H - 90), (W / 2 + 7, H - 76)], outline=tuple(int(c * a) for c in BLUE), width=2)
    return np.asarray(im)

def triptych(clips, p):
    im = Image.new("RGB", (W, H), (0, 0, 0)); w3 = W // 3
    for i, fr in enumerate(clips):
        f = fr[min(len(fr) - 1, int(p * (len(fr) - 1)))]
        f = f.resize((w3 - 4, H), Image.BILINEAR, box=(f.width / 2 - (w3 - 4) / 2 * f.height / H, 0, f.width / 2 + (w3 - 4) / 2 * f.height / H, f.height))
        dy = int(40 * (1 - min(1, p * 4 - i * .5)) ** 3) if p < .5 else 0
        im.paste(f, (i * w3 + 2, dy))
    return im

# ---------- montaje ----------
def main():
    lex = LEXUS_SRC / "b9cd92ff-159d-4699-8124-386ba8e3655e.mp4"
    clip_a = extract(lex, 6, 2.2, "lexA"); clip_b = extract(lex, 22, 1.6, "lexB"); clip_c = extract(lex, 30, 1.8, "lexC")
    vert = [extract(LEXUS_SRC / f, s, 2.2, f"v{i}", 427, 720) for i, (f, s) in enumerate([("365bf189-55e6-408b-86bc-e76df1a4b1db.mp4", 8), ("4f4dc1fb-cb5e-4832-8e35-2626b512b793.mp4", 31), ("a0b30b2b-71ab-42fc-9e63-cf4c3e510409.mp4", 3)])]
    cirsa = extract(ROOT / "assets/video/evento-cirsa.mp4", 0.5, 2.4, "cirsa")
    P = lambda n: still(IMG / f"proyectos/{n}.webp"); S = lambda n: still(IMG / f"servicios/{n}.webp")

    seq = []   # (dur_s, kind, data, caption, chapter)
    seq += [(4.2, "card", card_intro, None, None)]
    seq += [(1.6, "card", card_grid, None, None)]
    V = "VEHÍCULOS"
    seq += [(1.6, "clip", (clip_a, (1.0, 1.08), (0, 0)), "01 — LEXUS · CAR WRAPPING BLACK PANTHER", V),
            (0.08, "flash", BLUE, None, None),
            (1.2, "img", (P("tke"), (1.0, 1.12), (0.4, 0)), "02 — TK ELEVATOR · ROTULACIÓN", V),
            (1.1, "clip", (clip_b, (1.05, 1.0), (0, 0)), "03 — LEXUS · WRAPPING INTEGRAL", V),
            (1.1, "img", (P("jpujol"), (1.12, 1.0), (-0.5, 0)), "04 — J.PUJOL · FLOTA JACK", V),
            (2.0, "trip", vert, "05 — SHOWROOM LEXUS · DETALLE", V),
            (1.0, "img", (P("tibau"), (1.0, 1.1), (0, -0.4)), "06 — TIBAU TEAM · DAKAR", V),
            (0.8, "img", (P("goofretti"), (1.1, 1.0), (0, 0)), "07 — GOOFRETTI · FOOD TRUCK", V)]
    seq += [(1.8, "card", lambda p, n: card_loading(p, n, "STANDS & EVENTOS"), None, None)]
    E = "STANDS & EVENTOS"
    seq += [(1.3, "img", (P("eversense"), (1.0, 1.12), (0, 0.3)), "08 — EVERSENSE · CONGRESO MÉDICO", E),
            (1.1, "img", (P("janssen"), (1.12, 1.0), (0.4, 0)), "09 — JANSSEN · ONCOLOGÍA", E),
            (0.08, "flash", PAPER, None, None),
            (2.2, "clip", (cirsa, (1.0, 1.06), (0, 0)), "10 — CIRSA · LA ILUSIÓN UNE", E),
            (1.0, "img", (P("cava-pharma"), (1.0, 1.1), (-0.4, 0)), "11 — CAVA PHARMA · STAND", E),
            (1.1, "img", (P("disney"), (1.1, 1.0), (0, 0)), "12 — DISNEY · EVENTO", E)]
    seq += [(2.0, "card", card_number, None, None)]
    R = "RETAIL & INTERIORISMO"
    seq += [(1.1, "img", (P("venca"), (1.0, 1.1), (0, 0)), "13 — VENCA · POP-UP STORE", R),
            (1.0, "img", (P("mcdonalds"), (1.12, 1.0), (0.4, 0)), "14 — McDONALD'S · MURALES", R),
            (0.9, "img", (P("3cat"), (1.0, 1.1), (-0.4, 0)), "15 — 3CAT · MURAL CORPORATIVO", R),
            (0.8, "img", (P("five-guys"), (1.1, 1.0), (0, 0)), "16 — FIVE GUYS · INTERIORISMO", R),
            (0.6, "img", (P("tibidabo"), (1.0, 1.1), (0, 0)), "17 — TIBIDABO · EXTERIOR", R),
            (0.5, "img", (P("lexus"), (1.1, 1.0), (0, 0)), "18 — LEXUS · IMAGEN CORPORATIVA", R),
            (0.4, "img", (S("senaletica"), (1.0, 1.1), (0, 0)), "19 — SEÑALÉTICA", R),
            (0.35, "img", (S("plv-retail"), (1.1, 1.0), (0, 0)), "20 — PLV & RETAIL", R),
            (0.08, "flash", BLUE, None, None),
            (1.8, "clip", (clip_c, (1.0, 1.1), (0, 0)), "SIN LÍMITES.", None)]
    seq += [(4.0, "card", card_outro, None, None)]

    total = sum(int(round(d * FPS)) for d, *_ in seq)
    enc = subprocess.Popen([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                            "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                            str(ROOT / "assets/video/showreel.mp4")], stdin=subprocess.PIPE)
    n = 0
    for dur, kind, data, cap, ch in seq:
        nf = int(round(dur * FPS))
        for i in range(nf):
            p = i / max(1, nf - 1)
            if kind == "card":
                a = data(p, n)
            elif kind == "flash":
                a = np.full((H, W, 3), data, np.uint8)
            else:
                if kind == "img":
                    src, (z0, z1), pan = data; fr = frame_from(src, p, z0, z1, pan)
                elif kind == "clip":
                    frames, (z0, z1), pan = data; fr = frame_from(frames[min(len(frames) - 1, int(p * (len(frames) - 1)))], p, z0, z1, pan)
                else:
                    fr = triptych(data, p)
                fr = hud(fr, n, cap if cap != "SIN LÍMITES." else None, ch, i / FPS)
                if cap == "SIN LÍMITES.":
                    ov = Image.new("RGBA", (W, H)); od = ImageDraw.Draw(ov)
                    k = min(1, p * 3)
                    od.text((W / 2, H / 2 + (1 - k) ** 3 * 60), "SIN LÍMITES.", font=f_black(150), fill=PAPER + (int(255 * k),), anchor="mm")
                    fr = Image.alpha_composite(fr.convert("RGBA"), ov).convert("RGB")
                a = grade(fr, n)
                if i < 2: a = glitch(a, .5, n)
            enc.stdin.write(np.ascontiguousarray(a).tobytes()); n += 1
        print(f"{n}/{total}", end="\r")
    enc.stdin.close(); enc.wait()
    print(f"\nlisto: {n} fotogramas, {n / FPS:.1f} s")

if __name__ == "__main__":
    main()
