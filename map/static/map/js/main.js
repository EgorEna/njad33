class App {
    constructor() {
        this.map = null;
        this.get_all_points_btn = null;
        this.points_container = null;
    }

    initContent() {
        /**
         * Initializing content
         * @type {HTMLElement}
         */
        this.get_all_points_btn = document.getElementById('get_all_points');
        this.points_container = document.getElementById('points');
    }

    getCookie(name) {
        /**
         * Parsing cookie document and getting particular cookie value
         * @param {String} name The name of particular cookie
         */

        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    sendPoint(path, point) {
        /**
         * Sending new point to API
         * @param {Object} point Point
         */

        const csrfValue = this.getCookie('csrftoken');
        const request = new Request(
            path,
            {
                headers: {
                    'X-CSRFToken': csrfValue,
                    'Content-Type': 'application/json',
                }
            }
        );
        fetch(request, {
            method: 'POST',
            body: JSON.stringify(point),
        })
    }

    initMapEvent() {
        /**
         * Initializing click event on map (getting point and sending request to API)
         */
        this.map.on('click', (e) => {
            const point = {
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
            }

            this.sendPoint('http://127.0.0.1:8000/API/points', point);
        });
    }

    getPoints(path) {
        /**
         * Getting all points from API
         * @param {String} path Path to API to get points
         * @type {XMLHttpRequest}
         */
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            this.points_container.innerHTML = 'Loading...';
            xhr.onload = () => {
                this.points_container.innerHTML = '';
                const points = JSON.parse(xhr.responseText);
                resolve(points);
            }
            xhr.send(null);

        })
    }

    showPoints(points) {
        /**
         * Showing all points on a document
         * @type {string}
         */

        this.points_container.innerHTML = '';
        if (points.length > 0) {
            points.forEach((point, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<p class="point_counter">Point ${index + 1}</p>
                <p>Longitude: ${point.longitude}</p> 
                <p>Latitude: ${point.latitude}</p>`
                this.points_container.appendChild(li)
            })
        } else {
            this.points_container.innerText = 'No clicked points'
        }

    }

    initGetPointsButton() {
        /**
         * Initializing button for getting list of points
         */
        this.get_all_points_btn.addEventListener('click', async () => {
            const points = await this.getPoints('http://127.0.0.1:8000/API/points');
            this.showPoints(points)
        });
    }

    initTileLayer() {
        /**
         * Initializing Tile layer
         */
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; ' +
                '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                'contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            maxzoom: 18,
            accessToken: 'pk.eyJ1IjoibWFudWFsb25sb2NrIiwiYSI6ImNranNyZTR4cjEwOGkycnFoNXVvN241dncifQ.3ZxJDn6t0FAuJXHsfF_Wlg',
        }).addTo(this.map);
    }

    initMap() {
        /**
         * Initializing map
         */
        this.map = L.map('map').setView([53.9006, 27.5590], 13);
        this.initTileLayer();
        this.initMapEvent();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initContent();
            this.initMap();
            this.initGetPointsButton();
        })
    }

}

const app = new App();
app.init()