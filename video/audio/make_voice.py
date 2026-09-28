"""Builds the voice track from the exact script, one segment at a time, plus word timings."""
import json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from kokoro_onnx.tokenizer import Tokenizer
from scipy.signal import resample_poly

VOICE = "am_michael"
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin"); tok = Tokenizer()
SR = 48000

# (id, text, speed, gain_db, gap_after_s, fx). Text is the script, verbatim, split only at natural beats.
SEG = [
  ("l1",  "Did you ever just have the idea?", 1.0, 0, 1.0, None),
  ("l2",  "The path to financial freedom,", 1.18, -1, 0.12, None),
  ("l3",  "then it died in an AI chat box.", 0.86, 0, 1.0, None),
  ("l4",  "because you didn't have the means to push it through and see it live?", 1.02, 0, 0.45, None),
  ("l5a", "Or is the projects section on your", 1.02, 0, 0.02, None),
  ("l5r", "resume", 0.92, 1, 0.04, "phon:ʁˌezymˈe"),   # said the French way: résumé
  ("l5c", "looking a little...", 1.0, 0, 0.30, None),
  ("l5b", "rough?", 0.9, 4, 0.45, None),
  ("l6a", "And you're tired of all those", 1.05, 0, 0.05, None),
  ("l6b", "'thanks for your application'", 0.92, 0, 0.05, "robot"),
  ("l6c", "emails?", 1.0, 0, 0.55, None),
  ("l7a", "Introducing...", 0.8, 4, 1.0, None),
  ("l7b", "Spitch.", 0.8, 5, 0.55, None),
  ("l8",  "It's a way to broadcast your idea, get visibility, partnerships and collaborations.", 1.08, 0, 0.30, None),
  ("l9",  "Pitch it in less than a minute, post it, and people swipe right or left, based on what they see, to connect with you and push it forward.", 1.12, 0, 0.30, None),
  ("l10a","Pitchers and builders, those with the means and those with the skills,", 1.05, 0, 0.12, None),
  ("l10b","connecting for the price of a coffee.", 0.9, -1, 0.45, None),
  ("l11", "The market starts here, at uOttawa.", 0.98, 1, 0.45, None),
  ("l12", "I'm a fourth-year engineering student. I live this problem .", 1.0, 0, 1.0, None),
  ("l13", "If you think this would make a great LinkedIn post, let's chat.", 1.02, 0, 0.5, None),
  ("l14", "Or swipe right.", 1.08, 1, 0.0, None),
]
VO_START = 1.0  # after the intro card has been readable for a full second

def trim(a, thr=0.012):
    idx = np.where(np.abs(a) > thr)[0]
    return a[max(0, idx[0]-240): idx[-1]+480] if len(idx) else a

def robot(a, sr):
    t = np.arange(len(a))/sr
    ring = a*np.sin(2*np.pi*58*t)                   # ring modulation: metallic
    crushed = np.round(a*24)/24                      # light bit crush
    out = 0.55*ring + 0.45*crushed
    d = int(0.012*sr); out[d:] += 0.35*out[:-d]      # short comb for a hollow, tinny tone
    return out/np.max(np.abs(out))*np.max(np.abs(a))

track = np.zeros(int(SR*60)); t = VO_START; timeline = []
for sid, text, speed, gain, gap, fx in SEG:
    if fx and fx.startswith("phon:"):
        a, sr = k.create(fx[5:], voice=VOICE, speed=speed, is_phonemes=True)
    else:
        a, sr = k.create(text.replace("'thanks", "thanks").replace("application'", "application"), voice=VOICE, speed=speed, lang="en-us")
    a = trim(a); a = resample_poly(a, SR, sr)
    if fx == "robot": a = robot(a, SR)
    a = a*10**(gain/20)
    n = len(a); s = int(t*SR); track[s:s+n] += a
    # word timings: spread the segment by each word's phoneme count
    words = text.replace("...", "... ").split()
    ph = [max(1, len(tok.phonemize(w.strip("'.,?"), "en-us"))) for w in words] if not (fx and fx.startswith("phon:")) else [1]
    tot = sum(ph); dur = n/SR; cur = t; wt = []
    for w, p in zip(words, ph):
        d = dur*p/tot; wt.append({"w": w, "start": round(cur, 3), "end": round(cur+d, 3)}); cur += d
    timeline.append({"id": sid, "text": text, "start": round(t, 3), "end": round(t+dur, 3), "words": wt})
    t += dur + gap

end = t
track = track[:int(SR*60)]
sf.write("audio/voice.wav", track.astype(np.float32), SR)
json.dump({"voice": VOICE, "voEnd": round(end, 3), "segments": timeline}, open("audio/timeline.json", "w"), indent=1)
for s in timeline: print(f"{s['start']:6.2f}-{s['end']:6.2f}  {s['id']:5} {s['text'][:60]}")
print("VO ends at", round(end, 2))
