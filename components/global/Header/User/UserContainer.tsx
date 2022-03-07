import React from 'react'
import { observer } from 'mobx-react'
import { SupportModal } from './SupportModal'
import { UserMenu } from './UserMenu'
import UserManager from '../../../../manager/global/User/UserManager'
import { UserProfile } from './UserProfile'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'

export const UserContainer: React.FC<{
}> = observer(() => {
    const handleClick = async (event) => {
        event.stopPropagation()
        if (UserManager.isUserAuthorized) {
            UserManager.isUserMenuOpen = !UserManager.isUserMenuOpen
        } else {
            await RoutingManager.moveTo(Page.SignIn)
        }
    }

    return <>
        <div
            className='user-container'
            style={{
                backgroundColor: UserManager.isUserAuthorized ? '#D6E6F6' : '#ECEEF0'
            }}
            onClick={(event) => handleClick(event)}
        >
            <UserProfile/>
        </div>
        {
            UserManager.isUserMenuOpen
                ? <UserMenu/>
                : <></>
        }
        <SupportModal/>
    </>
})