import {Component} from "react";
import {Button, Container, Jumbotron} from 'reactstrap';
import {Link} from "react-router-dom";
import AppNavbar from "./AppNavbar";
import './App.css';
import AuthService from "./services/auth.service";
import ManagerScreen from "./ManagerScreen";
import AdminScreen from "./AdminScreen";
import TesterScreen from "./TesterScreen";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            role: undefined,
            currentUser: undefined
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if(user) {
            this.setState({
                role: user.role,
                currentUser: user
            });
        }
    }

    render() {
        const { role } = this.state;
        return (
            <div>
                <AppNavbar/>
                <Container>
                    <Jumbotron>
                        {role === "Customer" && (
                            <TesterScreen/>
                        )}
                        {role === "Configurator" && (
                            <ManagerScreen/>
                        )}
                        {role === "Admin" && (
                            <AdminScreen/>
                        )}
                        {role === undefined && (
                            <div>
                                <h1 className="display-3">Witaj!</h1>
                                <p className="lead">Nie jesteś zalogowany!</p>
                                <hr className="my-2" />
                                <p>Skorzystaj z formularza logowania, aby skorzystać z serwisu.</p>
                                <p className="lead">
                                    <Button color="primary" tag={Link} to="/login/">Zaloguj się</Button>
                                </p>
                            </div>
                        )}
                    </Jumbotron>
                </Container>
            </div>
        );
    }
}

export default Home;