import { addApolloState, initializeApollo } from '@/lib/apollo'
import { gql, useQuery } from '@apollo/client'
import { Container, Row, Card, Button } from 'react-bootstrap'


const helloQuery = gql`
    query Query {
        hello
    }
`

const Home = ({data}: any) => {
    // const { data, loading, error } = useQuery(helloQuery)

    // if (loading) return <p>Loading...</p>
    // if (error) return <p>Oh no... {error.message}</p>

    return (
    <Container>
         <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Welcome</Card.Title>
                <Card.Text>
                  {data.hello}
                </Card.Text>
                <Button variant="primary" href="https://nextjs.org/docs">
                  More &rarr;
                </Button>
              </Card.Body>
            </Card>
          </Row>
    </Container>
    )
}

export default Home

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: helloQuery,
  });

  return addApolloState(apolloClient, {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  });
}
