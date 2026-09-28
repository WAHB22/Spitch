# Spitch elevator pitch video (GNG4120)

A 60-second pitch video built with [Remotion](https://www.remotion.dev) (video in React code). The finished file is `out/spitch-pitch.mp4`: 1920x1080, 30 fps, stereo, about -14 LUFS.

## Re-render it

```bash
cd video
npm install
npm run studio     # preview and scrub in the browser
npm run render     # writes out/spitch-pitch.mp4
```

The first render downloads Remotion's own headless browser automatically.

## How it is put together

| File | What it does |
|---|---|
| `audio/timeline.json` | Every spoken line and word with its start time. All visuals and sound cues follow these timings. |
| `audio/voice.wav` | The voice track. |
| `audio/make_voice.py` | Rebuilds the voice from the exact script (Kokoro open-source voice `am_michael`; "résumé" is given French phonemes). |
| `audio/mix.py` | Synthesizes the music and sound effects on the word timings, mixes them under the voice and normalizes to -14 LUFS. Writes `public/mix.wav`. |
| `src/Pitch.tsx` | The 60-second timeline. |
| `src/scenes/Avatar.tsx` | The animated presenter: expressions per line, blinks, mouth moving with the voice, and the office background. Colors are in `LOOK`. |
| `src/scenes/*.tsx` | Intro card, graph, AI chat box, résumé, inbox, website zoom, app swipes, pitchers and builders, uOttawa counter, outro. |
| `public/site-full.png` | Full-page capture of the Spitch website used in the video. |

## Swapping in the real thing

- **Your face-cam:** put the clip at `public/facecam.mp4` and set `HAS_FACECAM = true` in `src/config.ts`. It replaces the animated presenter.
- **Your own voice:** the visuals are timed to the generated voice, so your recording needs new word timings in `audio/timeline.json`. Then run `python3 audio/mix.py` and re-render.
- **Regenerating the voice:** `pip install kokoro-onnx soundfile scipy numpy pyloudnorm`, download `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx releases into `audio/models/`, then from `video/` run `python3 audio/make_voice.py`, copy `audio/timeline.json` to `src/timeline.json`, regenerate `src/envelope.json`, run `audio/mix.py` and re-render.

## Notes

- The "48,000 students (uOttawa, 2023)" figure comes from the brief and has not been checked against uOttawa's published numbers.
- No real logos, crest or bank notes: the swipe cards, the uOttawa wordmark and the "$5" are drawn in code.
- Remotion has its own license: free for individuals and companies of up to 3 people. Check <https://www.remotion.dev/license> before commercial use.
- `video/` is excluded from website deployments by `.vercelignore`.
