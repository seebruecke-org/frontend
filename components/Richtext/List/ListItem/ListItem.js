import * as styles from './listItem.module.css';

export default function ListItem({ children }) {
  return <li className={`${styles.listItem} font-rubik`}>{children}</li>;
}
