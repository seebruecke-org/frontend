import clsx from 'clsx';

import Heading from '@/components/Blocks/Heading';
import FileDownloadIcon from '@/public/icons/file-download.svg';

import { blockNameMatches } from '@/lib/blocks';

function getHumanRedableFileFormat(mimeType) {
  const part = mimeType.split('/')[1].toUpperCase();
  let fileType = part;

  return fileType;
}

export default function MaterialBlock({
  mTitle,
  items = [],
  blockContext: { next, previous }
}) {
  let marginTop = 'mt-20';
  let marginBottom = next && 'mb-20';

  if (blockNameMatches(previous, 'Material')) {
    marginTop = 'mt-0';
  }

  if (blockNameMatches(next, 'Material')) {
    marginBottom = 'mb-0';
  }

  return (
    <div
      className={clsx(
        'col-span-full bg-turquoise-300 pt-4 md:pt-16 pb-24 md:pb-32 grid grid-layout-primary',
        marginTop,
        marginBottom
      )}
    >
      <Heading level={2}>{mTitle}</Heading>

      <ul className="flex flex-col space-y-10 col-span-full md:col-start-3 md:col-span-9 px-8 md:px-0 mt-10">
        {items.map(({ id, description, external_link, name, file }) => (
          <li
            key={`material-item-${id}`}
            className="flex flex-col space-y-2 relative"
          >
            {external_link ? (
              <h3 className="font-rubik text-xs md:text-base font-bold">
                <a href={external_link} className="underline break-all">
                  {name || external_link}
                </a>
              </h3>
            ) : (
              <>
                {file && (
                  <h3 className="font-rubik font-rubik-features text-xs md:text-base font-bold">
                    <a href={file.url} className="underline break-all">
                      {name || file.name}
                    </a>
                  </h3>
                )}
              </>
            )}

            {description && (
              <p className="font-rubik font-rubik-features text-xs md:text-base w-full">
                {description}
              </p>
            )}

            {file && (
              <p className="font-rubik font-rubik-features text-xs md:text-base uppercase flex items-center">
                <FileDownloadIcon className="w-8 h-8 mr-2" />
                {getHumanRedableFileFormat(file.mime)}, {file.size}kb
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
