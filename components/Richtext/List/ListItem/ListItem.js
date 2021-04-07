import clsx from 'clsx';

import * as styles from './listItem.module.css';

export default function ListItem({ children }) {
  return <li className={clsx(styles.listItem, 'font-rubik')}>{children}</li>;
}
