# Hero background video

Drop an MP4 (and optionally a WebM) here to enable the hero video background:

    public/videos/hero.mp4
    public/videos/hero.webm

The hero references these paths in `lib/images.ts` (`heroVideoSources`). When the
files are absent — as they are by default — the hero falls back to an animated
gradient plus the poster photograph, so nothing breaks.

Recommended encode: 1920×1080, 8–12 s seamless loop, no audio track, H.264,
under ~3 MB so it never competes with LCP.

    ffmpeg -i source.mov -t 10 -an -vf scale=1920:-2 -c:v libx264 -crf 28 -movflags +faststart hero.mp4
    ffmpeg -i hero.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an hero.webm
