import Footer from '../components/Footer'
import HeaderNav from '../components/HeaderNav'

import chat from '../assets/img/icon-chat.png'
import money from '../assets/img/icon-money.png'
import security from '../assets/img/icon-chat.png'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../state/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { storageChangeHandler } from './Signin'

const Homepage = () => {
    const token = useSelector(userSelector).token
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        // Lors de l'accès à la page: le state est rétabli à partir de localStorage
        // dans le cas où la page est rechargée et si l'utilisateur est enregistré
        if (token !== null) {
            // un utilisateur est déjà connecté ou enregistré
            // console.log(
            //     "accès à 'homepage' alors qu'un utilisateur est déjà enregistré"
            // )

            if (!window.onstorage) {
                // console.log('ajouter le listener sur le storage')
                const registred_user = JSON.parse(
                    window.localStorage.getItem('registred')
                )
                window.my_data = {
                    dispatch,
                    username: registred_user.username,
                    navigate,
                }
                window.onstorage = storageChangeHandler
            } else {
                // console.log('un listener sur le storage est déjà enregistré')
            }
        }
    }, [null])

    return (
        <>
            <HeaderNav />
            <main>
                <div className="hero">
                    <section className="hero-content">
                        <h2 className="sr-only">Promoted Content</h2>
                        <p className="subtitle">No fees.</p>
                        <p className="subtitle">No minimum deposit.</p>
                        <p className="subtitle">High interest rates.</p>
                        <p className="text">
                            Open a savings account with Argent Bank today!
                        </p>
                    </section>
                </div>
                <section className="features">
                    <h2 className="sr-only">Features</h2>
                    <div className="feature-item">
                        <img
                            src={chat}
                            alt="Chat Icon"
                            className="feature-icon"
                        />
                        <h3 className="feature-item-title">
                            You are our #1 priority
                        </h3>
                        <p>
                            Need to talk to a representative? You can get in
                            touch through our 24/7 chat or through a phone call
                            in less than 5 minutes.
                        </p>
                    </div>
                    <div className="feature-item">
                        <img
                            src={money}
                            alt="Chat Icon"
                            className="feature-icon"
                        />
                        <h3 className="feature-item-title">
                            More savings means higher rates
                        </h3>
                        <p>
                            The more you save with us, the higher your interest
                            rate will be!
                        </p>
                    </div>
                    <div className="feature-item">
                        <img
                            src={security}
                            alt="Chat Icon"
                            className="feature-icon"
                        />
                        <h3 className="feature-item-title">
                            Security you can trust
                        </h3>
                        <p>
                            We use top of the line encryption to make sure your
                            data and money is always safe.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Homepage
