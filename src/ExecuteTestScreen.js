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

const API_URL = "https://localhost:7290/api/Test/";

class ExecuteTestScreen extends Component {

    lastURLSegment = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            succes: false
        };
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleSuccessChange = this.handleSuccessChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCommentChange(event) {
        this.setState({comment: event.target.value});
    }

    handleSuccessChange() {
        this.setState({succes: !this.state.succes});
        console.log(this.state.succes);
    }

    async handleSubmit() {
        await axios.patch(API_URL + "execute/" + this.lastURLSegment, {
            comment: this.state.comment,
            succes: this.state.succes
        }, { headers: authHeader() }).then(() => {
            window.location.reload()
        }).catch((e) => console.log(e));
    }

    render() {
        const title = <h2>Wykonaj test</h2>;

        return <div>
            <div>
                <hr />
                <div>
                    <iframe title="swagger-execute" width="100%" height="600px" src="https://localhost:7290/swagger/index.html" />
                    <Card>
                        <CardBody>
                            <CardTitle tag="h2">{title}</CardTitle>
                            <CardSubtitle tag="h6" className="my-4 text-muted">Wypełnij poniższy formularz</CardSubtitle>
                            <hr className="my-3"/>
                            <CardText>
                                <form className={"my-2"} onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Input
                                            type="checkbox"
                                            className="form-control"
                                            name="succes"
                                            value={this.state.succes}
                                            onChange={this.handleSuccessChange}
                                        />
                                        <Label for="succes">Czy zakończone sukcesem?</Label>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="comment">Komentarz</Label>
                                        <Input
                                            type="textarea"
                                            className="form-control"
                                            name="comment"
                                            value={this.state.comment}
                                            onChange={this.handleCommentChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button color="success" type="submit">Zapisz</Button>
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

export default withRouter(ExecuteTestScreen);