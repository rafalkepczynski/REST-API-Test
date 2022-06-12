import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import axios from "axios";
import authHeader from './services/auth-header';

const API_URL = "https://localhost:7290/api/Account/";

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {users: [], isLoading: true};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        axios.get(API_URL + "getusers", { headers: authHeader() })
            .then(response => this.setState({users: response.data, isLoading: false}));
    }

    render() {
        const {users, isLoading} = this.state;

        if (isLoading) {
            return <p className="p-5">Loading...</p>;
        }

        const userList = users.map(user => {
            return <tr key={user.id}>
                <td className="align-middle">{user.name}</td>
                <td className="align-middle">{user.login}</td>
                {(user.roleId === 1) && <td className="align-middle">Admin</td>}
                {(user.roleId === 2) && <td className="align-middle">Konfigurator</td>}
                {(user.roleId === 3) && <td className="align-middle">Tester</td>}
                {(user.roleId === undefined) && <td className="align-middle">Błąd</td>}
                <td className="align-middle">
                    <Button color="primary" tag={Link} to={"/users/" + user.id}>Szczegóły</Button>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/users/new">Dodaj użytkownika</Button>{' '}
                        <Button color="secondary" onClick={() => window.location.reload(false)}>Odśwież</Button>
                    </div>
                    <h2 className={"my-5"}>Lista użytkowników</h2>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Nazwa użytkownika</th>
                            <th width="30%">Login</th>
                            <th width="30%">Rola</th>
                            <th width="10%">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default UserList;