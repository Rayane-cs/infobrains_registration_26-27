import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, HelpCircle, X, ZoomIn } from 'lucide-react';
import studentCardCornerImg from '../assets/e_c_cropped.png';
import studentCardFullImg from '../assets/e_c.png';

export default function StudentCardModal({ isOpen, onClose }) {
  const modalCardRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [viewMode, setViewMode] = useState('corner'); // 'corner' | 'full'

  useEffect(() => {
    if (!isOpen) return;

    // Reset to bottom-left corner view whenever opened
    setViewMode('corner');

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-card-modal-title"
        onClick={(e) => e.stopPropagation()}
        ref={modalCardRef}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-kicker">
              <HelpCircle size={15} aria-hidden="true" />
              Student Card Guide
            </span>
            <h3 id="student-card-modal-title" className="modal-title">
              University Registration Number Guide
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close guide"
            ref={closeBtnRef}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Look for the <strong>red square</strong> in the <strong>bottom-left corner</strong> of your student card (بطاقة الطالب):
          </p>

          {/* Toggle between focused bottom-left corner view and full card view */}
          <div className="modal-view-tabs" role="tablist" aria-label="Card preview modes">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'corner'}
              className={`view-tab-btn ${viewMode === 'corner' ? 'view-tab-btn--active' : ''}`}
              onClick={() => setViewMode('corner')}
            >
              <ZoomIn size={15} aria-hidden="true" />
              <span>Bottom-Left Corner (Red Box Zoom)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'full'}
              className={`view-tab-btn ${viewMode === 'full' ? 'view-tab-btn--active' : ''}`}
              onClick={() => setViewMode('full')}
            >
              <CreditCard size={15} aria-hidden="true" />
              <span>Full Student Card</span>
            </button>
          </div>

          <div className="modal-card-preview">
            <div className="modal-card-image-box">
              {viewMode === 'corner' ? (
                <img
                  src={studentCardCornerImg}
                  alt="Zoomed view of the bottom-left corner of Algerian student card showing red box around registration number 212137016608"
                  className="modal-card-image modal-card-image--corner"
                />
              ) : (
                <img
                  src={studentCardFullImg}
                  alt="Full Algerian student card showing registration number boxed in red in the bottom-left corner"
                  className="modal-card-image modal-card-image--full"
                />
              )}
            </div>

            <div className="card-red-indicator">
              <span className="indicator-pulse" />
              <div className="indicator-copy">
                <span className="indicator-headline">
                  Write this number (in the red square):
                </span>
                <span className="indicator-number-badge">212137016608</span>
              </div>
            </div>
          </div>

          <div className="modal-tips-list">
            <div className="modal-tip-item">
              <span className="tip-badge">1</span>
              <div className="tip-content">
                <strong>Bottom-Left Corner (Red Square)</strong>
                <p>
                  On your student card (بطاقة الطالب), locate the 12-digit number inside the red box at the very bottom-left.
                </p>
              </div>
            </div>

            <div className="modal-tip-item">
              <span className="tip-badge">2</span>
              <div className="tip-content">
                <strong>Standard 12-Digit Matricule</strong>
                <p>
                  It begins with your enrollment year prefix (e.g. <code>2121...</code>, <code>2222...</code>, <code>2323...</code>, <code>2424...</code>).
                </p>
              </div>
            </div>

            <div className="modal-tip-item">
              <span className="tip-badge">3</span>
              <div className="tip-content">
                <strong>Do NOT write the other numbers</strong>
                <p>
                  Ignore the long number series in the center/right (e.g. <code>0010070155...</code>) — enter only the bottom-left registration number.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="button button--primary modal-confirm-btn"
            onClick={onClose}
          >
            <Check size={18} aria-hidden="true" />
            <span>Got it, let me enter my number</span>
          </button>
        </div>
      </div>
    </div>
  );
}
