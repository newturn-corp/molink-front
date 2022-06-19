import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from '../../../Blog/EditorPage/Editor/EditorContainer'
import { ContentTitleComponent } from '../../../Blog/EditorPage/ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { PageBlogInfoComponent } from './PageBlogInfoComponent'
import { LikeButton } from '../../../Blog/EditorPage/LikeButton'
import { BlogInfoComponent } from '../../../Blog/BlogInfoComponent'
import { PageTagList } from '../../../Blog/EditorPage/PageTagList'
import { EditorPageSkeleton } from '../../../Blog/EditorPage/EditorPageSkeleton'
import { CommentContainer } from '../../../Blog/EditorPage/Comment/CommentContainer'
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
