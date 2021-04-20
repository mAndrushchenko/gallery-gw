import React, { useEffect } from 'react'
import './Home.scss'
import { Button } from "react-bootstrap"
import { useSelector } from "react-redux"
import { tokenSelector } from "../../store/tokenSlice"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"


const Home = () => {
    const { token } = useSelector(tokenSelector)
    const { isTokenExist } = useAuth()

    useEffect(() => {
        isTokenExist()
    }, [isTokenExist])

    return (
        <div className="home__container fs20">
            {!token && <div className="home animate__animated animate__backInDown animate__delay-0.2s animate__faster">
                <h1>Welcome to <span className="logo fs60">Gallery</span></h1>
                    <p>If you want to try how simple to use our app, just register to get start!</p>
                <Link to="/registration">
                    <Button variant="success" className="fs20 mb-10 btn__link">
                        Registration
                    </Button>
                </Link>
                <p>Are you already with us? Then login!</p>
                <Link to="/login">
                    <Button variant="primary" className="fs20 btn__link">
                        Login
                    </Button>
                </Link>
            </div>}
            {token && <div
                className="home__after__login  animate__animated animate__fadeInRight animate__delay-0.2s animate__faster"
            >
                <span className="mb-10">Well, how's your work coming along?</span>
                <p>Oh, maybe miss your Gallery? Don't afraid, click!</p>
                <Link to="/gallery">
                    <Button variant="outline-primary" className="fs20 mb-10 btn__link">
                        My Gallery
                    </Button>
                </Link>
            </div>}
        </div>
    )
}

export default Home