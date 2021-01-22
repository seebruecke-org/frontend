import NextLink from 'next/link';

import FacebookIcon from '@/public/icons/facebook-square-brands.svg';
import InstagramIcon from '@/public/icons/instagram-brands.svg';
import Link from '../Richtext/Link';
import TwitterIcon from '@/public/icons/twitter-brands.svg';
import VStack from '@/components/VStack';

export default function ContactBlock({
  email,
  telephone,
  twitter,
  instagram,
  facebook
}) {
  return (
    <VStack as="ul" gap={2} className="col-start-3 col-span-10 pb-20">
      {email && (
        <li className="w-full">
          <Link href={`mailto:${email}`}>{email}</Link>
        </li>
      )}

      {telephone && (
        <li className="w-full">
          <NextLink href={`tel:${telephone}`}>
            <a className="font-rubik text-base md:text-medium">{telephone}</a>
          </NextLink>
        </li>
      )}

      <li className="flex space-x-4 items-center">
        {twitter && (
          <NextLink href={twitter}>
            <a className="hover:text-orange-200">
              <TwitterIcon className="w-16 h-16" />
            </a>
          </NextLink>
        )}

        {facebook && (
          <NextLink href={facebook}>
            <a className="hover:text-orange-200">
              <FacebookIcon className="w-16 h-16" />
            </a>
          </NextLink>
        )}

        {instagram && (
          <NextLink href={instagram}>
            <a className="hover:text-orange-200">
              <InstagramIcon className="w-16 h-16" />
            </a>
          </NextLink>
        )}
      </li>
    </VStack>
  );
}
