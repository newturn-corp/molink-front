import React from 'react'
import { observer } from 'mobx-react'
import { Avatar, Tooltip } from 'antd'
import { BlogInfo, ESBlog } from '@newturn-develop/types-molink'
import Blog from '../../../manager/global/Blog/Blog'

export const UserBlogBlock: React.FC<{
    info: BlogInfo
}> = observer((props) => {
    const isActive = props.info.id === Blog.id
    return (
        <Tooltip
            title={props.info.name}
            placement={'right'}
            visible={isActive ? false : undefined}
        >
            <div
                className={'user-blog-page-block' + (isActive ? ' active' : '')}
                onClick={() => {
                    Blog.load(props.info.id)
                }}
            >
                <Avatar
                    size={46}
                    src={props.info.profileImageURL}
                />
            </div>
        </Tooltip>
    )
})
