import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UpdateUserBiographyDTO, UpdateUserProfileImageDTO } from '@newturn-develop/types-molink'
import UserManager from './UserManager'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import UserAPI from '../../../api/UserAPI'
import React from 'react'
import FeedbackManager, { NOTIFICATION_TYPE } from '../FeedbackManager'

export class UserProfile {
    yProfile: Y.Map<any> = null
    profileImageUrl: string = ''
    biography: string = ''
    nickname: string = ''

    constructor () {
        makeAutoObservable(this, {
            yProfile: false
        })
    }

    sync (yProfile: Y.Map<any>) {
        this.yProfile = yProfile
        this.yProfile.observeDeep(() => {
            this.profileImageUrl = this.yProfile.get('profileImageUrl')
            this.biography = this.yProfile.get('biography')
            this.nickname = this.yProfile.get('nickname')
        })
    }

    reset () {
        this.yProfile = null
        this.profileImageUrl = ''
        this.biography = ''
        this.nickname = ''
    }

    getUserProfileImageSrc () {
        if (!UserManager.isUserAuthorized) {
            return '/image/global/header/login-button-profile.png'
        }
        return UserManager.profile.profileImageUrl || `data:image/png;base64,${
            new Identicon(
                crypto.createHash('sha512')
                    .update(UserManager.profile.nickname)
                    .digest('base64'), {
                    size: 64,
                    foreground: [58, 123, 191, 255]
                }).toString()}`
    }

    async updateUserBiography (biography: string) {
        if (this.biography === biography) {
            return
        }
        await UserAPI.updateUserBiography(new UpdateUserBiographyDTO(biography))
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '한 줄 소개가 수정되었습니다.', '', 3)
    }

    async updateUserProfileImage (event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const reader = new FileReader()
        const file = event.target.files[0]
        try {
            reader.onloadend = async () => {
                this.profileImageUrl = reader.result as string
                await UserAPI.updateUserProfileImage(new UpdateUserProfileImageDTO(file))
                FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '프로필 이미지가 수정되었습니다.', '', 3)
            }
            reader.readAsDataURL(file)
        } catch (e) {
            console.log(file)
        }
    }
}
