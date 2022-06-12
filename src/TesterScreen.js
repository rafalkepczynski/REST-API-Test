import React, { Component } from 'react';
import './App.css';
import {Button} from 'reactstrap';
import {Link} from "react-router-dom";
import AuthService from "./services/auth.service";
import PwdChgScreen from "./PwdChgScreen";

class TesterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHidePwdChg: false,
            isLoading: true
        };
        this.showHidePwdChg = this.showHidePwdChg.bind(this);
    }

    showHidePwdChg() {
        this.setState(state => ({
            showHidePwdChg: !state.showHidePwdChg
        }));
    }

    componentDidMount() {
        this.setState({isLoading: true});
        const user = AuthService.getCurrentUser();

        if(user) {
            this.setState({
                currentUser: user,
                isLoading: false
            });
        }
        else {
            this.setState({
                isLoading: true
            });
        }
    }

    render() {
        const {currentUser, isLoading} = this.state;

        if (isLoading) {
            return <p className="p-5">Loading...</p>;
        }

        return (
            <div>
                <h1 className="display-3">Witaj {currentUser.name}!</h1>
                <p className="lead">Jesteś zalogowany!</p>
                <hr className="my-2" />
                <p>Twoja rola to tester. Możesz skorzystać z widocznych poniżej funkcji systemu.</p>
                <p className="lead">
                    <Button color="primary" tag={Link} to={"/tests/"}>Testy</Button>{' '}
                    <Button color="warning" onClick={this.showHidePwdChg}>Zmień hasło</Button>
                </p>
                {this.state.showHidePwdChg && <PwdChgScreen/>}
            </div>
        );
    }
}

export default TesterScreen;