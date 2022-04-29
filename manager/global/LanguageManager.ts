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
        console.log(process.env.NODE_ENV)
        console.log(JSON.stringify(data))
        // @ts-ignore
        const separator = process.env.NODE_ENV === 'local' ? '\r\n' : '\n'
        data.split(separator).forEach(line => {
            const [key, text] = line.split('\t')
            this.languageMap[key] = text
        })
        console.log(this.languageMap)
    }
}
export default new LanguageManager()
