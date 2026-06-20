import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck, Zap, Star, BadgeCheck,
  GraduationCap, BookOpen, Building2, LineChart,
  Brain, HelpCircle, Compass, PenTool, Target,
  FileText, BarChart3, FilePlus, Award, IdCard,
  Megaphone, ScrollText, Bell, Trophy, Bus,
} from 'lucide-react';
import { Reveal, SpotlightCard, CornerFrame, StatusDot, useInView } from './primitives';

/* ---------------- Live ticker marquee (ambient "system never sleeps") ---------------- */
const TICKER = [
  'AI TUTOR · 312 DOUBTS SOLVED TODAY',
  'TIMETABLE GENERATED · GRADE 9 · 0 CLASHES',
  'QUESTION PAPER CREATED · SCIENCE · CLASS 8',
  'CAREER GUIDANCE · 18 STUDENTS MATCHED',
  'BONAFIDE CERTIFICATE ISSUED · INSTANT',
  'LESSON PLAN DRAFTED · CHAPTER 6',
  'ADMISSION LEAD CONVERTED · +1 SEAT',
  'SUBSTITUTION ARRANGED · PERIOD 4',
  'WORKSHEET BUILT · 25 PRACTICE Qs',
  'ID CARDS PRINTED · NEW BATCH · 42',
];

export function LiveTicker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="eh-ticker" aria-hidden>
      <div className="eh-ticker-track">
        {row.map((t, i) => (
          <span className="eh-ticker-item" key={i}>
            <span className="d" />{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Role-based toolkit showcase ----------------
   One card per persona — each lists DIFFERENT tools so the page never
   repeats the same four features. 40+ tools across the whole school. */
const ROLES = [
  {
    role: 'For Students', icon: GraduationCap, accent: '#a78bfa', count: '12 tools',
    tools: [
      { icon: Brain, name: 'AI Tutor' },
      { icon: HelpCircle, name: 'Doubt Solver' },
      { icon: Compass, name: 'Career Guidance' },
      { icon: PenTool, name: 'Practice Tests' },
      { icon: Target, name: 'Study Planner' },
    ],
  },
  {
    role: 'For Teachers', icon: BookOpen, accent: '#2b8ff0', count: '14 tools',
    tools: [
      { icon: FileText, name: 'Assignments' },
      { icon: PenTool, name: 'Question Papers' },
      { icon: BookOpen, name: 'Lesson Plans' },
      { icon: FilePlus, name: 'Worksheets' },
      { icon: BarChart3, name: 'Class Analytics' },
    ],
  },
  {
    role: 'For Admin & Office', icon: Building2, accent: '#34d399', count: '20+ tools',
    tools: [
      { icon: Target, name: 'Admissions Pipeline' },
      { icon: Award, name: 'Certificates' },
      { icon: IdCard, name: 'ID Cards' },
      { icon: Bus, name: 'Transport' },
      { icon: Megaphone, name: 'Circulars' },
    ],
  },
  {
    role: 'For Owners & Leadership', icon: LineChart, accent: '#f2811d', count: 'Full view',
    tools: [
      { icon: BarChart3, name: 'Live Insights' },
      { icon: FileText, name: 'Auto Reports' },
      { icon: Bell, name: 'Fee Defaulters' },
      { icon: Trophy, name: 'School Activities' },
      { icon: ScrollText, name: 'Audit Log' },
    ],
  },
];

export function Features() {
  return (
    <section className="eh-section" id="features">
      <div className="eh-grid-bg" aria-hidden />
      <div className="eh-wrap">
        <Reveal as="span" className="eh-eyebrow" style={{ display: 'inline-flex', marginBottom: 16 }}>
          <i className="eh-eyebrow-idx">01</i> Built for everyone in the building
        </Reveal>
        <Reveal as="h2" className="eh-h2" style={{ maxWidth: 760 }}>
          A toolkit for <span className="eh-pop-orange">every role.</span>
        </Reveal>
        <Reveal as="p" className="eh-lead" delay={100} style={{ maxWidth: 560, marginTop: 16 }}>
          Students, teachers, the front office and leadership each get their own AI tools —
          40+ of them — all on one platform, all talking to each other.
        </Reveal>

        <div className="eh-roles">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.role} variant="scale-in" stagger={80} index={i}>
                <SpotlightCard className="eh-role" style={{ '--role-accent': r.accent }}>
                  <div className="eh-role-top">
                    <span className="eh-role-ico"><Icon size={22} /></span>
                    <span className="eh-role-count">{r.count}</span>
                  </div>
                  <h3 className="eh-role-title">{r.role}</h3>
                  <ul className="eh-role-tools">
                    {r.tools.map((t) => {
                      const TIcon = t.icon;
                      return (
                        <li key={t.name} className="eh-role-tool">
                          <TIcon size={15} /> {t.name}
                        </li>
                      );
                    })}
                    <li className="eh-role-tool more">+ more</li>
                  </ul>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Digital Twin — whole-school node graph ---------------- */
const HUB = { x: 450, y: 300 };
const SATS = [
  { id: 'students', label: 'Students', x: 450, y: 90 },
  { id: 'teachers', label: 'Teachers', x: 700, y: 150 },
  { id: 'parents', label: 'Parents', x: 810, y: 300 },
  { id: 'classes', label: 'Classes', x: 700, y: 450 },
  { id: 'fees', label: 'Fees', x: 450, y: 510 },
  { id: 'exams', label: 'Exams', x: 200, y: 450 },
  { id: 'attendance', label: 'Attendance', x: 90, y: 300 },
  { id: 'transport', label: 'Transport', x: 200, y: 150 },
];

export function DigitalTwin() {
  // once:false → nodes re-light and pulses restart each time it re-enters view
  const [ref, inView] = useInView({ once: false, threshold: 0.3 });
  const [lit, setLit] = useState({});
  const [pulses, setPulses] = useState([]);
  const pulsesRef = useRef([]);
  const alive = useRef(false);

  useEffect(() => {
    if (!inView) { setLit({}); setPulses([]); pulsesRef.current = []; return; } // reset on leave
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // sequential light-up (tracked so we can cancel if the user scrolls away mid-sequence)
    setLit({});
    const timeouts = SATS.map((s, i) => setTimeout(() => setLit((p) => ({ ...p, [s.id]: true })), 180 + i * 160));
    if (reduce) return () => timeouts.forEach(clearTimeout);

    alive.current = true;
    let raf, spawnTimer;
    let key = 0;
    const spawn = () => {
      const s = SATS[Math.floor(Math.random() * SATS.length)];
      const dir = Math.random() > 0.5;
      pulsesRef.current.push({ key: key++, sat: s, start: performance.now(), dur: 1100, dir });
    };
    spawnTimer = setInterval(spawn, 320);

    const frame = (now) => {
      const render = [];
      const live = [];
      for (const p of pulsesRef.current) {
        const t = Math.min((now - p.start) / p.dur, 1);
        const e = p.dir ? t : 1 - t;
        render.push({ key: p.key, x: HUB.x + (p.sat.x - HUB.x) * e, y: HUB.y + (p.sat.y - HUB.y) * e });
        if (t < 1) live.push(p);
      }
      pulsesRef.current = live;
      setPulses(render);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { timeouts.forEach(clearTimeout); alive.current = false; cancelAnimationFrame(raf); clearInterval(spawnTimer); pulsesRef.current = []; };
  }, [inView]);

  return (
    <section className="eh-section" id="twin" ref={ref}>
      <div className="eh-blob" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', opacity: 0.16 }} aria-hidden />
      <div className="eh-wrap" style={{ textAlign: 'center' }}>
        <Reveal as="span" className="eh-eyebrow" style={{ display: 'inline-flex', marginBottom: 16 }}>
          <i className="eh-eyebrow-idx">04</i> The digital twin
        </Reveal>
        <Reveal as="h2" className="eh-h2" style={{ maxWidth: 720, margin: '0 auto' }}>
          A living model of your entire school.
        </Reveal>
        <Reveal as="p" className="eh-lead" delay={100} style={{ maxWidth: 560, margin: '16px auto 0' }}>
          Every student, class, fee and bus — connected to one AI core that keeps the whole picture in sync, always.
        </Reveal>

        <Reveal className="eh-twin-wrap">
          <CornerFrame active style={{ borderRadius: 16, padding: 'clamp(12px,2vw,28px)' }}>
            <svg className="eh-twin-svg" viewBox="0 0 900 600" role="img" aria-label="EduFlow digital twin: a central AI core connected to students, teachers, parents, classes, fees, exams, attendance and transport.">
              {SATS.map((s) => (
                <line key={`e-${s.id}`} x1={HUB.x} y1={HUB.y} x2={s.x} y2={s.y}
                  className={`eh-twin-edge ${lit[s.id] ? 'lit' : ''}`} />
              ))}
              {pulses.map((p) => (
                <circle key={p.key} cx={p.x} cy={p.y} r="4" className="eh-twin-pulse" />
              ))}
              {SATS.map((s) => (
                <g key={s.id} className={`eh-twin-node ${lit[s.id] ? 'lit' : ''}`}>
                  <circle cx={s.x} cy={s.y} r="42" className="eh-twin-circle" />
                  <text x={s.x} y={s.y + 3} textAnchor="middle" className="eh-twin-label">{s.label}</text>
                </g>
              ))}
              {/* hub */}
              <g className="eh-twin-hub">
                <circle cx={HUB.x} cy={HUB.y} r="56" className="eh-twin-hub-glow" />
                <circle cx={HUB.x} cy={HUB.y} r="44" className="eh-twin-hub-core" />
                <text x={HUB.x} y={HUB.y - 2} textAnchor="middle" className="eh-twin-hub-label">EduFlow</text>
                <text x={HUB.x} y={HUB.y + 14} textAnchor="middle" className="eh-twin-hub-sub">AI CORE</text>
              </g>
            </svg>
          </CornerFrame>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
const QUOTES = [
  {
    q: 'We shut down three spreadsheets and a WhatsApp group in the very first week. What surprised me most is that the staff actually trust it — they stopped double-checking everything by hand.',
    name: 'Aman Litt', role: 'Principal',
    i: 'AL', av: '#2b8ff0',
  },
  {
    q: 'Report cards used to eat my entire weekend, every single term. Now they\'re generated and shared before I\'ve finished my morning chai. I genuinely got my Sundays back.',
    name: 'Rajesh Kumar', role: 'Class Teacher',
    i: 'RK', av: '#f2811d',
  },
  {
    q: 'Fee reconciliation that took my team two full days now closes itself by evening. I just open the dashboard, review what the AI flagged, and approve. The numbers always match.',
    name: 'Meena Gupta', role: 'Accounts Head',
    i: 'MG', av: '#46d17a',
  },
];

function Stars() {
  return (
    <div className="eh-quote-stars" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((s) => (
        <Star key={s} size={16} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="eh-section" id="voices">
      <div className="eh-wrap">
        <Reveal as="span" className="eh-eyebrow" style={{ display: 'inline-flex', marginBottom: 16 }}>
          From the staff room
        </Reveal>
        <Reveal as="h2" className="eh-h2" style={{ maxWidth: 680 }}>
          The people who stopped doing it <span className="eh-pop-orange">by hand.</span>
        </Reveal>
        <Reveal as="p" className="eh-lead" delay={100} style={{ maxWidth: 540, marginTop: 16 }}>
          Real educators, real schools — here's what changed once EduFlow took the busywork off their desks.
        </Reveal>

        <div className="eh-quotes">
          {QUOTES.map((qt, i) => (
            <Reveal key={i} variant="scale-in" stagger={90} index={i}>
              <SpotlightCard className="eh-quote">
                <div className="eh-quote-head">
                  <Stars />
                  <span className="eh-quote-verified"><BadgeCheck size={15} /> Verified</span>
                </div>
                <p className="eh-quote-text">{qt.q}</p>
                <div className="eh-quote-by">
                  <span className="eh-quote-av" style={{ background: qt.av }}>{qt.i}</span>
                  <div>
                    <div className="eh-quote-name">{qt.name}</div>
                    <div className="eh-quote-role">{qt.role}</div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="eh-trust-strip">
          <span className="eh-trust-item"><ShieldCheck size={16} /> DPDP-aware · data stays in-region</span>
          <span className="eh-trust-item"><Zap size={16} /> Built for CBSE multi-branch schools</span>
          <span className="eh-trust-item"><StatusDot done label="99.9% uptime" /></span>
        </Reveal>
      </div>
    </section>
  );
}
