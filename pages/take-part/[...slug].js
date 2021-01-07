import React from 'react';

import { RETURN_CODES } from '../../lib/constants';
import { query as queryGlobalData } from '../../lib/global';
import { query } from '../../lib/take-part';

import { StageMedium } from '@/components/Stages';

export default function TakePartPage({ city, page }) {
  return <StageMedium kicker={page.title} title={city.title} />
}

export async function getServerSideProps({ locale, params: { slug } }) {
  const { type, data, ...res } = await query(slug, locale);
  const globalData = await queryGlobalData(locale);

  if (type === RETURN_CODES.REDIRECT) {
    return {
      redirect: {
        destination: res.destination,
        permanent: true
      }
    }
  }

  if (data === null) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      ...data,
      initialState: globalData
    }
  }
}
