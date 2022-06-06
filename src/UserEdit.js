import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import axios from "axios";
import authHeader from "../services/auth-header";

class UserEdit extends Component {

    emptyItem = {
        id: '',
        username: '',
        email: '',
        password: '',
        role: '',
        name: '',
        surname: ''
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
            axios.get('http://localhost:8080/api/auth/users/edit/' + this.props.match.params.id, { headers: authHeader() })
                .then(response => this.setState({item: response.data}));
        }
        this.setState({
            roleEnum: [
                {
                    value: "",
                    display: "(Wybierz rolę)"
                },
                {
                    value: "ROLE_USER",
                    display: "Tester"
                },
                {
                    value: "ROLE_MANAGER",
                    display: "Konfigurator"
                },
                {
                    value: "ROLE_ADMIN",
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
        await fetch((item.id) ? 'http://localhost:8080/api/auth/users/' + item.id + '?username=' + item.username + '&email=' + item.email + '&role=' + item.role + '&name=' + item.name + '&surname=' + item.surname : 'http://localhost:8080/api/auth/signup', {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken
            },
            body: JSON.stringify(item),
        });
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
                        <Label for="username">Nazwa użytkownika</Label>
                        <Input type="text" name="username" id="username" value={item.username || ''}
                               onChange={this.handleChange} autoComplete="username"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">E-mail</Label>
                        <Input type="text" name="email" id="email" value={item.email || ''}
                               onChange={this.handleChange} autoComplete="email"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="role">Rola</Label>
                        <Input type="select" name="role" id="role" value={item.role || ''}
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
                    <FormGroup>
                        <Label for="name">Imię</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                               onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="surname">Nazwisko</Label>
                        <Input type="text" name="surname" id="surname" value={item.surname || ''}
                               onChange={this.handleChange} autoComplete="surname"/>
                    </FormGroup>
                    {(!item.id) &&
                        <FormGroup>
                            <Label for="password">Hasło</Label>
                            <Input type="password" name="password" id="password" value={item.password || ''}
                                   onChange={this.handleChange} autoComplete="current-password"/>
                        </FormGroup>}
                    <FormGroup>
                        <Button color="primary" type="submit">Zapisz</Button>{' '}
                        <Button color="secondary" tag={Link} to={(item.id) ? '/users/' + this.props.match.params.id : '/users/'}>Anuluj</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default UserEdit;