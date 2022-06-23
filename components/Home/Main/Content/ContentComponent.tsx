import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from '../../../BlogPage/EditorPage/Editor/EditorContainer'
import { ContentTitleComponent } from '../../../BlogPage/EditorPage/ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { PageBlogInfoComponent } from './PageBlogInfoComponent'
import { LikeButton } from '../../../BlogPage/EditorPage/LikeButton'
import { BlogInfoComponent } from '../../../BlogPage/BlogInfoComponent'
import { PageTagList } from '../../../BlogPage/EditorPage/PageTagList'
import { EditorPageSkeleton } from '../../../BlogPage/EditorPage/EditorPageSkeleton'
import { CommentContainer } from '../../../BlogPage/EditorPage/Comment/CommentContainer'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

export const ContentComponent: React.FC<{
}> = observer(() => {
    const editor = EditorPage.editor

    return <>
        <div className={'contents'}
            style={StyleManager.contentStyle.main}
        >
            {
                Blog.pageHierarchy && Blog.pageHierarchy.openedPage && editor.isLoaded
                    ? <>
                        <ContentHeaderIcon/>
                        <div
                            style={{
                                marginBottom: 20
                            }}
                        >
                            <ContentTitleComponent/>
                            {
                                (!editor.editable || editor.info.isLocked) && <PageBlogInfoComponent/>
                            }
                            <PageTagList/>
                            <div className={'info-divider'}/>
                        </div>
                    </>
                    : <EditorPageSkeleton/>
            }
            <EditorContainer/>
            {
                editor.isLoaded && <>
                    {
                        (!editor.editable || editor.info.isLocked) &&
                            <>
                                <LikeButton/>
                                <BlogInfoComponent/>
                                <CommentContainer/>
                            </>
                    }
                </>
            }
        </div>
        <ContentFooter/>
    </>
})
