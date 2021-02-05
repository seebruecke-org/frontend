import { v4 as uuid } from 'uuid';

import Help from '../Help';
import Label from '../Label';

import * as styles from './textInput.module.css';

export default function TextInput({
  type = 'text',
  label,
  help,
  id = null,
  ...props
}) {
  const htmlFor = id ?? uuid();

  return (
    <>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}

      {help && <Help>{help}</Help>}

      <input
        type={type}
        className={`font-rubik text-base text-gray-600 leading-none p-4 md:p-6 mt-2 rounded-md border border-gray-600 focus:border-black outline-none ${styles.input}`}
        id={htmlFor}
        {...props}
      />
    </>
  );
}
