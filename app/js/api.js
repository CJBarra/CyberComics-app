/* API DOCUMENTATION
// If you want to fetch comics and metadata automatically,
// you can use the JSON interface. The URLs look like this:
// https://xkcd.com/info.0.json (current comic)
// or:
// https://xkcd.com/614/info.0.json (comic #614)
// Those files contain, in a plaintext and easily-parsed format: comic titles,
// URLs, post dates, transcripts (when available), and other metadata. 
*/

/*
// CORS ANYWHERE GIT REPO:
// https://github.com/Rob--W/cors-anywhere.git
// this repo creates a Nodejs proxy that adds cors headers to proxied requests.
// In this case, the request to the xkcd API. This prevents the request throwing  
// a 'no-cors' mode error.
*/

// Here is the Controller class for making requests to the API.
// API_URL and FORMAT required separating to account for queries
// involving specific IDs of comics.
// (Eg. Comic id 1626 require the url to change from the documented:
// 'https://xkcd.com/info.0.json (current comic)'
// which only displays the latest comic uploaded to the json file, to
// '...//xkcd.com/1626/info.0.json' )

import { ResponseStatus, json, setControlVisibility } from './helpers.js';

export default class RequestAPI {
    constructor() {
        // Heroku proxy serves up CORS headers needed in request to api
        this.CORS_PROXY = 'https://fierce-beach-79817.herokuapp.com';
        this.API_URL = 'https://xkcd.com';
        this.API_URL_FORMAT = 'info.0.json';
        this.MAX_ID_NUM = 0; // indicates the max number of comics in json
        this.CURRENT_ID = 0; // grabs the current displayed comic id number
        this.REGEX = /(?:<<|>>)/gim; // Regular expression used to format sound effects in transcript

        this.controls = {
            next: document.getElementById('btn-next'),
            prev: document.getElementById('btn-prev'),
            random: document.getElementById('btn-random'),
            btn_collapse: document.getElementById('script-collapse'),
        };

        this.image_context = {
            image_canvas: document.getElementById('content-canvas'),
            image_source: document.getElementById('img-src'),
            image_title: document.getElementById('img-title'),
            image_date: document.getElementById('img-date'),
            image_id: document.getElementById('img-id'),
            image_transcript: document.getElementById('img-transcript'),
        };

        this.getLatestContent();
        this.eventManager();
    }

    // Initial Fetch to API on page load
    // display the current latest comic added to json file on screen
    getLatestContent() {
        const urlRequest = `${this.CORS_PROXY}/${this.API_URL}/${this.API_URL_FORMAT}`;
        fetch(urlRequest)
            .then(ResponseStatus)
            .then(json)
            .then((data) => {
                this.setMaxIdNumber(data.num);
                this.generateContent(data);
            })
            .catch((err) => {
                console.log('Error occured while loading image..', err);
            });

        if (this.CURRENT_ID === this.MAX_ID_NUM) {
            this.controls.next.hidden = true;
        }

    }

    // Generates the content data from API request and,
    // appends to children of 'content-canvas' div
    generateContent(data) {
        this.setCurrentIdNumber(data.num);

        this.image_context.image_id.innerHTML = `${this.CURRENT_ID} /${this.MAX_ID_NUM}`
        this.image_context.image_title.innerHTML = `${data.safe_title}`;
        this.image_context.image_date.innerHTML = `created: ${data.year}/${data.month}/${data.day}`;

        this.image_context.image_source.setAttribute('src', `${data.img}`);
        this.image_context.image_source.setAttribute('alt', `${data.alt}`);

        var length = `${data.transcript}`.length;
        var msg = "Sorry, we don't have a transcript for that one yet.";

        // checks for length of transcript array in json, display or throw default msg
        if (length > 0) {
            this.image_context.image_transcript.innerHTML = `${data.transcript.replace(
                this.REGEX,
                ' * '
            )}`;
        } else {
            this.image_context.image_transcript.innerHTML = `<p>${msg}</p>`;
        }

        setControlVisibility(this.CURRENT_ID, this.MAX_ID_NUM);

        this.image_context.image_canvas.classList.add('flex');
    }

    // GETS
    getContentById(id) {
        const urlRequest = `${this.CORS_PROXY}/${this.API_URL}/${id}/${this.API_URL_FORMAT}`;

        fetch(urlRequest)
            .then(ResponseStatus) // Check response status, if fail, throw error code
            .then(json)
            .then((data) => {
                // generate image content by specified id
                this.generateContent(data);
            })
            .catch((err) => {
                console.log('Error occured while loading image..', err);
            });
    }

    getRandomId() {
        const min = 1;
        const max = this.MAX_ID_NUM;

        // Generate random id to be inclusive at min / max values
        const ran = Math.floor(Math.random() * (max - min + 1)) + min;
        return ran;
    }

    // Event Manager for content navigation controllers, aka buttons.
    eventManager() {
        this.controls.prev.addEventListener('click', () => {
            this.getContentById(this.CURRENT_ID - 1);
        });
        this.controls.next.addEventListener('click', () => {
            this.getContentById(this.CURRENT_ID + 1);
        });
        this.controls.random.addEventListener('click', () =>
            this.getContentById(this.getRandomId())
        );

        this.controls.btn_collapse.addEventListener('click', () => {
            this.controls.btn_collapse.classList.toggle('active');

            var context = this.image_context.image_transcript;
            if (context.style.maxHeight) {
                context.style.maxHeight = null;
            } else {
                context.style.maxHeight = context.scrollHeight + 'px';
            }
        });
    }

    // SETS
    setCurrentIdNumber(num) {
        this.CURRENT_ID = num;
    }

    setMaxIdNumber(num) {
        this.MAX_ID_NUM = num;
    }
} // Request_API class

const requestOnLoad = new RequestAPI();
