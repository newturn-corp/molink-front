import React from 'react'
import { useRouter } from 'next/router'
import { Header } from '../../components/global/Header/Header'
import { BrowserView, MobileView } from 'react-device-detect'
import { HomeMainComponent } from '../../components/Home/Main/HomeMainComponent'
import BlogManager from '../../manager/Blog/BlogManager'
import { HierarchyWidthController } from '../../components/global/Hierarchy/HierarchyWidthController'
import { HierarchyContainer } from '../../components/global/Hierarchy/HierarchyContainer'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import { Portal } from '../../components/utils/Portal'
import StyleManager from '../../manager/global/Style/StyleManager'

const BlogPage = () => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogManager.handleEnterBlogPage(router.query.info as string[])

    return <div
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
                <HierarchyContainer />
                <HierarchyWidthController/>
            </BrowserView>
        </div>
        <div className={'drag-ghost-parent'}/>
    </div>
}

export default BlogPage
