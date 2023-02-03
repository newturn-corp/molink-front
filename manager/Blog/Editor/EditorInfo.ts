import * as Y from 'yjs'
import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import { makeAutoObservable } from 'mobx'
import EditorPage from './EditorPage'
import ContentAPI from '../../../api/ContentAPI'
import { ESPageMetaInfo, UpdatePageHeaderIconDTO, UpdatePageTitleDTO } from '@newturn-develop/types-molink'

export class EditorInfo {
    private yInfo: Y.Map<any> = null
    pageID: string
    info: any = null
    isLocked: boolean = false
    title: string = ''
    icon: string = ''

    constructor (yInfo: Y.Map<any>, metaInfo: ESPageMetaInfo) {
        this.yInfo = yInfo
        this.yInfo.observeDeep(() => {
            this.info = this.yInfo.toJSON()
            this.title = this.yInfo.get('title')
            this.icon = this.yInfo.get('icon')
            const isLocked = this.yInfo.get('isLocked')
            if (this.isLocked !== isLocked) {
                this.isLocked = isLocked
                EventManager.issueEvent(Event.LockPage, { isLocked })
            }
        })
        this.title = metaInfo.title
        this.icon = metaInfo.icon
        makeAutoObservable(this)
    }

    load (pageID: string) {
        this.pageID = pageID
    }

    updateIsLocked (isLocked: boolean) {
        this.yInfo.set('isLocked', isLocked)
        if (!isLocked) {
            EditorPage.editor.toolbar.tryEnable()
        }
    }

    async updateTitle (title: string) {
        console.log('update title' + title)
        await ContentAPI.updatePageTitle(new UpdatePageTitleDTO(this.pageID, title))
    }

    async updateHeaderIcon (icon: string) {
        await ContentAPI.updatePageHeaderIcon(new UpdatePageHeaderIconDTO(this.pageID, icon))
    }

    reset () {
        this.yInfo = null
        this.info = null
        this.isLocked = false
    }
}
