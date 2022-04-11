import React, { useState } from 'react'
import { observer } from 'mobx-react'
import AuthManager from '../../../../manager/Auth/AuthManager'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import SupportManager from '../../../../manager/global/SupportManager'
import { Portal } from '../../../utils/Portal'
import { UserMenuItem } from './UserMenuItem'
import UserManager from '../../../../manager/global/User/UserManager'
import SettingManager from '../../../../manager/global/Setting/SettingManager'
import { Menu, MenuProps } from '../../../utils/Menu/Menu'
import { MenuItem } from '../../../utils/Menu/MenuItem'

export const UserMenu: React.FC<MenuProps> = observer((props) => {
    return <Menu
        {...props}
        style={{
            top: 55,
            right: 18
        }}
    >
        <MenuItem
            text={'문의 & 의견 보내기'}
            onClick={() => {
                UserManager.isUserMenuOpen = false
                SupportManager.showSupportModal = true
            }}
        />
        <MenuItem
            text={'개인 정보 처리방침 & 약관'}
            onClick={async () => {
                await RoutingManager.rawMoveTo('https://www.molink.life/blog/Molink/4629add3ae7d9971bc539427afd127ad/%EC%9D%B4%EC%9A%A9%20%EC%95%BD%EA%B4%80', true)
            }}
        />
        <MenuItem
            text={'로그아웃'}
            onClick={async () => {
                UserManager.isUserMenuOpen = false
                await AuthManager.signOut()
            }}
        />
    </Menu>
})
