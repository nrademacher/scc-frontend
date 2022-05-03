import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import { Container, Nav, Navbar } from 'react-bootstrap'
import Cookies from 'js-cookie'
import Link from 'next/link'

const CURRENT_USERNAME = gql`
    query Self {
        self {
            name
        }
    }
`

export const NavBar: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
    const router = useRouter()
    const { data } = useQuery(CURRENT_USERNAME)

    function handleLogout() {
        Cookies.remove('scc-user-token')
        router.push('/auth/signin')
    }

    return (
        <Navbar className="mb-3">
            <Container>
                <Navbar.Brand className="fs-3">{pageTitle}</Navbar.Brand>
                <Nav className="me-auto">
                    {pageTitle !== 'Contracts' ? (
                        <Link href="/contracts" passHref>
                            <Nav.Link>Contracts</Nav.Link>
                        </Link>
                    ) : null}
                    {pageTitle !== 'Usage' ? (
                        <Link href="/usage" passHref>
                            <Nav.Link>Usage</Nav.Link>
                        </Link>
                    ) : null}
                </Nav>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {data ? (
                            <span className="d-flex align-items-center">
                                <span className="me-4">
                                    Welcome, <strong>{data.self.name}</strong>
                                </span>
                                <Nav.Link onClick={handleLogout} className="text-blue">
                                    Log out
                                </Nav.Link>
                            </span>
                        ) : (
                            <Nav>
                                <Link href="/auth/signin" passHref>
                                    <Nav.Link className="link-primary">Sign in</Nav.Link>
                                </Link>
                            </Nav>
                        )}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
