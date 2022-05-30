import { makeAutoObservable } from 'mobx'

export class PageComment {
    content: string
    createdAt: Date
    userId: number
    children: string[] = []

    constructor (content: string, createdAt: Date, userId: number) {
        this.content = content
        this.createdAt = createdAt
        this.userId = userId
        makeAutoObservable(this)
    }

    getAllChildrenCommentCount (map: { [index: string]: PageComment }) {
        return this.children.reduce((prev, current) => {
            const child = map[current]
            return prev + child.getAllChildrenCommentCount(map)
        }, 0) + this.children.length
    }
}