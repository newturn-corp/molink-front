import { observer } from 'mobx-react'
import React from 'react'
import { ContentHeaderIcon } from './ContentHeaderIcon'
import { EditorContainer } from './EditorContainer'
import { ContentTitleComponent } from '../../../Blog/EditorPage/ContentTitleComponent'
import { ContentFooter } from './ContentFooter'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { PageUserInfoComponent } from './PageUserInfoComponent'
import EditorManager from '../../../../manager/Blog/EditorManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { LikeButton } from '../../../Blog/EditorPage/LikeButton'
import { BlogUserInfoComponent } from '../../../Blog/BlogUserInfoComponent'
import PageManager from '../../../../manager/Blog/PageManager'
import { PageTagList } from '../../../Blog/EditorPage/PageTagList'
import { Skeleton } from '@material-ui/lab'
import { EditorPageSkeleton } from '../../../Blog/EditorPage/EditorPageSkeleton'

export const ContentComponent: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }

    const {
        userId,
        nickname,
        biography,
        profileImageUrl,
        followerCount,
        followCount
    } = PageManager.blogUserInfo
    return <>
        <div className={'contents'}
            style={StyleManager.contentStyle.main}
        >
            {
                EditorManager.isLoaded
                    ? <>
                        <ContentHeaderIcon/>
                        <div
                            style={{
                                marginBottom: 20
                            }}
                        >
                            <ContentTitleComponent/>
                            {
                                EditorManager.editable && !EditorManager.isLocked
                                    ? <>
                                        <PageTagList/>
                                        <div className={'info-divider'}/>
                                    </>
                                    : <>
                                        <PageUserInfoComponent/>
                                        <PageTagList/>
                                        <div className={'info-divider'}/>
                                    </>
                            }
                        </div>
                    </>
                    : <EditorPageSkeleton/>
            }
            <EditorContainer/>
            {
                EditorManager.isLoaded
                    ? <>
                        {
                            EditorManager.editable && !EditorManager.isLocked
                                ? <></>
                                : <>
                                    <LikeButton/>
                                    <BlogUserInfoComponent
                                        userId={userId}
                                        nickname={nickname}
                                        biography={biography}
                                        profileImageUrl={profileImageUrl}
                                        followCount={followCount}
                                        followerCount={followerCount}
                                    />
                                </>
                        }
                    </>
                    : <></>
            }
        </div>
        <ContentFooter/>
    </>
})
