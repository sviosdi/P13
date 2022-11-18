import HeaderNav from '../components/HeaderNav'
import Footer from '../components/Footer'

import '../assets/styles/sign-in.css'
import { useNavigate } from 'react-router-dom'

const logToAccount = () => {
    console.log('submit identifation data')
}

const Signin = () => {
    const navigate = useNavigate()

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

                        <input
                            type="button"
                            value="Sign in"
                            onClick={() => {
                                logToAccount()
                                navigate('/user')
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
