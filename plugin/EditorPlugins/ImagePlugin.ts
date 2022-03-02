import { Editor, Transforms } from 'slate'
import { ImageFloatOption, SlateImageElementType } from '../../Types/slate/CustomElement'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import FileUploadManager from '../../manager/Editing/FileUploadManager'
import StyleManager from '../../manager/global/Style/StyleManager'

const insertImage = (editor: Editor, image: HTMLImageElement) => {
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
}

const isImageUrl = (url: string) => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

export const InsertImageWhenInsertData = (editor: Editor, data) => {
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
                        insertImage(editor, image)
                        const selection = editor.selection
                        FileUploadManager.uploadImage(file).then((url) => {
                            Transforms.setNodes(editor,
                                {
                                    url,
                                    isUploading: false
                                }, {
                                    at: selection
                                })
                        })
                    }
                })

                reader.readAsDataURL(file)
            }
        }
        return true
    } else if (isImageUrl(text)) {
        const image = new Image()
        image.src = text
        image.onload = () => {
            insertImage(editor, image)
            const selection = editor.selection
            FileUploadManager.uploadImageFromURL(image.src).then((url) => {
                Transforms.setNodes(editor,
                    {
                        url,
                        isUploading: false
                    }, {
                        at: selection
                    })
            })
        }
        return true
    }
    return false
}
