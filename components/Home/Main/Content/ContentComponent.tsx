import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import { ContentTitleComponent } from '../../../Blog/EditorPage/ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { PageUserInfoComponent } from './PageUserInfoComponent'
import { LikeButton } from '../../../Blog/EditorPage/LikeButton'
import { BlogUserInfoComponent } from '../../../Blog/BlogUserInfoComponent'
import { PageTagList } from '../../../Blog/EditorPage/PageTagList'
import { EditorPageSkeleton } from '../../../Blog/EditorPage/EditorPageSkeleton'
import { CommentContainer } from '../../../Blog/EditorPage/Comment/CommentContainer'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

export const ContentComponent: React.FC<{
}> = observer(() => {
    const editor = EditorPage.editor
    const {
        userId,
        userProfileImageUrl,
        nickname,
        biography,
        followerCount,
        followCount
    } = EditorPage.userInfo

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
                                (!editor.editable || editor.info.isLocked) && <PageUserInfoComponent/>
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
                                <BlogUserInfoComponent
                                    userId={userId}
                                    nickname={nickname}
                                    biography={biography}
                                    profileImageUrl={userProfileImageUrl}
                                    followCount={followCount}
                                    followerCount={followerCount}
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
