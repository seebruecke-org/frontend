import Heading from '@/components/Heading';
import VStack from '@/components/VStack';

import FileDownloadIcon from '@/public/icons/file-download.svg';

export default function MaterialBlock({ item }) {
  return (
    <VStack
      gap={10}
      className="col-span-full bg-turquoise-300 pt-20 pb-32 grid grid-layout-primary mt-20"
    >
      <Heading level={2} className="col-span-full md:col-start-3 md:col-span-9">
        Material
      </Heading>

      <VStack
        as="ul"
        gap={10}
        className="col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0"
      >
        {item.map(({ id, description, external_link, file }) => (
          <li key={`material-item-${id}`}>
            <VStack gap={2}>
              {external_link ? (
                <h3 className="font-rubik text-xs md:text-base font-bold">
                  <a href={external_link} className="underline break-all">
                    {external_link}
                  </a>
                </h3>
              ) : (
                <>
                  {file && (
                    <VStack gap={2}>
                      <h3 className="font-rubik text-xs md:text-base font-bold">
                        <a href={file.url} className="underline break-all">
                          {file.name}
                        </a>
                      </h3>

                      <p className="font-rubik text-xs md:text-base uppercase flex items-center">
                        <FileDownloadIcon className="w-8 h-8 mr-2" />
                        {file.mime} {file.size}kb
                      </p>
                    </VStack>
                  )}
                </>
              )}

              {description && (
                <p className="font-rubik text-xs md:text-base w-full">
                  {description}
                </p>
              )}
            </VStack>
          </li>
        ))}
      </VStack>
    </VStack>
  );
}
