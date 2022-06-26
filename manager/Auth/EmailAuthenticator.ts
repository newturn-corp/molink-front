import AuthSignUpAPI from '../../api/Auth/AuthSignUpAPI'
import { SendSignUpAuthEmailDTO } from '@newturn-develop/types-molink'
import { TooManyEmailRequest, UserAlreadyAuthorized } from '../../Errors/AuthError'
import { UserNotExists } from '../../Errors/UserError'
import ModalManager, { Modal, ModalButton } from '../global/ModalManager'
import RoutingManager, { Page } from '../global/RoutingManager'

class EmailAuthenticator {
    async sendSignUpAuthEmail (email: string) {
        try {
            await AuthSignUpAPI.sendSignUpAuthEmail(new SendSignUpAuthEmailDTO(email))
            return { success: true }
        } catch (err) {
            if (err instanceof TooManyEmailRequest) {
                await ModalManager.openDefaultModal('너무 많이 요청함.', '잠시 뒤에 다시 시도해주세요.', [new ModalButton('확인', () => {
                    ModalManager.close(Modal.Default)
                })])
            } else if (err instanceof UserNotExists) {
                await ModalManager.openDefaultModal('사용자가 존재하지 않습니다.', '회원 가입 화면으로 이동합니다.', [new ModalButton('확인', () => {
                    ModalManager.close(Modal.Default)
                    RoutingManager.moveTo(Page.SignUp)
                })])
            } else if (err instanceof UserAlreadyAuthorized) {
                await ModalManager.openDefaultModal('이미 인증된 이메일입니다.', '로그인 화면으로 이동합니다.', [new ModalButton('확인', () => {
                    ModalManager.close(Modal.Default)
                    RoutingManager.moveTo(Page.SignIn)
                })])
            }
            return { success: false }
        }
    }
}
export default new EmailAuthenticator()
