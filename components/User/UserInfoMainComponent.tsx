import { observer } from 'mobx-react'
import React from 'react'
import UserPage from '../../manager/User/UserPage'
import UserManager from '../../manager/global/User/UserManager'
import ModalManager, { Modal } from '../../manager/global/ModalManager'

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
        {
            UserPage.userID === UserManager.userId && <div
                className='profile-setting-button no-select'
                onClick={() => ModalManager.open(Modal.UserSetting)}
            >
                {'프로필 편집'}
            </div>
        }
        {/* <SettingProfileButton/> */}
    </div>
})
