/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import Head from 'next/head'
import '../styles/global.css'
import { AppProps } from 'next/dist/shared/lib/router/router'

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>{'good'}</title>
                <link rel='shortcut icon' href='/favicon.svg' />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default App
