let ctx: AudioContext | null = null

/** A short pentatonic riff, synthesized in the browser. Returns its length in ms. */
export function playRiff(): number {
  try {
    ctx = ctx || new AudioContext()
    ctx.resume()
    const out = ctx.createGain(); out.gain.value = .18; out.connect(ctx.destination)
    const delay = ctx.createDelay(1); delay.delayTime.value = .24
    const fb = ctx.createGain(); fb.gain.value = .28
    out.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(ctx.destination)
    const notes = [0, 3, 7, 10, 12, 10, 7, 12, 15, 12, 10, 7, 3, 5, 7, 0]
    const beat = .19
    const t0 = ctx.currentTime + .05
    notes.forEach((n, i) => {
      const o = ctx!.createOscillator(), g = ctx!.createGain()
      o.type = i % 4 === 0 ? 'triangle' : 'sine'
      o.frequency.value = 293.66 * Math.pow(2, n / 12)
      const t = t0 + i * beat
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.8, t + .015); g.gain.exponentialRampToValueAtTime(.001, t + beat * 1.8)
      o.connect(g); g.connect(out); o.start(t); o.stop(t + beat * 2)
    })
    return notes.length * beat * 1000 + 400
  } catch {
    return 3200
  }
}
