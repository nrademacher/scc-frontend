import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { NavBar } from '@/components'
import { Container, Card, Stack } from 'react-bootstrap'
import { USER_CONTRACTS, type Contract } from './contracts'

const Usage: React.FC = () => {
    const router = useRouter()

    useEffect(() => {
        if (!Cookies.get('scc-user-token')) {
            router.push('/auth/signin')
        }
    }, [router])

    const [usage, setUsage] = useState(1)
    const [contractId, setContractId] = useState('')

    const { data: contractsData, loading: contractsLoading, error } = useQuery(USER_CONTRACTS)

    const selectedContract = useMemo(() => {
        if (!contractsData) return
        const selectedContract: Contract = contractsData.contractsByCurrentUser.find(
            (contract: Contract) => contract.publicId === contractId
        )
        return selectedContract
    }, [contractId, contractsData])

    const contractPrice = useMemo(() => {
        if (!selectedContract) return
        return selectedContract.oneTimeFee + selectedContract.usageFee * usage
    }, [usage, selectedContract])

    if (contractsLoading) return <p>Loading...</p>
    if (error) return <p>Oh no... {error.message}</p>

    return (
        <Container>
            <NavBar pageTitle="Usage" />
            <Card style={{ width: '50%' }}>
                <Card.Body>
                    <Card.Title className="fw-normal mb-3">Calculate contract price for usage</Card.Title>
                    <Stack gap={4}>
                        <div className="d-flex flex-column">
                            <label htmlFor="usage" className="mb-1 fw-bolder">
                                Usages
                            </label>
                            <input
                                id="usage"
                                type="number"
                                min="1"
                                value={usage}
                                onChange={e => setUsage(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <label htmlFor="contract-select" className="mb-1 fw-bolder">
                                Contract
                            </label>
                            <select
                                id="contract-select"
                                value={contractId}
                                onChange={e => setContractId(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select a contract
                                </option>
                                {contractsData.contractsByCurrentUser.map((contract: Contract) => (
                                    <option key={contract.publicId} value={contract.publicId}>
                                        {contract.machineName} - {contract.publicId}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <hr />
                    </Stack>
                    {contractPrice && !isNaN(contractPrice) ? (
                        <Card.Text className="fs-4">
                            <span className="fw-bold">Contract Price: </span>${contractPrice}
                        </Card.Text>
                    ) : null}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Usage
