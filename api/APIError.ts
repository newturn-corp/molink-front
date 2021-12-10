import { NetworkMessage } from './baseAPI'

export class APIError extends Error {
  status: number

  constructor (res: NetworkMessage) {
      super(`${res.msg instanceof Object ? res.msg.message : res.msg}`)
      this.name = '오류'
      this.status = res.status
  }
}

export class AuthError extends Error {
    constructor () {
        super('인증정보가 유효하지 않습니다!')
    }
}

export class ServiceError extends Error {
    constructor () {
        super('서버에 문제가 발생했습니다! 슈퍼바이저에게 문의해주세요.')
    }
}

export class NetworkError extends Error {
    constructor () {
        super('네트워크 요청에 실패했습니다! 인터넷 연결을 확인해주세요.')
    }
}
