import axios from 'axios'
import { makeAutoObservable, toJS } from 'mobx'

const defaultLanguage = 'ko-KR'
const availLanguage = [
    'ko-KR'
]

class LanguageManager {
    languageMap: { [index: string]: string }

    constructor () {
        this.languageMap = {}
        makeAutoObservable(this)
    }

    async loadLanguage (language: string) {
        if (!availLanguage.includes(language)) {
            language = defaultLanguage
        }
        const { data } = await axios.get(`/language/${language}.tsv`)
        // @ts-ignore
        const separator = process.env.NODE_ENV === 'local' ? '\r\n' : '\n'
        data.split(separator).forEach(line => {
            const [key, text] = line.split('\t')
            this.languageMap[key] = text
        })
    }
}
export default new LanguageManager()
