import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteError, deleteSuccess, errorSelector } from "../../store/errorSlice"
import { endLoading, loadingSelector, startLoading } from "../../store/loadingSlice"
import AfterRegComp from './after-registraition-component/AfterRegComp'
import { notification } from "../notifacation/notification"
import { Button, Form, Spinner } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { TAppDispatch } from "../../types/store-types"
import { registerUser } from "../../store/userSlice"
import { msg } from "../../api/errorMessages"
import { TCandidate } from "../../types/user"
import './Registration.scss'


const Registration = () => {
    const dispatch = useDispatch<TAppDispatch>()
    const { isError, errorMessage, isSuccess } = useSelector(errorSelector)
    const { isLoading } = useSelector(loadingSelector)

    const [firstNameError, setFirstNameError] = useState<boolean>(false)
    const [lastNameError, setLastNameError] = useState<boolean>(false)
    const [emailError, setEmailError] = useState<boolean>(false)
    const [firstPasswordError, setFirstPasswordError] = useState<boolean>(false)
    const [secondPasswordError, setSecondPasswordError] = useState<boolean>(false)

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [firstPassword, setFirstPassword] = useState<string>('')
    const [secondPassword, setSecondPassword] = useState<string>('')

    useEffect(() => {
        dispatch(deleteError())
        dispatch(deleteSuccess())
        dispatch(endLoading())
    }, [dispatch])

    const isFormInvalid = useMemo(() => (
        firstNameError || lastNameError || emailError ||
        firstPasswordError || secondPasswordError ||
        !firstName || !lastName || !email ||
        !firstPassword || !secondPassword), [
        firstNameError, lastNameError, emailError, firstPasswordError, secondPasswordError,
        firstName, lastName, email, firstPassword, secondPassword
    ])

    const hoverError = useCallback(() => {
        dispatch(deleteError())
    }, [dispatch])

    const onSubmit = async (event: any) => {
        event.preventDefault()
        dispatch(deleteError())
        if (isFormInvalid) return notification(msg.registerDataError)

        const candidate: TCandidate = {
            email,
            firstName,
            lastName,
            password: firstPassword,
            albums: [],
            photos: [],
        }
        dispatch(startLoading())
        dispatch(registerUser(candidate))
    }

    /*  Start validation functions */
    const checkName = useCallback((name: string) => (
        name.length >= 2 &&
        name.match(/^([A-Z][a-z]+)$|^([А-ЯІЇҐЄ][а-яіґє]+)$/)
    ), [])

    const checkEmail = useCallback((email: string) => (
        email.length >= 4 &&
        email.length <= 320 &&
        email.match(/^[a-zA-Z]+[0-9]*([.\-_]?[0-9]*[a-zA-Z]+[0-9]*)*@([.\-_]?[0-9]*[a-zA-Z]+[0-9]*)+\.[a-zA-Z]+$/)
    ), [])

    const checkPassword = useCallback((password: string) => (
        password.length >= 6 &&
        password.match(/((?=.*[a-z])|(?=.*[а-я])).*((?=.*[A-Z])|(?=.*[А-Я])).*(?=.*\d).*/)
    ), [])

    const isPasswordsMatch = useCallback((password: string, repeatPassword: string) => (
        password === repeatPassword
    ), [])
    /*  End validation functions */

    const handleFirstName = useCallback(({ target }) => {
        setFirstName(target.value)
        setFirstNameError(!checkName(target.value))
    }, [checkName, setFirstName, setFirstNameError])

    const handleLastName = useCallback(({ target }) => {
        setLastName(target.value)
        setLastNameError(!checkName(target.value))
    }, [checkName, setLastName, setLastNameError])

    const handleEmail = useCallback(({ target }) => {
        setEmail(target.value)
        setEmailError(!checkEmail(target.value))
    }, [checkEmail, setEmail, setEmailError])

    const handleFirstPassword = useCallback(({ target }) => {
        setFirstPassword(target.value)
        setFirstPasswordError(!checkPassword(target.value))
        if (secondPassword) setSecondPasswordError(!isPasswordsMatch(firstPassword, target.value))
    }, [setFirstPassword, setFirstPasswordError, secondPassword, checkPassword, firstPassword, isPasswordsMatch])

    const handleSecondPassword = useCallback(({ target }) => {
        setSecondPassword(target.value)
        setSecondPasswordError(!isPasswordsMatch(firstPassword, target.value))
    }, [setSecondPassword, setSecondPasswordError, firstPassword, isPasswordsMatch])


    return (
        <>
            {!isSuccess && <div className="registration animate__animated animate__bounceInLeft">
                <Form className="fs20 registration__form">
                    <Form.Group>
                        <Form.Label className="label">Email</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            className={emailError ? 'form__input__error' : ''}
                            value={email}
                            onChange={handleEmail}/>
                        {emailError && <Form.Text
                            className="animate__animated animate__fadeIn form__message__error">
                            You can use only english letters with
                            numbers, dots, underscores or hyphens.
                        </Form.Text>}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="label">Name</Form.Label>
                        <Form.Control
                            name="firstName"
                            type="text"
                            placeholder="First name"
                            className={`mb-10 ${firstNameError ? 'form__input__error' : ''}`}
                            value={firstName}
                            onChange={handleFirstName}/>
                        <Form.Control
                            name="lastName"
                            type="text"
                            placeholder="Last name"
                            className={lastNameError ? 'form__input__error' : ''}
                            value={lastName}
                            onChange={handleLastName}/>
                        {(firstNameError || lastNameError) && <Form.Text
                            className="animate__animated animate__fadeIn form__message__error">
                            First and last name must contain only english letters or cyrillic and start with letter in
                            uppercase.
                        </Form.Text>}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="label">Password</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleFirstPassword}
                            value={firstPassword}
                            className={`mb-10 ${firstPasswordError ? 'form__input__error' : ''}`}/>
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="Repeat password"
                            className={secondPasswordError ? 'form__input__error' : ''}
                            value={secondPassword}
                            onChange={handleSecondPassword}/>
                        {firstPasswordError && <Form.Text
                            className="animate__animated animate__fadeIn form__message__error">
                            Password must contain letters in lowercase and uppercase
                            with numbers (more than six symbols).
                        </Form.Text>}
                        {secondPasswordError && <Form.Text
                            className="animate__animated animate__fadeIn form__message__error">
                            Passwords must be equal.
                        </Form.Text>}
                        {isError && <Form.Text
                            onClick={hoverError}
                            className="animate__animated animate__fadeIn form__message__error">
                            {errorMessage}
                        </Form.Text>}
                    </Form.Group>

                    <Button onClick={onSubmit} disabled={isFormInvalid || isLoading} variant="primary" type="submit"
                            className="fs20 form__btn__submit">
                        {isLoading && <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />}
                        {isLoading ? "Loading..." : "Register"}
                    </Button>
                </Form>
            </div>}
            {isSuccess && <AfterRegComp/>}
        </>
    )
}

export default Registration