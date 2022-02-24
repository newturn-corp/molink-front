import MainAPI from '../../api/MainAPI'
import { UploadImageDTO, UploadImageFromURLDTO } from '@newturn-develop/types-molink'

class FileUploadManager {
    async uploadImage (image: File) {
        const { url } = await MainAPI.uploadImage(new UploadImageDTO(image))
        return url
    }

    async uploadImageFromURL (imageUrl: string) {
        const { url } = await MainAPI.uploadImageFromURL(new UploadImageFromURLDTO(imageUrl))
        return url
    }
}
export default new FileUploadManager()
