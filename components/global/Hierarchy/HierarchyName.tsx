import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyName: React.FC<{
}> = observer(() => {
    if (!Blog.profile) {
        return <></>
    }
    const {
        name,
        profileImageURL
    } = Blog.profile

    return (
        <>
            <div
                className={'hierarchy-name'}
                onClick={async () => {
                    await RoutingManager.moveTo(Page.Blog, `/${name}`)
                }}
            >
                <Avatar
                    className='profile-image'
                    sizes='32'
                    src={profileImageURL}
                />
                <div
                    className='text'
                >
                    {name }
                </div>
            </div>
        </>
    )
})
