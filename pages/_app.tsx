/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import 'antd/dist/antd.css'

import '../styles/global.css'
import '../styles/global/header.css'
import '../styles/global/hierarchy.css'
import '../styles/global/visibility-menu.css'
import '../styles/global/user-menu.css'

import '../styles/contents/toolbar.css'
import '../styles/contents/hovering-toolbar.css'
import '../styles/contents/command-list.css'
import '../styles/contents/header.css'

import '../styles/contents.css'
import '../styles/auth.css'
import '../styles/home.css'
import '../styles/search.css'
import '../styles/setting.css'
import { AppProps } from 'next/dist/shared/lib/router/router'
import { configure } from 'mobx'
import GlobalManager from '../manager/global/GlobalManager'
import { DialogComponent } from '../components/Dialog'
import { SiteHead } from '../components/global/SiteHead'

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
                <Component {...pageProps} />
            </SafeHydrate>
        </>
    )
}

export default App
