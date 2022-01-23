import React from 'react'
import { useRouter } from 'next/router'
import HomeManager from '../manager/Home/HomeManager'
import { Header } from '../components/global/Header/Header'
import { BrowserView, MobileView } from 'react-device-detect'
import { HierarchyContainer } from '../components/home/Hierarchy/HierarchyContainer'
import DocumentHierarchyManager from '../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'

const Home = () => {
    console.log('home render')
    const router = useRouter()
    const nickname = router.query.nickname as string
    HomeManager.handleEnterHomePage(nickname)

    return <div onClick={() => {
        DocumentHierarchyManager.closeContextMenu()
    } } >
        <Header />
        <div className={'index-body'}>
            <BrowserView>
                <HierarchyContainer />
                {/* <DrawerWidthController /> */}
                {/* <ContentComponent /> */}
                {/* <CollectButton /> */}
            </BrowserView>
            <MobileView>
                {/* <FileSystem />
                <DrawerWidthController/> */}
                {/* <ContentComponent/> */}
                {/* <CollectButton /> */}
            </MobileView>
        </div>
        <div className={'drag-ghost-parent'}/>
    </div>
}

export default Home
