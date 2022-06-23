import { observer } from 'mobx-react'
import React from 'react'
import { Avatar } from 'antd'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import { getRelativeTime } from '../../../../utils/getRelativeTime'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const PageBlogInfoComponent: React.FC<{
}> = observer(() => {
    const pageInfo = EditorPage.pageInfo
    const blogInfo = EditorPage.userInfo
    return <div
        className={'page-blog-info-container'}
    >
        <div
            className={'page-blog-info'}
        >
            <div
                className={'blog-info'}
                // onClick={async () => {
                //     await RoutingManager.moveTo(Page.Blog, `/${blogInfo.name}`)
                // }}
            >
                <Avatar
                    className='profile'
                    size={30}
                    src={blogInfo.profileImageUrl}
                >
                    {blogInfo.profileImageUrl ? null : blogInfo.nickname}
                </Avatar>
                <div
                    className={'nickname'}
                >
                    {blogInfo.nickname}
                </div>
            </div>
            <div
                className={'page-info'}
            >
                {getRelativeTime(new Date(pageInfo.lastEditedAt), {
                    showDate: true
                })}
            </div>
        </div>
    </div>
})
