import * as Y from 'yjs'
import { makeAutoObservable } from 'mobx'
import { Transaction, YEvent } from 'yjs'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import EditorPage from '../../Blog/Editor/EditorPage'
import Blog from '../Blog/Blog'

// 총 업로드 용량은 Insert Node, Set Node에서 차감되고, removeNodes에서 복구된다.
export class UserLimit {
    yLimit: Y.Map<any> = null
    limitListener: (arg0: YEvent<any>[], arg1: Transaction) => void = null

    sizeLimitPerUpload: number = 0
    maxDailyUploadLimit: number = 0
    dailyUploadLimit: number = 0
    maxTotalUploadLimit: number = 0
    totalUploadLimit: number = 0

    constructor () {
        makeAutoObservable(this, {
            yLimit: false,
            limitListener: false
        })
    }

    handleFileUpload (fileSize: number) {
        this.yLimit.set('dailyUploadLimit', this.dailyUploadLimit - fileSize)
    }

    handleFileDeletion (fileSize: number) {
        this.yLimit.set('totalUploadLimit', this.totalUploadLimit + fileSize)
        if (Blog.pageHierarchy && Blog.pageHierarchy.openedPage) {
            Blog.pageHierarchy.openedPage.handleFileDeletion(fileSize)
        }
    }

    handleFileChange (prevFileSize: number, newFileSize: number) {
        this.handleFileDeletion(prevFileSize)
        // this.handleFileUpload(newFileSize)
        this.handleInsertFile(newFileSize)
    }

    handleInsertFile (fileSize: number) {
        this.yLimit.set('totalUploadLimit', this.totalUploadLimit - fileSize)
        if (Blog.pageHierarchy && Blog.pageHierarchy.openedPage) {
            Blog.pageHierarchy.openedPage.handleInsertFile(fileSize)
        }
    }

    handlePageDeletion (page: HierarchyDocumentInfoInterface) {
        this.yLimit.set('totalUploadLimit', this.totalUploadLimit + page.fileUsage)
    }

    sync (yLimit: Y.Map<any>) {
        this.yLimit = yLimit
        this.limitListener = () => {
            this.sizeLimitPerUpload = this.yLimit.get('sizeLimitPerUpload')
            this.maxDailyUploadLimit = this.yLimit.get('maxDailyUploadLimit')
            this.dailyUploadLimit = this.yLimit.get('dailyUploadLimit')
            this.maxTotalUploadLimit = this.yLimit.get('maxTotalUploadLimit')
            this.totalUploadLimit = this.yLimit.get('totalUploadLimit')
        }
        this.yLimit.observeDeep(this.limitListener)
    }

    reset () {
        if (this.yLimit) {
            this.yLimit.unobserveDeep(this.limitListener)
        }
        this.maxDailyUploadLimit = 0
        this.dailyUploadLimit = 0
        this.maxTotalUploadLimit = 0
        this.totalUploadLimit = 0
        this.yLimit = null
    }
}
