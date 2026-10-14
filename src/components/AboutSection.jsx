import { ArrowRight, UsersRound } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="section-inner about-layout">
        <div>
          <p className="section-kicker">
            <UsersRound size={16} aria-hidden="true" />
            About
          </p>
          <h2 id="about-title">A campus space for technical curiosity.</h2>
        </div>
        <div className="about-copy">
          <p>
            InfoBrains is a university club that brings together students interested in
            technology, science, and creative collaboration. Open Day is a starting point:
            meet the community, explore club activities, and discover where you want to grow.
          </p>
          <a className="button button--primary" href="#attendance">
            Mark My Attendance
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
