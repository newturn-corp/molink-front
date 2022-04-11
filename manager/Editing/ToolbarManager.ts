import React from 'react'
import FileManager from './FileManager'

class ToolbarManager {
    async insertImage (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await FileManager.getURLAndFileFromInputEvent(event)
        await FileManager.insertImage(url, file)
    }

    async insertVideo (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await FileManager.getURLAndFileFromInputEvent(event)
        await FileManager.insertVideo(url, file)
    }

    async insertFile (event: React.ChangeEvent<HTMLInputElement>) {
        const { url, file } = await FileManager.getURLAndFileFromInputEvent(event)
        await FileManager.insertFile(url, file)
    }
}
export default new ToolbarManager()
