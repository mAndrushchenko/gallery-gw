import { useCallback, useEffect } from "react"
import { loginUserByToken } from "../store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { TAppDispatch } from "../types/store-types"
import { deleteToken, setToken, tokenSelector } from "../store/tokenSlice"

const tokenName = 'token'

export const useAuth = () => {
    const { token } = useSelector(tokenSelector)
    const dispatch = useDispatch<TAppDispatch>()

    const login = useCallback((jwtToken: string | null) => {
        if (jwtToken) {
            dispatch(setToken({ token: jwtToken }))
            document.cookie = `${tokenName}=${jwtToken}`
        }
    }, [dispatch])

    const logout = useCallback(() => {
        dispatch(deleteToken())
        document.cookie = `${tokenName}=`
    }, [dispatch])

    const getItem = useCallback((key: string): string | null => {
        let currentToken: string | null = null
        document.cookie.split("; ").forEach((field: string) => {
            const currentField = field.split('=')
            if (key === currentField[0]) currentToken = currentField[1]
        })
        return currentToken
    },[])

    useEffect(() => {
        const newToken = getItem(tokenName)
        if (newToken) dispatch(setToken({token: newToken}))
    }, [dispatch, getItem])

    useEffect(() => {
        if (token) {
            login(token)
            dispatch(loginUserByToken({ token }))
        }
    }, [dispatch, login, token])


    const isTokenExist = useCallback(() => {
        const newToken = getItem(tokenName)
        dispatch(setToken({token: newToken}))
    }, [dispatch, getItem])

    return { login, logout, isTokenExist }
}

