import { observer } from 'mobx-react'
import React from 'react'
import { BlogInfoComponent } from '../BlogInfoComponent'
import StyleManager from '../../../manager/global/Style/StyleManager'
import GlobalManager from '../../../manager/global/GlobalManager'
import { PageListComponent } from '../../global/PageList/PageListComponent'
import { PageListViewType } from '../../../Enums/PageListViewType'
import Blog from '../../../manager/global/Blog/Blog'

export const BlogUserContent: React.FC<{
}> = observer(() => {
    const blogUserInfo = Blog.blogUserInfo
    const blogPageList = Blog.blogPageList
    if (!blogUserInfo || !blogPageList) {
        return <></>
    }

    return <div
        className={'blog-user-content'}
        style={{
            top: 0,
            height: GlobalManager.screenHeight - StyleManager.globalStyle.header.height,
            width: GlobalManager.screenWidth - Blog.getBlogWidth()
        }}
    >
        <BlogInfoComponent/>
        <PageListComponent
            pageSummaryList={blogPageList.pageSummaryList}
            isListEnded={blogPageList.listEnded}
            onLoadPageList={async () => {
                await blogPageList.loadPageSummaryList()
            }}
            viewType={PageListViewType.List}
        />
    </div>
})
