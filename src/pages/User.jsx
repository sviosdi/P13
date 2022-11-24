import HeaderNav from '../components/HeaderNav'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/user.css'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, updateName, userSelector } from '../state/userSlice'
import backendService from '../api.services/api'
import { storageChangeHandler } from './Signin'

const User = () => {
    const navigate = useNavigate()
    const user = useSelector(userSelector)
    const token = user.token
    const dispatch = useDispatch()
    const [name, setName] = useState({
        firstName: '',
        lastName: '',
    })

    let titleMessage = `${user.firstname} ${user.lastname}`

    const title = document.querySelector('#header-title')
    const editButton = document.querySelector('#edit-name')
    const editZone = document.querySelector('.edit')

    useEffect(() => {
        if (token === null) {
            // console.log('non authentifié')
            navigate('/')
        } else {
            // un utilisateur est déjà connecté ou enregistré
            // console.log(
            //   "accès à 'user' alors qu'un utilisateur est déjà enregistré"
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
            const fetchData = (token) => backendService.getProfile(token)

            fetchData(token).then((data) => {
                if (data.ok) {
                    dispatch(registerUser(data))
                    const registred = JSON.parse(
                        window.localStorage.getItem('registred')
                    )
                    if (registred !== null) {
                        const update_registred = {
                            ...registred,
                            firstname: data.firstname,
                        }

                        window.localStorage.setItem(
                            'registred',
                            JSON.stringify(update_registred)
                        )
                    }
                } else {
                    console.log('erreur de récup des données utilisateur')
                }
            })
        }
    }, [])

    const editHandler = (ev) => {
        titleMessage = ''
        editButton.style.display = 'none'
        editZone.style.display = 'flex'
        title.style.marginBottom = '0px'
    }

    const editTextHandler = (ev, type) => {
        setName((v) => ({ ...v, [type]: ev.target.value }))
    }

    const saveHandler = async (ev) => {
        if (name.firstName === '') name.firstName = user.firstname
        if (name.lastName === '') name.lastName = user.lastname
        const ok = await backendService.udpateName(token, name)
        if (ok) {
            dispatch(updateName(name))
            cancelHandler()
        }
    }

    const cancelHandler = (ev) => {
        titleMessage = `${user.firstname} ${user.lastname}`
        editButton.style.display = 'inline-block'
        editZone.style.display = 'none'
        title.style.marginBottom = '20px'
    }

    return (
        <>
            <HeaderNav />
            <main className="main bg-dark">
                <div className="header">
                    <h1 id="header-title">
                        Welcome Back
                        <br />
                        {titleMessage}
                    </h1>
                    <div className="edit">
                        <div>
                            <input
                                id="edit-firstname"
                                onChange={(event) =>
                                    editTextHandler(event, 'firstName')
                                }
                                type="text"
                                placeholder={user.firstname}
                            />
                            <button
                                onClick={saveHandler}
                                className="edit-button"
                            >
                                Save
                            </button>
                        </div>
                        <div>
                            <input
                                id="edit-lastname"
                                onChange={(event) =>
                                    editTextHandler(event, 'lastName')
                                }
                                type="text"
                                placeholder={user.lastname}
                            />
                            <button
                                onClick={cancelHandler}
                                className="edit-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <button
                        id="edit-name"
                        onClick={editHandler}
                        className="edit-button"
                    >
                        Edit Name
                    </button>
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
