import { BaseAPI } from './baseAPI'
import {
    ChangePageVisibilityDTO,
    CreatePageInBlogDTO,
    HierarchyDocumentInfoInterface, SetHeaderIconActiveDTO
} from '@newturn-develop/types-molink'
import { APIError } from './APIError'
import { ChildrenVisibilityWide, PageNotExists, ParentVisibilityNarrow } from '../Errors/HierarchyError'

class HierarchyAPI extends BaseAPI {
    async changePageVisibility (dto: ChangePageVisibilityDTO) {
        const res = await this.put('/hierarchy/visibility', dto)
        if (res.status === 404000) {
            throw new PageNotExists()
        } else if (res.status === 409000) {
            throw new ParentVisibilityNarrow()
        } else if (res.status === 409001) {
            throw new ChildrenVisibilityWide()
        } else if (res.status !== 200) {
            throw new APIError(res)
        }
        return true
    }

    async setBlogHeaderIconActive (dto: SetHeaderIconActiveDTO) {
        await this.put('/hierarchy/header-icon-active', dto)
    }

    async createPageInBlog (dto: CreatePageInBlogDTO): Promise<HierarchyDocumentInfoInterface> {
        const res = await this.post('/hierarchy/pages', dto)
        return res.data
    }
}
export default new HierarchyAPI()
