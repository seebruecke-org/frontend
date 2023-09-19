import NextLink from 'next/link';

import FacebookIcon from '@/public/icons/facebook-square-brands.svg';
import InstagramIcon from '@/public/icons/instagram-brands.svg';
import Link from '@/components/Richtext/Link';
import TwitterIcon from '@/public/icons/twitter-brands.svg';
import YoutubeIcon from '@/public/icons/youtube-brands.svg';
import MastodonIcon from '@/public/icons/mastodon-brands.svg';

export default function ContactBlock({
  email,
  telephone,
  twitter,
  instagram,
  facebook,
  youtube,
  mastodon,
}) {
  return (
    <ul className="flex flex-col space-y-2 col-span-full md:col-start-3 md:col-span-10 py-20 px-8 md:px-0">
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
              <TwitterIcon className="w-12 md:w-16 h-auto" />
            </a>
          </NextLink>
        )}

        {facebook && (
          <NextLink href={facebook}>
            <a className="hover:text-orange-200">
              <FacebookIcon className="w-12 md:w-16 h-auto" />
            </a>
          </NextLink>
        )}

        {instagram && (
          <NextLink href={instagram}>
            <a className="hover:text-orange-200">
              <InstagramIcon className="w-12 md:w-16 h-auto" />
            </a>
          </NextLink>
        )}

        {youtube && (
          <NextLink href={youtube}>
            <a className="hover:text-orange-200">
              <YoutubeIcon className="w-12 md:w-16 h-auto" />
            </a>
          </NextLink>
        )}

        {mastodon && (
          <NextLink href={mastodon}>
            <a className="hover:text-orange-200">
              <MastodonIcon className="w-12 md:w-16 h-auto" />
            </a>
          </NextLink>
        )}
      </li>
    </ul>
  );
}
