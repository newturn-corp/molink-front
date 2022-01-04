export class AcceptFollowRequestDTO {
    followRequestId: number

    constructor (followRequestId: number) {
        this.followRequestId = followRequestId
    }
}

export class RejectFollowRequestDTO {
    followRequestId: number

    constructor (followRequestId: number) {
        this.followRequestId = followRequestId
    }
}
