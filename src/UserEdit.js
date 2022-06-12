import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import axios from "axios";
import authHeader from "./services/auth-header";

const API_URL = "https://localhost:7290/api/Account/";

class UserEdit extends Component {

    emptyItem = {
        id: '',
        name: '',
        login: '',
        password: '',
        roleId: ''
    };

    lastURLSegment = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            roleEnum: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.lastURLSegment !== 'new') {
            axios.get(API_URL + "getusers", { headers: authHeader() })
                .then(response =>{
                    let index = response.data.findIndex(x => x.id === Number(this.lastURLSegment));
                    this.setState({item: response.data[index]})});
        }
        this.setState({
            roleEnum: [
                {
                    value: "",
                    display: "(Wybierz rolę)"
                },
                {
                    value: 3,
                    display: "Tester"
                },
                {
                    value: 2,
                    display: "Konfigurator"
                },
                {
                    value: 1,
                    display: "Administrator"
                }
            ]
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
        if (item.id) {
            await axios.patch(API_URL + "edituser/" + this.lastURLSegment, {
               name: item.name,
               login: item.login
            }, {headers: authHeader()});
            await axios.patch(API_URL + "changerole/" + this.lastURLSegment, {
                roleId: item.roleId
            }, {headers: authHeader()});
        }
        else {
            await axios.post(API_URL + "create", {
                name: item.name,
                login: item.login,
                password: item.password,
                confirmPassword: item.password,
                roleId: item.roleId
            }, { headers: authHeader() });
        }
        this.props.history.push('/users/' + this.state.item.id);
    }

    render() {
        const {item, roleEnum} = this.state;
        const title = <h2>{item.id ? 'Edytuj użytkownika' : 'Dodaj użytkownika'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Nazwa użytkownika</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                               onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="login">Login</Label>
                        <Input type="text" name="login" id="login" value={item.login || ''}
                               onChange={this.handleChange} autoComplete="login"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="roleId">Rola</Label>
                        <Input type="select" name="roleId" id="roleId" value={item.roleId || ''}
                               onChange={this.handleChange}>
                            {roleEnum.map(role => (
                                <option
                                    key={role.value}
                                    value={role.value}
                                >
                                    {role.display}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    {(!item.id) &&
                        <FormGroup>
                            <Label for="password">Hasło</Label>
                            <Input type="password" name="password" id="password" value={item.password || ''}
                                   onChange={this.handleChange} autoComplete="current-password"/>
                        </FormGroup>}
                    <FormGroup>
                        <Button color="primary" type="submit">Zapisz</Button>{' '}
                        <Button color="secondary" tag={Link} to={'/users/'}>Anuluj</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default UserEdit;