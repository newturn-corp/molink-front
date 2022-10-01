import React, { useEffect, useRef } from 'react'

import { observer } from 'mobx-react'
import { Header } from '../components/global/Header/Header'
import StyleManager from '../manager/global/Style/StyleManager'
import { BrowserView, MobileView } from 'react-device-detect'
import { BlogComponent } from '../components/Blog/BlogComponent'
import { BlogWidthController } from '../components/Blog/BlogWidthController'
import { MainHeader } from '../components/Main/MainHeader'
import { PageListComponent } from '../components/global/PageList/PageListComponent'
import MainPage from '../manager/Main/MainPage'
import ContentContainer from '../components/global/ContentContainer'
import { SiteHead } from '../components/global/SiteHead'
import { UserBlogBarComponent } from '../components/global/UserBlogBar/UserBlogBarComponent'

const MainPageComponent = observer(() => {
    useEffect(() => {
        MainPage.handleEnter()
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
                <UserBlogBarComponent />
                <BlogComponent />
                <BlogWidthController/>
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
            <MobileView>
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
            </MobileView>
        </div>
        <div
            id={'drag-ghost-parent'}
            className={'drag-ghost-parent'}
        />
    </div>
})

export default MainPageComponent
