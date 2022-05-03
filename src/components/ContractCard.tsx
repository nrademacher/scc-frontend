import type { Contract } from '@/pages/contracts'
import { type ApolloQueryResult, gql, type OperationVariables, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Button, Card, Stack } from 'react-bootstrap'

const DELETE_CONTRACT = gql`
    mutation DeleteContract($id: String!) {
        deleteContract(id: $id) {
            publicId
        }
    }
`

const UPDATE_CONTRACT = gql`
    mutation UpdateContract($id: String!, $machineName: String, $oneTimeFee: Float, $usageFee: Float) {
        updateContract(id: $id, machineName: $machineName, oneTimeFee: $oneTimeFee, usageFee: $usageFee) {
            publicId
        }
    }
`

type ContractCardProps = Contract & {
    contractRefetchFunc: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>
}

export const ContractCard: React.FC<ContractCardProps> = ({
    publicId,
    machineName,
    oneTimeFee,
    usageFee,
    contractRefetchFunc,
}) => {
    const [editMode, setEditMode] = useState(false)
    const [newMachineName, setNewMachineName] = useState(machineName)
    const [newOneTimeFee, setNewOneTimeFee] = useState(oneTimeFee)
    const [newUsageFee, setNewUsageFee] = useState(usageFee)

    const [deleteContract] = useMutation(DELETE_CONTRACT)
    const [updateContract] = useMutation(UPDATE_CONTRACT)

    async function handleDelete() {
        await deleteContract({ variables: { id: publicId } })
        await contractRefetchFunc()
    }

    async function handleUpdate() {
        setEditMode(false)
        await updateContract({
            variables: { id: publicId, machineName: newMachineName, oneTimeFee: newOneTimeFee, usageFee: newUsageFee },
        })
    }

    return (
        <Card className="ms-3 mb-3" style={{ width: '22.5%' }}>
            <Card.Body>
                <Card.Title>
                    <span className="fw-bolder fs-6">#{publicId}</span>
                </Card.Title>
                <hr />
                <Stack gap={2}>
                    <Card.Text>
                        <span className="fw-bolder">Machine Name:</span>{' '}
                        {editMode ? (
                            <input
                                placeholder="Machine Name"
                                value={newMachineName}
                                onChange={e => setNewMachineName(e.target.value)}
                                required
                            />
                        ) : (
                            newMachineName
                        )}
                    </Card.Text>
                    <Card.Text>
                        <span className="fw-bolder">One-Time Fee:</span>{' '}
                        {editMode ? (
                            <input
                                placeholder="One-Time Fee"
                                value={newOneTimeFee}
                                onChange={e => setNewOneTimeFee(Number(e.target.value))}
                                required
                            />
                        ) : (
                            newOneTimeFee
                        )}
                    </Card.Text>
                    <Card.Text>
                        <span className="fw-bolder">Usage Fee:</span>{' '}
                        {editMode ? (
                            <input
                                placeholder="Usage Fee"
                                value={newUsageFee}
                                onChange={e => setNewUsageFee(Number(e.target.value))}
                                required
                            />
                        ) : (
                            newUsageFee
                        )}
                    </Card.Text>
                </Stack>
                <hr />
                <Stack gap={2}>
                    {!editMode ? (
                        <Button onClick={() => setEditMode(true)} variant="primary">
                            Edit
                        </Button>
                    ) : (
                        <Button onClick={handleUpdate} variant="success">
                            Save
                        </Button>
                    )}
                    <Button onClick={handleDelete} variant="danger">
                        Delete
                    </Button>
                </Stack>
            </Card.Body>
        </Card>
    )
}
