import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export default function FeedbackMessage({ tone = 'info', title, children, id }) {
  const Icon = icons[tone] ?? Info;

  return (
    <div className={`feedback feedback--${tone}`} role={tone === 'error' ? 'alert' : 'status'} id={id}>
      <Icon size={20} aria-hidden="true" />
      <div>
        {title ? <strong>{title}</strong> : null}
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}
