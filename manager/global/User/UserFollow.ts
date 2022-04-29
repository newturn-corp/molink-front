import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { FollowRequest, Notification } from '@newturn-develop/types-molink'

export enum FollowStatus {
    Default,
    Following,
    FollowRequested
}

export class UserFollow {
    yMyFollowRequests: Y.Map<any> = null
    yFollowList: Y.Map<any> = null

    constructor () {
        makeAutoObservable(this, {
            yMyFollowRequests: false,
            yFollowList: false
        })
    }

    sync (yMyFollowRequests, yFollowList) {
        this.yMyFollowRequests = yMyFollowRequests
        this.yFollowList = yFollowList
    }

    reset () {
        this.yMyFollowRequests = null
        this.yFollowList = null
    }

    // 특정 유저에 대한 팔로우 상태를 확인하는 함수
    checkUserFollowStatus (userId: number) {
        if (this.yFollowList.get(userId.toString())) {
            return FollowStatus.Following
        } else if (this.yMyFollowRequests.get(userId.toString())) {
            return FollowStatus.FollowRequested
        } else {
            return FollowStatus.Default
        }
    }
}
