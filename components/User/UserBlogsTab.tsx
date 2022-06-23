import { observer } from 'mobx-react'
import React from 'react'
import UserPage from '../../manager/User/UserPage'
import { TabPane } from 'rc-tabs'
import { UserBlogComponent } from './UserBlogComponent'

export const UserBlogsTab: React.FC<{
}> = observer(() => {
    const blogs = UserPage.blogInfo?.blogs || []
    return <div
        className={'user-blog-container'}
    >
        {
            blogs.map(blog => <UserBlogComponent key={`user-blog-${blog.id}`} blog={blog}/>)
        }
    </div>
})
