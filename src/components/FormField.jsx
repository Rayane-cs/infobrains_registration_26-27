import { forwardRef } from 'react';

const FormField = forwardRef(function FormField(
  {
    id,
    label,
    error,
    help,
    className = '',
    as = 'input',
    children,
    required = false,
    labelAction,
    ...props
  },
  ref,
) {
  const Input = as;
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`field ${className}`}>
      <div className="field-header">
        <label htmlFor={id}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {labelAction}
      </div>
      {children ?? (
        <Input
          id={id}
          ref={ref}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          {...props}
        />
      )}
      {help ? (
        <p className="field-help" id={`${id}-help`}>
          {help}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default FormField;
