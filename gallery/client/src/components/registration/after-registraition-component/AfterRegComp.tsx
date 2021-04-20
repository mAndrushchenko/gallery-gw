import React from 'react'
import { Button, Card } from "react-bootstrap"
import { Link } from 'react-router-dom'
import './AfterRegComp.scss'


const AfterRegComp = () => {

    return (
        <Card className="registration__card animate__animated animate__bounceInDown">
            <Card.Header className="registration__card__header" as="h5">Great! ✅</Card.Header>
            <Card.Body className="registration__card__body">
                <Card.Title>You have been registered successfully!</Card.Title>
                <Card.Text>
                    If you want to continue - just login! 🙂
                </Card.Text>
                <Link to="/login">
                    <Button className="btn__card__login" variant="primary">Login</Button>
                </Link>
            </Card.Body>
        </Card>
    )
}

export default AfterRegComp