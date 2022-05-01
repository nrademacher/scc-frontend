import type { AppProps } from 'next/app'
import Head from 'next/head'

import { ApolloProvider } from '@apollo/client'

import '../styles/globals.css'
import { useApollo } from '@/lib/apollo'

function App({ Component, pageProps }: AppProps) {
    const apolloClient = useApollo(pageProps)

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Next Starter Lite</title>
            </Head>
            <ApolloProvider client={apolloClient}>
                <div className="subpixel-antialiased">
                    <Component {...pageProps} />
                </div>
            </ApolloProvider>
        </>
    )
}

export default App
