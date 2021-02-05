import { v4 as uuid } from 'uuid';

import * as styles from './checkbox.module.css';

export default function Checkbox({ children, id = null, ...props }) {
  const htmlFor = id ?? uuid();

  return (
    <div className="flex items-start">
      <input
        type="checkbox"
        className={`font-rubik text-base text-gray-600 leading-none p-6 mt-2 rounded border border-gray-600 ${styles.checkbox}`}
        id={htmlFor}
        {...props}
      />

      {children && (
        <label
          htmlFor={htmlFor}
          className={`font-rubik text-base md:text-medium relative inline-block cursor-pointer py-2 ${styles.label}`}
        >
          {children}
        </label>
      )}
    </div>
  );
}
