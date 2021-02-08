import { v4 as uuid } from 'uuid';

import * as styles from './radio.module.css';

export default function Radio({ children, id = null, ...props }) {
  const htmlFor = id ?? uuid();

  return (
    <div className="flex items-start">
      <input
        type="radio"
        className={`font-rubik text-base text-gray-600 leading-none p-6 mt-2 rounded border border-gray-600 ${styles.radio}`}
        id={htmlFor}
        {...props}
      />

      {children && (
        <label
          htmlFor={htmlFor}
          className={`font-rubik text-base md:text-medium relative inline-block cursor-pointer py-2 leading-tight md:leading-normal ${styles.label}`}
        >
          {children}
        </label>
      )}
    </div>
  );
}
