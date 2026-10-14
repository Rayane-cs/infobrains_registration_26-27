import { eventConfig } from '../config/event.js';

export default function AttendanceConfirmation({ record, submittedAt }) {
  return (
    <article className="printable-confirmation" aria-labelledby="confirmation-title">
      <div className="confirmation-banner">DEMO - NOT AN OFFICIAL DOCUMENT</div>
      <header>
        <div>
          <p className="mono-label">{eventConfig.clubName} {eventConfig.eventName}</p>
          <h3 id="confirmation-title">Attendance Confirmation Reference</h3>
        </div>
        <strong>{record.referenceNumber}</strong>
      </header>

      <dl className="confirmation-list">
        <div>
          <dt>Student</dt>
          <dd>{record.fullName}</dd>
        </div>
        <div>
          <dt>Phone number</dt>
          <dd>{record.phoneNumber}</dd>
        </div>
        <div>
          <dt>Registration number</dt>
          <dd>{record.registrationNumber}</dd>
        </div>
        <div>
          <dt>Faculty or department</dt>
          <dd>{record.faculty}</dd>
        </div>
        <div>
          <dt>Study level</dt>
          <dd>{record.studyLevel}</dd>
        </div>
        <div>
          <dt>Event date</dt>
          <dd>{eventConfig.dateLabel}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{eventConfig.venueLabel}</dd>
        </div>
        <div>
          <dt>Generated</dt>
          <dd>{submittedAt}</dd>
        </div>
      </dl>

      <p>
        This frontend demo confirms that the student recorded attendance in this local interface.
        It is not an official university or faculty document and does not approve an absence.
      </p>
    </article>
  );
}
