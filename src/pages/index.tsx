import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

const Index = () => {
    const router = useRouter()

    useEffect(() => {
        if (!Cookies.get('scc-user-token')) {
            router.push('/auth/signin')
        } else {
            router.push('/contracts')
        }
    }, [router])

    return null
}

export default Index
