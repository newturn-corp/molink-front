import { Editor } from 'slate'
import ImageManager from '../../manager/Editing/ImageManager'

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
                    ImageManager.insertImage(event.target.result as string)
                })

                reader.readAsDataURL(file)
            }
        }
        return true
    } else if (ImageManager.isImageUrl(text)) {
        ImageManager.insertImage(text)
        return true
    }
    return false
}
