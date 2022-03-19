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

const BlogPage = () => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogManager.handleEnterBlogPage(router.query.info as string[])

    return <div onClick={async () => {
        await EventManager.issueEvent(Event.PageBodyClick)
    } } >
        <Header />
        <div className={'index-body'}>
            <BrowserView>
                <HierarchyContainer />
                <HierarchyWidthController/>
                <HomeMainComponent/>
                {/* <CollectButton /> */}
            </BrowserView>
            <MobileView>
                {/* <FileSystem />
                <DrawerWidthController/> */}
                <HomeMainComponent/>
                {/* <CollectButton /> */}
            </MobileView>
        </div>
        <div className={'drag-ghost-parent'}/>
    </div>
}

export default BlogPage
