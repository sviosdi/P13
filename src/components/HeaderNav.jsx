import logo from '../assets/img/argentBankLogo.png'
import '../assets/styles/headernav.css'
import { useSelector, useDispatch } from 'react-redux'
import {
    connectedSelector,
    getFirstnameSelector,
    disconnect,
    getUsernameSelector,
} from '../state/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import { storageChangeHandler } from '../pages/Signin'

const removeFromConnectedUsers = (username) => {
    const connected = JSON.parse(localStorage.getItem('connected'))
    const index = connected.indexOf(username)
    if (index > -1) {
        connected.splice(index, 1)
        localStorage.setItem('connected', JSON.stringify(connected))
    }
}

const HeaderNav = () => {
    const dispatch = useDispatch()
    const isConnected = useSelector(connectedSelector)
    const name = useSelector(getFirstnameSelector)
    const username = useSelector(getUsernameSelector)
    const navigate = useNavigate()

    return (
        <nav className="main-nav">
            <Link to="/" className="main-nav-logo">
                <img
                    className="main-nav-logo-image"
                    src={logo}
                    alt="Argent Bank Logo"
                />
                <h1 className="sr-only">Argent Bank</h1>
            </Link>
            <div>
                {!isConnected ? (
                    <Link to="/sign-in" className="main-nav-item">
                        <i className="fa fa-user-circle"></i>
                        &nbsp;Sign In&nbsp;
                    </Link>
                ) : (
                    <>
                        <Link to="/user" className="main-nav-item">
                            <i className="fa fa-user-circle"></i>
                            {name}
                        </Link>
                        <Link
                            to="/"
                            onClick={() => {
                                let registred =
                                    localStorage.getItem('registred')
                                if (registred !== null)
                                    localStorage.removeItem('registred')
                                removeFromConnectedUsers(username)
                                dispatch(disconnect())
                                window.removeEventListener(
                                    'storage',
                                    storageChangeHandler
                                )
                                navigate('/')
                            }}
                            className="main-nav-item"
                        >
                            <i className="fa fa-sign-out"></i>
                            Sign Out
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default HeaderNav
