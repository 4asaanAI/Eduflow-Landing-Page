import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, BadgeCheck, IdCard, CalendarDays, MessageCircle } from 'lucide-react';
import { Reveal } from './primitives';

/* A different flow entirely — a new admission travelling end-to-end, so this
   section showcases enrolment tools rather than repeating daily ops. */
const STAGES = [
  { icon: UserPlus, name: 'Admission Enquiry', readout: 'Lead captured · auto-scored', head: 'Every enquiry, captured and scored', body: 'A parent fills the form and the AI logs the lead, scores its likelihood to convert, and nudges the front office with the next follow-up.' },
  { icon: BadgeCheck, name: 'Seat Confirmed', readout: 'Fee plan + invoice generated', head: 'Confirmation that sets everything up', body: 'On admission, EduFlow builds the fee plan, raises the first invoice, and reserves the seat — no forms to re-key, nothing to chase.' },
  { icon: IdCard, name: 'ID & Records', readout: 'ID card printed · profile live', head: 'The student exists everywhere, instantly', body: 'A profile is created, the ID card is generated, and records sync to attendance, library and transport — all from that one admission.' },
  { icon: CalendarDays, name: 'Class & Timetable', readout: 'Section · bus route assigned', head: 'Placed into the day automatically', body: 'EduFlow assigns the section, slots the student into the live timetable, and maps them to a bus route — balanced and clash-free.' },
  { icon: MessageCircle, name: 'Family Welcomed', readout: 'Parents onboarded on the app', head: 'The family is welcomed in', body: 'Login details, the welcome circular and the school calendar reach the parents on the app — before they\'ve left the building.' },
];

export default function Automation() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // The row crossing the exact vertical centre of the screen is the active one.
    // rootMargin collapses the root to a 1px line at 50% height, so the browser
    // tells us precisely which card is centred — works scrolling up or down.
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute('data-idx')));
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    const els = stepRefs.current.filter(Boolean);
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="eh-section" id="automation" ref={sectionRef}>
      <div className="eh-wrap">
        <Reveal as="span" className="eh-eyebrow" style={{ display: 'inline-flex', marginBottom: 16 }}>
          <i className="eh-eyebrow-idx">02</i> The pipeline
        </Reveal>
        <Reveal as="h2" className="eh-h2" style={{ maxWidth: 720, marginBottom: 10 }}>
          From admission to classroom, in one flow.
        </Reveal>

        {/* each stage's node sits side-by-side with its step — left and right
            stay glued together row-by-row, since they're one linked pipeline */}
        <div className="eh-pipe-flow">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const state = i === active ? 'active' : i < active ? 'done' : '';
            const last = i === STAGES.length - 1;
            return (
              <div
                key={s.name}
                data-idx={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className={`eh-pipe-row ${i === active ? 'active' : ''}`}
              >
                <div className="eh-pipe-row-node">
                  {/* top rail half — links up to the previous card. invisible on the
                      first row but still claims flex space so every card centers the same */}
                  <span className={`eh-prail eh-prail-top ${i === 0 ? 'hide' : ''} ${i <= active ? 'on' : ''}`} />
                  <div className={`eh-pnode ${state}`}>
                    <span className="ico"><Icon size={19} /></span>
                    <div>
                      <div className="pname">{s.name}</div>
                      <div className="preadout">{s.readout}</div>
                    </div>
                  </div>
                  {/* bottom rail half — the active card streams a beam down it toward
                      the next card, so the flow visibly travels card → card */}
                  <span className={`eh-prail eh-prail-bot ${last ? 'hide' : ''} ${i < active ? 'on' : ''} ${i === active && !last ? 'flow' : ''}`}>
                    <span className="eh-prail-beam" />
                  </span>
                </div>

                <div className="eh-pipe-row-step">
                  <div className="idx">{String(i + 1).padStart(2, '0')} / 05</div>
                  <h3 className="eh-h3" style={{ margin: '12px 0 12px' }}>{s.head}</h3>
                  <p className="eh-body" style={{ maxWidth: 460 }}>{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
