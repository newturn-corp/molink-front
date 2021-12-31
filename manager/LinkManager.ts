import { makeAutoObservable, toJS } from 'mobx'
import { Range, Transforms } from 'slate'
import ContentManager from './ContentManager'
import DocumentManager from './DocumentManager'
import { LinkElement } from '../utils/slate'
import { IS_DEV } from '../infra/constants'
import isUrl from 'is-url'
import DocumentAPI from '../api/DocumentAPI'
import UserManager from './UserManager'

export interface LinkOption {
    reference: string
    text: string
    url: string
}

class LinkManager {
    _options: LinkOption[] = []

    selectionRange: Range = null
    selectionRect: DOMRect = null
    isShowLinkInput: boolean = false
    currentInputValue: string = ''
    searchOtherDocumentsTimeout: NodeJS.Timeout = null
    isSearching = false

    get options () {
        return toJS(this._options)
    }

    constructor () {
        makeAutoObservable(this, {
            selectionRange: false,
            selectionRect: false
        })
    }

    showLinkInput (selectionRange) {
        this.selectionRange = selectionRange
        this.isShowLinkInput = true
    }

    closeLinkInput () {
        this.isShowLinkInput = false
    }

    handleInputChange (value) {
        if (value === '') {
            return
        }
        this.currentInputValue = value
        this.isSearching = true
        if (this.searchOtherDocumentsTimeout) {
            clearTimeout(this.searchOtherDocumentsTimeout)
        }
        this.searchOtherDocumentsTimeout = setTimeout(async () => {
            const documents = await DocumentAPI.searchDocumentsLinkList(value)
            this._options = documents.map(document => {
                return {
                    reference: document.userId === UserManager.userId ? '내 문서' : '검색 결과',
                    text: document.title,
                    url: `?id=${document.id}`
                }
            })
            this.isSearching = false
        }, 500)
    }

    handleChange (value: LinkOption) {
        const url = IS_DEV ? `http://localhost:3000${value.url}` : `https://knowlink.io${value.url}`
        const link: LinkElement = {
            type: 'link',
            url,
            children: []
        }

        Transforms.wrapNodes(ContentManager.editor, link, {
            at: this.selectionRange,
            split: true
        })
        Transforms.collapse(ContentManager.editor, { edge: 'end' })
        this.closeLinkInput()
    }

    handleEnter () {
        if (!isUrl(this.currentInputValue)) {
            return
        }
        const link: LinkElement = {
            type: 'link',
            url: this.currentInputValue,
            children: []
        }

        Transforms.wrapNodes(ContentManager.editor, link, {
            at: this.selectionRange,
            split: true
        })
        Transforms.collapse(ContentManager.editor, { edge: 'end' })
        this.closeLinkInput()
    }
}
export default new LinkManager()