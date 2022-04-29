/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'

import 'antd/dist/antd.css'

import '../styles/global.css'
import '../styles/global/header.css'
import '../styles/global/hierarchy.css'
import '../styles/global/visibility-menu.css'
import '../styles/global/user-menu.css'

import '../styles/components/mobile-column-drawer.css'
import '../styles/components/menu.css'

import '../styles/contents/toolbar.css'
import '../styles/contents/hovering-toolbar.css'
import '../styles/contents/command-list.css'
import '../styles/contents/header.css'

import '../styles/auth.css'
import '../styles/auth/sign-up.css'

import '../styles/contents.css'

import '../styles/home.css'
import '../styles/search.css'
import '../styles/setting.css'
import '../styles/blog.css'

import { AppProps } from 'next/dist/shared/lib/router/router'
import { configure } from 'mobx'
import LanguageManager from '../manager/global/LanguageManager'
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
            .then(() => LanguageManager.loadLanguage(navigator.language))
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
