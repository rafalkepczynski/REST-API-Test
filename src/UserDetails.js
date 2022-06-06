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
import AppNavbar from '../AppNavbar';
import axios from "axios";
import authHeader from "../services/auth-header";
import UsersCarList from "../cars/UsersCarList"

class UserDetails extends Component {

    emptyItem = {
        id: '',
        username: '',
        email: '',
        password: '',
        roles: [
            {
                id: '',
                name: ''
            }
        ],
        userData: {
            id: '',
            name: '',
            surname: ''
        },
        blocked: ''
    };

    lastURLSegment = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            showHideCarList: true,
            isLoading: true,
            blocked: true
        };
        this.remove = this.remove.bind(this);
        this.block = this.block.bind(this);
        this.showHideCarList = this.showHideCarList.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
        await axios.get('http://localhost:8080/api/auth/users/' + this.props.match.params.id, { headers: authHeader() })
            .then(response => this.setState({item: response.data, isLoading: false}));

        this.setState({blocked: this.state.item.blocked});
    }

    async remove() {
        axios.delete('http://localhost:8080/api/auth/users/' + this.props.match.params.id, { headers: authHeader() })
            .then(() => {
                this.props.history.push('/users');
            });
    }
    async block() {
        axios.put('http://localhost:8080/api/auth/block/' + this.props.match.params.id, { headers: authHeader() })
            .then(() => {
                this.componentDidMount();
            });
    }

    showHideCarList() {
        this.setState(state => ({
            showHideCarList: !state.showHideCarList
        }));
    }

    getCurrentState() {
        if (this.state.blocked) return "odblokować";
        else return "zablokować";
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
                            <CardTitle tag="h2" className={"mb-4"}>{item.userData.name + ' ' + item.userData.surname}</CardTitle>
                            <CardText tag="div" className="mb-3">
                                <ul className={"list-group"}>
                                    <li className={"list-group-item"}>{'Nazwa użytkownika: ' + item.username}</li>
                                    <li className={"list-group-item"}>{'E-mail: ' + item.email}</li>
                                    {item.roles[0].id === 1 && <li className={"list-group-item"}>Rola: Użytkownik</li>}
                                    {item.roles[0].id === 2 && <li className={"list-group-item"}>Rola: Zarządca floty</li>}
                                    {item.roles[0].id === 3 && <li className={"list-group-item"}>Rola: Administrator</li>}
                                </ul>
                            </CardText>
                            <Button color="primary" tag={Link} to={"/users/edit/" + item.id}>Edytuj</Button>{' '}
                            <Button color="warning"
                                    onClick={() => {
                                        if (window.confirm('Czy na pewno chcesz ' + this.getCurrentState() + ' tego użytkownika?'))
                                        {
                                            this.block(item.id);
                                            this.setState({blocked: !this.state.blocked})
                                        }
                                    }}>
                                {(this.state.blocked) ? "Odblokuj" : "Zablokuj"}
                            </Button>{' '}
                            <Button color="danger" onClick={() => { if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) this.remove(item.id) } }>Usuń</Button>
                            {this.state.showHideCarList &&
                                <div className={"my-5"}>
                                    <UsersCarList id={this.state.item.id}/>
                                </div>
                            }
                        </CardBody>
                    </Card>
                </div>
            </Container>
        </div>
    }
}

export default UserDetails;