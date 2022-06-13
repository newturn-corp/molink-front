import React from 'react'
import { observer } from 'mobx-react'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import UserManager from '../../../../../manager/global/User/UserManager'
import { Avatar } from '@material-ui/core'

export const ProfileImageSetting: React.FC<{
}> = observer(() => {
    return <div className='profile-image'>
        <p className='setting-name'>
            {LanguageManager.languageMap.ProfileImage}
        </p>
        <input
            accept='image/jpg,image/png,image/jpeg'
            style={{ display: 'none' }}
            id="profile-image-button"
            multiple
            onChange={(event) => UserManager.profile.updateUserProfileImage(event)}
            type="file"
        />
        <label htmlFor="profile-image-button">
            <Avatar className='image' sizes='200' src={UserManager.profile.getUserProfileImageSrc()}/>
        </label>
        <div className='edit'>
            {LanguageManager.languageMap.PressToChange}
        </div>
    </div>
})
