import { observer } from 'mobx-react'
import React from 'react'
import { BlogUserInfoComponent } from '../../Blog/BlogUserInfoComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import GlobalManager from '../../../manager/global/GlobalManager'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import { PageListComponent } from '../../global/PageList/PageListComponent'
import Blog from '../../../manager/global/Blog/Blog'
import { PageListViewType } from '../../../Enums/PageListViewType'

export const BlogUserContent: React.FC<{
}> = observer(() => {
    const blogUserInfo = Blog.blogUserInfo
    const userPageList = Blog.userPageList
    if (!blogUserInfo || !userPageList) {
        return <></>
    }
    const pageCount = userPageList.totalPageCount

    return <div
        className={'blog-user-content'}
        style={{
            top: 0,
            height: GlobalManager.screenHeight - StyleManager.globalStyle.header.height,
            width: GlobalManager.screenWidth - HierarchyManager.getHierarchyWidth()
        }}
    >
        <BlogUserInfoComponent
            {...blogUserInfo}
            pageCount={pageCount}
        />
        <PageListComponent
            pageSummaryList={userPageList.pageSummaryList}
            isListEnded={userPageList.listEnded}
            onLoadPageList={async () => {
                await userPageList.loadPageSummaryList()
            }}
            viewType={PageListViewType.List}
        />
    </div>
})
