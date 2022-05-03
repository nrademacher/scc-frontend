import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject, split } from '@apollo/client'
import type { IncomingHttpHeaders } from 'http'
import { WebSocketLink } from '@apollo/client/link/ws'
import Cookies from 'js-cookie'
import { getMainDefinition } from '@apollo/client/utilities'
import merge from 'deepmerge'
import isEqual from 'lodash.isequal'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

function createApolloClient(headers: IncomingHttpHeaders | null = null) {
    const authLink = new ApolloLink((operation, forward) => {
        const token = Cookies.get('scc-user-token')
        const authorization = token ? `Bearer ${token}` : ''

        operation.setContext(({ headers }: Request) => ({
            headers: {
                authorization,
                ...headers,
            },
        }))

        return forward(operation)
    })

    /* let host
    if (typeof window !== 'undefined') {
        host = 'localhost:4000'
    } else {
        host = 'server'
    } */

    const host = 'localhost:4000'

    const httpLink = new HttpLink({
        uri: `http://${host}/graphql`,
    })

    const wsLink =
        typeof window !== 'undefined'
            ? new WebSocketLink({
                  // if you instantiate in the server, the error will be thrown
                  uri: `ws://${host}/graphql`,
                  options: {
                      reconnect: true,
                  },
              })
            : null

    interface Definintion {
        kind: string
        operation?: string
    }

    const link = wsLink
        ? split(
              // only create the split in the browser
              // split based on operation type
              ({ query }) => {
                  const { kind, operation }: Definintion = getMainDefinition(query)
                  return kind === 'OperationDefinition' && operation === 'subscription'
              },
              wsLink,
              httpLink
          )
        : httpLink

    return new ApolloClient({
        // SSR only for Node.js
        ssrMode: typeof window === 'undefined',
        link: authLink.concat(link),
        cache: new InMemoryCache(),
    })
}

type InitialState = NormalizedCacheObject | undefined

interface IInitializeApollo {
    headers?: IncomingHttpHeaders | null
    initialState?: InitialState | null
}

export function initializeApollo(
    { headers, initialState }: IInitializeApollo = {
        headers: null,
        initialState: null,
    }
) {
    const _apolloClient = apolloClient ?? createApolloClient(headers)

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function addApolloState(client: ApolloClient<NormalizedCacheObject>, pageProps: AppProps['pageProps']) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }

    return pageProps
}

export function useApollo(pageProps: AppProps['pageProps']) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo({ initialState: state }), [state])

    return store
}
