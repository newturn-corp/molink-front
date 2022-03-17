import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface } from '@newturn-develop/types-molink'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import HierarchyManager from '../Hierarchy/HierarchyManager'

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
                    this.yProfile.set('lastOpenPageId', currentHierarchy.openedDocumentId)
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

    // async updateUserProfileImage (event: React.ChangeEvent<HTMLInputElement>) {
    //     event.preventDefault()
    //     const reader = new FileReader()
    //     const file = event.target.files[0]
    //     reader.onloadend = async () => {
    //         this.profile.profileImageUrl = reader.result as string
    //         await UserAPI.updateUserProfileImage(new UpdateUserProfileImageDto(file))
    //     }
    //     reader.readAsDataURL(file)
    // }
}
