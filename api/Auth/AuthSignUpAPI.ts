import { BaseAPI } from '../baseAPI'
import { SendSignUpAuthEmailDTO } from '@newturn-develop/types-molink'
import { TooManyEmailRequest, UserAlreadyAuthorized } from '../../Errors/AuthError'
import { UserNotExists } from '../../Errors/UserError'

class AuthSignUpAPI extends BaseAPI {
    async sendSignUpAuthEmail (dto: SendSignUpAuthEmailDTO) {
        const res = await this.post('/auth/send-sign-up-auth-email', dto)
        if (res.status === 409001 || res.status === 409003) {
            throw new TooManyEmailRequest()
        } else if (res.status === 409002) {
            throw new UserAlreadyAuthorized()
        } else if (res.status === 404001) {
            throw new UserNotExists()
        }
    }
}
export default new AuthSignUpAPI()
