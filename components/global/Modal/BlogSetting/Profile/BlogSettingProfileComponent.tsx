import React from 'react'
import { observer } from 'mobx-react'
import LanguageManager from '../../../../../manager/global/LanguageManager'
import Blog from '../../../../../manager/global/Blog/Blog'
import { BiographySetting } from '../../Setting/Profile/BiographySetting'
import { BlogNameSettingComponent } from './BlogNameSettingComponent'
import { ProfileImageSetting } from '../../Setting/Profile/ProfileImageSetting'

export const BlogSettingProfileComponent: React.FC<{
}> = observer(() => {
    if (!Blog.profile) {
        return <></>
    }

    return <>
        <BlogNameSettingComponent/>
        <ProfileImageSetting
            id={'blog-profile-image-setting'}
            text={LanguageManager.languageMap.ProfileImage}
            profileImageSrc={Blog.profile.profileImageURL}
            onChange={(event) => Blog.profile.updateProfileImage(event)}
        />
        <BiographySetting
            settingName={LanguageManager.languageMap.Biography}
            currentBiography={Blog.profile.biography}
            onUpdate={(biography) => Blog.profile.updateBiography(biography)}
        />
    </>
})
