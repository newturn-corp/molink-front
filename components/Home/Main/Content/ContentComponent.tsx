import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIconComponent } from './ContentHeaderIconComponent'
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
    const blogInfo = EditorPage.blogInfo
    return <>
        <div className={'contents'}
            style={StyleManager.contentStyle.main}
        >
            {
                editor.isLoaded
                    ? <>
                        <ContentHeaderIconComponent/>
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
                                <BlogInfoComponent
                                    followerCount={blogInfo.followerCount}
                                    profileImageURL={blogInfo.profileImageUrl}
                                    biography={blogInfo.biography}
                                    blogID={blogInfo.blogID}
                                    name={blogInfo.name}
                                />
                                <CommentContainer/>
                            </>
                    }
                </>
            }
        </div>
        <ContentFooter/>
    </>
})
