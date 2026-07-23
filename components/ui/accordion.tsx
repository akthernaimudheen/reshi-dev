'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { duration, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

/**
 * Single-open accordion.
 *
 * Hand-rolled rather than pulled from a library because the accessible
 * contract is small and well defined: a real `<button>` per row carrying
 * `aria-expanded` and `aria-controls`, and a region labelled back by the
 * button. Keyboard support then comes free from the button element.
 */
export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                // Only reference the panel while it is actually mounted.
                // AnimatePresence unmounts closed panels, and pointing
                // aria-controls at a missing id fails aria-valid-attr-value.
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    'text-lg font-semibold tracking-[-0.015em] transition-colors duration-200',
                    isOpen
                      ? 'text-navy-900'
                      : 'text-navy-900/80 group-hover:text-navy-900',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-[var(--ease-out-quint)]',
                    isOpen
                      ? 'rotate-45 border-cyan-500 bg-cyan-500 text-navy-950'
                      : 'border-line-strong text-ink-muted group-hover:border-navy-900 group-hover:text-navy-900',
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pr-12 pb-7 text-ink-muted">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
