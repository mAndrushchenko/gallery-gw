import { IEndpoint } from "../types/api"
import { notification } from "../components/notifacation/notification"


export const request = async ({ uri, method = 'GET', body, token, headers = {} }: IEndpoint): Promise<any> => {
    try {
        if (body) {
            body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json'
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response: Response = await fetch(uri, { method, body, headers })
        const status = response.ok
        const statusNumber = response.status

        if (!status) {
            const data = await response.json()
            const message = data.message
            notification(message)
            throw new Error(message || 'Something wrong...')
        }
        if (statusNumber !== 204) {
            const userData = await response.json()
            return { status, statusNumber, userData }
        }

        return { status, statusNumber, userData: {} }
    } catch (err) {
        return { message: err.message }
    }
}

