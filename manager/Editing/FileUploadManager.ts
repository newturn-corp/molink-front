import ContentAPI from '../../api/ContentAPI'
import { UploadContentImageDto } from '../../DTO/ContentDTO'

class FileUploadManager {
    async uploadContentImage (image: File) {
        const { url } = await ContentAPI.uploadContentImage(new UploadContentImageDto(image))
        return url
    }
}
export default new FileUploadManager()
