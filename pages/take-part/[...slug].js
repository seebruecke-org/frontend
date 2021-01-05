import { RETURN_CODES } from '../../lib/constants';
import { query } from '../../lib/take-part';

import Header from '@/components/Header';

export default function TakePartPage(props) {
  return <div>
    <Header />
    {JSON.stringify(props)}
  </div>
}

export async function getServerSideProps({ locale, params: { slug } }) {
  const { type, data, ...res } = await query(slug, locale);

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
      ...data
    }
  }
}
