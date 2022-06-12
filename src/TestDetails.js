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
import AuthService from "./services/auth.service";
import ExecuteTestScreen from "./ExecuteTestScreen";

const API_URL = "https://localhost:7290/api/Test/";

class TestDetails extends Component {

    emptyItem = {
        id: '',
        name: '',
        isDone: '',
        succes: '',
        comment: '',
        endpoints: [
            {
                endpointType: {
                    name: ''
                },
                body: '',
                heder: '',
                parametrs: '',
                url: ''
            }
        ],
        description: ''
    };

    lastURLSegment = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

    constructor(props) {
        super(props);
        this.state = {
            item: [],
            isLoading: true
        };
        this.remove = this.remove.bind(this);
        this.showHideExecuteTest = this.showHideExecuteTest.bind(this);
    }

    async componentDidMount() {
        await axios.get(API_URL + "getall", { headers: authHeader() })
            .then(response => {
                let index = response.data.findIndex(x => x.id === Number(this.lastURLSegment));
                this.setState({item: response.data[index], isLoading: false})});
    }

    async remove() {
        axios.delete(API_URL + "delete/" + this.props.match.params.id, { headers: authHeader() })
            .then(() => {
                this.props.history.push('/tests');
            });
    }

    showHideExecuteTest() {
        this.setState(state => ({
            showHideExecuteTest: !state.showHideExecuteTest
        }));
    }

    render() {
        const {item, isLoading} = this.state;
        const title = <h2>Szczegóły przypadku testowego</h2>;

        if (isLoading) {
            return <p className="p-5">Loading...</p>;
        }

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem><a href='/tests'>Lista przypadków testowych</a></BreadcrumbItem>
                        <BreadcrumbItem active>Szczegóły przypadku testowego</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className={"my-5"}>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h2" className={"mb-4"}>{item.name}</CardTitle>
                            <CardText tag="div" className="mb-3">
                                <ul className={"list-group"}>
                                    {(item.isDone) ? <li className={"list-group-item"}>Wykonano: TAK</li> : <li className={"list-group-item"}>Wykonano: NIE</li>}
                                    {(item.succes) ? <li className={"list-group-item"}>Zakończone sukcesem: TAK</li> : <li className={"list-group-item"}>Zakończone sukcesem: NIE</li>}
                                    <li className={"list-group-item"}>{item.description}</li>
                                    {(item.comment) ? <li className={"list-group-item"}>{item.comment}</li> : <li className={"list-group-item"}>Brak komentarza</li>}
                                </ul>
                                <span className={"m-4"}></span>
                                <ul className={"list-group"}>
                                    <li className={"list-group-item h5"}>Endpointy</li>
                                    {item.endpoints.map(endpoint => (
                                        <div className={"my-2"}>
                                            <li className={"list-group-item"}>{'Typ: ' + endpoint.endpointType.name}</li>
                                            <li className={"list-group-item"}>{'Ciało: ' + endpoint.body}</li>
                                            <li className={"list-group-item"}>{'Nagłówek: ' + endpoint.heder}</li>
                                            <li className={"list-group-item"}>{'Parametry: ' + endpoint.parametrs}</li>
                                            <li className={"list-group-item"}>{'Adres URL: ' + endpoint.url}</li>
                                        </div>
                                    ))}
                                </ul>
                            </CardText>
                            {(AuthService.getCurrentUser().role === "Tester" && !item.isDone) && <Button color="primary" onClick={this.showHideExecuteTest}>Rozpocznij</Button>}
                            {(AuthService.getCurrentUser().role !== "Tester") && <Button color="primary" tag={Link} to={"/tests/edit/" + item.id}>Edytuj</Button>}{' '}
                            {(AuthService.getCurrentUser().role !== "Tester") && <Button color="danger" onClick={() => { if (window.confirm('Czy na pewno chcesz usunąć ten przypadek testowy?')) this.remove(item.id) } }>Usuń</Button>}
                        </CardBody>
                    </Card>
                    {this.state.showHideExecuteTest && <ExecuteTestScreen/>}
                </div>
            </Container>
        </div>
    }
}

export default TestDetails;