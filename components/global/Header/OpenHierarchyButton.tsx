import React from 'react'
import { observer } from 'mobx-react'
import { MenuRounded } from '@material-ui/icons'
import Blog from '../../../manager/global/Blog/Blog'
import UserManager from '../../../manager/global/User/UserManager'

export const OpenHierarchyButton: React.FC<{
}> = observer(() => {
    if (!UserManager.isUserAuthorized) {
        return <></>
    }
    return <div
        className='open-hierarchy-button'
        onClick={() => {
            Blog.isOpen = true
        }}
    >
        <MenuRounded/>
    </div>
})
