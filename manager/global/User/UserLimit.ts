import * as Y from 'yjs'
import moment from 'moment-timezone'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import { makeAutoObservable } from 'mobx'

// 일 업로드 용량 제한은 업로드마다 차감되고, 다음날 원상복구된다.
// 총 업로드 용량은 Insert Node, Set Node에서 차감되고, removeNodes에서 복구된다.
export class UserLimit {
    yLimit: Y.Map<any> = null

    constructor () {
        EventManager.addEventListener(Event.PageFileUsageChange, (param: any) => {
            this.totalUploadLimit -= param.usage
        }, 1)
        makeAutoObservable(this)
    }

    get dailyUploadLimit () {
        return this.yLimit?.get('dailyUploadLimit') || 0
    }

    set dailyUploadLimit (limit: number) {
        if (limit < 0) {
            this.uploadRestrictedByDailyLimit = true
        } else {
            this.uploadRestrictedByDailyLimit = false
        }
        this.yLimit.set('dailyUploadLimit', limit)
    }

    get totalUploadLimit () {
        return this.yLimit?.get('totalUploadLimit') || 0
    }

    set totalUploadLimit (limit: number) {
        if (limit < 0) {
            this.uploadRestrictedByTotalLimit = true
        } else {
            this.uploadRestrictedByTotalLimit = false
        }
        this.yLimit.set('totalUploadLimit', limit)
    }

    get lastDailyUploadLimitDate () {
        return this.yLimit?.get('lastDailyUploadLimitDate') || 0
    }

    set lastDailyUploadLimitDate (dateString: string) {
        this.yLimit.set('lastDailyUploadLimitDate', dateString)
    }

    get uploadRestrictedByDailyLimit () {
        return this.yLimit?.get('uploadRestrictedByDailyLimit') || 0
    }

    set uploadRestrictedByDailyLimit (limit: boolean) {
        this.yLimit.set('uploadRestrictedByDailyLimit', limit)
    }

    get uploadRestrictedByTotalLimit () {
        return this.yLimit?.get('uploadRestrictedByTotalLimit') || 0
    }

    set uploadRestrictedByTotalLimit (limit: boolean) {
        this.yLimit.set('uploadRestrictedByTotalLimit', limit)
    }

    checkUploadAvail () {
        return !this.uploadRestrictedByDailyLimit || !this.uploadRestrictedByTotalLimit
    }

    sync (yLimit: Y.Map<any>) {
        this.yLimit = yLimit
        if (isNaN(this.totalUploadLimit) || this.totalUploadLimit === undefined || this.totalUploadLimit === null) {
            this.totalUploadLimit = 104857600 * 5 // 500MB
        }
        const today = moment().format('YYYY-MM-DD')
        if (this.lastDailyUploadLimitDate !== today) {
            this.dailyUploadLimit = 104857600 // 100MB
            this.lastDailyUploadLimitDate = today
            this.uploadRestrictedByDailyLimit = false
        }
    }

    reset () {
        this.yLimit = null
    }
}
