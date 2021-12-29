import React from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { ButtonGroup, Button, List, Divider, Avatar } from '@material-ui/core'
import { UserSearchResult } from '../../components/search/UserSearchResult'
import UserManager from '../../manager/UserManager'
import RoutingManager, { Page } from '../../manager/RoutingManager'
import { Input } from 'antd'
import { SettingButtonList } from '../../components/setting/SettingButtonList'

const SettingProfile = observer(() => {
    UserManager.updateUserProfile()
        .then(() => {
            if (!UserManager.isUserAuthorized) {
                RoutingManager.moveTo(Page.SignIn)
            }
        })
    if (!UserManager.isUserAuthorized) {
        return <></>
    }

    const profileImageSrc = UserManager.profileImageUrl ? UserManager.profileImageUrl : undefined
    const profileInnerText = UserManager.profileImageUrl ? undefined : UserManager.nickname[0]
    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <SettingButtonList/>
                </div>
                <div className='setting-list'>
                    <div className='profile'>
                        <div className='profile-image'>
                            <p className='setting-name'>프로필 이미지</p>
                            <input
                                accept='image/jpg,impge/png,image/jpeg'
                                style={{ display: 'none' }}
                                id="profile-image-button"
                                multiple
                                onChange={(event) => UserManager.updateUserProfileImage(event)}
                                type="file"/
                            >
                            <label htmlFor="profile-image-button">
                                <Avatar className='image' sizes='200' src={profileImageSrc}>{profileInnerText}</Avatar>
                            </label>
                            <div className='edit'>
                                눌러서 변경하기
                            </div>
                        </div>
                        <div className='biography'>
                            <p className='setting-name'>한 줄 소개</p>
                            <Input
                                maxLength={37}
                                onChange={(e) => {
                                    UserManager.biography = e.target.value
                                }}
                                value={UserManager.biography}
                                onBlur={() => UserManager.updateUserBiography()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
})

export default SettingProfile
