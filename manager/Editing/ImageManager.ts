import { Editor, Transforms } from 'slate'
import StyleManager from '../global/Style/StyleManager'
import { ImageFloatOption, SlateImageElementType } from '../../Types/slate/CustomElement'
import FileUploadManager from './FileUploadManager'
import EditorManager from '../Blog/EditorManager'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import React from 'react'
import { FILE } from 'dns'

class ImageManager {
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

    private async _uploadImage (url: string, file?: File) {
        if (file) {
            return FileUploadManager.uploadImage(file)
        } else {
            return FileUploadManager.uploadImageFromURL(url)
        }
    }

    insertImage (url: string, file?: File) {
        const editor = EditorManager.slateEditor
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
                floatOption: ImageFloatOption.Center,
                children: [text],
                width,
                height,
                isUploading: true,
                caption: '',
                captionHeight: 0
            }
            Transforms.insertNodes(editor, slateImageElement)
            const selection = editor.selection
            const uploadResultUrl = await this._uploadImage(url, file)
            Transforms.setNodes(editor,
                {
                    url: uploadResultUrl,
                    isUploading: false
                }, {
                    at: selection
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
export default new ImageManager()
