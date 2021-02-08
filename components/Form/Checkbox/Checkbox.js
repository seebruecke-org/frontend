import { forwardRef } from 'react';
import { v4 as uuid } from 'uuid';

import FormError from '../Error';

import * as styles from './checkbox.module.css';

function Checkbox({ children, id = null, error = null, ...props }, ref) {
  const htmlFor = id ?? uuid();

  return (
    <div className={`flex items-start ${error && 'text-orange-900'}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        id={htmlFor}
        ref={ref}
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

export default forwardRef(Checkbox);
