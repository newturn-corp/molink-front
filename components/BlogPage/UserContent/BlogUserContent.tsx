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
    const blogPageList = Blog.blogPageList
    if (!blogPageList) {
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
        <BlogInfoComponent
            blogID={Blog.id}
            name={Blog.profile.name}
            followerCount={Blog.profile.followerCount}
            biography={Blog.profile.biography}
            profileImageURL={Blog.profile.profileImageURL}
        />
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
