import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { SupportModal } from '../../Modal/SupportModal'
import UserManager from '../../../../manager/global/User/UserManager'
import { UserProfile } from './UserProfile'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import { isBrowser, isMobile, MobileView } from 'react-device-detect'
import { UserDrawer } from './UserDrawer'
import { SupportDrawer } from './SupportDrawer'
import MenuManager from '../../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../../manager/global/Menu/MenuItem'
import SupportManager from '../../../../manager/global/SupportManager'
import AuthManager from '../../../../manager/Auth/AuthManager'
import GlobalManager from '../../../../manager/global/GlobalManager'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { VisibilityDrawer } from '../Mobile/VisibilityDrawer'
import LanguageManager from '../../../../manager/global/LanguageManager'

export const UserContainer: React.FC<{
}> = observer(() => {
    const userContainerRef = useRef<HTMLDivElement>()

    const handleClick = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        const rect = userContainerRef.current.getBoundingClientRect()
        if (isMobile) {
            UserManager.isUserDrawerOpen = true
            return
        }
        if (UserManager.isUserAuthorized) {
            MenuManager.open([
                new MenuItem(LanguageManager.languageMap.SupportInMenu,
                    () => {
                        UserManager.isUserMenuOpen = false
                        SupportManager.openSupportModal()
                        MenuManager.close()
                    }),
                new MenuItem(LanguageManager.languageMap.PrivacyAndTerms,
                    async () => {
                        await RoutingManager.rawMoveTo('https://www.molink.life/blog/Molink/4629add3ae7d9971bc539427afd127ad/%EC%9D%B4%EC%9A%A9%20%EC%95%BD%EA%B4%80', true)
                        MenuManager.close()
                    }),
                new MenuItem(LanguageManager.languageMap.Setting,
                    async () => {
                        await RoutingManager.moveTo(Page.SettingProfile)
                    }),
                new MenuItem(LanguageManager.languageMap.SignOut,
                    async () => {
                        UserManager.isUserMenuOpen = false
                        await AuthManager.signOut()
                        MenuManager.close()
                    })
            ], {
                top: StyleManager.globalStyle.header.height - 5,
                left: rect.left + rect.width
            })
        } else {
            await RoutingManager.moveTo(Page.SignIn)
        }
    }

    return <>
        <div
            className='user-container'
            ref={userContainerRef}
            style={{
                backgroundColor: UserManager.isUserAuthorized ? '#D6E6F6' : '#ECEEF0',
                padding: isBrowser ? '2px 12px 2px 2px' : 2,
                minWidth: isBrowser ? 105 : undefined,
                top: isBrowser ? 8 : 6,
                right: isBrowser ? 16 : 6,
                height: isBrowser ? 40 : 32,
                borderRadius: isBrowser ? 20 : 16
            }}
            onClick={(event) => handleClick(event)}
        >
            <UserProfile/>
        </div>
        <MobileView>
            <UserDrawer/>
            <VisibilityDrawer/>
        </MobileView>
        <SupportModal/>
        <SupportDrawer/>
    </>
})
