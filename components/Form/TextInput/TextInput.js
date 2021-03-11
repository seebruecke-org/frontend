import { forwardRef } from 'react';
import { v4 as uuid } from 'uuid';

import FormError from '../Error';
import Help from '../Help';
import Label from '../Label';
import TimesCircleIcon from '@/public/icons/times-circle.svg';

import * as styles from './textInput.module.css';

function TextInput(
  { type = 'text', label, help, id = null, error = null, className, ...props },
  ref
) {
  const htmlFor = id ?? uuid();

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}

      {help && <Help>{help}</Help>}

      <div className="relative mt-2">
        {error?.message && <FormError message={error.message} />}

        <div className="relative">
          <input
            type={type}
            className={`font-rubik text-base leading-none p-4 md:p-6 rounded-md border-2 outline-none w-full ${
              styles.input
            } ${
              error
                ? 'border-orange-900 text-orange-900'
                : 'border-gray-600 text-gray-600 focus:border-black'
            }`}
            id={htmlFor}
            ref={ref}
            {...props}
          />

          {error && (
            <TimesCircleIcon className="text-orange-900 absolute top-2/4 right-4 h-10 w-10 md:h-12 md:w-12 transform -translate-y-1/2" />
          )}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(TextInput);
