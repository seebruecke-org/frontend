import NextLink from 'next/link'

import ChevronRightIcon from '@/public/icons/chevron-right-regular.svg'

export default function GroupTeaser({ uri, name }) {
  return (
    <h4 className="font-brezel text-base font-bold italic">
      <NextLink
        href={uri}
        className="bg-orange-200 hover:bg-orange-800 cursor-pointer p-5 flex justify-between"
      >
        {name}
        <ChevronRightIcon className="w-5 h-auto mr-4 opacity-20" />
      </NextLink>
    </h4>
  )
}
