import { BasePoint, Editor, Element, Range, Transforms } from 'slate'
import StyleManager from '../global/Style/StyleManager'
import {
    FloatOption,
    SlateFileElementType,
    SlateImageElementType,
    SlateVideoElementType
} from '../../Types/slate/CustomElement'
import FileUploadManager from './FileUploadManager'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import React from 'react'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import UserManager from '../global/User/UserManager'
import EditorPage from '../Blog/Editor/EditorPage'

class FileManager {
    private _insert (editor: Editor, element: Element, insertPosition: BasePoint | number[]) {
        const lineBefore = Editor.before(editor, insertPosition, { unit: 'word' })
        const beforeRange = lineBefore && Editor.range(editor, lineBefore, insertPosition)
        const beforeText = beforeRange && Editor.string(editor, beforeRange)
        if (beforeText && beforeText.length > 0) {
            Transforms.insertNodes(editor, element)
        } else {
            Transforms.setNodes<Element>(editor, element, {
                match: n => Editor.isBlock(editor, n)
            })
        }
    }

    checkUploadAvail (file?: File) {
        if (UserManager.limit.uploadRestrictedByDailyLimit || (file && file.size > UserManager.limit.dailyUploadLimit)) {
            FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '오늘 허용된 업로드 용량이 부족합니다.', '')
            return false
        } else if (UserManager.limit.uploadRestrictedByTotalLimit || (file && file.size > UserManager.limit.totalUploadLimit)) {
            FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '용량이 부족합니다.', '')
            return false
        }
        return true
    }

    async handleInsertData (editor: Editor, data) {
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
            if (!this.checkUploadAvail()) {
                return true
            }
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')
                // 5MB 이상은 못 올리도록
                if (file.size > 5120000) {
                    FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '5MB 이상의 파일은 업로드할 수 없습니다.', '')
                    return true
                }
                reader.addEventListener('load', (event) => {
                    if (mime === 'image') {
                        this.insertImage(event.target.result as string, file)
                    } else if (mime === 'video') {
                        this.insertVideo(event.target.result as string, file)
                    } else {
                        this.insertFile(event.target.result as string, file)
                    }
                })
                reader.readAsDataURL(file)
            }
            return true
        } else if (this.isImageUrl(text)) {
            if (!this.checkUploadAvail()) {
                return true
            }
            this.insertImage(text)
            return true
        }
        return false
    }

    getURLAndFileFromInputEvent (event: React.ChangeEvent<HTMLInputElement>) {
        return new Promise<{ url: string, file: File }>(resolve => {
            event.preventDefault()
            const reader = new FileReader()
            const file = event.target.files[0]
            reader.onloadend = () => {
                resolve({
                    url: reader.result as string,
                    file
                })
            }
            reader.readAsDataURL(file)
        })
    }

    async insertFile (url: string, file?: File) {
        const editor = EditorPage.editor.slateEditor
        const text = { text: '' }
        const slateFileElement: SlateFileElementType = {
            type: 'file',
            url: null,
            children: [text],
            isUploading: true,
            name: file ? file.name : '파일',
            size: file.size,
            fileType: file.type
        }
        const insertPosition = this.getInsertPosition(editor)
        this._insert(editor, slateFileElement, insertPosition)
        const insertedNodePosition = this.getInsertPosition(editor)
        const { url: uploadResultUrl, size } = await FileUploadManager.uploadFile(url, file)
        Transforms.setNodes(editor,
            {
                url: uploadResultUrl,
                size,
                isUploading: false
            }, {
                at: insertedNodePosition
            }
        )
    }

    getInsertPosition (editor: Editor) {
        const { selection } = editor
        if (selection) {
            return Range.edges(selection)[0]
        }
        return [editor.children.length]
    }

    insertVideo (url: string, file?: File) {
        const editor = EditorPage.editor.slateEditor
        const video = document.createElement('video')
        video.src = url
        video.onloadeddata = async () => {
            let width = video.videoWidth
            let height = video.videoHeight
            if (width > StyleManager.contentStyle.main.width) {
                height *= StyleManager.contentStyle.main.width / width
                width = StyleManager.contentStyle.main.width
            }
            if (height > StyleManager.contentStyle.body.height * 0.8) {
                width *= StyleManager.contentStyle.body.height * 0.8 / height
                height = StyleManager.contentStyle.body.height * 0.8
            }
            const text = { text: '' }
            const slateVideoElement: SlateVideoElementType = {
                type: 'video',
                url: null,
                children: [text],
                width,
                height,
                name: file ? file.name : '비디오',
                floatOption: FloatOption.Center,
                isUploading: true,
                caption: '',
                captionHeight: 0,
                size: file ? file.size : 0
            }
            const insertPosition = this.getInsertPosition(editor)
            this._insert(editor, slateVideoElement, insertPosition)
            const insertedNodePosition = this.getInsertPosition(editor)
            const { url: uploadResultUrl, size } = await FileUploadManager.uploadFile(url, file)
            Transforms.setNodes(editor,
                {
                    url: uploadResultUrl,
                    size,
                    isUploading: false
                }, {
                    at: insertedNodePosition
                }
            )
        }
    }

    insertImage (url: string, file?: File) {
        const editor = EditorPage.editor.slateEditor
        const image = new Image()
        image.src = url

        image.onload = async () => {
            let width = image.width
            let height = image.height
            if (image.width > StyleManager.contentStyle.main.width) {
                height *= StyleManager.contentStyle.main.width / width
                width = StyleManager.contentStyle.main.width
            }
            const text = { text: '' }
            const slateImageElement: SlateImageElementType = {
                type: 'image',
                url: image.src,
                floatOption: FloatOption.Center,
                children: [text],
                width,
                height,
                size: file ? file.size : 0,
                isUploading: true,
                caption: '',
                captionHeight: 0
            }
            const insertPosition = this.getInsertPosition(editor)
            this._insert(editor, slateImageElement, insertPosition)
            const insertedNodePosition = this.getInsertPosition(editor)
            const { url: uploadResultUrl, size } = await FileUploadManager.uploadFile(url, file)
            Transforms.setNodes(editor,
                {
                    url: uploadResultUrl,
                    size,
                    isUploading: false
                }, {
                    at: insertedNodePosition
                }
            )
        }
    }

    isImageUrl (url: string) {
        if (!url) return false
        if (!isUrl(url)) return false
        const ext = new URL(url).pathname.split('.').pop()
        return imageExtensions.includes(ext)
    }
}
export default new FileManager()
