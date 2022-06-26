import React from 'react'
import { observer } from 'mobx-react'
import { ProfileImageSetting } from '../../Setting/Profile/ProfileImageSetting'
import { BiographySetting } from '../../Setting/Profile/BiographySetting'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import UserManager from '../../../../../manager/global/User/UserManager'
import { UserSettingNicknameComponent } from './UserSettingNicknameComponent'

export const UserSettingProfileComponent: React.FC<{
}> = observer(() => {
    return <>
        <UserSettingNicknameComponent/>
        <ProfileImageSetting
            id={'user-profile-image-setting'}
            text={LanguageManager.languageMap.ProfileImage}
            profileImageSrc={UserManager.profile.getUserProfileImageSrc()}
            onChange={(event) => UserManager.profile.updateUserProfileImage(event)}
        />
        <BiographySetting
            settingName={LanguageManager.languageMap.Biography}
            currentBiography={UserManager.profile.biography}
            onUpdate={(biography) => UserManager.profile.updateUserBiography(biography)}
        />
    </>
})
