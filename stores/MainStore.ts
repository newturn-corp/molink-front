import { makeAutoObservable } from 'mobx'
import Document from '../domain/Document'
import Text from '../domain/Text'

class MainStore {
    metaData: Document[]
    currentContent: string
    content: {
        title: string
        texts: Text[]
    }

    constructor () {
        makeAutoObservable(this)
        const Book1 = new Document('생각에 관한 생각', 0)
        const Book2 = new Document('Hook', 1)
        const Book3 = new Document('OKR', 2)
        const Book = new Document('책', 0, true, true, 'book', [Book1, Book2, Book3])
        const eco1 = new Document('지주회사', 0, false)
        const jeje1 = new Document('재무상태표', 0, false)
        const jeje2 = new Document('손익계산서', 1, false)
        const eco2 = new Document('재무제표', 1, true, false, '', [jeje1, jeje2])
        const Eco = new Document('회계 & 금융', 0, true, true, 'book', [eco1, eco2])
        this.metaData = [Book, Eco]
        this.currentContent = `정의
        GDP, 실질 소득, 고용, 산업 생산, 총매출등이 감소하는 것
    원인
        수요 감소를 일으키는 모든 것
        금융 위기, 자연재해, 팬데믹
    영향
        실업률 증가
    `
        this.content = {
            title: '경기 후퇴, Recession',
            texts: [
                new Text('정의', 0, 0),
                new Text('GDP, 실질 소득, 고용, 산업 생산, 총매출등이 감소하는 것', 1, 1),
                new Text('원인', 2, 0),
                new Text('수요 감소를 일으키는 모든 것', 3, 1),
                new Text('금융 위기, 자연재해, 팬데믹', 4, 1),
                new Text('영향', 5, 0),
                new Text('실업률 증가', 6, 1)
            ]
        }
    }
}

export default new MainStore()
