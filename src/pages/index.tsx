import { addApolloState, initializeApollo } from '@/lib/apollo'
import { gql, useQuery } from '@apollo/client'

const helloQuery = gql`
    query Query {
        hello
    }
`

const Home = () => {
    const { data, loading, error } = useQuery(helloQuery)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Oh no... {error.message}</p>

    return <h1 className="grid place-items-center min-h-screen text-7xl">{data.hello}</h1>
}

export default Home

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   const { data } = await apolloClient.query({
//     query: helloQuery,
//   });

//   return addApolloState(apolloClient, {
//     props: {
//       data: JSON.parse(JSON.stringify(data)),
//     },
//   });
// }
