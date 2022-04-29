import axios from 'axios'
import { makeAutoObservable } from 'mobx'

class LanguageManager {
    languageMap: Map<string, string>

    constructor () {
        this.languageMap = new Map<string, string>()
        makeAutoObservable(this)
    }

    async loadLanguage (language: string) {
        const { data } = await axios.get(`/language/${language}.tsv`)
        data.split('\r\n').forEach(line => {
            const [key, text] = line.split('\t')
            this.languageMap.set(key, text)
        })
    }
}
export default new LanguageManager()
