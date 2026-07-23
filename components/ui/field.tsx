import { useId } from 'react';
import { cn } from '@/lib/utils';

const controlStyles = [
  'w-full rounded-card border bg-surface-raised px-4 py-3 text-[0.9375rem] text-ink',
  'placeholder:text-ink-muted/70',
  'transition-[border-color,box-shadow] duration-200',
  'focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/12',
  'disabled:cursor-not-allowed disabled:opacity-60',
];

type FieldProps = {
  label: string;
  error?: string;
  /** Rendered under the control when there is no error. */
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby': string | undefined;
    className: string;
  }) => React.ReactNode;
};

/**
 * Wires up the label, control, hint and error message with the right ids and
 * ARIA relationships. Passing the control as a render prop means the wiring
 * cannot be forgotten at the call site.
 */
export function Field({ label, error, hint, required, className, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-navy-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-cyan-600">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-muted">optional</span>
        )}
      </label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        className: cn(
          controlStyles,
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/12',
        ),
      })}

      {error ? (
        // `role="alert"` announces the message the moment validation fails.
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
