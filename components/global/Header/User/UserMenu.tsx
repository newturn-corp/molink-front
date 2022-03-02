import React from 'react'
import { observer } from 'mobx-react'
import { Menu, MenuItem } from '@material-ui/core'
import AuthManager from '../../../../manager/Auth/AuthManager'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import UserManager from '../../../../manager/global/User/UserManager'
import SupportManager from '../../../../manager/global/SupportManager'

export const UserMenu: React.FC<{
}> = observer(() => {
    const handleClose = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
        if (event) {
            event.stopPropagation()
            event.preventDefault()
        }

        switch (key) {
        case 'sign-out':
            await AuthManager.signOut()
            break
        case 'support':
            SupportManager.showSupportModal = true
            break
        case 'setting':
            await RoutingManager.moveTo(Page.SettingProfile)
            break
        }
        UserManager.isUserMenuOpen = false
    }

    return <>
        <Menu
            keepMounted
            open={UserManager.isUserMenuOpen}
            onClose={(event) => handleClose(null, null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
            PaperProps={{
                style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch'
                }
            }}
        >
            <MenuItem
                key={'support'}
                onClick={(event) => handleClose(event, 'support')}
            >
                {'문의 & 의견'}
            </MenuItem>
            <MenuItem
                key={'setting'}
                onClick={(event) => handleClose(event, 'setting')}
            >
                {'설정'}
            </MenuItem>
            <MenuItem
                key={'sign-out'}
                onClick={(event) => handleClose(event, 'sign-out')}
            >
                {'로그아웃'}
            </MenuItem>
        </Menu>
    </>
})
