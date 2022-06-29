import { observer } from 'mobx-react'
import React from 'react'
import UserPage from '../../manager/User/UserPage'
import GlobalManager from '../../manager/global/GlobalManager'
import StyleManager from '../../manager/global/Style/StyleManager'
import Blog from '../../manager/global/Blog/Blog'
import { UserInfoComponent } from './UserInfoComponent'
import { UserPageTabs } from './UserPageTabs'

export const UserPageContent: React.FC<{
}> = observer(() => {
    const userPageList = UserPage.pageList
    if (!userPageList) {
        return <></>
    }

    return <div
        className={'user-page-content'}
        style={{
            top: 0,
            height: GlobalManager.screenHeight - StyleManager.globalStyle.header.height,
            width: GlobalManager.screenWidth - Blog.getBlogWidth()
        }}
    >
        <UserInfoComponent/>
        <UserPageTabs/>
    </div>
})
