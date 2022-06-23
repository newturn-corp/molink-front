import { makeAutoObservable } from 'mobx'
import * as Y from 'yjs'
import ViewerBlogAPI from '../../../api/Viewer/ViewerBlogAPI'
import UserAPI from '../../../api/UserAPI'
import {
    SetBlogBiographyDTO,
    SetBlogProfileImageDTO,
    UpdateUserBiographyDTO,
    UpdateUserProfileImageDTO
} from '@newturn-develop/types-molink'
import FeedbackManager, { NOTIFICATION_TYPE } from '../FeedbackManager'
import BlogProfileAPI from '../../../api/blog/BlogProfileAPI'
import Blog from './Blog'
import React from 'react'

export class BlogProfile {
    yProfile: Y.Map<any> = null
    public name: string = null
    public profileImageURL: string | null = null
    public biography: string | null = null
    public followerCount: number = 0

    constructor (yProfile: Y.Map<any>) {
        this.yProfile = yProfile
        this.yProfile.observeDeep(() => {
            this.name = this.yProfile.get('name')
            this.profileImageURL = this.yProfile.get('profileImageURL')
            this.biography = this.yProfile.get('biography')
        })
        makeAutoObservable(this, {
            yProfile: false
        })
    }

    async load (blogID: number) {
        const { count } = await ViewerBlogAPI.getBlogFollowerCount(blogID)
        this.followerCount = count
    }

    async updateProfileImage (event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        const reader = new FileReader()
        const file = event.target.files[0]
        try {
            reader.onloadend = async () => {
                this.profileImageURL = reader.result as string
                await BlogProfileAPI.setBlogProfileImage(new SetBlogProfileImageDTO(Blog.id, file))
                FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '블로그 프로필 이미지가 수정되었습니다.', '', 3)
            }
            reader.readAsDataURL(file)
        } catch (e) {
            console.log(file)
        }
    }

    async updateBiography (biography: string) {
        if (this.biography === biography) {
            return
        }
        await BlogProfileAPI.setBlogBiography(new SetBlogBiographyDTO(Blog.id, biography))
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '한 줄 소개가 수정되었습니다.', '', 3)
    }

    reset () {
        this.yProfile = null
        this.name = null
        this.profileImageURL = null
        this.followerCount = 0
    }
}
