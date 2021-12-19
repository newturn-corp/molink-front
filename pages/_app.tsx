/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import Head from 'next/head'
import 'antd/dist/antd.css'
import '../styles/global.css'
import '../styles/contents.css'
import '../styles/auth.css'
import { AppProps } from 'next/dist/shared/lib/router/router'
import { configure } from 'mobx'
import GlobalManager from '../manager/GlobalManager'

configure(
    {
        enforceActions: 'never'
    }
)

function SafeHydrate ({ children }: { children: JSX.Element[] }) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        GlobalManager.init()
    }, [])

    return (
        <>
            <SafeHydrate>
                <Head>
                    <title>{'good'}</title>
                    <link rel='shortcut icon' href='/favicon.ico' />
                </Head>
                <Component {...pageProps} />
            </SafeHydrate>
        </>
    )
}

export default App
