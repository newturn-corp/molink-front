import { Editor, Node, Transforms } from 'slate'
import { ImageElement, ImageFloatOption } from '../utils/slate'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import FileUploadManager from '../manager/FileUploadManager'
import StyleManager from '../manager/StyleManager'

const insertImage = (editor: Editor, url: string, width: number, height: number, isUploading: boolean) => {
    const text = { text: '' }
    const image: ImageElement = { type: 'image', url, floatOption: ImageFloatOption.Center, children: [text], width, height, isUploading, caption: '', captionHeight: 0 }
    Transforms.insertNodes(editor, image)
}

const isImageUrl = (url: string) => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

export const withImages = (editor: Editor) => {
    const { insertData } = editor

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                // 10MB 이상은 못 올리도록
                if (file.size > 10485760) {
                    continue
                }

                if (mime === 'image') {
                    reader.addEventListener('load', (event) => {
                        const image = new Image()
                        image.src = event.target.result as string
                        image.onload = () => {
                            const url = reader.result as string
                            let width = image.width
                            let height = image.height
                            if (image.width > StyleManager.contentStyle.content.width) {
                                height *= StyleManager.contentStyle.content.width / width
                                width = StyleManager.contentStyle.content.width
                            }
                            insertImage(editor, url, width, height, true)
                            const selection = editor.selection
                            FileUploadManager.uploadContentImage(file).then((url) => {
                                Transforms.setNodes(editor, { url }, {
                                    at: selection
                                })
                            })
                        }
                    })

                    reader.readAsDataURL(file)
                }
            }
        } else {
            insertData(data)
        }
    }

    return editor
}
