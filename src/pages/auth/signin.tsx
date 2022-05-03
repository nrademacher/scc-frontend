import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Container, Card, Button, Form, Stack } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { nanoid } from 'nanoid'

const SIGNUP_USER = gql`
    mutation SignUpUser($email: String!, $password: String!, $name: String!) {
        signUpUser(email: $email, password: $password, name: $name) {
            email
            name
            publicId
        }
    }
`

export const LOGIN_USER = gql`
    query Query($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`

const SignIn: React.FC = () => {
    const router = useRouter()

    const [signupMode, setSignupMode] = useState(false)
    const [isGuest, setIsGuest] = useState(false)

    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const [signUpUser, { loading }] = useMutation(SIGNUP_USER)

    const [logInUser, { data: loginData }] = useLazyQuery(LOGIN_USER)

    if (loginData && !loading) {
        Cookies.set('scc-user-token', loginData.login)

        router.push('/contracts')
    }

    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Card className="mt-4" style={{ width: '24rem' }}>
                <Card.Body>
                    <Card.Title className="mb-4 fs-3">{signupMode ? 'Sign Up' : 'Login'}</Card.Title>
                    <Form
                        onSubmit={async e => {
                            e.preventDefault()
                            if (!signupMode && !isGuest) {
                                await logInUser({ variables: { email, password } })
                            } else if (!isGuest) {
                                await signUpUser({ variables: { email, password, name: userName } })
                                await logInUser({ variables: { email, password } })
                            } else {
                                const guestName = 'Guest-' + Date.now()
                                const guestEmail = guestName + '@scc.com'
                                const guestPassword = guestName + nanoid()
                                await signUpUser({
                                    variables: { email: guestEmail, password: guestPassword, name: guestName },
                                })
                                await logInUser({ variables: { email: guestEmail, password: guestPassword } })
                            }
                        }}
                    >
                        <Stack gap={4}>
                            <input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {signupMode ? (
                                <input
                                    placeholder="User name"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                />
                            ) : null}
                            <input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <a
                                onClick={() => setSignupMode(!signupMode)}
                                style={{ cursor: 'pointer' }}
                                className="text-center link-primary"
                            >
                                {signupMode ? 'Log in' : 'Sign up'}
                            </a>
                            <Button type="submit">{signupMode ? 'Sign Up' : 'Log in'}</Button>
                        </Stack>
                        <hr />
                        <Button onClick={() => setIsGuest(true)} type="submit" style={{ width: '100%' }}>
                            Continue as Guest
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default SignIn
