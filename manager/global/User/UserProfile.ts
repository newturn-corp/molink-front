import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface, UpdateUserBiographyDTO, UpdateUserProfileImageDTO } from '@newturn-develop/types-molink'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import HierarchyManager from '../Hierarchy/HierarchyManager'
import UserManager from './UserManager'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import UserAPI from '../../../api/UserAPI'
import React from 'react'

export class UserProfile {
    yProfile: Y.Map<any> = null
    profileImageUrl: string = ''
    biography: string = ''
    nickname: string = ''
    lastOpenPageId: string | null = null

    constructor () {
        makeAutoObservable(this, {
            yProfile: false
        })
        EventManager.addEventListener(Event.LoadContent, () => {
            if (this.yProfile) {
                const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
                if (currentHierarchy) {
                    this.yProfile.set('lastOpenPageId', currentHierarchy.openedPageId)
                }
            }
        }, 1)
    }

    sync (yProfile: Y.Map<any>) {
        this.yProfile = yProfile
        this.yProfile.observeDeep(() => {
            this.profileImageUrl = this.yProfile.get('profileImageUrl')
            this.biography = this.yProfile.get('biography')
            this.nickname = this.yProfile.get('nickname')
            this.lastOpenPageId = this.yProfile.get('lastOpenPageId')
        })
    }

    reset () {
        this.yProfile = null
        this.profileImageUrl = ''
        this.biography = ''
        this.nickname = ''
        this.lastOpenPageId = null
    }

    setLastOpenPageId (pageId: string) {
        this.yProfile.set('lastOpenPageId', pageId)
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
        await UserAPI.updateUserBiography(new UpdateUserBiographyDTO(biography))
    }

    async updateUserProfileImage (event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const reader = new FileReader()
        const file = event.target.files[0]
        try {
            reader.onloadend = async () => {
                this.profileImageUrl = reader.result as string
                await UserAPI.updateUserProfileImage(new UpdateUserProfileImageDTO(file))
            }
            reader.readAsDataURL(file)
        } catch (e) {
            console.log(file)
        }
    }
}
