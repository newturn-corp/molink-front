import React from 'react'
import { useRouter } from 'next/router'
import StyleManager from '../../../manager/global/Style/StyleManager'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import BlogPage from '../../../manager/Blog/BlogPage'
import { BlogPageHead } from '../../../components/BlogPage/EditorPage/BlogPageHead'
import EventManager from '../../../manager/global/Event/EventManager'
import { Event } from '../../../manager/global/Event/Event'
import { BrowserView, MobileView } from 'react-device-detect'
import { Header } from '../../../components/global/Header/Header'
import { Portal } from '../../../components/utils/Portal'
import { HierarchyContainer } from '../../../components/Blog/HierarchyContainer'
import { UserBlogBarComponent } from '../../../components/global/UserBlogBar/UserBlogBarComponent'
import { HierarchyWidthController } from '../../../components/Blog/HierarchyWidthController'
import { HomeMainComponent } from '../../../components/Home/Main/HomeMainComponent'

const EditorPageComponent: React.FC<{
}> = () => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogPage.handleEnter(router.query.info as string[], pageMetaInfo)
    return <div>
        <BlogPageHead
            pageMetaInfo={pageMetaInfo}
        />
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
                <HomeMainComponent/>
                <BrowserView>
                    <UserBlogBarComponent/>
                    <HierarchyContainer />
                    <HierarchyWidthController/>
                </BrowserView>
            </div>
            <div
                id={'drag-ghost-parent'}
                className={'drag-ghost-parent'}
            />
        </div>
    </div>
}

export default EditorPageComponent
