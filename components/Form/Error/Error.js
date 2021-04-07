import clsx from 'clsx';

import * as styles from './error.module.css';

export default function FormError({ message, align = 'middle' }) {
  return (
    <div
      className={clsx(
        'font-rubik text-small md:absolute md:left-full md:min-w-min md:w-96 mb-2 md:mb-0',
        align === 'middle' && 'md:transform md:-translate-y-1/2 md:top-2/4',
        align === 'top' && 'md:transform md:-translate-y-1/2 md:top-10'
      )}
    >
      <p
        className={clsx(
          'text-white bg-orange-900 py-4 px-6 md:p-8 rounded-2xl md:ml-12 relative',
          styles.container
        )}
      >
        {message}
      </p>
    </div>
  );
}
