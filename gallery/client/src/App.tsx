import React from 'react'
import Registration from "./components/registration/Registration"
import ReactNotification from "react-notifications-component"
import { BrowserRouter as Router } from "react-router-dom"
import { Route, Switch, Redirect } from 'react-router-dom'
import { store } from "./store/configure-store"
import Gallery from "./components/gallery/Gallery"
import Header from "./components/header/Header"
import Login from "./components/login/Login"
import Home from './components/home/Home'
import { Provider } from "react-redux"
import 'animate.css/animate.css'
import './App.scss'

export const App = () => {

    return (
        <Provider store={store}>
            <ReactNotification className="notification"/>
            <div className="app">
                <Header/>
                <section className="content">
                    <Router>
                        <Switch>
                            <Route
                                path='/login'
                                exact
                                component={Login}
                            />
                            <Route
                                path='/registration'
                                component={Registration}
                            />
                            <Route
                                exact
                                path='/'
                                component={Home}
                            />
                            <Route
                                path='/gallery'
                                exact
                                component={Gallery}
                            />
                            <Redirect to='/'/>
                        </Switch>
                    </Router>
                </section>
            </div>
        </Provider>


    )
}

export default App
