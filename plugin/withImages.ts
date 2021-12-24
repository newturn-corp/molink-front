import { Editor, Node, Transforms } from 'slate'
import { ImageElement } from '../utils/slate'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'

const insertImage = (editor: Editor, url: string, width: number, height: number) => {
    const text = { text: '' }
    const image: ImageElement = { type: 'image', url, children: [text], width, height }
    Transforms.insertNodes(editor, image)
}

const isImageUrl = (url: string) => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

export const withImages = (editor: Editor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', (e) => {
                        const image = new Image()
                        image.src = e.target.result as string
                        image.onload = () => {
                            const url = reader.result as string
                            insertImage(editor, url, image.width, image.height)
                        }
                    })

                    reader.readAsDataURL(file)
                }
            }
        // } else if (isImageUrl(text)) {
        //     insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}
