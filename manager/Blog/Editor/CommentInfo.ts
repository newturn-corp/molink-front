import { makeAutoObservable } from 'mobx'
import ViewerAPI from '../../../api/ViewerAPI'
import UserInfoMap from '../../global/User/UserInfoMap'
import { PageComment } from '../../../domain/PageComment'
import ContentAPI from '../../../api/ContentAPI'
import { SaveCommentDTO } from '@newturn-develop/types-molink/dist/DTO'
import UserManager from '../../global/User/UserManager'

export class CommentInfo {
    pageId: string
    commentCount: number = 0
    commentMap: { [index: string]: PageComment } = {}
    topLevelCommentIDList: string[] = []

    constructor (pageId: string) {
        this.pageId = pageId
        makeAutoObservable(this)
    }

    async load () {
        // 초기화
        const comments = await ViewerAPI.getPageComments(this.pageId)
        this.commentCount = comments.length

        const commentUserIDSet = new Set<number>()
        for (const comment of comments) {
            commentUserIDSet.add(comment.userId)
        }
        await UserInfoMap.updateUserInfoMapByUserIDList(Array.from(commentUserIDSet))
        for (const comment of comments) {
            if (!comment.parentCommentId) {
                this.topLevelCommentIDList.push(comment.id)
            }
            this.commentMap[comment.id] = new PageComment(comment.content, new Date(comment.createdAt), comment.userId)
        }
        for (const comment of comments) {
            if (comment.parentCommentId) {
                this.commentMap[comment.parentCommentId].children.push(comment.id)
            }
        }

        // 정렬
        for (const comment of Object.values(this.commentMap)) {
            if (comment.children.length > 1) {
                comment.children.sort((a, b) => {
                    const aComment = this.commentMap[a]
                    const bComment = this.commentMap[b]
                    return Number(aComment.createdAt) - Number(bComment.createdAt)
                })
            }
        }
        this.topLevelCommentIDList.sort((a, b) => {
            const aComment = this.commentMap[a]
            const bComment = this.commentMap[b]
            return Number(aComment.createdAt) - Number(bComment.createdAt)
        })
    }

    async saveComment (parentCommentID: string | null, content: string) {
        const { commentID } = await ContentAPI.saveComment(new SaveCommentDTO(this.pageId, content, parentCommentID))
        this.commentCount += 1
        this.commentMap[commentID] = new PageComment(content, new Date(), UserManager.userId)
        if (parentCommentID) {
            this.commentMap[parentCommentID].children.push(commentID)
        } else {
            this.topLevelCommentIDList.push(commentID)
        }
    }
}
