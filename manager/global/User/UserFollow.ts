import { makeAutoObservable, toJS } from 'mobx'
import UserAPI from '../../../api/UserAPI'
import { AcceptFollowRequestDTO, FollowRequestDTO, FollowRequestInfo } from '@newturn-develop/types-molink'
import FollowAPI from '../../../api/FollowAPI'

export enum FollowStatus {
    Default,
    Following,
    FollowRequested
}

export class UserFollow {
    followMap: { [index: number]: true } = null
    followRequestMap: { [index: number]: true } = null
    _requestedFollows: FollowRequestInfo[] = null

    get requestedFollows () {
        return toJS(this._requestedFollows)
    }

    constructor () {
        makeAutoObservable(this)
    }

    async load () {
        this.followMap = (await UserAPI.getFollowMap()).followMap
        this.followRequestMap = (await UserAPI.getMyFollowRequestMap()).followRequestMap
        this._requestedFollows = (await UserAPI.getRequestedFollows()).follows
    }

    reset () {
        this.followMap = null
        this.followRequestMap = null
    }

    // 특정 유저에 대한 팔로우 상태를 확인하는 함수
    public checkUserFollowStatus (userId: number) {
        if (this.followMap[userId]) {
            return FollowStatus.Following
        } else if (this.followRequestMap[userId]) {
            return FollowStatus.FollowRequested
        } else {
            return FollowStatus.Default
        }
    }

    public async requestFollow (targetId: number) {
        await UserAPI.follow(new FollowRequestDTO(targetId))
        this.followRequestMap[targetId] = true
    }

    public async acceptFollowRequest (index: number) {
        const request = this._requestedFollows[index]
        console.log(request)
        this._requestedFollows.splice(index, 1)
        console.log(this._requestedFollows)
        await UserAPI.acceptFollowRequest(new AcceptFollowRequestDTO(request.id))
    }

    public async rejectFollowRequest (index: number) {
        const request = this._requestedFollows[index]
        this._requestedFollows.splice(index, 1)
        await UserAPI.rejectFollowRequest(new AcceptFollowRequestDTO(request.id))
    }

    public async checkFollowRequestsViewed () {
        if (this._requestedFollows.length === 0) {
            return
        }
        await UserAPI.setFollowRequestsViewedAt()
        this._requestedFollows.forEach(request => {
            request.isViewed = true
        })
    }
}
