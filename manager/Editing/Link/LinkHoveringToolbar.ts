import Fuse from 'fuse.js'
import UserManager from '../../global/User/UserManager'
import { IS_DEV } from '../../../infra/constants'
import { LinkElement } from '../../../Types/slate/CustomElement'
import { Range, Transforms } from 'slate'
import { isURL } from 'class-validator'
import { LinkOption } from './LinkManager'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import { makeAutoObservable, toJS } from 'mobx'
import EditorPage from '../../Blog/Editor/EditorPage'
import Blog from '../../global/Blog/Blog'

export class LinkHoveringToolbar {
    _options: LinkOption[] = []
    isSearching = false
    selectionRange: Range = null
    selectionRect: DOMRect = null
    isShowLinkInput: boolean = false
    currentInputValue: string = ''
    fuse: Fuse<HierarchyDocumentInfoInterface>

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
        const pages = Array.from(Blog.pageHierarchy.yMap.values())
        this.fuse = new Fuse(pages, {
            keys: ['title']
        })
        this.isShowLinkInput = true
    }

    close () {
        this.isShowLinkInput = false
    }

    handleInputChange (value) {
        if (value === '') {
            return
        }
        this.currentInputValue = value
        this.isSearching = true
        this._options = this.fuse.search(value).splice(0, 5).map(result => {
            const { item: page } = result
            return {
                reference: page.userId === UserManager.userId ? '내 문서' : '검색 결과',
                text: page.title,
                url: `/blog/${page.id}`,
                icon: page.icon
            }
        })
        this.isSearching = false
    }

    handleLinkOptionChange (value: LinkOption | string) {
        if (typeof value === 'string') {
            return
        }
        const url = IS_DEV ? `https://localhost:3000${value.url}` : `https://molink.life${value.url}`
        const link: LinkElement = {
            type: 'link',
            url,
            children: []
        }

        const slateEditor = EditorPage.editor.slateEditor
        Transforms.wrapNodes(slateEditor, link, {
            at: this.selectionRange,
            split: true
        })
        Transforms.collapse(slateEditor, { edge: 'end' })
        this.close()
    }

    handleEnter () {
        if (!isURL(this.currentInputValue)) {
            return
        }
        const link: LinkElement = {
            type: 'link',
            url: this.currentInputValue,
            children: []
        }

        const slateEditor = EditorPage.editor.slateEditor
        Transforms.wrapNodes(slateEditor, link, {
            at: this.selectionRange,
            split: true
        })
        Transforms.collapse(slateEditor, { edge: 'end' })
        this.close()
    }
}
