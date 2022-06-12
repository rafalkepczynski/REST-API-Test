import React, { Component } from 'react';
import { Button, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import axios from "axios";
import authHeader from './services/auth-header';
import authService from './services/auth.service';

const API_URL = "https://localhost:7290/api/Test/";

class TestList extends Component {

    constructor(props) {
        super(props);
        this.state = {tests: [], isLoading: true};
    }

    componentDidMount() {
        this.setState({isLoading: true});

        if (authService.getCurrentUser().role === "Tester") {
            axios.get(API_URL + "gettodo", { headers: authHeader() })
                .then(response => this.setState({tests: response.data, isLoading: false}));
        }
        else {
            axios.get(API_URL + "getall", { headers: authHeader() })
                .then(response => this.setState({tests: response.data, isLoading: false}));
        }
    }

    render() {
        const {tests, isLoading} = this.state;

        if (isLoading) {
            return <p className="p-5">Loading...</p>;
        }

        const testList = tests.map(test => {
            return <tr key={test.id}>
                <td className="align-middle">{test.name}</td>
                {(test.isDone) ? <td className="align-middle text-success">TAK</td> : <td className="align-middle text-danger">NIE</td>}
                {(test.succes) ? <td className="align-middle text-success">TAK</td> : <td className="align-middle text-danger">NIE</td>}
                <td className="align-middle">
                    <Button color="primary" tag={Link} to={"/tests/" + test.id}>Szczegóły</Button>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container>
                    <div className="float-right">
                        {(authService.getCurrentUser().role !== "Tester") && <Button color="success" tag={Link} to="/tests/new">Dodaj przypadek testowy</Button>}{' '}
                        <Button color="secondary" onClick={() => window.location.reload(false)}>Odśwież</Button>
                    </div>
                    <h2 className={"my-5"}>Lista przypadków testowych</h2>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="30%">Nazwa</th>
                            <th width="30%">Wykonany</th>
                            <th width="30%">Sukces</th>
                            <th width="10%">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default TestList;