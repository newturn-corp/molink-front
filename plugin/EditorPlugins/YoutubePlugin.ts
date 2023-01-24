import { Editor, Transforms } from 'slate'

export const insertYoutubeWhenInsertData = (editor: Editor, data: DataTransfer) => {
    const text = data.getData('text/plain')
    const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/
    const matches = text.match(youtubeRegex)
    if (text && text !== '' && matches) {
        const [_, videoId] = matches
        Transforms.insertNodes(editor, [{
            type: 'youtube',
            videoId,
            children: [{
                text: ''
            }]
        }])
        return true
    }
    return false
}
