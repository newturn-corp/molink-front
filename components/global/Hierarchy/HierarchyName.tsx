import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import BlogPage from '../../../manager/Blog/BlogPage'

export const HierarchyName: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!BlogPage.blog) {
        return <></>
    }
    return (
        <>
            <div
                className={'hierarchy-name'}
                onClick={() => {
                    currentHierarchy.openedPageId = null
                    RoutingManager.moveTo(Page.Blog, `/${BlogPage.blog.blogUserInfo.nickname}`)
                }}
            >
                <Avatar
                    className='profile-image'
                    sizes='32'
                    src={BlogPage.blog.blogUserInfo.profileImageUrl}
                />
                <div
                    className='text'
                >
                    {`${BlogPage.blog.blogUserInfo.nickname}의 공간`}
                </div>
            </div>
            <div className={'hierarchy-divider'}/>
        </>
    )
})
