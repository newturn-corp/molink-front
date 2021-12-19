/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import Head from 'next/head'
import 'antd/dist/antd.css'
import '../styles/global.css'
import '../styles/contents.css'
import '../styles/auth.css'
import '../styles/home.css'
import { AppProps } from 'next/dist/shared/lib/router/router'
import { configure } from 'mobx'
import GlobalManager from '../manager/GlobalManager'
import ContentManager from '../manager/home/ContentManager'

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

    const headText = ContentManager.openedDocument ? ContentManager.openedDocument.title : 'Knowlink'
    return (
        <>
            <SafeHydrate>
                <Head>
                    <title>{headText}</title>
                    <link rel='shortcut icon' href='/favicon.ico' />
                </Head>
                <Component {...pageProps} />
            </SafeHydrate>
        </>
    )
}

export default App
