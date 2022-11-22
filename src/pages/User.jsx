import HeaderNav from '../components/HeaderNav'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/user.css'
import { useSelector } from 'react-redux'
import { connectedSelector } from '../state/userSlice'
//import { Navigate } from 'react-router-dom'

const User = () => {
    const navigate = useNavigate()
    const isConnected = useSelector(connectedSelector)
    useEffect(() => {
        if (!isConnected) {
            //console.log('déjà connecté')
            navigate('/')
        }
    }, [])

    if (!isConnected) return null // <>Vous n'êtes pas authentifié. Cette page n'est pas accessible</>

    return (
        <>
            <HeaderNav />
            <main className="main bg-dark">
                <div className="header">
                    <h1>
                        Welcome back
                        <br />
                        Tony Jarvis!
                    </h1>
                    <button className="edit-button">Edit Name</button>
                </div>
                <h2 className="sr-only">Accounts</h2>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">
                            Argent Bank Checking (x8349)
                        </h3>
                        <p className="account-amount">$2,082.79</p>
                        <p className="account-amount-description">
                            Available Balance
                        </p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">
                            View transactions
                        </button>
                    </div>
                </section>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">
                            Argent Bank Savings (x6712)
                        </h3>
                        <p className="account-amount">$10,928.42</p>
                        <p className="account-amount-description">
                            Available Balance
                        </p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">
                            View transactions
                        </button>
                    </div>
                </section>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">
                            Argent Bank Credit Card (x8349)
                        </h3>
                        <p className="account-amount">$184.30</p>
                        <p className="account-amount-description">
                            Current Balance
                        </p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">
                            View transactions
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default User
