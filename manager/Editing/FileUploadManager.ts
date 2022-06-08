import { ChangePageFileRelationshipDTO } from '@newturn-develop/types-molink'
import * as filestack from 'filestack-js'
import UserManager from '../global/User/UserManager'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import FileAPI from '../../api/FileAPI'
import { UserAuthorizationParam } from '../global/Event/EventParams'
import { isNumber } from 'lodash'
import EditorPage from '../Blog/Editor/EditorPage'
import Blog from '../global/Blog/Blog'
const client = filestack.init(process.env.FILE_API_KEY)

class UploadManager {
    policy: string = ''
    signature: string = ''

    constructor () {
        EventManager.addEventListener(Event.UserAuthorization, async ({ result }: UserAuthorizationParam) => {
            if (result === true) {
                await this.handleUserAuthorization()
            }
        }, 1)
        EventManager.addEventListener(Event.SignOut, () => {
            this.handleSignOut()
        }, 1)
    }

    private async handleUserAuthorization () {
        const dto = await FileAPI.getFileSecurity()
        this.policy = dto.policy
        this.signature = dto.signature
    }

    private handleSignOut () {
        this.policy = ''
        this.signature = ''
    }

    getTag () {
        return {
            userId: UserManager.userId.toString(),
            pageId: EditorPage.pageId,
            visibility: Blog.pageHierarchy.openedPage.visibility
        }
    }

    public uploadFile (url: string, file?: File) {
        if (file) {
            return this._uploadFile(file)
        } else {
            return this._uploadFileFromURL(url)
        }
    }

    async _uploadFile (file: File) {
        const pageId = EditorPage.pageId
        const result = await client.upload(file, {
            tags: this.getTag()
        }, {}, {}, {
            policy: this.policy,
            signature: this.signature
        })
        const { url, size } = result
        if (isNumber(size)) {
            UserManager.limit.handleFileUpload(size)
        }
        const handle = url.split('/').pop()
        await FileAPI.addPageFileRelationship(new ChangePageFileRelationshipDTO(pageId, handle))
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.split('.').pop() === 'docx') {
            return {
                url: `${process.env.SERVER_BASE_URL}/files/docx/${handle}`,
                size
            }
        } else {
            return {
                url: `${process.env.SERVER_BASE_URL}/files/${handle}`,
                size
            }
        }
    }

    async _uploadFileFromURL (fileUrl: string) {
        const pageId = EditorPage.pageId
        const result = await client.storeURL(fileUrl, {
            location: 's3'
        }, {}, {
            policy: this.policy,
            signature: this.signature
        }, this.getTag()) as any
        const { url, size } = result
        if (isNumber(size)) {
            UserManager.limit.handleFileUpload(size)
        }
        const handle = url.split('/').pop()
        await FileAPI.addPageFileRelationship(new ChangePageFileRelationshipDTO(pageId, handle))
        return {
            url: `${process.env.SERVER_BASE_URL}/files/${handle}`,
            size: size
        }
    }
}
export default new UploadManager()
