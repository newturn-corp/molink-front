import React from 'react'
import { observer } from 'mobx-react'
import { MobileColumnDrawer } from '../../../utils/MobileColumeDrawer/MobileColumnDrawer'
import UserManager from '../../../../manager/global/User/UserManager'
import { PrivacyAndTermsButton } from './PrivacyAndTermsButton'
import { MobileColumnDrawerGroup } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerGroup'
import { MobileColumnDrawerElement } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerElement'
import SendIcon from 'public/image/icon/send.svg'
import LogOutIcon from 'public/image/icon/logout.svg'
import { Avatar } from '@material-ui/core'
import AuthManager from '../../../../manager/Auth/AuthManager'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import SupportManager from '../../../../manager/global/SupportManager'

export const UserDrawer: React.FC<{
}> = observer(() => {
    return (
        <MobileColumnDrawer
            className={'user-drawer'}
            open={UserManager.isUserDrawerOpen}
            onClose={() => {
                UserManager.isUserDrawerOpen = false
            }}
            backgroundColor={'#FAFAFB'}
            title={'메뉴'}
        >
            <MobileColumnDrawerGroup
                style={{
                    marginBottom: 40
                }}
            >
                <MobileColumnDrawerElement
                    onClick={async () => {
                        await RoutingManager.moveTo(Page.SignIn)
                    }}
                >
                    <Avatar
                        className='profile'
                        style={{
                            width: 32,
                            height: 32
                        }}
                        src={UserManager.profile.getUserProfileImageSrc()}
                    />
                    <div
                        className={'nickname'}
                    >
                        {UserManager.isUserAuthorized ? UserManager.profile.nickname : '로그인'}
                    </div>
                </MobileColumnDrawerElement>
                {
                    UserManager.isUserAuthorized
                        ? <>
                            <MobileColumnDrawerElement
                                onClick={async () => {
                                    UserManager.isUserDrawerOpen = false
                                    await AuthManager.signOut()
                                }}
                            >
                                <LogOutIcon/>
                                <div className={'name'}>{'로그 아웃'}</div>
                            </MobileColumnDrawerElement>
                        </>
                        : <></>
                }
            </MobileColumnDrawerGroup>
            <PrivacyAndTermsButton/>
            <MobileColumnDrawerGroup>
                <MobileColumnDrawerElement
                    onClick={async () => {
                        SupportManager.isSupportDrawerOpen = true
                    }}
                >
                    <SendIcon/>
                    <div className={'name'}>{'문의하기 & 의견보내기'}</div>
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
            <PrivacyAndTermsButton/>
        </MobileColumnDrawer>
    )
})
