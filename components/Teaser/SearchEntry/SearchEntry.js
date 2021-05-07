import clsx from 'clsx';

import Heading from '@/components/Heading';

export default function SearchEntry({ title, excerpt, isLast = false }) {
  return (
    <article className="grid grid-layout-primary gap-8 col-span-full pt-12 md:pt-20 px-8 md:px-0 relative group overflow-x-hidden">
      <div
        className={clsx('col-span-full w-full md:col-start-3 md:col-span-11')}
      >
        <Heading level={2} as={3}>
          {title}
        </Heading>

        {excerpt && (
          <p className="font-rubik text-small md:text-medium mt-6">{excerpt}</p>
        )}
      </div>

      {!isLast && (
        <span className="col-start-1 md:col-start-2 col-span-full md:col-span-12 h-1 border-b border-gray-300 mt-4 md:mt-12" />
      )}
    </article>
  );
}
