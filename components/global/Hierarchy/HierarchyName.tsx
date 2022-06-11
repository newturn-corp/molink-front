import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyName: React.FC<{
}> = observer(() => {
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
                onClick={async () => {
                    await RoutingManager.moveTo(Page.Blog, `/${nickname}`)
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
        </>
    )
})
