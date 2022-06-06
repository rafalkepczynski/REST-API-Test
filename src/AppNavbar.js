import {Component} from "react";
import {
    Collapse,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink
} from 'reactstrap';
import {Link} from "react-router-dom";
import AuthService from "./services/auth.service";

class AppNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);

        this.state = {
            showConfiguratorScreen: false,
            showAdminScreen: false,
            currentUser: undefined,
            counter: ''
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showManagerScreen: user.role === ("Configurator") || user.role === ("Admin"),
                showAdminScreen: user.role === ("Admin")
            });
        }

        if (user && user.role === ("Tester")) {
            // TODO: display quantity of tests to be done - count elements in the list
            /*axios.get('endpoint definition', { headers: authHeader() })
                .then(response => this.setState({counter: response.data}));*/
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logOut() {
        AuthService.logout();
    }

    render() {
        const { currentUser, showConfiguratorScreen, showAdminScreen } = this.state;
        return (
            <Navbar color="dark" dark expand="md">
                <div className='container' id='navbar'>
                    <NavbarBrand tag={Link} to="/">REST API Test</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            {(showConfiguratorScreen || showAdminScreen) && (
                                <NavItem>
                                    <NavLink href="/tests">Przypadki testowe</NavLink>
                                </NavItem>
                            )}
                            {showAdminScreen && (
                                <NavItem>
                                    <NavLink href="/users">Użytkownicy</NavLink>
                                </NavItem>
                            )}
                        </Nav>
                        {currentUser ? (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={""} className="nav-link">{currentUser.name}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link" onClick={this.logOut}>Wyloguj się</Link>
                                </li>
                            </div>
                        ) : (
                            <div className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">Zaloguj się</Link>
                                </li>
                            </div>
                        )}
                    </Collapse>
                </div>
            </Navbar>
        );
    }
}

export default AppNavbar;