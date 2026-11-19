'use client'
import {useState} from 'react'

const steps = [
  {q: 'Which buildings have unaccepted alarms?', a: ['detect language → en', 'intent → alarms.unaccepted', 'context ← alarm list + telemetry', 'answer + link to the alarm list']},
  {q: 'Как поменять модем у счётчика?', a: ['detect language → ru', 'intent → knowledge.howto', 'search ← knowledge base chunks (guides, glossary)', 'answer in Russian + source section']},
  {q: 'Почему счётчик не на связи?', a: ['detect language → ru', 'intent → device.status', 'context ← last uplink, traffic, alarm details', 'answer + suggested next step']}
]

/** Concept illustration of how the real ArnaAI service handles a message. Not a screenshot. */
export default function ArnaAiConcept() {
  const [i, setI] = useState(0)
  const s = steps[i]
  return <div className="arnaai">
    <p className="concept-note">Concept illustration of the real ArnaAI pipeline. Example questions, no production data.</p>
    <div className="arnaai-grid">
      <div className="chat">
        <div className="msg me">{s.q}</div>
        <div className="msg bot"><span className="bot-face" aria-hidden="true">◕‿◕</span>Thinking with the product docs and live context…</div>
      </div>
      <ol className="pipeline" aria-label="What happens inside">
        {s.a.map((x, k) => <li key={x} style={{animationDelay: k * .12 + 's'}}><span>{k + 1}</span><code>{x}</code></li>)}
      </ol>
    </div>
    <div className="seg" role="tablist" aria-label="Example question">
      {steps.map((x, k) => <button key={k} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)}>Example {k + 1}</button>)}
    </div>
  </div>
}
