import { makeAutoObservable, toJS } from 'mobx'
import UserAPI from '../../../api/UserAPI'
import {
    AcceptFollowRequestDTO,
    FollowRequestDTO,
    FollowRequestInfo,
    FollowStatus
} from '@newturn-develop/types-molink'

export class UserFollow {
    followMap: { [index: number]: true } = null
    followRequestMap: { [index: number]: true } = null

    constructor () {
        makeAutoObservable(this)
    }

    async load () {
        this.followMap = (await UserAPI.getFollowMap()).followMap
        this.followRequestMap = (await UserAPI.getMyFollowRequestMap()).followRequestMap
    }

    reset () {
        this.followMap = null
        this.followRequestMap = null
    }

    // 특정 블로그에 대한 팔로우 상태를 확인하는 함수
    public checkUserFollowStatus (blogID: number) {
        if (this.followMap[blogID]) {
            return FollowStatus.Following
        } else if (this.followRequestMap[blogID]) {
            return FollowStatus.FollowRequested
        } else {
            return FollowStatus.Default
        }
    }

    public async requestFollow (targetId: number) {
        await UserAPI.follow(new FollowRequestDTO(targetId))
        this.followRequestMap[targetId] = true
    }
}
