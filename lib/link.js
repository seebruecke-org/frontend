import { fetchAPI } from './api';

export async function fetchLink(link) {
  if (!link) {
    return link;
  }

  try {
    const data = JSON.parse(link);
    const { contentType, id } = data;
    let url = null;

    if (contentType && id) {
      const content = await fetchAPI(`
        query {
          ${contentType}(id: ${id}) {
            slug
            title

            parent {
              slug
            }
          }
        }
      `);

      if (content?.page?.slug) {
        url = `/${content?.page?.slug}`;
      }

      if (content?.page?.slug) {
        url = `/${content?.page?.parent?.slug}/${content?.page?.slug}`;
      }

      if (!url) {
        return data;
      }

      return {
        ...data,
        label: link.label || content?.page?.title,
        url: url.toLocaleLowerCase()
      };
    }

    return data;
  } catch (err) {
    console.log(err);
    return link;
  }
}
