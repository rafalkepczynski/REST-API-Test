import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import axios from "axios";
import authHeader from "./services/auth-header";

const API_URL = "https://localhost:7290/api/Test/";

class TestEdit extends Component {

    emptyItem = {
        name: '',
        endpoints: [
            {
                endpointTypeId: '',
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
            item: this.emptyItem,
            endpointsEnum: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeEndpointType = this.handleChangeEndpointType.bind(this);
        this.handleChangeEndpoint = this.handleChangeEndpoint.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.lastURLSegment !== 'new') {
            await axios.get(API_URL + "getall", { headers: authHeader() })
                .then(response => {
                    console.log(response.data);
                    let index = response.data.findIndex(x => x.id === Number(this.lastURLSegment));
                    console.log(index);
                    this.setState({item: response.data[index]})});
        }

        this.setState({
            endpointsEnum: [
                {
                    value: "",
                    display: "(Wybierz rodzaj endpointa)"
                },
                {
                    value: 3,
                    display: "GET"
                },
                {
                    value: 1,
                    display: "POST"
                },
                {
                    value: 2,
                    display: "PUT"
                },
                // {
                //     value: "PATCH",
                //     display: "PATCH"
                // },
                {
                    value: 4,
                    display: "DELETE"
                }
            ]
        });
    }

    addEndpoint = () => {
        let temp = {...this.state.item};
        temp.endpoints.push(
            {
                endpointType: {
                    name: ''
                },
                body: "",
                heder: '',
                parametrs: '',
                url: ''
            }
        );
        this.setState({temp});
    }

    deleteEndpoint = (e, i) => {
        let temp = {...this.state.item};
        temp.endpoints.splice(i, 1);
        this.setState({temp});
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleChangeEndpointType(event, i) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item.endpoints[i].endpointType[name] = value;
        this.setState({item});
    }

    handleChangeEndpoint(event, i) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item.endpoints[i][name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;
        if (item.id) {
            await axios.put(API_URL + "update/" + this.lastURLSegment, {
                name: item.name,
                endpoints: item.endpoints,
                description: item.description
            }, {headers: authHeader()});
        }
        else {
            await axios.post(API_URL + "create", {
                name: item.name,
                endpoints: item.endpoints,
                description: item.description
            }, { headers: authHeader() });
        }
        this.props.history.push('/tests/');
    }

    render() {
        const {item, endpointsEnum} = this.state;
        const title = <h2>{item.id ? 'Edytuj przypadek testowy' : 'Dodaj przypadek testowy'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <iframe title="swagger-execute" width="100%" height="600px" src="https://localhost:7290/swagger/index.html" />
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Nazwa przypadku testowego</Label>
                        <Input type="text" name="name" id="name" value={item.name || ''}
                               onChange={this.handleChange} autoComplete="name"/>
                    </FormGroup>
                    <h5>Endpointy</h5>
                    {item.endpoints.map((endpoint, i) => (
                        <div>
                            <FormGroup>
                                <div className="text-right">
                                    <Button color="danger" onClick={e => this.deleteEndpoint(e, i)}>Usuń endpoint</Button>
                                </div>
                                <Label>Endpoint {i+1}</Label>
                            </FormGroup>
                            <FormGroup>
                                <Label>Typ endpointu</Label>
                                <Input type="select" name="endpointTypeId" id="endpointTypeId" value={endpoint.endpointTypeId || ''} onChange={e => this.handleChangeEndpoint(e, i)}>
                                    {endpointsEnum.map(endpoint => (
                                        <option key={endpoint.value} value={endpoint.value}>{endpoint.display}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label>Ciało</Label>
                                <Input type="textarea" name="body" id="body" value={endpoint.body || ''} onChange={e => this.handleChangeEndpoint(e, i)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Nagłówek</Label>
                                <Input type="textarea" name="heder" id="heder" value={endpoint.heder || ''} onChange={e => this.handleChangeEndpoint(e, i)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Parametry</Label>
                                <Input type="textarea" name="parametrs" id="parametrs" value={endpoint.parametrs || ''} onChange={e => this.handleChangeEndpoint(e, i)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>URL</Label>
                                <Input type="text" name="url" id="url" value={endpoint.url || ''} onChange={e => this.handleChangeEndpoint(e, i)}/>
                            </FormGroup>
                        </div>
                        ))}
                    <FormGroup>
                        <Button color="success" onClick={this.addEndpoint}>Dodaj endpoint</Button>
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Opis</Label>
                        <Input type="textarea" name="description" id="description" value={item.description || ''} onChange={this.handleChange} autoComplete="description"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Zapisz</Button>{' '}
                        <Button color="secondary" tag={Link} to={'/tests/'}>Anuluj</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default TestEdit;