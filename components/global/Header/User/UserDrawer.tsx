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
import { LinkRounded, LockOpenRounded, LockRounded, RedoRounded, UndoRounded } from '@material-ui/icons'
import { message } from 'antd'
import { PageVisibility } from '@newturn-develop/types-molink'
import Public from '../../../../public/image/editor/toolbar/visibility/public.svg'
import OnlyFollower from '../../../../public/image/editor/toolbar/visibility/only-follower.svg'
import Private from '../../../../public/image/editor/toolbar/visibility/private.svg'
import LanguageManager from '../../../../manager/global/LanguageManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

const getIconForPageVisibility = (visibility: PageVisibility) => {
    switch (visibility) {
    case PageVisibility.Public:
        return <Public/>
    case PageVisibility.OnlyFollower:
        return <OnlyFollower/>
    case PageVisibility.Private:
        return <Private/>
    }
}

const getNameForPageVisibility = (visibility: PageVisibility) => {
    switch (visibility) {
    case PageVisibility.Public:
        return LanguageManager.languageMap.PublicVisibility
    case PageVisibility.OnlyFollower:
        return LanguageManager.languageMap.OnlyFollowerVisibility
    case PageVisibility.Private:
        return LanguageManager.languageMap.PrivateVisibility
    }
}

const UserPart: React.FC<{
}> = observer(() => {
    return (
        <MobileColumnDrawerGroup
            style={{
                marginBottom: 30
            }}
        >
            <MobileColumnDrawerElement
                onClick={async () => {
                    if (!UserManager.isUserAuthorized) {
                        await RoutingManager.moveTo(Page.SignIn)
                    }
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
                    {UserManager.isUserAuthorized ? UserManager.profile.nickname : LanguageManager.languageMap.SignIn}
                </div>
            </MobileColumnDrawerElement>
            {
                UserManager.isUserAuthorized && <>
                    <MobileColumnDrawerElement
                        onClick={async () => {
                            UserManager.isUserDrawerOpen = false
                            await AuthManager.signOut()
                        }}
                    >
                        <LogOutIcon/>
                        <div className={'name'}>{LanguageManager.languageMap.SignOut}</div>
                    </MobileColumnDrawerElement>
                </>
            }
        </MobileColumnDrawerGroup>
    )
})

const EditorPart: React.FC<{
}> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
    if (!pageHierarchy || !pageHierarchy.openedPage) {
        return <></>
    }
    const openedPage = pageHierarchy.openedPage
    const editor = EditorPage.editor
    const slateEditor = editor.slateEditor
    if (!editor.editable) {
        return <></>
    }

    return (
        <>
            <MobileColumnDrawerGroup
                style={{
                    marginBottom: 30
                }}
            >
                <MobileColumnDrawerElement
                    onClick={async () => {
                        slateEditor.redo()
                        UserManager.isUserDrawerOpen = false
                    }}
                >
                    <UndoRounded/>
                    <div className={'name'}>{'실행 취소'}</div>
                </MobileColumnDrawerElement>
                <MobileColumnDrawerElement
                    onClick={async () => {
                        slateEditor.undo()
                        UserManager.isUserDrawerOpen = false
                    }}
                >
                    <RedoRounded/>
                    <div className={'name'}>{'다시 실행'}</div>
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
            <MobileColumnDrawerGroup
                style={{
                    marginBottom: 30
                }}
            >
                <MobileColumnDrawerElement
                    onClick={async () => {
                        const isLocked = editor.info.isLocked
                        editor.info.updateIsLocked(!editor.info.isLocked)
                        if (isLocked) {
                            message.success('페이지가 잠금되었습니다.')
                        } else {
                            message.success('페이지가 잠금 해제 되었습니다.')
                        }
                    }}
                >
                    {
                        editor.info.isLocked ? <LockOpenRounded/> : <LockRounded/>
                    }
                    <div className={'name'}>
                        {editor.info.isLocked ? '페이지 잠금 해제' : '페이지 잠금'}
                    </div>
                </MobileColumnDrawerElement>
                <MobileColumnDrawerElement
                    onClick={async () => {
                        pageHierarchy.visibilityController.isVisibilityDrawerOpen = true
                        UserManager.isUserDrawerOpen = false
                    }}
                >
                    {
                        getIconForPageVisibility(openedPage.visibility)
                    }
                    <div className={'name'}>{`공개 범위 변경 (${getNameForPageVisibility(openedPage.visibility)})`}</div>
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
        </>
    )
})

export const UserDrawer: React.FC<{
}> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
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
            <UserPart/>
            <EditorPart/>
            {
                pageHierarchy && pageHierarchy.openedPage
                    ? <>
                        <MobileColumnDrawerGroup
                            style={{
                                marginBottom: 30
                            }}
                        >
                            <MobileColumnDrawerElement
                                onClick={async () => {
                                    await navigator.clipboard.writeText(window.location.href)
                                    UserManager.isUserDrawerOpen = false
                                    message.success('클립보드에 링크가 복사되었습니다.')
                                }}
                            >
                                <LinkRounded/>
                                <div className={'name'}>{'링크 복사'}</div>
                            </MobileColumnDrawerElement>
                        </MobileColumnDrawerGroup>
                    </>
                    : <></>
            }
            <MobileColumnDrawerGroup
                style={{
                    marginBottom: 20
                }}
            >
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
