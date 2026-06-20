import React, { useEffect, useRef, useState } from 'react';
import { Reveal, CornerFrame, useInView } from './primitives';
import Mascot from './Mascot';

const SCRIPT = [
  {
    prompt: 'Make a Class 8 science worksheet',
    response: 'Here is a 25-question worksheet on "Force & Pressure" — mixed difficulty, with an answer key.',
    result: { head: ['Section', 'Questions', 'Type'], rows: [['Warm-up', '8', 'MCQ'], ['Core', '12', 'Short answer'], ['Challenge', '5', 'Numerical']] },
  },
  {
    prompt: 'Who are my hottest admission leads?',
    response: 'Here are your 23 open enquiries ranked by intent. The top 3 are most likely to convert this week — follow up today.',
    result: { head: ['Parent', 'Grade', 'Score'], rows: [['Mr. Verma', 'Grade 4', '92%'], ['Mrs. Iyer', 'Grade 1', '88%'], ['Mr. Khan', 'Grade 7', '81%']] },
  },
  {
    prompt: 'Draft a clash-free timetable for Grade 9',
    response: 'Here is a full weekly timetable across 6 sections — balanced load, zero teacher clashes.',
    result: { head: ['Day', 'Periods', 'Clashes'], rows: [['Mon–Fri', '8 / day', '0'], ['Teachers', '14', 'Balanced'], ['Labs', '3', 'Slotted']] },
  },
  {
    prompt: 'Suggest career paths for Aarav',
    response: 'Based on grades, interests and aptitude, here are three strong directions with next steps.',
    result: { head: ['Path', 'Fit', 'Next step'], rows: [['Data Science', 'High', 'Try Python'], ['Architecture', 'Medium', 'Design club'], ['Biotech', 'Medium', 'Science fair']] },
  },
];

const PHASE = { IDLE: 0, TYPING: 1, THINKING: 2, STREAMING: 3, RESULT: 4 };

export default function ChatConsole() {
  const [ref, inView] = useInView({ once: false, threshold: 0.3 });
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [typed, setTyped] = useState('');
  const [streamed, setStreamed] = useState('');
  const timers = useRef([]);
  const runningRef = useRef(false);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const wait = (ms) => new Promise((r) => timers.current.push(setTimeout(r, ms)));

  useEffect(() => {
    if (!inView) { runningRef.current = false; clearTimers(); return; }
    runningRef.current = true;
    let idx = 0;

    const cycle = async () => {
      while (runningRef.current) {
        const item = SCRIPT[idx];
        setActive(idx);
        setPhase(PHASE.TYPING); setTyped(''); setStreamed('');
        await wait(400);
        // type the prompt
        for (let c = 0; c < item.prompt.length; c++) {
          if (!runningRef.current) return;
          setTyped(item.prompt.slice(0, c + 1));
          await wait(38);
        }
        await wait(450);
        setPhase(PHASE.THINKING);
        await wait(900);
        // stream response word by word
        setPhase(PHASE.STREAMING);
        const words = item.response.split(' ');
        for (let w = 0; w < words.length; w++) {
          if (!runningRef.current) return;
          setStreamed(words.slice(0, w + 1).join(' '));
          await wait(55);
        }
        await wait(350);
        setPhase(PHASE.RESULT);
        await wait(3400);
        idx = (idx + 1) % SCRIPT.length;
      }
    };
    cycle();
    return () => { runningRef.current = false; clearTimers(); };
  }, [inView]);

  const item = SCRIPT[active];

  return (
    <section className="eh-section" id="assistant" ref={ref}>
      <div className="eh-blob" style={{ bottom: '0%', right: '0%', opacity: 0.12 }} aria-hidden />
      <div className="eh-wrap" style={{ textAlign: 'center' }}>
        <Reveal as="span" className="eh-eyebrow" style={{ display: 'inline-block', marginBottom: 16 }}>
          Ask your school anything
        </Reveal>
        <Reveal as="h2" className="eh-h2" style={{ maxWidth: 680, margin: '0 auto' }}>
          A conversation, not a console.
        </Reveal>

        <Reveal style={{ marginTop: 0, position: 'relative' }}>
          <div className="eh-chat-mascot" aria-hidden><Mascot size={104} mood="wink" /></div>
          <CornerFrame style={{ borderRadius: 18 }}>
            <div className="eh-chat">
              <div className="eh-chat-head">
                <span className="dots"><i /><i /><i /></span>
                <span className="title">EduFlow Assistant · live</span>
              </div>

              <div className="eh-chat-body" style={{ textAlign: 'left' }}>
                {/* user prompt */}
                <div className="eh-chat-row">
                  <span className="eh-chat-avatar user">You</span>
                  <div className="eh-chat-bubble">
                    {phase === PHASE.TYPING ? typed : item.prompt}
                    {phase === PHASE.TYPING && <span className="cursor" />}
                  </div>
                </div>

                {/* AI response */}
                {phase >= PHASE.THINKING && (
                  <div className="eh-chat-row">
                    <span className="eh-chat-avatar ai">AI</span>
                    <div className="eh-chat-bubble ai">
                      {phase === PHASE.THINKING ? (
                        <span className="eh-thinking"><i /><i /><i /></span>
                      ) : (
                        <>
                          {phase === PHASE.STREAMING ? streamed : item.response}
                          {phase === PHASE.STREAMING && <span className="cursor" />}
                          {phase === PHASE.RESULT && (
                            <div className="eh-chat-result">
                              <div className="rrow head">
                                {item.result.head.map((h, i) => <span key={i}>{h}</span>)}
                              </div>
                              {item.result.rows.map((row, ri) => (
                                <div className="rrow" key={ri}>
                                  {row.map((cell, ci) => (
                                    <span key={ci} className={ci === row.length - 1 ? 'v' : ''}>{cell}</span>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="eh-chat-chips">
                {SCRIPT.map((s, i) => (
                  <span key={i} className={`eh-chip ${i === active ? 'active' : ''}`}>{s.prompt}</span>
                ))}
              </div>
            </div>
          </CornerFrame>
        </Reveal>
      </div>
    </section>
  );
}
