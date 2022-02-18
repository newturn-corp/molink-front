import { makeAutoObservable, observable } from 'mobx'
import React from 'react'
import SettingAPI from '../../api/SettingAPI'
import UserAPI from '../../api/UserAPI'
import EventManager, { Event } from '../EventManager'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { UserSetting } from './User/UserSetting'
import { UserSettingInterface } from '@newturn-develop/types-molink'

class NewUserManager {
    isUserAuthorized: boolean = false
    isLoading: boolean = false
    isConnected: boolean = false
    userId: number = null

    yjsDocument: Y.Doc = null
    websocketProvider: WebsocketProvider = null
    yProfile: Y.Map<any> = null
    profile: any = null
    setting: UserSetting = null

    constructor () {
        makeAutoObservable(this, {
            yjsDocument: false,
            yProfile: false,
            websocketProvider: false
        })
    }

    async load () {
        if (this.isLoading) {
            return
        }
        try {
            this.isLoading = true
            this.userId = await UserAPI.getUserID()
            console.log(this.userId)
            this.yjsDocument = new Y.Doc()

            this.yProfile = this.yjsDocument.getMap('profile')
            this.yProfile.observeDeep(() => {
                this.profile = this.yProfile.toJSON()
                console.log(this.yProfile.toJSON())
            })

            this.setting = new UserSetting(this.yjsDocument.getMap<any>('setting'))

            this.websocketProvider = new WebsocketProvider(
                process.env.USER_SERVER_URL,
                this.userId.toString(),
                this.yjsDocument, {
                    connect: false
                })

            this.websocketProvider.on('status', ({ status }: { status: string }) => {
                this.isConnected = status === 'connected'
                console.log(status)
            })

            this.websocketProvider.connect()

            await EventManager.issueEvent(Event.UserProfileInited, {})
            await EventManager.issueEvent(Event.UserAuthorization, { result: true })
            this.isUserAuthorized = true
        } catch (err) {
            console.log(err)
            EventManager.issueEvent(Event.UserAuthorization, { result: false })
            this.isUserAuthorized = false
        } finally {
            this.isLoading = false
        }
    }

    disconnect () {
        if (this.websocketProvider) {
            this.websocketProvider.disconnect()
        }
        this.userId = null
        this.isUserAuthorized = false
        this.yjsDocument = null
        this.websocketProvider = null
        this.yProfile = null
        this.profile = null
        this.setting = null
    }
}
export default new NewUserManager()
