import React from 'react'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import { useRouter } from 'next/router'
import BlogPage from '../../manager/Blog/BlogPage'
import { BlogPageHead } from '../../components/BlogPage/EditorPage/BlogPageHead'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import { Header } from '../../components/global/Header/Header'
import { BrowserView, MobileView } from 'react-device-detect'
import { Portal } from '../../components/utils/Portal'
import { HierarchyContainer } from '../../components/Blog/HierarchyContainer'
import StyleManager from '../../manager/global/Style/StyleManager'
import { HomeMainComponent } from '../../components/Home/Main/HomeMainComponent'
import { HierarchyWidthController } from '../../components/Blog/HierarchyWidthController'
import BlogPageComponent from '../blog/[...info]'
import UserPage from '../../manager/User/UserPage'
import { DefaultSiteHead } from '../../manager/global/DefaultSiteHead'
import { UserPageContent } from '../../components/User/UserPageContent'
import ContentContainer from '../../components/global/ContentContainer'

const UserPageComponent: React.FC<{
    pageMetaInfo: ESPageMetaInfo | null
}> = ({ pageMetaInfo }) => {
    const router = useRouter()
    if (!router.query.nickname) {
        return <></>
    }
    UserPage.handleEnter(router.query.nickname as string)
    return <div>
        <DefaultSiteHead/>
        <div
            onClick={async () => {
                await EventManager.issueEvent(Event.PageBodyClick)
            }}
        >
            <Header />
            <MobileView>
                <Portal>
                    <HierarchyContainer />
                </Portal>
            </MobileView>
            <div
                className={'index-body'}
                style={StyleManager.globalStyle.body}
            >
                <ContentContainer>
                    <UserPageContent/>
                </ContentContainer>
                <BrowserView>
                    <HierarchyContainer />
                    <HierarchyWidthController/>
                </BrowserView>
            </div>
            <div
                className={'drag-ghost-parent'}
            />
        </div>
    </div>
}

export default UserPageComponent
