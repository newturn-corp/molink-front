import { Editor as SlateEditor, Element, Node } from 'slate'
import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import { PageVisibility, UpdatePageDataInSearchEngineDTO } from '@newturn-develop/types-molink'
import ContentAPI from '../../../api/ContentAPI'
import { EditorTagList } from './EditorTagList'
import { SlateImageElementType } from '../../../Types/slate/CustomElement'
import Blog from '../../global/Blog/Blog'

export class EditorPermanenceManager {
    pageId: string
    editable: boolean
    slateEditor: SlateEditor = null
    tagList: EditorTagList
    shouldUpdateLastEditedAt: boolean = false

    constructor (pageId: string, tagList: EditorTagList, slateEditor: SlateEditor) {
        this.pageId = pageId
        this.tagList = tagList
        this.slateEditor = slateEditor
        EventManager.addDisposableEventListener(
            Event.MoveToAnotherPage, async () => {
                await this.persistPageDataInSearchEngine()
            }, 10)
        EventManager.addEventListener(
            Event.EditorChange, async () => {
                this.handleEditorChange()
            }, 1)
    }

    async persistPageDataInSearchEngine () {
        const page = Blog.pageHierarchy.openedPage
        console.log(page)
        const title = page.title
        const image = this.slateEditor.children.filter(child => Element.isElement(child) && child.type === 'image')[0] as SlateImageElementType
        const { content, rawContent, description } = this.getPagePermanenceDataFromNodeArray(this.slateEditor.children)

        await ContentAPI.updatePageDataInSearchEngine(new UpdatePageDataInSearchEngineDTO(
            this.pageId,
            title,
            content,
            rawContent,
            description,
            this.pageVisibilityToNumber(page.visibility),
            this.shouldUpdateLastEditedAt ? Number(new Date()) : undefined,
            image ? `${image.url}?pageId=${this.pageId}` : undefined,
            this.tagList.tags
        ))
    }

    pageVisibilityToNumber (visibility: PageVisibility) {
        switch (visibility) {
        case PageVisibility.Private: return 0
        case PageVisibility.OnlyFollower: return 1
        case PageVisibility.Public: return 2
        }
    }

    handleEditorChange () {
        if (!this.shouldUpdateLastEditedAt) {
            if (this.slateEditor && this.slateEditor.operations.filter(operation => operation.type !== 'set_selection').length > 0) {
                this.shouldUpdateLastEditedAt = true
            }
        }
    }

    getPagePermanenceDataFromNodeArray (nodes: Node[]) {
        let content = ''
        let description = ''
        const rawContent = JSON.stringify(nodes)
        for (const node of nodes) {
            const nodeString = Node.string(node)
            if (nodeString === '') {
                continue
            }
            if (description === '') {
                description = nodeString
            }
            content += nodeString + '\n'
        }
        return { content, description, rawContent }
    }
}
