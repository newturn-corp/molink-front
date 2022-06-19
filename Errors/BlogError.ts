import { CustomError } from './Common'

export class BlogPageNotExist extends CustomError {
    blogNickname: string

    constructor (blogNickname: string) {
        super()
        this.blogNickname = blogNickname
    }
}

export class BlogNotExists extends CustomError {}
