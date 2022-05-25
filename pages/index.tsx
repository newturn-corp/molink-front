import React, { useEffect } from 'react'

import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../manager/global/RoutingManager'
import UserManager from '../manager/global/User/UserManager'
import { Header } from '../components/global/Header/Header'
import StyleManager from '../manager/global/Style/StyleManager'
import { HomeMainComponent } from '../components/Home/Main/HomeMainComponent'
import { BrowserView, MobileView } from 'react-device-detect'
import { HierarchyContainer } from '../components/global/Hierarchy/HierarchyContainer'
import { HierarchyWidthController } from '../components/global/Hierarchy/HierarchyWidthController'
import HierarchyManager from '../manager/global/Hierarchy/HierarchyManager'
import BlogManager from '../manager/Blog/BlogManager'
import { FollowPageListComponent } from '../components/Main/FollowPageListComponent'
import { MainHeader } from '../components/Main/MainHeader'

const Index = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(async () => {
                if (!UserManager.isUserAuthorized) {
                    await RoutingManager.moveTo(Page.SignIn)
                } else {
                    if (!HierarchyManager.currentHierarchyUserId) {
                        await HierarchyManager.loadHierarchy(UserManager.userId)
                    }
                }
            })
        BlogManager.handleEnterMainPage()
    }, [])
    return <div>
        <Header />
        <div
            className={'index-body'}
            style={StyleManager.globalStyle.body}
        >
            <BrowserView>
                <HierarchyContainer />
                <HierarchyWidthController/>
                <div
                    className={'content-container'}
                    style={StyleManager.contentStyle.container}
                >
                    <MainHeader/>
                    <FollowPageListComponent/>
                </div>
            </BrowserView>
        </div>
    </div>
})

export default Index
