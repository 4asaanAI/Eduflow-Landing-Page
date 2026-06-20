import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Check, Brain, BookOpen, Target, FileText } from 'lucide-react';
import { MagneticButton, StatusDot, TickerCounter } from './primitives';
import Mascot from './Mascot';

/* ---------------- Playful "school runs itself" flow ----------------
   A friendly, Duolingo-style lesson path: each school task pops in with a
   bouncy spring + green tick, energy zips along the connector to the next,
   and Flo celebrates at the end. Loops continuously. ------------------- */
/* one tool per persona — signals "for everyone", not just office ops */
const STEPS = [
  { icon: Brain,    label: 'AI Tutor',   sub: 'student', g: 'linear-gradient(155deg, #a99bff, #6c5ce7)' },
  { icon: BookOpen, label: 'Lesson Plan', sub: 'teacher', g: 'linear-gradient(155deg, #5fb0ff, #2b8ff0)' },
  { icon: Target,   label: 'Admissions', sub: 'office',  g: 'linear-gradient(155deg, #63e6a8, #22b573)' },
  { icon: FileText, label: 'Reports',    sub: 'owner',   g: 'linear-gradient(155deg, #ffc06b, #f2811d)' },
];

function FunFlow() {
  // -1 = idle, 0..len-1 = task lighting up, len = celebrate
  const [step, setStep] = useState(-1);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(STEPS.length); setCelebrate(true);
      return;
    }
    let i = -1;
    let timer;
    const tick = () => {
      i += 1;
      if (i < STEPS.length) {
        setStep(i);
        timer = setTimeout(tick, 850);
      } else {
        setStep(STEPS.length);
        setCelebrate(true);
        timer = setTimeout(() => {
          setCelebrate(false);
          setStep(-1);
          i = -1;
          timer = setTimeout(tick, 700);
        }, 2300);
      }
    };
    timer = setTimeout(tick, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="eh-funpanel" aria-hidden>
      <span className="eh-funpanel-glow" />
      <div className="eh-funflow-track">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i <= step;
          const active = i === step;
          return (
            <React.Fragment key={s.label}>
              <div className={`eh-funstep ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                <div className="eh-funstep-tile" style={{ background: s.g }}>
                  <Icon strokeWidth={2.4} />
                  <span className="eh-funstep-check"><Check size={15} strokeWidth={3.5} /></span>
                </div>
                <div className="eh-funstep-label">{s.label}</div>
                <div className="eh-funstep-sub">{done ? s.sub : '···'}</div>
              </div>
              <span className={`eh-funlink ${step > i ? 'on' : ''}`} />
            </React.Fragment>
          );
        })}

        <div className={`eh-funstep eh-funstep-flo ${celebrate ? 'celebrate' : ''}`}>
          <Mascot size={96} mood={celebrate ? 'happy' : 'happy'} wave={celebrate} />
          <div className="eh-fun-bubble">All done! 🎉</div>
        </div>
      </div>
    </div>
  );
}

const FLOATING = [
  { style: { top: '2%', left: '1%' }, text: <>🧠 <b>AI Tutor</b> · 24/7</> },
  { style: { top: '0%', right: '3%' }, text: <>🗓️ <b>timetable</b> built</> },
  { style: { top: '42%', left: '-2%' }, text: <>🧭 <b>career</b> matched</> },
  { style: { bottom: '6%', left: '4%' }, text: <>📝 <b>question paper</b> ready</> },
  { style: { bottom: '2%', right: '2%' }, text: <>🎓 <b>certificate</b> issued</> },
  { style: { top: '44%', right: '-3%' }, text: <>🚌 <b>routes</b> on time</> },
];

const HERO_STATS = [
  { to: 6, suffix: '', cap: 'Modules unified' },
  { to: 0.4, prefix: '', suffix: 's', cap: 'Action → outcome', fmt: (n) => n.toFixed(1) },
  { to: 24, suffix: '/7', cap: 'Always running' },
];

export default function Hero({ onLogin, scrollTo }) {
  const opsRef = useRef(null);

  const onParallax = (e) => {
    const el = opsRef.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    el.style.transform = `perspective(1400px) rotateY(${px * 4}deg) rotateX(${-py * 3}deg)`;
  };
  const resetParallax = () => {
    if (opsRef.current) opsRef.current.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg)';
  };

  return (
    <header className="eh-hero" id="top" onMouseMove={onParallax} onMouseLeave={resetParallax}>
      <div className="eh-grid-bg" aria-hidden />
      <div className="eh-blob" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)' }} aria-hidden />
      <div className="eh-blob eh-blob-orange" style={{ bottom: '6%', right: '4%' }} aria-hidden />

      <div className="eh-hero-mascot eh-reveal in" style={{ transitionDelay: '420ms' }} aria-hidden>
        <Mascot size={210} wave />
      </div>

      <div className="eh-hero-copy">
        <span className="eh-eyebrow eh-reveal in" style={{ marginBottom: 22, display: 'inline-flex' }}>
          <StatusDot done label="" /> Autonomous School Operations
        </span>
        <h1 className="eh-h1 eh-reveal in" style={{ transitionDelay: '60ms' }}>
          Your school,<br /><span className="eh-pop-orange">running itself.</span>
        </h1>
        <p className="eh-lead eh-reveal in" style={{ maxWidth: 620, margin: '22px auto 0', transitionDelay: '140ms' }}>
          One AI platform, 40+ tools — AI tutoring for students, lesson plans for teachers,
          admissions for the office, live insight for owners. Everyone's work, running itself.
        </p>
        <div className="eh-hero-cta eh-reveal in" style={{ transitionDelay: '220ms' }}>
          <MagneticButton variant="primary" onClick={onLogin}>
            See it in action <ArrowRight size={17} />
          </MagneticButton>
          <button className="eh-btn eh-btn-ghost" onClick={() => scrollTo('automation')}>
            <Play size={15} /> Watch how it works
          </button>
        </div>

        <div className="eh-hero-stats eh-reveal in" style={{ transitionDelay: '320ms' }}>
          {HERO_STATS.map((s, i) => (
            <div className="eh-hero-stat" key={i}>
              <div className="num">
                {s.prefix || ''}<TickerCounter to={s.to} duration={1400} format={s.fmt} />{s.suffix}
              </div>
              <div className="cap">{s.cap}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="eh-ops" ref={opsRef} style={{ transition: 'transform 0.5s cubic-bezier(0.215,0.61,0.355,1)', transformStyle: 'preserve-3d' }}>
        {FLOATING.map((f, i) => (
          <div key={i} className="eh-flabel" style={{ ...f.style, animationDelay: `${i * 0.5}s` }} aria-hidden>
            {f.style.right !== undefined ? (
              <>
                <span className="pill">{f.text}</span>
                <span className="line" style={{ width: 26 }} />
                <span className="anchor" />
              </>
            ) : (
              <>
                <span className="anchor" />
                <span className="line" style={{ width: 26 }} />
                <span className="pill">{f.text}</span>
              </>
            )}
          </div>
        ))}
        <FunFlow />
      </div>
    </header>
  );
}
