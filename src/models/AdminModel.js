import GLOBAL from '../GLOBAL';

export default class AdminModel {
    
    async checkLogin(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", data.username);
        urlencoded.append("password", data.password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/user/login`, requestOptions )
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async insertAdmin(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("firstname", data.firstname);
        urlencoded.append("lastname", data.lastname);
        urlencoded.append("insittution", data.insittution);
        urlencoded.append("major", data.major);
        urlencoded.append("username", data.username);
        urlencoded.append("password", data.password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/user/register`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    
    async EditAdmin(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();

        urlencoded.append("uid", data.uid);
        urlencoded.append("firstname", data.firstname);
        urlencoded.append("lastname", data.lastname);
        urlencoded.append("insittution", data.insittution);
        urlencoded.append("major", data.major);
        urlencoded.append("username", data.username);
        urlencoded.append("password", data.password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/user/edit`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }
}