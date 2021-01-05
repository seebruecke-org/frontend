import { query } from '../../lib/cities';

export default function TakePartPage({ data }) {
  return <div>
    {JSON.stringify(data)}
  </div>
}

export async function getServerSideProps({ params: { slug } }) {
  const data = await query(slug);

  if (data.type === 'redirect') {
    return {
      redirect: {
        destination: data.destination,
        permanent: true
      }
    }
  }

  if (data.data === null) {
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
