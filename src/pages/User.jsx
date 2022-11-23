import HeaderNav from '../components/HeaderNav'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/user.css'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, userSelector } from '../state/userSlice'
import backendService from '../api.services/api'

const User = () => {
    const navigate = useNavigate()
    const user = useSelector(userSelector)
    const token = user.token
    const dispatch = useDispatch()
    useEffect(() => {
        if (token === null) {
            console.log('non authentifié')
            navigate('/')
        } else {
            const fetchData = (token) => backendService.getProfile(token)

            fetchData(token).then((data) => {
                if (data.ok) dispatch(registerUser(data))
                else {
                    console.log('erreur de récup des données utilisateur')
                }
            })
        }
    }, [])

    return (
        <>
            <HeaderNav />
            <main className="main bg-dark">
                <div className="header">
                    <h1>
                        Welcome back
                        <br />
                        {user.firstname} {user.lastname}
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
