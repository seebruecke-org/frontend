import Heading from '@/components/Blocks/Heading';

import FileDownloadIcon from '@/public/icons/file-download.svg';

function getHumanRedableFileFormat(mimeType) {
  const part = mimeType.split('/')[1].toUpperCase();
  let fileType = part;

  return fileType;
}

export default function MaterialBlock({
  mTitle,
  items = [],
  blockContext: { next }
}) {
  return (
    <div
      className={`col-span-full bg-turquoise-300 pt-4 md:pt-16 pb-24 md:pb-32 grid grid-layout-primary mt-20 ${
        next && 'mb-20'
      }`}
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
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-rubik font-rubik-features text-xs md:text-base font-bold">
                      <a href={file.url} className="underline break-all">
                        {name || file.name}
                      </a>
                    </h3>

                    <p className="font-rubik font-rubik-features text-xs md:text-base uppercase flex items-center">
                      <FileDownloadIcon className="w-8 h-8 mr-2" />
                      {getHumanRedableFileFormat(file.mime)}, {file.size}kb
                    </p>
                  </div>
                )}
              </>
            )}

            {description && (
              <p className="font-rubik font-rubik-features text-xs md:text-base w-full">
                {description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
