/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import '../styles/index.css'

import { AppProps } from 'next/dist/shared/lib/router/router'
import { configure } from 'mobx'
import GlobalManager from '../manager/global/GlobalManager'
import { DialogComponent } from '../components/Dialog'
import { SiteHead } from '../components/global/SiteHead'
import { MenuComponent } from '../components/global/MenuComponent'
import { LinkModalComponent } from '../components/global/Modal/LinkModalComponent'

configure(
    {
        enforceActions: 'never'
    }
)

function SafeHydrate ({ children }: { children: JSX.Element[] }) {
    return (
        <div
            suppressHydrationWarning
        >
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

const removeConsoleLogOnProduction = () => {
    // 콘솔 제거
    if (process.env.NODE_ENV === 'production') {
        console.log = () => {}
    }
}

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        GlobalManager.init()
        removeConsoleLogOnProduction()
    }, [])

    return (
        <>
            <SafeHydrate>
                <SiteHead/>
                <DialogComponent />
                <MenuComponent />
                <LinkModalComponent/>
                <Component {...pageProps} />
            </SafeHydrate>
        </>
    )
}

export default App
