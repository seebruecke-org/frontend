import Heading from '@/components/Heading';

import FileDownloadIcon from '@/public/icons/file-download.svg';

export default function MaterialBlock({ item }) {
  return (
    <div className="col-span-full bg-turquoise-300 pt-20 pb-32 grid grid-layout-primary mt-20">
      <Heading
        level={2}
        className="col-span-full md:col-start-3 md:col-span-9 mx-10md:mx-0"
      >
        Material
      </Heading>

      <ul className="flex flex-col space-y-10 col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0 mt-10">
        {item.map(({ id, description, external_link, file }) => (
          <li key={`material-item-${id}`} className="flex flex-col space-y-2">
            {external_link ? (
              <h3 className="font-rubik text-xs md:text-base font-bold">
                <a href={external_link} className="underline break-all">
                  {external_link}
                </a>
              </h3>
            ) : (
              <>
                {file && (
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-rubik font-rubik-features text-xs md:text-base font-bold">
                      <a href={file.url} className="underline break-all">
                        {file.name}
                      </a>
                    </h3>

                    <p className="font-rubik font-rubik-features text-xs md:text-base uppercase flex items-center">
                      <FileDownloadIcon className="w-8 h-8 mr-2" />
                      {file.mime} {file.size}kb
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
