import { useI18n } from 'next-localization';
import { format } from 'date-fns';
import isSameDay from 'date-fns/isSameDay';
import React from 'react';

import { fetchAllActionPaths } from '@/lib/actions';
import { query as queryGlobalData } from '../../lib/global';
import { fetchActionBySlug } from '../../lib/actions';

import Action from '@/components/Map/Action';
import BlockSwitch from '@/components/BlockSwitch';
import Group from '@/components/Map/Group';
import Heading from '@/components/Heading';
import SEO from '@/components/SEO';

export default function ActionPage({
  title,
  content,
  start,
  end,
  where,
  group
}) {
  const i18n = useI18n();

  const formatDate = (date, prevDate = null) => {
    const start = new Date(date);
    const end = prevDate && new Date(prevDate);

    if (end && isSameDay(start, end)) {
      return `${format(start, `${i18n.t('action.timeFormat')}`)} ${i18n.t(
        'action.timePostfix'
      )}`;
    }

    return `${format(
      start,
      `${i18n.t('action.dateFormat')}, ${i18n.t('action.timeFormat')}`
    )} ${i18n.t('action.timePostfix')}`;
  };

  return (
    <article>
      <SEO title={title} />

      <div className="grid grid-layout-primary">
        <Heading
          level={1}
          className="col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0 w-full"
        >
          {title}
        </Heading>

        <div className="col-span-full md:col-start-3 md:col-span-5 px-10 md:px-0 mt-20">
          <Action
            title={`${formatDate(start)} - ${formatDate(end, start)}`}
            intro={where}
          />
        </div>
      </div>

      <BlockSwitch blocks={content} />

      {group && group?.city && (
        <div className="grid grid-layout-primary">
          <Heading
            level={2}
            className="col-span-full md:col-start-3 md:col-span-9 px-10 md:px-0"
          >
            Organisiert von der Lokalgruppe
          </Heading>

          <div className="col-span-full md:col-start-3 md:col-span-5 px-10 md:px-0 mt-20">
            <Group {...group.city} />
          </div>
        </div>
      )}
    </article>
  );
}

export async function getStaticPaths() {
  const paths = await fetchAllActionPaths();

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ locale, params }) {
  const { slug } = params;

  const { data } = await fetchActionBySlug(slug);
  const { initialState = null, ...globalData } = await queryGlobalData(locale);

  if (data === null) {
    return {
      notFound: true
    };
  }

  return {
    // TODO: find a good magic number here
    revalidate: 60,
    props: {
      ...data,
      ...globalData,
      initialState
    }
  };
}
