import GLOBAL from '../GLOBAL';

export default class TeachingModel {
    async allTeaching(data) {
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

        return fetch(`${GLOBAL.URL}/api/teaching/all`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async getTeaching(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);
        urlencoded.append("teachKey", data.teachKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/teaching`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async createTeaching(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);
        urlencoded.append("subject", data.subject);
        urlencoded.append("date", data.date);
        urlencoded.append("description", data.description);
        urlencoded.append("status", data.status);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/teaching/create`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async editTeaching(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);
        urlencoded.append("teachKey", data.teachKey);
        urlencoded.append("subject", data.subject);
        urlencoded.append("date", data.date);
        urlencoded.append("description", data.description);
        urlencoded.append("link_video", data.link_video);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/teaching/edit`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async deleteTeaching(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);
        urlencoded.append("teachKey", data.teachKey);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/teaching/delete`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }


    // Emotion--------------------------------------------------------------------

    async endEmotion(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("uid", data.uid);
        urlencoded.append("courseKey", data.courseKey);
        urlencoded.append("termKey", data.termKey);
        urlencoded.append("teachKey", data.teachKey);
        urlencoded.append("anger", data.anger);
        urlencoded.append("anxiety", data.anxiety);
        urlencoded.append("joy", data.joy);
        urlencoded.append("disgust", data.disgust);
        urlencoded.append("surprise", data.surprise);
        urlencoded.append("natural", data.natural);
        urlencoded.append("link_video", data.link_video);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/emotion/end`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }

    async startEmotion(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: '',
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/emotion/start`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }


    async deleteVideo(data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("filename", data.filename);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(`${GLOBAL.URL}/api/record/delete`, requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            }).catch((error) => {
                console.error(error);
            });
    }
}