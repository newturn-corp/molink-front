import { jsx } from 'slate-hyperscript'
import { FloatOption, SlateImageElementType, TextCategory } from '../../../Types/slate/CustomElement'
import { Element, Transforms } from 'slate'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import StyleManager from '../../../manager/global/Style/StyleManager'
import FileUploadManager from '../../../manager/Editing/FileUploadManager'
import { HistoryEditor } from 'slate-history'

// eslint-disable-next-line no-undef
const shouldReturnText = (el: HTMLElement, children: any) => {
    const { parentNode, previousSibling } = el
    if (['STRONG', 'B', 'CODE', 'I', 'EM', 'SPAN'].includes(parentNode.nodeName)) {
        return true
    } else if (Array.isArray(children) && children.filter(child => typeof child !== 'string').length === 0) {
        return true
    }

    if (!previousSibling) {
        return false
    }

    if (previousSibling.nodeName === 'A') {
        return shouldReturnText(previousSibling as HTMLElement, previousSibling.childNodes)
    } else if (previousSibling.nodeName === 'SPAN') {
        return true
    }

    if (parentNode.nodeName === 'BODY') {
        return false
    } else {
        return true
    }
}

export const handleImage = (el: HTMLElement, children: any) => {
    const image = new Image()
    const url = el.getAttribute('src')
    image.onload = async () => {
        let width = image.width
        let height = image.height
        if (image.width > StyleManager.contentStyle.main.width) {
            height *= StyleManager.contentStyle.main.width / width
            width = StyleManager.contentStyle.main.width
        }
        const { url: uploadResultUrl, size } = await FileUploadManager.uploadFile(url)
        HistoryEditor.withoutSaving(EditorPage.editor.slateEditor, () => {
            Transforms.setNodes(EditorPage.editor.slateEditor, {
                width,
                height,
                url: uploadResultUrl,
                size,
                isUploading: false
            }, {
                at: [],
                match: n => Element.isElement(n) && n.type === 'image' && n.url === url,
                voids: true
            })
        })
    }
    image.src = url

    const element: SlateImageElementType = {
        type: 'image',
        url,
        floatOption: FloatOption.Center,
        children: [{ text: '' }],
        width: 0,
        height: 0,
        size: 0,
        isUploading: true,
        caption: '',
        captionHeight: 0
    }
    return jsx('element',
        element,
        children
    )
}
