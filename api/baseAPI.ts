import { SERVER_BASE_URL } from '../infra/constants'
import { AuthError, NetworkError, ServiceError } from './APIError'

export interface NetworkMessage {
  status: number
  data?: any
  arr?: any
  msg?:
    | string
    | {
        message: string
        name: string
      }
}

export abstract class BaseAPI {
    get commonHeaders () {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        return headers
    }

    protected async get (path: string): Promise<NetworkMessage> {
        let res
        try {
            res = await fetch(`${SERVER_BASE_URL}${path}`, {
                method: 'GET',
                headers: this.commonHeaders,
                credentials: 'include'
            })
        } catch (e) {
            throw new NetworkError()
        }
        if (res.status === 500) throw new ServiceError()
        if (res.status === 401) {
            throw new AuthError()
        }
        return res.json()
    }

    protected async post (path: string, body?: object): Promise<NetworkMessage> {
        let res
        try {
            res = await fetch(`${SERVER_BASE_URL}${path}`, {
                method: 'POST',
                headers: this.commonHeaders,
                body: JSON.stringify(body),
                credentials: 'include'
            })
        } catch (e) {
            throw new NetworkError()
        }
        if (res.status === 500) throw new ServiceError()
        return res.json()
    }

    protected async put (path: string, body: object): Promise<NetworkMessage> {
        let res: Response
        try {
            res = await fetch(`${SERVER_BASE_URL}${path}`, {
                method: 'PUT',
                headers: this.commonHeaders,
                body: JSON.stringify(body),
                credentials: 'include'
            })
        } catch (e) {
            throw new NetworkError()
        }
        if (res.status === 500) throw new ServiceError()
        return res.json()
    }

    private async useFormData (
        method: 'POST' | 'PUT',
        path: string,
        body: object,
        isCustomURL: boolean = false
    ): Promise<NetworkMessage> {
        const formData = new FormData()
        // eslint-disable-next-line
    for (const [k, v] of Object.entries(body)) {
            formData.append(k, v)
        }
        // remove content-type header from headers
        // so that browser can inject content-type with boundary definition
        // https://stackoverflow.com/a/35799817/3535760
        const headers = this.commonHeaders
        delete headers['Content-Type']
        let res
        try {
            res = await fetch(isCustomURL ? path : `${SERVER_BASE_URL}${path}`, {
                method,
                headers,
                body: formData,
                credentials: 'include'
            })
        } catch (e) {
            throw new NetworkError()
        }
        if (res.status === 500) throw new ServiceError()
        return res.json()
    }

    protected async postFormData (
        path: string,
        body: object,
        isCustomURL: boolean = false
    ): Promise<NetworkMessage> {
        return this.useFormData('POST', path, body, isCustomURL)
    }

    protected async putFormData (
        path: string,
        body: object
    ): Promise<NetworkMessage> {
        return this.useFormData('PUT', path, body)
    }

    protected async delete (
        path: string,
        body: object = {}
    ): Promise<NetworkMessage> {
        let res
        try {
            res = await fetch(`${SERVER_BASE_URL}${path}`, {
                method: 'DELETE',
                headers: this.commonHeaders,
                body: JSON.stringify(body),
                credentials: 'include'
            })
        } catch (e) {
            throw new NetworkError()
        }
        if (res.status === 500) throw new ServiceError()
        return res.json()
    }
}
