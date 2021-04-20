import React, { useEffect } from 'react'
import { prevUserStateSelector } from "../../store/prevUserState"
import { setUser, userSelector } from "../../store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { TAppDispatch } from "../../types/store-types"
import { errorSelector } from "../../store/errorSlice"
import { tokenSelector } from "../../store/tokenSlice"
import { useAuth } from "../../hooks/useAuth"
import { Navbar, Nav } from "react-bootstrap"
import './Header.scss'

const Header = () => {
    const { token } = useSelector(tokenSelector)
    const { firstName, lastName, token: userToken } = useSelector(userSelector)
    const { login, logout, isTokenExist } = useAuth()
    const prevState = useSelector(prevUserStateSelector)
    const dispatch = useDispatch<TAppDispatch>()
    const { isError } = useSelector(errorSelector)

    useEffect(() => {
        if (isError) {
            dispatch(setUser(prevState))
        }
    }, [dispatch, isError, prevState])

    useEffect(() => {
        isTokenExist()
        if (userToken) login(userToken)
    }, [token, login, userToken, isTokenExist])

    return (
        <header>
            <Navbar className="navbar" variant="dark">
                <Navbar.Brand href="/">
                    <span className="logo">Gallery</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {token && <Nav.Link href="/gallery">{firstName} {lastName}</Nav.Link>}
                    </Nav>
                    <Nav>
                        {token ? <Nav.Link href="/" onClick={logout}>Logout</Nav.Link> :
                            <Nav.Link href="/login">Login</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    )
}

export default Header