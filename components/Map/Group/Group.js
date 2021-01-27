import NextLink from 'next/link';

export default function Group({ uri, name }) {
  return (
    <h4 className="font-brezel text-base font-bold italic">
      <NextLink href={uri}>
        <a className="bg-orange-200 hover:bg-orange-800 cursor-pointer p-5 block">
          {name}
        </a>
      </NextLink>
    </h4>
  );
}
