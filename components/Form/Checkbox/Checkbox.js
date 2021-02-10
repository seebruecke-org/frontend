import { forwardRef } from 'react';
import { v4 as uuid } from 'uuid';

import FormError from '../Error';

import * as styles from './checkbox.module.css';

function Checkbox({ children, id = null, error = null, ...props }, ref) {
  const htmlFor = id ?? uuid();

  return (
    <div className="relative py-2">
      {error && (
        <div
          className={`absolute top-0 left-0 w-full h-full z-0 bg-gray-300 -ml-4 rounded-md ${styles.background}`}
        />
      )}
      <div
        className={`flex items-start relative ${
          error && 'mb-4 md:mb-0 text-orange-900'
        }`}
      >
        <input
          type="checkbox"
          className={`${styles.checkbox} z-10 relative`}
          id={htmlFor}
          ref={ref}
          {...props}
        />

        {children && (
          <label
            htmlFor={htmlFor}
            className={`font-rubik text-base md:text-medium relative inline-block cursor-pointer py-2 leading-tight md:leading-normal z-10 ${styles.label}`}
          >
            <span className="text-black">{children}</span>
          </label>
        )}
      </div>

      {error?.message && <FormError message={error.message} />}
    </div>
  );
}

export default forwardRef(Checkbox);
