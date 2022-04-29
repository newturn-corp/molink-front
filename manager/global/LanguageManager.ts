import axios from 'axios'
import { makeAutoObservable, toJS } from 'mobx'

class LanguageManager {
    languageMap: { [index: string]: string }

    constructor () {
        this.languageMap = {}
        makeAutoObservable(this)
    }

    async loadLanguage (language: string) {
        const { data } = await axios.get(`/language/${language}.tsv`)
        data.split('\r\n').forEach(line => {
            const [key, text] = line.split('\t')
            this.languageMap[key] = text
        })
    }
}
export default new LanguageManager()
