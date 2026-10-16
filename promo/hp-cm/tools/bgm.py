import numpy as np, wave
SR=48000; T=30.0; N=int(SR*T); t=np.arange(N)/SR
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def add(sig,start,gain=1.0,pan=0.0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n<=0: return
    L[i:i+n]+=sig[:n]*gain*(1-pan)/1; R[i:i+n]+=sig[:n]*gain*(1+pan)/1
def env(n,a,d):
    e=np.ones(n); ai=int(a*SR); e[:ai]=np.linspace(0,1,ai) if ai else 1
    e*=np.exp(-np.arange(n)/SR/d); return e
def lp(x,a):  # one-pole lowpass
    y=np.empty_like(x); s=0.0
    for i in range(len(x)): s+=a*(x[i]-s); y[i]=s
    return y
# drone: A1 + E2 + A2 detuned, swelling
dr=np.zeros(N)
for f,g in [(55,1),(55.3,.6),(82.4,.45),(110,.25),(110.4,.2)]:
    dr+=g*np.sin(2*np.pi*f*t+np.sin(2*np.pi*0.1*t)*0.5)
sw=np.clip(t/3,0,1)*(0.55+0.45*np.clip((t-6)/18,0,1))
sw*=np.where(t>24.4,np.where(t<24.6,1-(t-24.4)/0.2*0.9,0.1+0.9*np.clip((t-24.6)/2.0,0,1)),1)
sw*=np.clip((30-t)/2.5,0,1)
dr*=sw*0.16; L+=dr; R+=dr
# kick (heartbeat) 96bpm from 3.0 to 24.4
beat=60/96
def kick():
    n=int(0.45*SR); tt=np.arange(n)/SR
    f=48+90*np.exp(-tt*28); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-tt*7)
k=kick(); b=3.0; i=0
while b<24.3:
    g=0.35+0.4*min(1,(b-3)/18)
    add(k,b,g); 
    if i%2==1 and b>9: add(k,b+beat*0.5,g*0.35)
    b+=beat; i+=1
# hats (filtered noise ticks) from 6s
def tick():
    n=int(0.06*SR); x=rng.standard_normal(n); x=x-lp(x,0.3); return x*np.exp(-np.arange(n)/SR*60)
th=tick(); b=6.0
while b<24.3:
    add(th,b+beat*0.5,0.10,pan=0.3); b+=beat
# whoosh before cuts
def whoosh(dur=0.9):
    n=int(dur*SR); x=rng.standard_normal(n); tt=np.linspace(0,1,n)
    a=0.02+0.25*tt**2; y=np.empty(n); s=0
    for j in range(n): s+=a[j]*(x[j]-s); y[j]=s
    return y*np.sin(np.pi*tt)**2*tt*3
wh=whoosh()
for c in [3.0,6.0,12.5,15.5,21.5,24.5]:
    add(wh,c-0.85,0.5,pan=0.0)
# guzheng-like plucks (Karplus-Strong), A minor pentatonic
def pluck(f,dur=2.2):
    n=int(dur*SR); p=int(SR/f); buf=rng.uniform(-1,1,p); out=np.empty(n)
    for j in range(n):
        out[j]=buf[j%p]; buf[j%p]=0.996*0.5*(buf[j%p]+buf[(j+1)%p])
    return out*np.exp(-np.arange(n)/SR*1.6)
notes={'A3':220,'C4':261.6,'D4':293.7,'E4':329.6,'G4':392,'A4':440,'C5':523.3,'E5':659.3,'A5':880}
seq=[(0.25,'E4'),(0.9,'A4'),(1.6,'C5'),(3.05,'A3'),(3.4,'E4'),(4.4,'D4'),(6.05,'A4'),(7.3,'G4'),(8.55,'E4'),(9.8,'C5'),(12.55,'E5'),(13.2,'A4'),(15.55,'A4'),(16.8,'C5'),(18.05,'D4'),(19.3,'E5'),(21.55,'G4'),(22.2,'E4'),(22.85,'D4'),
     (24.55,'A3'),(24.6,'E4'),(24.65,'A4'),(25.3,'C5'),(26.0,'E5'),(26.8,'A5')]
cache={}
for s,nm in seq:
    if nm not in cache: cache[nm]=pluck(notes[nm])
    add(cache[nm],s,0.22,pan=(hash(nm)%5-2)*0.15)
# impact at 24.5: boom + noise burst + reverse-ish swell before
n=int(3.5*SR); tt=np.arange(n)/SR
boom=np.sin(2*np.pi*np.cumsum(38+60*np.exp(-tt*6))/SR)*np.exp(-tt*1.4)
nb=rng.standard_normal(n); nb=lp(nb,0.08)*np.exp(-tt*3)*2
add(boom+nb,24.5,0.75)
# simple stereo reverb: feedback delays
def verb(x):
    y=x.copy()
    for d,g in [(0.031,.35),(0.047,.3),(0.071,.25),(0.113,.2),(0.167,.15),(0.241,.1)]:
        k=int(d*SR); y[k:]+=x[:-k]*g
    return y
L=verb(L); R=verb(R[::-1])[::-1]*0+verb(R)
m=max(np.abs(L).max(),np.abs(R).max()); L/=m/0.89; R/=m/0.89
L=np.tanh(L*1.2)/np.tanh(1.2); R=np.tanh(R*1.2)/np.tanh(1.2)
st=(np.stack([L,R],1)*32767*0.9).astype(np.int16)
w=wave.open(__import__('os').environ.get('BGM_OUT','gumon-cm/assets/bgm.wav'),'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
print("ok")
