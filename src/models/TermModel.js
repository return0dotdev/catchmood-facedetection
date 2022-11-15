import GLOBAL from '../GLOBAL';

export default class TermModel {
    async allTerm(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/course/term/all`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async getTermDashboard(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/dashboard/term`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async getAllTermDashboard(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/dashboard/term/all`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async getTerm(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/course/term`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async createTerm(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("semester", data.semester);
        urlencoded.append("trimester", data.trimester);
        urlencoded.append("status", data.status);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/course/term/create`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async editTerm(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);
        urlencoded.append("semester", data.semester);
        urlencoded.append("trimester", data.trimester);
        urlencoded.append("status", data.status);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/course/term/edit`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async deleteTerm(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/course/term/delete`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

}