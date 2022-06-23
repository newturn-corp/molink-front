import { observer } from 'mobx-react'
import React from 'react'
import UserPage from '../../manager/User/UserPage'

export const UserInfoMainComponent: React.FC<{}> = observer(() => {
    const { nickname } = UserPage.info
    return <div
        className={'main-container'}
    >
        <div
            className={'name'}
        >
            {nickname}
        </div>
        {/* <SettingProfileButton/> */}
    </div>
})
