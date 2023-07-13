import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            <li className="navbar__item active">
                <Link className="navbar__link" to="/tickets">Tickets</Link>
            </li>
            {
                localStorage.getItem("honey_user")
                    ? <li className="navbar__item navbar__logout">
                        <Link className="navbar__link" to="" onClick={() => { //on a user's click of the logout button...
                            localStorage.removeItem("honey_user") //...the user's local storage removes the honey_user object
                            navigate("/", {replace: true}) //...and then the website goes back to the base route of the website/application
                        }}>Logout</Link>
                    </li>
                    : ""
            }
        </ul>
    )
}

