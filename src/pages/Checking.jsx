import HeaderNav from '../components/HeaderNav'
import backendService from '../api.services/api'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/styles/checking.css'
import { useDispatch, useSelector } from 'react-redux'
import { userSelector } from '../state/userSlice'
import { storageChangeHandler } from './Signin'
import chevronUp from '../assets/img/chevron-up.svg'
import chevronDown from '../assets/img/chevron-down.svg'
import edit from '../assets/img/edit.svg'
import send from '../assets/img/send.svg'
let TYPE_ACCOUNT = ''

const Checking = () => {
    const { type: type_account } = useParams()
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

        backendService
            .getTransactions(token, { type: type_account })
            .then((data) => {
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
            backendService
                .getBalance(token, { type: type_account })
                .then((data) => {
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
                    <Transactions
                        transactions={transactions}
                        type_account={type_account}
                    />
                </div>
            </main>

            <Footer />
        </>
    )
}

const Transactions = ({ transactions, type_account }) => {
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
                            type_account={type_account}
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
    type_account,
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
    const catLabels = [
        ['c0', 'Choisir une catégorie'],
        ['c1', 'Énergie'],
        ['c2', 'Logement'],
        ['c3', 'Hyper/Supermarché'],
        ['c4', 'Assurances'],
        ['c5', 'Véhicule'],
        ['c6', 'High-Tech'],
        ['c7', 'Achats online'],
    ]

    const catLabelsMap = new Map(catLabels)
    const [editState, setEditState] = useState({
        catEditing: false,
        catValue: cat,
        catLabel: cat !== '' ? catLabelsMap.get(cat) : '',
        notesEditing: false,
        notesValue: notes,
    })

    const user = useSelector(userSelector)
    const token = user.token

    // gère l'ouverture/fermeture d'une ligne transaction pour permettre l'édition category/notes
    const handleEditTransac = (ev, idTransac) => {
        if (!openedTransacState.openedTransac) {
            openedTransacState.setOpenedTransac(idTransac)
        } else {
            if (openedTransacState.openedTransac === idTransac) {
                // clic sur transaction ouverte => la fermer
                editState.notesEditing = false
                editState.catEditing = false
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
                                <span>{editState.catLabel}</span>
                            ) : (
                                <select
                                    value={editState.catValue}
                                    onChange={(ev) => {
                                        setEditState((s) => ({
                                            ...s,
                                            catLabel:
                                                ev.target[
                                                    ev.target.selectedIndex
                                                ].label,
                                            catValue: ev.target.value,
                                            catEditing: !s.catEditing,
                                        }))
                                        backendService
                                            .updateTransac(token, {
                                                type: type_account,
                                                _id: id,
                                                notes,
                                                category: ev.target.value,
                                            })
                                            .then((data) => {
                                                console.log(data)
                                            })
                                    }}
                                >
                                    {catLabels.map((el) => (
                                        <option key={el[0]} value={el[0]}>
                                            {el[1]}
                                        </option>
                                    ))}
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
                                            .updateTransac(token, {
                                                type: type_account,
                                                _id: id,
                                                notes: editState.notesValue,
                                                cat,
                                            })
                                            .then((data) => {
                                                console.log(data)
                                            })

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
