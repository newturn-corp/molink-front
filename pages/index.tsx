import React, { useEffect, useRef } from 'react'

import { observer } from 'mobx-react'
import UserManager from '../manager/global/User/UserManager'
import { Header } from '../components/global/Header/Header'
import StyleManager from '../manager/global/Style/StyleManager'
import { BrowserView } from 'react-device-detect'
import { HierarchyContainer } from '../components/global/Hierarchy/HierarchyContainer'
import { HierarchyWidthController } from '../components/global/Hierarchy/HierarchyWidthController'
import { MainHeader } from '../components/Main/MainHeader'
import { PageListComponent } from '../components/global/PageList/PageListComponent'
import MainPage from '../manager/Main/MainPage'
import ContentContainer from '../components/global/ContentContainer'
import { SiteHead } from '../components/global/SiteHead'

const MainPageComponent = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(async () => {
                MainPage.handleEnter()
            })
    }, [])

    const pageList = MainPage.pageLists[MainPage.currentCategoryIndex]

    return <div>
        <SiteHead/>
        <Header />
        <div
            className={'index-body'}
            style={StyleManager.globalStyle.body}
        >
            <BrowserView>
                <HierarchyContainer />
                <HierarchyWidthController/>
                <ContentContainer>
                    <MainHeader/>
                    <PageListComponent
                        pageSummaryList={pageList.pageSummaryList}
                        isListEnded={pageList.listEnded}
                        onLoadPageList={() => pageList.loadPageSummaryList()}
                        viewType={MainPage.viewType}
                        showScroll={true}
                    />
                </ContentContainer>
            </BrowserView>
        </div>
    </div>
})

export default MainPageComponent
