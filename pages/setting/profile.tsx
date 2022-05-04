import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Header } from '../../components/global/Header/Header'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { Input } from 'antd'
import { SettingCategory } from '../../components/setting/SettingCategory'
import UserManager from '../../manager/global/User/UserManager'
const { TextArea } = Input

const SettingProfile = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (!UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.SignIn)
                }
            })
    }, [])
    const biography = UserManager.profile ? UserManager.profile.biography : ''
    return <div className='setting-page' onClick={() => {
    } } >
        <Header />
        <div className={'index-body'}>
            <div className='core'>
                <div className='setting-meta'>
                    <SettingCategory/>
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
                                onChange={(event) => UserManager.profile.updateUserProfileImage(event)}
                                type="file"
                            />
                            <label htmlFor="profile-image-button">
                                <Avatar className='image' sizes='200' src={UserManager.profile.getUserProfileImageSrc()}/>
                            </label>
                            <div className='edit'>
                                눌러서 변경하기
                            </div>
                        </div>
                        <div className='biography'>
                            <p className='setting-name'>한 줄 소개</p>
                            <TextArea
                                maxLength={100}
                                autoSize={{ minRows: 3, maxRows: 3 }}
                                onChange={(e) => {
                                    UserManager.profile.biography = e.target.value
                                }}
                                value={biography}
                                onBlur={() => UserManager.profile.updateUserBiography(biography)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
})

export default SettingProfile
