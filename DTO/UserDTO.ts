export class GetUserProfileDTO {
    userId: number
    email: string
    nickname: string

    constructor (userId: number, email: string, nickname: string) {
        this.userId = userId
        this.email = email
        this.nickname = nickname
    }
}