import axios from "axios";
import jwt from 'jwt-decode';

const API_URL = "https://localhost:7290/api/Account/";

class AuthService {
    login(login, password) {
        return axios
            .post(API_URL + "login", {
                login,
                password
            })
            .then(response => {
                if (response.data) {
                    const token = response.data;
                    const decoded = jwt(token);
                    const accessToken = token;
                    const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    const user = {
                        id,
                        name,
                        role,
                        accessToken
                    }
                    localStorage.setItem("user", JSON.stringify(user));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(id, username, email, password) {
        return axios.post(API_URL + "signup", {
            id,
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();
