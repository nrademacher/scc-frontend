import { ContractCard, NavBar } from '@/components'
import { gql, useMutation, useQuery } from '@apollo/client'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Row, Card, Button, Form, Stack } from 'react-bootstrap'

const CREATE_CONTRACT = gql`
    mutation CreateContract($machineName: String!, $oneTimeFee: Float!, $usageFee: Float!) {
        createContract(machineName: $machineName, oneTimeFee: $oneTimeFee, usageFee: $usageFee) {
            machineName
            oneTimeFee
            usageFee
        }
    }
`

export const USER_CONTRACTS = gql`
    query ContractsByCurrentUser {
        contractsByCurrentUser {
            publicId
            machineName
            oneTimeFee
            usageFee
        }
    }
`

export type Contract = {
    publicId: string
    machineName: string
    oneTimeFee: number
    usageFee: number
}

const Contracts: React.FC = () => {
    const router = useRouter()

    useEffect(() => {
        if (!Cookies.get('scc-user-token')) {
            router.push('/auth/signin')
        }
    }, [router])

    const [machineName, setMachineName] = useState('')
    const [oneTimeFee, setOneTimeFee] = useState<string | number>('')
    const [usageFee, setUsageFee] = useState<string | number>('')

    const [createContract, { loading, error }] = useMutation(CREATE_CONTRACT)
    const { data: contractsData, loading: contractsLoading, refetch: refetchContracts } = useQuery(USER_CONTRACTS)

    if (loading || contractsLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <Container>
            <NavBar pageTitle="Contracts" />
            <Row>
                <Card className="ms-3 mb-3" style={{ width: '22.5%' }}>
                    <Form
                        onSubmit={async e => {
                            e.preventDefault()
                            await createContract({ variables: { machineName, oneTimeFee, usageFee } })
                            await refetchContracts()
                        }}
                    >
                        <Card.Body>
                            <Stack gap={4}>
                                <Card.Title>New Contract</Card.Title>
                                <input
                                    placeholder="Machine Name"
                                    value={machineName}
                                    onChange={e => setMachineName(e.target.value)}
                                    required
                                />
                                <input
                                    placeholder="One-Time Fee"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={oneTimeFee}
                                    onChange={e => setOneTimeFee(Number(e.target.value))}
                                    required
                                />
                                <input
                                    placeholder="Usage Fee"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={usageFee}
                                    onChange={e => setUsageFee(Number(e.target.value))}
                                    required
                                />
                                <Button type="submit">Create Contract</Button>
                            </Stack>
                        </Card.Body>
                    </Form>
                </Card>
                {contractsData
                    ? contractsData.contractsByCurrentUser.map((contract: Contract) => (
                          <ContractCard
                              key={contract.publicId}
                              publicId={contract.publicId}
                              machineName={contract.machineName}
                              oneTimeFee={contract.oneTimeFee}
                              usageFee={contract.usageFee}
                              contractRefetchFunc={refetchContracts}
                          />
                      ))
                    : null}
            </Row>
        </Container>
    )
}

export default Contracts
