/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import 'antd/dist/antd.css'
import '../styles/global.css'
import '../styles/contents.css'
import '../styles/auth.css'
import '../styles/home.css'
import '../styles/search.css'
import '../styles/setting.css'
import { AppProps } from 'next/dist/shared/lib/router/router'
import { configure } from 'mobx'
import GlobalManager from '../manager/GlobalManager'
// import ContentManager from '../manager/home/ContentManager'
import { DialogComponent } from '../components/Dialog'
import { SiteHead } from '../components/global/SiteHead'

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
                <SiteHead/>
                <DialogComponent />
                <Component {...pageProps} />
            </SafeHydrate>
        </>
    )
}

export default App
