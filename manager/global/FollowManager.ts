import { FollowRequest } from '../../domain/FollowRequest'
import FollowAPI from '../../api/FollowAPI'

class FollowManager {
    followRequests: FollowRequest[] = []
    get viewedFollowRequestsLength () {
        return this.followRequests.filter(req => !req.isViewed).length
    }
}
export default new FollowManager()
