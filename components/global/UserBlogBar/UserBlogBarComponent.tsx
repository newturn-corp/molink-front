import React from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/global/User/UserManager'
import { UserBlogBlock } from './UserBlogBlock'
import BlogInfoMap from '../../../manager/global/Blog/BlogInfoMap'

export const UserBlogBarComponent: React.FC<{
}> = observer(() => {
    if (!UserManager.isUserAuthorized) {
        return <></>
    }
    return (
        <div
            className={'user-blog-bar'}
        >
            {
                UserManager.blog.blogs.map(blogID => <UserBlogBlock
                    key={`user-blog-${blogID}`}
                    info={BlogInfoMap.idMap[blogID]}
                />)
            }
        </div>
    )
})
