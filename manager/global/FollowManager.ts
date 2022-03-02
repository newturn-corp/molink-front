import { FollowRequest } from '../../domain/FollowRequest'
import FollowAPI from '../../api/FollowAPI'

class FollowManager {
    followRequests: FollowRequest[] = []
    get viewedFollowRequestsLength () {
        return this.followRequests.filter(req => !req.isViewed).length
    }

    // constructor () {
    //     // FollowAPI.getFollowRequests().then(arr => {
    //     //     this.followRequests = arr
    //     // })
    // }

    async checkFollowRequestsViewed () {
        await FollowAPI.setFollowRequestsViewedAt()
        this.followRequests.forEach(request => {
            request.isViewed = true
        })
    }
}
export default new FollowManager()
