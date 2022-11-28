import HeaderNav from '../components/HeaderNav'
import backendService from '../api.services/api'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/checking.css'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, updateName, userSelector } from '../state/userSlice'
import { storageChangeHandler } from './Signin'
import chevronUp from '../assets/img/chevron-up.svg'
import chevronDown from '../assets/img/chevron-down.svg'
import edit from '../assets/img/edit.svg'
import send from '../assets/img/send.svg'

const Checking = () => {
    const navigate = useNavigate()
    const user = useSelector(userSelector)
    const token = user.token
    const dispatch = useDispatch()
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState([])

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
        }

        backendService.getTransactions(token).then((data) => {
            if (data.ok) {
                setTransactions(data.transactions)
            } else {
                console.log('erreur de récup des transactions')
            }
        })
    }, [])

    useEffect(() => {
        if (token === null) {
            // console.log('non authentifié')
            navigate('/')
        } else {
            backendService.getCheckingBalance(token).then((data) => {
                if (data.ok) {
                    setBalance(data.balance)
                } else {
                    console.log('erreur de récup des données utilisateur')
                }
            })
        }
    }, [balance])

    return (
        <>
            <HeaderNav />
            <div className="transacs-header">
                <h3 className="account-title">Argent Bank Checking (x8349)</h3>
                <p className="account-amount">€{balance}</p>
                <p className="account-amount-description">Available Balance</p>
            </div>
            <main className="main bg-dark">
                <div className="transactions">
                    <Transactions transactions={transactions} />
                </div>
            </main>

            <Footer />
        </>
    )
}

const Transactions = ({ transactions }) => {
    const [openedTransac, setOpenedTransac] = useState(null)
    const openedTransacState = { openedTransac, setOpenedTransac }

    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((t, idx) => {
                    const options = {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }
                    const d = new Date(t.date)
                    const months = [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                    ]

                    const year = d.getFullYear()
                    const month = d.getMonth()
                    const date = `${months[month]} ${d.getDate()}th, ${year}`

                    return (
                        <OneTransac
                            openedTransacState={openedTransacState}
                            key={t._id}
                            id={t._id}
                            date={date}
                            description={t.description}
                            amount={t.amount.toFixed(2)}
                            balance={t.balance.toFixed(2)}
                            type={t.transaction_type}
                            cat={t.category}
                            notes={t.notes}
                        />
                    )
                })}
            </tbody>
        </table>
    )
}

const OneTransac = ({
    openedTransacState,
    id,
    date,
    description,
    amount,
    balance,
    type,
    cat,
    notes,
}) => {
    const [editState, setEditState] = useState({
        catEditing: false,
        catValue: cat,
        notesEditing: false,
        notesValue: notes,
    })

    const user = useSelector(userSelector)
    const token = user.token

    const handleEditTransac = (ev, idTransac) => {
        if (!openedTransacState.openedTransac) {
            openedTransacState.setOpenedTransac(idTransac)
        } else {
            if (openedTransacState.openedTransac === idTransac) {
                // clic sur transaction ouverte => la fermer
                openedTransacState.setOpenedTransac(null)
            } else {
                // marquer ouverte la nouvelle transaction cliquée
                openedTransacState.setOpenedTransac(idTransac)
            }
        }
    }

    return (
        <>
            <tr
                className={
                    openedTransacState.openedTransac === id
                        ? 'tr-opened'
                        : 'tr-closed'
                }
                onClick={(ev) => handleEditTransac(ev, id)}
            >
                <td>
                    <img
                        src={
                            openedTransacState.openedTransac === id
                                ? chevronUp
                                : chevronDown
                        }
                        alt="ouvrir"
                    />
                </td>
                <td>{date}</td>
                <td>{description}</td>
                <td>{amount}</td>
                <td>{balance}</td>
            </tr>
            {openedTransacState.openedTransac === id ? (
                <>
                    <tr className="tr-type">
                        <td></td>
                        <td colSpan="5">Transaction type: {type}</td>
                    </tr>
                    <tr className="tr-cat">
                        <td></td>
                        <td colSpan="5">
                            Category:
                            {!editState.catEditing ? (
                                cat
                            ) : (
                                <select>
                                    <option value="v1">
                                        Choisir une catégorie
                                    </option>
                                    <option value="Énergie">Énergie</option>
                                    <option value="Logement">Logement</option>
                                    <option value="Hyper/Supermarché">
                                        Hyper/Supermarché
                                    </option>
                                    <option value="Assurances">
                                        Assurances
                                    </option>
                                    <option value="Achats online">
                                        Achats online
                                    </option>
                                    <option value="High-tech">High-tech</option>
                                    <option value="Véhicule">Véhicule</option>
                                </select>
                            )}
                            <img
                                onClick={() =>
                                    setEditState((s) => ({
                                        ...s,
                                        catEditing: !s.catEditing,
                                    }))
                                }
                                src={edit}
                                alt="edit button"
                            />
                        </td>
                    </tr>
                    <tr className="tr-notes">
                        <td></td>
                        <td colSpan="5">
                            Notes:
                            {!editState.notesEditing ? (
                                <span>{editState.notesValue}</span>
                            ) : (
                                <input
                                    type="text"
                                    onChange={(ev) => {
                                        setEditState((s) => ({
                                            ...s,
                                            notesValue: ev.target.value,
                                        }))
                                    }}
                                    value={editState.notesValue}
                                ></input>
                            )}
                            {!editState.notesEditing ? (
                                <img
                                    onClick={() =>
                                        setEditState((s) => ({
                                            ...s,
                                            notesEditing: !s.notesEditing,
                                        }))
                                    }
                                    src={edit}
                                    alt="edit button"
                                />
                            ) : (
                                <img
                                    onClick={(ev) => {
                                        backendService
                                            .udpateTransac(token, {
                                                _id: id,
                                                notes: editState.notesValue,
                                                cat,
                                            })
                                            .then((data) => {
                                                console.log(data)
                                                /* if (data.ok) { data= true/false
                                                    console.log(
                                                        'notes mis à jours'
                                                    )
                                                } else {
                                                    console.log(
                                                        'erreur de récup des données utilisateur'
                                                    )*
                                                }*/
                                            })

                                        /*console.log(
                                            'sauvegarder : ',
                                            editState.notesValue
                                        )*/
                                        setEditState((s) => ({
                                            ...s,
                                            notesEditing: !s.notesEditing,
                                        }))
                                    }}
                                    src={send}
                                    alt="send button"
                                />
                            )}
                        </td>
                    </tr>
                </>
            ) : null}
        </>
    )
}

export default Checking
