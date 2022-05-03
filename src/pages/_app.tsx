import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '@/lib/apollo'

import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps)

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>SCC</title>
            </Head>
            <ApolloProvider client={apolloClient}>
                <div>
                    <Component {...pageProps} />
                </div>
            </ApolloProvider>
        </>
    )
}

export default App
