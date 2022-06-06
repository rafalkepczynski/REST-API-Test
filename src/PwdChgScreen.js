import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import axios from "axios";
import authHeader from './services/auth-header';

const API_URL = "https://localhost:7290/api/Account/";

class PwdChgScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            message: "",
            success: ""
        };
        this.handleChangeOld = this.handleChangeOld.bind(this);
        this.handleChangeNew = this.handleChangeNew.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeOld(event) {
        this.setState({oldPassword: event.target.value, message: ""})
    }

    handleChangeNew(event) {
        this.setState({newPassword: event.target.value, message: ""})
    }

    async changePassword(oldPassword, newPassword) {
        try {
            await axios.patch(API_URL + "changepassword", {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmNewPassword: newPassword
            }, { headers: authHeader() });
            this.setState({success: "Hasło zostało zmienione!"});
            await new Promise(r => setTimeout(r, 2000));
            window.location.reload(false);
        }
        catch (err) {
            this.setState({message: "Wprowadzone stare hasło jest niepoprawne!"});
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.newPassword === "") {
            return (
                this.setState({message: "Hasło nie może być puste!"})
            );
        }
        else if (this.state.newPassword.length < 5) {
            return (
                this.setState({message: "Hasło nie może być krótsze niż 5 znaków!"})
            );
        }
        await this.changePassword(this.state.oldPassword, this.state.newPassword);
        this.props.history.push('/');
    }

    render() {
        const title = <h2>Zmień hasło</h2>;

        return <div>
            <div>
                <hr />
                <div>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h2">{title}</CardTitle>
                            <CardSubtitle tag="h6" className="my-4 text-muted">Wypełnij pole hasło, aby zmienić swoje hasło</CardSubtitle>
                            <hr className="my-3"/>
                            <CardText>
                                <form className={"my-2"} onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label for="username">Nazwa użytkownika</Label>
                                        <Input type="text" disabled={true} name="username" id="username"
                                               value={JSON.parse(localStorage.getItem('user')).name || ''} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="oldPassword">Stare hasło</Label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={this.state.oldPassword}
                                            onChange={this.handleChangeOld}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="newPassword">Nowe hasło</Label>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={this.state.newPassword}
                                            onChange={this.handleChangeNew}
                                        />
                                    </FormGroup>
                                    {this.state.message && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.message}
                                            </div>
                                        </div>
                                    )}
                                    {this.state.success && (
                                        <div className="form-group">
                                            <div className="alert alert-success" role="alert">
                                                {this.state.success}
                                            </div>
                                        </div>
                                    )}
                                    <FormGroup>
                                        <Button color="warning" type="submit">Zapisz</Button>
                                    </FormGroup>
                                </form>
                            </CardText>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    }
}

export default withRouter(PwdChgScreen);