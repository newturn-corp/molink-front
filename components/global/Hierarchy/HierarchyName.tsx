import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import BlogPage from '../../../manager/Blog/BlogPage'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyName: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    console.log(Blog.blogUserInfo)
    if (!Blog.blogUserInfo) {
        return <></>
    }
    const {
        nickname,
        profileImageUrl
    } = Blog.blogUserInfo
    return (
        <>
            <div
                className={'hierarchy-name'}
                onClick={() => {
                    currentHierarchy.openedPageId = null
                    RoutingManager.moveTo(Page.Blog, `/${nickname}`)
                }}
            >
                <Avatar
                    className='profile-image'
                    sizes='32'
                    src={profileImageUrl}
                />
                <div
                    className='text'
                >
                    {`${nickname}의 공간`}
                </div>
            </div>
            <div className={'hierarchy-divider'}/>
        </>
    )
})
