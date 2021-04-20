import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteError, deleteSuccess, errorSelector } from "../../store/errorSlice"
import { loadingSelector, startLoading } from "../../store/loadingSlice"
import { userSelector, loginUser } from "../../store/userSlice"
import { notification } from "../notifacation/notification"
import { Button, Form, Spinner } from "react-bootstrap"
import { TAppDispatch } from "../../types/store-types"
import { useDispatch, useSelector } from "react-redux"
import { Redirect, Link } from 'react-router-dom'
import { msg } from "../../api/errorMessages"
import './Login.scss'


const Login = () => {
    const dispatch = useDispatch<TAppDispatch>()
    const user = useSelector(userSelector)
    const { isLoading } = useSelector(loadingSelector)
    const { isError, errorMessage } = useSelector(errorSelector)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    useEffect(() => {
        dispatch(deleteError())
        dispatch(deleteSuccess())
    }, [dispatch])

    const isEmpty = useMemo(() => (!email || !password), [email, password])

    const onSubmit = useCallback(async (event: any) => {
        event.preventDefault()
        if (isEmpty) return notification(msg.loginInputError)
        const userData = {
            email,
            password
        }
        dispatch(startLoading())
        dispatch(loginUser(userData))
    }, [dispatch, isEmpty, email, password])

    const handleEmail = useCallback(({ target }) => {
        setEmail(target.value)
    }, [setEmail])

    const handlePassword = useCallback(({ target }) => {
        setPassword(target.value)
    }, [setPassword])


    return (
        <div className="fs20 login animate__animated animate__bounceInDown">
            <Form className="login__form" onSubmit={onSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="label">Email address</Form.Label>
                    <Form.Control
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        onChange={handleEmail}
                        value={email}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="label">Password</Form.Label>
                    <Form.Control
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handlePassword}
                        value={password}/>
                    {isError && <Form.Text className="animate__animated animate__fadeIn form__message__error">
                        {errorMessage}
                    </Form.Text>}
                </Form.Group>
                <Button className="mb-10 fs20" disabled={isEmpty || isLoading} variant="primary" type="submit">
                    {isLoading && <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    {isLoading ? "Loading..." : "Login"}
                </Button>
            </Form>
            <Link to="/registration">
                <Button variant="success" className="fs20 btn__link__registration">
                    Registration
                </Button>
            </Link>
            {user.token && <Redirect to="/gallery"/>}
        </div>
    )
}

export default Login