# Video assets

## Hero background video

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

## Virtual tour clips

One clip per tour stop, registered in `lib/images.ts` (`tourVideoSources`) and
attached to the stop in `lib/data.ts`. Reception ships with a real clip:

    public/videos/tour/reception.mp4   1280×720 · 12 s · 3.6 MB

Source: "Clinic staff at a hospital reception" from Mixkit
(<https://mixkit.co/free-stock-video/clinic-staff-at-a-hospital-reception-4766/>),
used under the Mixkit Free Stock Video License — free for commercial use, no
attribution required, redistribution as a standalone asset not permitted.

The play button only appears on stops that have a clip, and if the file is
missing or the browser cannot decode it the frame falls straight back to the
still photograph. Keep clips at or under **30 seconds** — the player hard-stops
at 30s (`MAX_CLIP_SECONDS` in `components/sections/virtual-tour.tsx`) and the
duration badge in `lib/data.ts` should match the real length.

Recommended encode: 1920×1080, ≤ 30 s, H.264, under ~8 MB.

    ffmpeg -i source.mov -t 30 -vf scale=1920:-2 -c:v libx264 -crf 26 -movflags +faststart tour/reception.mp4
    ffmpeg -i tour/reception.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 tour/reception.webm
