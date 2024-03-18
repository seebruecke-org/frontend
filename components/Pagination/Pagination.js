import styles from './pagination.module.sass';

export default function Pagination({total, current, linkMaker}) {
  return <div className="col-span-full pb-20 md:pb-40">
    <div className="grid grid-layout-primary">
      <div className="col-span-full md:col-start-2 md:col-span-12">
        <ul className={styles.pagination}>
          {[...Array(total)].map((x, i) => (
            <li>
              {linkMaker && linkMaker(i, i == current)}
            </li>))}
        </ul>
      </div>
    </div>
  </div>;
}
