import { PageList } from '../../domain/PageList'
import { GetPageListResponseDTO } from '@newturn-develop/types-molink'
import { makeObservable, observable, reaction } from 'mobx'
import LanguageManager from '../global/LanguageManager'

export class MainPagePageList extends PageList {
    category: string = null
    categoryKey: string

    constructor (pageCountForEveryRequest: number, getPageList: (from: number, count: number) => Promise<GetPageListResponseDTO>, categoryKey: string) {
        super(pageCountForEveryRequest, getPageList)
        makeObservable(this, {
            category: observable
        })
        this.category = LanguageManager.languageMap[categoryKey]
        this.categoryKey = categoryKey
        reaction(() => LanguageManager.languageMap[categoryKey], (value) => {
            this.category = LanguageManager.languageMap[categoryKey]
        })
    }
}
