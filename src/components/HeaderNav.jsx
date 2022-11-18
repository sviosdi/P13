import logo from '../assets/img/argentBankLogo.png'
import '../assets/styles/headernav.css'
import { Link } from 'react-router-dom'

const HeaderNav = () => {
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
                <Link to="/sign-in" className="main-nav-item">
                    <i className="fa fa-user-circle"></i>
                    &nbsp;Sign In&nbsp;
                </Link>
            </div>
        </nav>
    )
}

export default HeaderNav
