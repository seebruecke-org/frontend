import styles from './pagination.module.sass';
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import ForwardImage from "./Forward.svg"
import FastForwardImage from "./FastForward.svg"
import BackwardImage from "./Backward.svg"
import FastBackwardImage from "./FastBackward.svg"

export default function Pagination({total, current, urlMaker, locale, bigStep=10}) {

  return <div className="col-span-full pb-20 md:pb-40">
    <div className="grid grid-layout-primary">
      <div className="col-span-full md:col-start-2 md:col-span-12">
        <ul className={styles.pagination}>
          <li>
            <PaginationLink pageNum={current - bigStep} locale={locale} urlMaker={urlMaker} total={total}>
              <FastBackwardImage/>
            </PaginationLink>
          </li>
          <li>
            <PaginationLink pageNum={current - 1} locale={locale} urlMaker={urlMaker} total={total}>
              <BackwardImage/>
            </PaginationLink>
          </li>
          <li className='font-rubik-features font-rubik text-small md:text-medium font-bold'>
            {(current ?? 0) + 1} / {total ?? "-"}
          </li>
          <li>
            <PaginationLink pageNum={current + 1} locale={locale} urlMaker={urlMaker} total={total}>
              <ForwardImage/>
            </PaginationLink>
          </li>
          <li>
            <PaginationLink pageNum={current + bigStep} locale={locale} urlMaker={urlMaker} total={total}>
              <FastForwardImage/>
            </PaginationLink>
          </li>

        </ul>
      </div>
    </div>
  </div>;
}

export function PaginationLink({urlMaker, pageNum, total, children, locale}) {
  const enabled = 0 <= pageNum && pageNum < total;

  const cls = 'font-rubik-features font-rubik text-small md:text-medium font-bold';
  return <>
    {enabled && (<Link
      href={urlMaker(pageNum, total, locale)}
      className={clsx(cls, "text-black")}
      >
        {children}
    </Link>)}
    {!enabled && (<span className={clsx(cls, "text-gray-500")}>
          {children}
        </span>)}
  </>;

}
