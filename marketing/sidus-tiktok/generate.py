#!/usr/bin/env python3
"""Generate Sidus TikTok promo (1080x1920) with pt-PT neural voice."""

from __future__ import annotations

import asyncio
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
BUILD = ROOT / "build"
OUT = ROOT / "output"
FONT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
VOICE = "pt-PT-DuarteNeural"
TTS_RATE = "-12%"
TTS_PITCH = "-1Hz"
FPS = 30
W, H = 1080, 1920

# Each voice line describes ONLY what is on screen in that asset.
SEGMENTS = [
    {
        "id": "01-tarot",
        "image": "01-tarot.png",
        "voice": (
            "No Sidus Astro, cada dia começa com uma mensagem do cosmos. "
            "Tarot gratuito, cruzado com o teu Sol e a tua Lua — uma leitura feita só para ti."
        ),
        "top": "Sidus Astro",
        "bottom": "Leitura grátis diária",
    },
    {
        "id": "02-horoscopo",
        "image": "02-horoscopo.png",
        "voice": (
            "Consulta o horóscopo diário do teu signo. Trânsitos reais, linguagem clara — "
            "numa interface simples e elegante, pensada para o telemóvel."
        ),
        "top": "Horóscopo diário",
        "bottom": "Interface amigável",
    },
    {
        "id": "03-sonho-input",
        "image": "03-sonho-input.png",
        "voice": (
            "Relata o teu sonho em poucas palavras. Escolhe símbolos e emoções — "
            "a porta simbólica abre-se com um toque."
        ),
        "top": "Interpretação de sonhos",
        "bottom": "Relata · Revela",
    },
    {
        "id": "04-sonho-cura",
        "image": "04-sonho-cura.png",
        "voice": (
            "Recebes análise da alma, caminho de cura espiritual, e uma pergunta para meditar. "
            "Simbolismo e astrologia, reunidos num só lugar."
        ),
        "top": "Análise da alma",
        "bottom": "Cura espiritual",
    },
    {
        "id": "05-horas",
        "image": "05-horas-1111.png",
        "voice": (
            "Quando o relógio marca onze e onze, o universo fala. "
            "Descobre o significado das horas iguais e as mensagens angélicas do momento."
        ),
        "top": "Horas Iguais · 11:11",
        "bottom": "Portal de Despertar",
    },
]

ORACLE = {
    "id": "06-oraculo",
    "video": "06-oraculo.mp4",
    "voice": (
        "E quando precisares de orientação, o Oráculo inteligente responde com base no teu mapa natal. "
        "Três perguntas de oferta — o teu astrólogo de bolso, disponível agora."
    ),
    "top": "Oráculo IA",
    "bottom": "3 perguntas grátis",
}

CTA = {
    "id": "07-cta",
    "voice": (
        "Sidus Astro. O teu guia cósmico, claro e próximo. "
        "Visita sidusastro.com — começa grátis hoje."
    ),
    "top": "sidusastro.com",
    "bottom": "O teu guia cósmico",
}


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True)


def esc(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace(":", "\\:")
        .replace("'", "\\'")
        .replace("%", "\\%")
    )


async def tts(text: str, out_mp3: Path) -> float:
    edge = shutil.which("edge-tts") or str(Path.home() / ".local/bin/edge-tts")
    run(
        [
            edge,
            "--voice",
            VOICE,
            "--rate",
            TTS_RATE,
            "--pitch",
            TTS_PITCH,
            "--text",
            text,
            "--write-media",
            str(out_mp3),
        ]
    )
    probe = subprocess.check_output(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "json", str(out_mp3)],
        text=True,
    )
    return float(json.loads(probe)["format"]["duration"])


def drawtext_filters(top: str, bottom: str) -> str:
    gold = "0xDFB76C"
    white = "0xFFFFFF"
    font = esc(str(FONT))
    return (
        f"drawtext=fontfile='{font}':text='{esc(top)}':fontsize=54:fontcolor={gold}:"
        f"x=(w-text_w)/2:y=h*0.08:shadowcolor=black@0.7:shadowx=2:shadowy=2,"
        f"drawtext=fontfile='{font}':text='{esc(bottom)}':fontsize=42:fontcolor={white}:"
        f"x=(w-text_w)/2:y=h*0.88-text_h:shadowcolor=black@0.7:shadowx=2:shadowy=2"
    )


def image_clip(image: Path, duration: float, top: str, bottom: str, out_mp4: Path) -> None:
    vf = (
        f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
        f"zoompan=z='min(zoom+0.0008,1.08)':d={max(int(duration * FPS), 1)}:"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},"
        f"{drawtext_filters(top, bottom)}"
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-i",
            str(image),
            "-vf",
            vf,
            "-t",
            f"{duration:.2f}",
            "-an",
            "-pix_fmt",
            "yuv420p",
            str(out_mp4),
        ]
    )


def merge_av(video: Path, audio: Path, out_mp4: Path) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(video),
            "-i",
            str(audio),
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            str(out_mp4),
        ]
    )


def oracle_clip(video: Path, duration: float, top: str, bottom: str, out_mp4: Path) -> None:
    vf = (
        f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
        f"setsar=1,fps={FPS},"
        f"{drawtext_filters(top, bottom)}"
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(video),
            "-vf",
            vf,
            "-t",
            f"{duration:.2f}",
            "-an",
            "-pix_fmt",
            "yuv420p",
            str(out_mp4),
        ]
    )


def cta_clip(duration: float, top: str, bottom: str, out_mp4: Path) -> None:
    vf = (
        f"color=c=0x0B071E:s={W}x{H}:d={duration:.2f},fps={FPS},"
        f"{drawtext_filters(top, bottom)}"
    )
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", vf, "-pix_fmt", "yuv420p", str(out_mp4)])


def concat(clips: list[Path], out_mp4: Path) -> None:
    list_file = BUILD / "concat.txt"
    list_file.write_text("\n".join(f"file '{p}'" for p in clips), encoding="utf-8")
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c",
            "copy",
            str(out_mp4),
        ]
    )


def check_assets() -> list[str]:
    missing = []
    for seg in SEGMENTS:
        p = ASSETS / seg["image"]
        if not p.exists():
            missing.append(seg["image"])
    if not (ASSETS / ORACLE["video"]).exists():
        missing.append(ORACLE["video"])
    return missing


async def main() -> int:
    missing = check_assets()
    if missing:
        print("MISSING ASSETS — add these files to marketing/sidus-tiktok/assets/:")
        for name in missing:
            print(f"  - {name}")
        print("\nSee marketing/sidus-tiktok/COMO-ENVIAR-FICHEIROS.md")
        return 1

    if BUILD.exists():
        shutil.rmtree(BUILD)
    BUILD.mkdir(parents=True)
    OUT.mkdir(parents=True)

    final_clips: list[Path] = []

    for seg in SEGMENTS:
        img = ASSETS / seg["image"]
        audio = BUILD / f"{seg['id']}.mp3"
        silent = BUILD / f"{seg['id']}-silent.mp4"
        merged = BUILD / f"{seg['id']}.mp4"
        dur = await tts(seg["voice"], audio)
        dur = max(dur + 0.35, 3.0)
        image_clip(img, dur, seg["top"], seg["bottom"], silent)
        merge_av(silent, audio, merged)
        final_clips.append(merged)

    oracle_path = ASSETS / ORACLE["video"]
    o_audio = BUILD / f"{ORACLE['id']}.mp3"
    o_silent = BUILD / f"{ORACLE['id']}-silent.mp4"
    o_merged = BUILD / f"{ORACLE['id']}.mp4"
    o_dur = await tts(ORACLE["voice"], o_audio)
    o_dur = max(o_dur + 0.4, 6.0)
    oracle_clip(oracle_path, o_dur, ORACLE["top"], ORACLE["bottom"], o_silent)
    merge_av(o_silent, o_audio, o_merged)
    final_clips.append(o_merged)

    c_audio = BUILD / f"{CTA['id']}.mp3"
    c_merged = BUILD / f"{CTA['id']}.mp4"
    c_dur = await tts(CTA["voice"], c_audio)
    c_dur = max(c_dur + 0.2, 2.5)
    c_silent = BUILD / f"{CTA['id']}-silent.mp4"
    cta_clip(c_dur, CTA["top"], CTA["bottom"], c_silent)
    merge_av(c_silent, c_audio, c_merged)
    final_clips.append(c_merged)

    out = OUT / "sidus-tiktok-pt-PT.mp4"
    concat(final_clips, out)
    print(f"\nDONE: {out}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
