import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { UserSettingInterface } from '@newturn-develop/types-molink'

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
