import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Container
} from 'reactstrap';
import AppNavbar from './AppNavbar';
import axios from "axios";
import authHeader from "./services/auth-header";

const API_URL = "https://localhost:7290/api/Account/";

class UserDetails extends Component {

    emptyItem = {
        id: '',
        name: '',
        login: '',
        password: '',
        roleId: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            isLoading: true
        };
        this.remove = this.remove.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
        await axios.get(API_URL + "getusers", { headers: authHeader() })
            .then(response => this.setState({item: response.data[this.props.match.params.id - 1], isLoading: false}));
    }

    async remove() {
        axios.delete(API_URL + "delete/" + this.props.match.params.id, { headers: authHeader() })
            .then(() => {
                this.props.history.push('/users');
            });
    }

    render() {
        const {item, isLoading} = this.state;
        const title = <h2>Szczegóły użytkownika</h2>;

        if (isLoading) {
            return <p className="p-5">Loading...</p>;
        }

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><a href='/users'>Lista użytkowników</a></BreadcrumbItem>
                        <BreadcrumbItem active>Szczegóły użytkownika</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className={"my-5"}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h2" className={"mb-4"}>{item.name}</CardTitle>
                            <CardText tag="div" className="mb-3">
                                <ul className={"list-group"}>
                                    <li className={"list-group-item"}>{'Login: ' + item.login}</li>
                                    {item.roleId === 3 && <li className={"list-group-item"}>Rola: Tester</li>}
                                    {item.roleId === 2 && <li className={"list-group-item"}>Rola: Konfigurator</li>}
                                    {item.roleId === 1 && <li className={"list-group-item"}>Rola: Administrator</li>}
                                </ul>
                            </CardText>
                            <Button color="primary" tag={Link} to={"/users/edit/" + item.id}>Edytuj</Button>{' '}
                            <Button color="danger" onClick={() => { if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) this.remove(item.id) } }>Usuń</Button>
                        </CardBody>
                    </Card>
                </div>
            </Container>
        </div>
    }
}

export default UserDetails;