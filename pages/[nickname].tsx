import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import HomeManager from '../manager/Home/HomeManager'
import { Header } from '../components/global/Header/Header'
import { BrowserView, MobileView } from 'react-device-detect'
import { HierarchyContainer } from '../components/Home/Hierarchy/HierarchyContainer'
import DocumentHierarchyManager from '../manager/Home/Hierarchy/HierarchyManager'
import EventManager, { Event } from '../manager/EventManager'
import { Page } from '../manager/global/RoutingManager'
import { HomeMainComponent } from '../components/Home/Main/HomeMainComponent'
import { HierarchyWidthController } from '../components/Home/Hierarchy/HierarchyWidthController'

const Home = () => {
    const router = useRouter()
    const nickname = router.query.nickname as string
    useEffect(() => {
        EventManager.issueEvent(Event.NewPageLoading, { page: Page.Home })
    }, [nickname])

    HomeManager.handleEnterHomePage(nickname)

    return <div onClick={() => {
        DocumentHierarchyManager.closeContextMenu()
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

export default Home
