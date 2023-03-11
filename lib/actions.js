import { format, utcToZonedTime } from 'date-fns-tz';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import isSameDay from 'date-fns/isSameDay';
import parseISO from 'date-fns/parseISO';

import { getFragments } from '@/components/Blocks';
import METADATA_FRAGMENT from '@/components/SEO/fragment';

import { mergeMetadata } from '@/lib/metadata';
import { fetchAPI } from '@/lib/api';
import { createUri as createCityUri } from '@/lib/city';
import { toMapboxCoordinates } from '@/lib/coordinates';

function getDateWithFixedTZ(dateStr) {
  return utcToZonedTime(parseISO(dateStr), 'Europe/Berlin');
}

export function formatStartAndEnd(start, end, formatting) {
  const startDate = getDateWithFixedTZ(start);
  const endDate = getDateWithFixedTZ(end);
  const startEndIsSameDay = isSameDay(startDate, endDate);

  const formattedStart = start && format(startDate, formatting.dateTime);

  const formattedEnd =
    end &&
    format(
      endDate,
      `${startEndIsSameDay ? '' : formatting.date} ${formatting.time}`
    );

  return `${formattedStart} — ${formattedEnd} ${formatting.timePostfix}`;
}

export function formatTime(date, formatting) {
  if (!date) {
    return null;
  }

  return format(getDateWithFixedTZ(date), formatting);
}

export function buildGraphQLQuery(fields, filter = [], limit, locale) {
  const fieldsObject = fields.reduce((acc, name) => {
    acc[name] = true;
    return acc;
  }, {});

  const filterObject = filter.reduce( (acc, { connect_via, value, key }) => {
    let normalizedValue = value;

    if (typeof normalizedValue === 'object') {
      normalizedValue = {
        [normalizedValue.key]: normalizedValue.value
      };
    }

    switch (key) {
      case 'campaign':
        normalizedValue = {
          slug: {eq:value}
        };
    }
    acc[key] = normalizedValue;


    // This part is not used. kept for reference.
    // switch (connect_via) {
    //   case 'or':
    //     if (!acc['_or']) {
    //       acc['_or'] = {};
    //     }
    //
    //     acc['_or'][key] = normalizedValue;
    //
    //     break;
    //
    //   default:
    //     acc[key] = normalizedValue;
    // }

    return acc;
  }, {});

  return jsonToGraphQLQuery({
    query: {
      actions: {
        data: {
          id: true,
          attributes: {
            ...fieldsObject
          }
        },

        __args: {
          filters: {
            end: { gte: new Date().toISOString() },
            ...filterObject
          },
          locale: locale,
          sort: 'start:asc',
          pagination: { limit: !limit || limit === 0 ? 100 : limit }
        }
      }
    }
  });
}

export async function fetchAllActions(locale, formatting, options) {
  const query = buildGraphQLQuery(
    [
      'title',
      'intro',
      'start',
      'slug',
      'location',
      'location_detail',
      'coordinates'
    ],
    [],
    null,
    locale
  );
  const { actions } = await fetchAPI(query, options);

  return actions.reduce((acc, { start, end, coordinates, ...action }) => {
    const key = format(getDateWithFixedTZ(start), formatting.date);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      ...action,
      start: formatTime(start, formatting.dateTime),
      end: formatTime(end, formatting.dateTime),
      coordinates: toMapboxCoordinates(coordinates)
    });

    return acc;
  }, {});
}

export async function fetchActionBySlug(slug, locale, formatting, options) {
  const { actions } = await fetchAPI(
    `
    query ActionBySlug {
      actions(filters: { slug: {eq:"${slug}"}}, locale: "all") {data{attributes{
        title
        intro
        start
        end
        content {
          __typename
          ${getFragments({
            exclude: [
              'SubNavigation',
              'StageLarge',
              'StageMedium',
              'Actions',
              'MediaGallery',
              'Newsletter',
              'Fundraisingbox'
            ]
          })}
        }

        location
        location_detail

        locale
        group {data{attributes{
          city {data{attributes{
            name
            slug
            localizations {data{attributes{
              slug 
            }}}
          }}}
        }}}

        metadata {
          ${METADATA_FRAGMENT}
        }
      }}}
    }
  `,
    options
  );

  const action = actions && actions[0];

  if (action && action?.group?.city?.name) {
    if (action.locale !== locale){
      // action's city will be in german, but we want to link it to the english
      action.group.city.slug = action.group.city.localizations[0].slug;
    }
    action.group.city.uri = await createCityUri(action.group.city.slug, {locale});
  }

  if (action) {
    action.metadata = mergeMetadata(action.metadata, {
      title: action?.title
    });

    action.formattedDateRange = formatStartAndEnd(
      action.start,
      action.end,
      formatting
    );
  }

  return {
    data: {
      ...action
    }
  };
}

export async function fetchAllActionPaths(locale, options) {
  const { actions } = await fetchAPI(
    `
    query {
      actions {data{attributes{
        slug
      }}}
    }
  `,
    options
  );

  return actions.map(({ slug }) => ({
    locale,
    params: {
      slug: [slug]
    }
  }));
}
