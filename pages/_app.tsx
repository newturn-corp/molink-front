/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import Head from 'next/head'
import '../styles/global.css'
import { AppProps } from 'next/dist/shared/lib/router/router'

function SafeHydrate ({ children }) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <SafeHydrate>
            <Head>
                <title>{'good'}</title>
                <link rel='shortcut icon' href='/favicon.svg' />
            </Head>
            <Component {...pageProps} />
        </SafeHydrate>
    )
}

export default App
