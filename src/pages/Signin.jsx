import { useNavigate, redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import HeaderNav from '../components/HeaderNav'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import {
    connectAsync,
    connectedSelector,
    register,
    disconnect,
} from '../state/userSlice'

import '../assets/styles/sign-in.css'

export const storageChangeHandler = (event) => {
    const connected = JSON.parse(localStorage.getItem('connected'))
    if (!connected.includes(event.currentTarget.my_data.username)) {
        event.currentTarget.my_data.dispatch(disconnect())
        event.currentTarget.my_data.navigate('/')
    }
}

const addToConnectedUsers = (username) => {
    let connected = localStorage.getItem('connected')
    if (connected === null) connected = []
    else {
        connected = JSON.parse(connected)
    }
    if (!connected.includes(username)) {
        connected.push(username)
        localStorage.setItem('connected', JSON.stringify(connected))
    }
}

const Signin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [errno, setErrno] = useState(0) // 0: pas d'erreurs, 1: mauvais identifiants, 2: server down, 3: connexion refusée
    const isConnected = useSelector(connectedSelector)
    useEffect(() => {
        if (isConnected) {
            //console.log('déjà connecté')
            navigate('/')
        }
    }, [])

    if (isConnected) return null
    return (
        <>
            <HeaderNav />
            <main className="main bg-dark">
                <section className="sign-in-content">
                    <i className="fa fa-user-circle sign-in-icon"></i>
                    <h1>Sign In</h1>
                    <form>
                        <div className="input-wrapper">
                            <label htmlFor="username">Username</label>
                            <input
                                autoComplete="username"
                                type="text"
                                id="username"
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password">Password</label>
                            <input
                                autoComplete="current-password"
                                type="password"
                                id="password"
                            />
                        </div>
                        <div className="input-remember">
                            <input type="checkbox" id="remember-me" />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        {errno === 1 ? (
                            <div className="bad-connect">
                                Incorrect username or password.
                            </div>
                        ) : errno === 2 ? (
                            <div className="bad-connect">
                                The server seems to be down.
                            </div>
                        ) : errno === 3 ? (
                            <div className="bad-connect">
                                You can't sign-in with 'remember me' : another
                                user is already registred on this browser
                            </div>
                        ) : (
                            ''
                        )}
                        <input
                            type="button"
                            value="Sign in"
                            onClick={() => {
                                const remember =
                                    document.getElementById(
                                        'remember-me'
                                    ).checked
                                const username = document
                                    .getElementById('username')
                                    .value.toLowerCase()
                                    .trim()
                                const password = document
                                    .getElementById('password')
                                    .value.trim()
                                const user = {
                                    username,
                                    password,
                                }
                                const status = dispatch(connectAsync(user))
                                status.then((authData) => {
                                    if (authData.posted && authData.ok) {
                                        // utilisateur correctement authentifié
                                        window.my_data = {
                                            dispatch,
                                            username,
                                            navigate,
                                        }

                                        window.addEventListener(
                                            'storage',
                                            storageChangeHandler
                                        )
                                        setErrno(1)
                                        setErrno(2)
                                        const registred = JSON.parse(
                                            localStorage.getItem('registred')
                                        )
                                        const to_register = {
                                            token: authData.token,
                                            username,
                                        }
                                        if (registred === null) {
                                            // aucun utilisateur n'est encore enregistré
                                            // accepter la connexion
                                            // mettre à jour le state
                                            dispatch(register(to_register))
                                            addToConnectedUsers(username)
                                            if (remember) {
                                                // enregistrer l'utilisateur
                                                localStorage.setItem(
                                                    'registred',
                                                    JSON.stringify(to_register)
                                                )
                                            }
                                            navigate('/user')
                                        } else {
                                            // un utilisateur est déjà enregistré
                                            if (
                                                // autre utilisateur que celui enregistré
                                                username !== registred.username
                                            ) {
                                                if (remember === false) {
                                                    // accepter la connexion
                                                    // mettre à jour le state
                                                    dispatch(
                                                        register(to_register)
                                                    )
                                                    addToConnectedUsers(
                                                        username
                                                    )
                                                    navigate('/user')
                                                } else {
                                                    //refuser la connexion
                                                    window.removeEventListener(
                                                        'storage',
                                                        storageChangeHandler
                                                    )
                                                    setErrno(3)
                                                }
                                            } else {
                                                // même utilisateur que celui enregistré
                                                dispatch(register(to_register))
                                                navigate('/user')
                                            }
                                        }
                                    } else if (authData.posted && !authData.ok)
                                        setErrno(1)
                                    else setErrno(2)
                                })
                            }}
                            className="sign-in-button"
                        />
                    </form>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Signin
