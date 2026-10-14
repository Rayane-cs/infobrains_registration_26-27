import { ArrowRight, ClipboardCheck, Sparkles } from 'lucide-react';
import { eventConfig } from '../config/event.js';
import logo from '../assets/logo.webp';

const clubPillars = [
  { label: 'Build', color: '#38bdf8' },
  { label: 'Code', color: '#818cf8' },
  { label: 'Create', color: '#f472b6' },
  { label: 'Innovate', color: '#fb923c' },
  { label: 'Learn', color: '#4ade80' },
  { label: 'Share', color: '#a78bfa' },
];

export default function Hero() {
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="section-inner hero-grid">
        <div className="hero-copy reveal">
          <p className="section-kicker">
            <Sparkles size={16} aria-hidden="true" />
            {eventConfig.clubName} {eventConfig.eventName}
          </p>
          <h1 id="hero-title">Explore. Build. Belong.</h1>
          <p className="hero-lede">
            Discover your next passion with InfoBrains. Explore technology, meet the community,
            and find your place in the world of innovation.
          </p>

          <div className="hero-actions">
            <a className="button button--primary" href="#attendance">
              <ClipboardCheck size={18} aria-hidden="true" />
              Mark My Attendance
            </a>
            <a className="button button--outline" href="#about">
              About InfoBrains
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <dl className="event-strip" aria-label="Open Day details">
            <div>
              <dt>Date</dt>
              <dd>{eventConfig.dateLabel}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{eventConfig.venueLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="signal-atlas reveal reveal--late" aria-label="InfoBrains community hub atlas">
          <div className="atlas-header">
            <div className="atlas-brand-heading">
              <img src={logo} alt="" className="atlas-header-logo" />
              <span className="atlas-brand-name">InfoBrains</span>
            </div>
            <span className="atlas-hub-badge">Community Hub</span>
          </div>
          <div className="atlas-map" aria-hidden="true">
            <div className="atlas-core">
              <img src={logo} alt="InfoBrains Logo" className="atlas-core-logo" />
            </div>
            {clubPillars.map((pillar, index) => (
              <span
                key={pillar.label}
                className={`atlas-node atlas-node--${index + 1}`}
                style={{ '--node-color': pillar.color }}
              >
                {pillar.label}
              </span>
            ))}
            <span className="atlas-line atlas-line--a" />
            <span className="atlas-line atlas-line--b" />
            <span className="atlas-line atlas-line--c" />
          </div>
          <p>
            One passionate community: innovation, hands-on learning, engineering,
            and creative collaboration.
          </p>
        </div>
      </div>
    </section>
  );
}
