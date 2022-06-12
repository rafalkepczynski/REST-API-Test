import {Component} from "react";
import axios from "axios";
import authHeader from "./services/auth-header";
import AppNavbar from "./AppNavbar";
import {Card, CardBody, CardText, CardTitle, Container} from "reactstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

const API_URL = "https://localhost:7290/api/Test/";

class Results extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoading: true
        };
    }

    async componentDidMount() {
        await axios.get(API_URL + "getall", { headers: authHeader() })
            .then(response => this.setState({items: response.data, isLoading: false}));
    }

    render() {
        const {items, isLoading} = this.state;
        const title = <h2>Rezultaty testów</h2>;

        let TODO = 0;
        let success = 0;
        let non_success = 0;

        for (const item of items) {
            if (!item.isDone) TODO++;
            else {
                if (item.succes) success++;
                else non_success++;
            }
        }

        ChartJS.register(ArcElement, Tooltip, Legend);

        const data = {
            labels: ['Do wykonania', 'Zakończone sukcesem', 'Zakończone niepowodzeniem'],
            datasets: [
                {
                    label: 'Liczba testów',
                    data: [TODO, success, non_success],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        }

        if (isLoading) {
            return <p className="p-5">Loading...</p>;
        }
        return <div>
            <AppNavbar/>
            <Container>
                <Card>
                    <CardBody>
                        <CardTitle tag="h2" className="mb-4">{title}</CardTitle>
                        <CardText tag="div" className="mb-4">
                            <ul className="list-group">
                                <li className="list-group-item">{"Liczba testów wykonanych: " + Number(success + non_success)}</li>
                                <li className="list-group-item">{"Liczba testów oczekujących: " + Number(TODO)}</li>
                                <li className="list-group-item">{"Wszystkie testy w systemie: " + Number(success + non_success + TODO)}</li>
                            </ul>
                        </CardText>
                        <div style={{position: "relative", height: "60vh"}}>
                            <Doughnut data={data} options={{ maintainAspectRatio: false }} />
                        </div>
                    </CardBody>
                </Card>

            </Container>
        </div>
    }
}
export default Results;