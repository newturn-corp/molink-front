import ImageManager from './ImageManager'
import React from 'react'

class ToolbarManager {
    async insertImage (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await ImageManager.getURLAndFileFromInputEvent(event)
        await ImageManager.insertImage(url, file)
    }
}
export default new ToolbarManager()
