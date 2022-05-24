import { BaseAPI } from './baseAPI'
import { APIError } from './APIError'

export enum SIGN_UP_FAIL_REASON {
    ALREADY_EXISTS,
    INVALID_EMAIL,
    INVALID_PASSWORD,
    INVALID_NICKNAME,
    NICKNAME_ALREADY_EXISTS,
    TOO_MANY_SIGN_UP_REQEUST
}

export enum SIGN_IN_FAIL_REASON {
    WRONG_EMAIL_PASSWORD,
    EMAIL_NOT_AUTHORIZED,
    TOO_MANY_REQUEST,
    TOO_MANY_EMAIL_AUTH_REQUEST
}

export enum START_PASSWORD_CHANGE_FAIL_REASON {
    INVALID_EMAIL, USER_NOT_EXISTS, TOO_MANY_REQEUST
}

export enum PASSWORD_CHANGE_FAIL_REASON {
    INVALID_PASSWORD, NO_PASSWORD_CHANGE
}

export enum VERIFY_EMAIL_FAIL_REASON {
    EXPIRED_EMAIL
}

class AutoAPI extends BaseAPI {
    async signUp (email: string, pwd: string, nickname: string) {
        const res = await this.post('/auth/sign-up', {
            email,
            pwd,
            nickname
        })
        if (res.status === 201) {
            return { success: true }
        } else if (res.status === 409001) {
            return { success: false, reason: SIGN_UP_FAIL_REASON.ALREADY_EXISTS }
        } else if (res.status === 409002) {
            return { success: false, reason: SIGN_UP_FAIL_REASON.INVALID_EMAIL }
        } else if (res.status === 409003) {
            return { success: false, reason: SIGN_UP_FAIL_REASON.INVALID_PASSWORD }
        } else if (res.status === 409004) {
            return { success: false, reason: SIGN_UP_FAIL_REASON.TOO_MANY_SIGN_UP_REQEUST }
        } else if (res.status === 409005) {
            return { success: false, reason: SIGN_UP_FAIL_REASON.INVALID_NICKNAME }
        } else if (res.status === 409006) {
            return { success: false, reason: SIGN_UP_FAIL_REASON.NICKNAME_ALREADY_EXISTS }
        }
        return { success: true }
    }

    async signIn (email: string, pwd: string) {
        const res = await this.put('/auth/sign-in', {
            email,
            pwd
        })
        if (res.status === 200) {
            return { success: true }
        } else if (res.status === 404001) {
            return { success: false, failReason: SIGN_IN_FAIL_REASON.WRONG_EMAIL_PASSWORD }
        } else if (res.status === 403001) {
            return { success: false, failReason: SIGN_IN_FAIL_REASON.TOO_MANY_REQUEST }
        } else if (res.status === 409001) {
            return { success: false, failReason: SIGN_IN_FAIL_REASON.EMAIL_NOT_AUTHORIZED }
        } else if (res.status === 409002) {
            return { success: false, failReason: SIGN_IN_FAIL_REASON.TOO_MANY_EMAIL_AUTH_REQUEST }
        }
    }

    async checkPasswordChangeExist (hash: string) {
        const res = await this.get(`/auth/password-change/${hash}`)
        if (res.status !== 200) throw new APIError(res)
        return res.data.exist
    }

    async startPasswordChange (email: string) {
        const res = await this.post('/auth/password-change', {
            email
        })
        if (res.status === 409001) {
            return { success: false, failReason: START_PASSWORD_CHANGE_FAIL_REASON.INVALID_EMAIL }
        } else if (res.status === 409002) {
            return { success: false, failReason: START_PASSWORD_CHANGE_FAIL_REASON.USER_NOT_EXISTS }
        } else if (res.status === 409003) {
            return { success: false, failReason: START_PASSWORD_CHANGE_FAIL_REASON.TOO_MANY_REQEUST }
        } else {
            return { success: true }
        }
    }

    async endPasswordChange (hash: string, pwd: string) {
        const res = await this.put('/auth/password-change', {
            hash,
            pwd
        })
        if (res.status === 409001) {
            return { success: false, failReason: PASSWORD_CHANGE_FAIL_REASON.NO_PASSWORD_CHANGE }
        } else if (res.status === 409002) {
            return { success: false, failReason: PASSWORD_CHANGE_FAIL_REASON.INVALID_PASSWORD }
        } else {
            return { success: true }
        }
    }

    async verifyEmail (hash: string) {
        const res = await this.put('/auth/verify-email', {
            hash
        })
        if (res.status === 409001) {
            return { success: false, failReason: VERIFY_EMAIL_FAIL_REASON.EXPIRED_EMAIL }
        } else {
            return { success: true }
        }
    }

    async signOut () {
        await this.delete('/auth/sign-out')
    }
}
export default new AutoAPI()
