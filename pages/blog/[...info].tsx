import React from 'react'
import { useRouter } from 'next/router'
import HierarchyManager from '../../manager/Home/Hierarchy/HierarchyManager'
import { Header } from '../../components/global/Header/Header'
import { BrowserView, MobileView } from 'react-device-detect'
import { HomeMainComponent } from '../../components/Home/Main/HomeMainComponent'
import BlogManager from '../../manager/Blog/BlogManager'
import { HierarchyWidthController } from '../../components/global/Hierarchy/HierarchyWidthController'
import { HierarchyContainer } from '../../components/global/Hierarchy/HierarchyContainer'
const BlogPage = () => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogManager.handleEnterBlogPage(router.query.info as string[])

    return <div onClick={() => {
        HierarchyManager.closeContextMenu()
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
                {/* <HomeMainComponent/> */}
                {/* <CollectButton /> */}
            </MobileView>
        </div>
        <div className={'drag-ghost-parent'}/>
    </div>
}

export default BlogPage
