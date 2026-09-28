"""Synthesizes the music and sound effects on the script's word timings, mixes them under the voice,
and normalizes the result to -14 LUFS. Everything here is generated, so there is nothing to license."""
import json, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 48000; N = SR * 60
T = json.load(open("audio/timeline.json"))
W = {s["id"]: s["words"] for s in T["segments"]}
at = lambda sid, i: W[sid][i]["start"]
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def env_adsr(n, a=0.01, r=0.1):
    e = np.ones(n); A = int(a*SR); R = int(r*SR)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R)
    return e
def put(buf, x, sec, gain=1.0):
    s = int(sec*SR); e = min(len(buf), s+len(x))
    if s < len(buf): buf[s:e] += x[:e-s]*gain
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, hz): return sosfilt(butter(2, hz, btype="low", fs=SR, output="sos"), x)
def hp(x, hz): return sosfilt(butter(2, hz, btype="high", fs=SR, output="sos"), x)
def tone(freq, dur, kind="sine"):
    tt = np.arange(int(dur*SR))/SR
    if kind == "saw": return 2*((tt*freq) % 1) - 1
    return np.sin(2*np.pi*freq*tt)

music = np.zeros(N); sfx = np.zeros(N)

# --- ambient pad: A minor add9, soft, slow-moving
def pad(start, end, level):
    dur = end - start
    x = np.zeros(int(dur*SR))
    for fr, g in [(110, .5), (164.81, .35), (220, .35), (261.63, .25), (329.63, .2), (493.88, .12)]:
        x += g*(tone(fr, dur) + 0.3*tone(fr*1.003, dur))
    x = lp(x, 1400) * env_adsr(len(x), a=min(1.2, dur/3), r=0.06)
    put(music, x/np.max(np.abs(x)), start, level)

died = at("l3", 2)
pad(0.0, died + 0.02, 0.10)                       # soft ambient from the start, out on "died"
pad(at("l4", 0), at("l7a", 0) + 0.2, 0.06)        # comes back quietly for the sincere line

# --- riser under "Introducing", beat drops on "Spitch"
rs, drop = at("l7a", 0) - 0.1, at("l7b", 0)
n = int((drop - rs)*SR); k = np.linspace(0, 1, n)
riser = hp(rng.standard_normal(n), 400) * k**2 * 0.35
sweep = np.sin(2*np.pi*np.cumsum(200 + 900*k**2)/SR) * k**2 * 0.25
put(music, riser + sweep, rs)

# --- upbeat groove, 112 bpm, from "Spitch" until "I'm a fourth-year..."
BPM = 112; beat = 60/BPM
groove_end = at("l12", 0)
def kick():
    d = 0.35; tt = np.arange(int(d*SR))/SR
    f0 = 45 + 110*np.exp(-tt*28)
    return np.sin(2*np.pi*np.cumsum(f0)/SR) * np.exp(-tt*9)
def clap():
    x = bp(rng.standard_normal(int(0.2*SR)), 900, 4000); return x*np.exp(-np.arange(len(x))/SR*22)*0.6
def hat():
    x = hp(rng.standard_normal(int(0.06*SR)), 7000); return x*np.exp(-np.arange(len(x))/SR*70)*0.35
chords = [(220, 261.63, 329.63), (174.61, 220, 261.63), (130.81, 196, 261.63), (196, 246.94, 293.66)]  # Am F C G
b = drop; i = 0
while b < groove_end:
    put(music, kick(), b, 0.55)
    if i % 2 == 1: put(music, clap(), b, 0.35)
    put(music, hat(), b + beat/2, 0.3)
    if i % 4 == 0:
        ch = chords[(i//4) % 4]; d = beat*4
        x = sum(tone(fr, d, "saw") for fr in ch); x = lp(x, 1800)*env_adsr(len(x), 0.02, 0.3)
        put(music, x/np.max(np.abs(x)), b, 0.07)
        bass = lp(tone(ch[0]/2, d, "saw"), 300)*env_adsr(int(d*SR), 0.01, 0.1)
        put(music, bass, b, 0.2)
    b += beat; i += 1

# --- dip for "I live this problem", warm pad through the invitation, swell, clean cut on "right"
pad(at("l12", 0), at("l13", 0), 0.045)
cut = at("l14", 2)
pad(at("l13", 0), cut, 0.08)
sw0 = at("l14", 0) - 0.4; nn = int((cut - sw0)*SR)
swell = lp(sum(tone(fr, cut - sw0, "saw") for fr in (220, 329.63, 440)), 2400)*np.linspace(0.2, 1, nn)**2
put(music, swell/np.max(np.abs(swell)), sw0, 0.12)
music[int(cut*SR):] = 0                            # clean cut on "right"

# --- outro: one soft final note that fades out by 1:00
note = (tone(440, 2.3) + 0.4*tone(880, 2.3)) * np.exp(-np.arange(int(2.3*SR))/SR*1.6)
put(music, note/np.max(np.abs(note)), cut + 0.45, 0.12)

# --- sound effects
def click(): x = bp(rng.standard_normal(int(0.03*SR)), 1500, 6000); return x*np.exp(-np.arange(len(x))/SR*160)
for j in range(9):                                 # soft typing, then silence
    put(sfx, click(), died + 0.05 + j*0.11 + rng.uniform(-0.02, 0.02), 0.18)
def ding(glitch):
    d = 0.35; tt = np.arange(int(d*SR))/SR
    x = (np.sin(2*np.pi*1318.5*tt) + 0.6*np.sin(2*np.pi*1975.5*tt))*np.exp(-tt*9)
    if glitch: x = np.round(x*6)/6; x[int(0.05*SR):int(0.08*SR)] = 0
    return x*0.5
base = at("l6a", 0) + 0.35
for j in range(7): put(sfx, ding(j % 2 == 1), base + j*0.5, 0.35)
def whoosh(d, lo, hi):
    n = int(d*SR); k = np.linspace(0, 1, n); x = rng.standard_normal(n)
    out = np.zeros(n); step = n//20
    for q in range(20):
        c = lo + (hi - lo)*(q/19); seg = bp(x[q*step:(q+1)*step], c*0.7, c*1.3); out[q*step:q*step+len(seg)] = seg
    return out*np.sin(np.pi*k)**2
zoom = at("l7b", 0) + 0.72
put(sfx, whoosh(0.75, 300, 3000), zoom - 0.05, 0.5)
for s_ in (at("l9", 11), at("l9", 14)): put(sfx, whoosh(0.28, 1500, 5000), s_, 0.35)   # card swipes
put(sfx, whoosh(0.4, 1200, 4500), at("l14", 1), 0.3)                                     # final swipe
cs, ce = at("l11", 0), at("l11", 3); tt_ = cs
while tt_ < ce:                                    # counter ticks, slowing as it lands
    put(sfx, click(), tt_, 0.22); p = (tt_ - cs)/(ce - cs); tt_ += 0.035 + 0.1*p**2
coffee = at("l10b", 6)
ting = (tone(2637, 0.5) + 0.5*tone(3951, 0.5))*np.exp(-np.arange(int(0.5*SR))/SR*8)
put(sfx, click(), coffee, 0.4); put(sfx, ting, coffee + 0.03, 0.22)                     # register tick on "$5"

# --- mix: music well under the voice
voice, _ = sf.read("audio/voice.wav")
voice = voice[:N]
mix = voice*1.0 + music*0.14 + sfx*0.45
meter = pyln.Meter(SR)
# Measure as the stereo file it will be (both channels count), then normalise to -14 LUFS.
st = np.stack([mix, mix], axis=1)
loud = meter.integrated_loudness(st)
mix = mix * 10 ** ((-14.0 - loud) / 20)
peak = np.max(np.abs(mix))
if peak > 0.89:                                     # soft-limit peaks to about -1 dBFS
    over = np.abs(mix) > 0.7
    mix[over] = np.sign(mix[over])*(0.7 + 0.19*np.tanh((np.abs(mix[over]) - 0.7)/0.19))
final = meter.integrated_loudness(np.stack([mix, mix], axis=1))
stereo = np.stack([mix, mix], axis=1).astype(np.float32)
sf.write("public/mix.wav", stereo, SR, subtype="PCM_24")
vr = np.sqrt(np.mean(voice[voice != 0]**2)); mr = np.sqrt(np.mean((music*0.14)[music != 0]**2))
print(f"integrated {final:.1f} LUFS, peak {20*np.log10(np.max(np.abs(mix))):.1f} dBFS, music sits {20*np.log10(vr/mr):.1f} dB under the voice")
