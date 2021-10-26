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
 Author: Christian Barratt,
 Description: Case Study - Create and host a web server on Heroku,
 using javascript only. Vanilla css must also be used for Frontend.
 
 live url: https://dry-ravine-90752.herokuapp.com/
  */
// Here is the Controller class for making requests to the API.
// API_URL and FORMAT required separating to account for queries
// involving specific IDs of comics.
// (Eg. Comic id 1626 require the url to change from the documented:
// 'https://xkcd.com/info.0.json (current comic)'
// which only displays the latest comic uploaded to the json file, to
// '...//xkcd.com/1626/info.0.json' )
class RequestAPI {
  constructor() {
    // Heroku proxy server needed to bypass CORS
    this.CORS_PROXY = "https://fierce-beach-79817.herokuapp.com";
    this.API_URL = "https://xkcd.com";
    this.API_URL_FORMAT = "info.0.json";
    this.MAX_ID_NUM = 0; // indicates the max number of comics in json
    this.CURRENT_ID = 0; // grabs the current displayed comic id number
    this.REGEX = /(?:<<|>>)/gim; // Regular expression used to format sound effects in transcript

    this.controls = {
      next: document.getElementById("btn-next"),
      prev: document.getElementById("btn-prev"),
      random: document.getElementById("btn-random"),
      btn_collapse: document.getElementById("script-collapse"),
    };

    this.image_context = {
      loader: document.getElementById("loader"),
      image_canvas: document.getElementById("content-canvas"),
      image_source: document.getElementById("img-src"),
      image_title: document.getElementById("img-title"),
      image_date: document.getElementById("img-date"),
      image_transcript: document.getElementById("img-transcript"),
    };

    this.getLatestContent();
    this.eventManager();
  }

  // Event Manager for content navigation controllers, aka buttons.
  eventManager() {
    this.controls.random.addEventListener("click", () =>
      this.getContentById(this.getRandomId())
    );
    this.controls.prev.addEventListener("click", () =>
      this.getContentById(this.CURRENT_ID - 1)
    );
    this.controls.next.addEventListener("click", () =>
      this.getContentById(this.CURRENT_ID + 1)
    );

    this.controls.btn_collapse.addEventListener("click", () => {
      this.controls.btn_collapse.classList.toggle("active");

      var context = this.image_context.image_transcript;
      if (context.style.maxHeight) {
        context.style.maxHeight = null;
      } else {
        context.style.maxHeight = context.scrollHeight + "px";
      }
    });
  }

  generateContent(data) {
    this.image_context.image_title.innerHTML = `${data.safe_title}`;
    this.image_context.image_date.innerHTML = `created: ${data.year}/${data.month}/${data.day}`;

    this.image_context.image_source.setAttribute("src", `${data.img}`);
    this.image_context.image_source.setAttribute("alt", `${data.alt}`);

    var length = `${data.transcript}`.length;

    if (length > 0) {
      this.image_context.image_transcript.innerHTML = `${data.transcript.replace(
        this.REGEX,
        " * "
      )}`;
    } else {
      this.image_context.image_transcript.innerHTML = `<p>Sorry, we don't have a transcript for that one yet.</p>`;
    }
  }

  // Initial Fetch to API on page load
  // display the current latest comic added to json file on screen
  getLatestContent() {
    const urlRequest = `${this.CORS_PROXY}/${this.API_URL}/${this.API_URL_FORMAT}`;
    fetch(urlRequest)
      .then(ResponseStatus)
      .then(json)
      .then((data) => {
        this.generateContent(data);

        this.setCurrentIdNumber(data.num);
        this.setMaxIdNumber(data.num);

        this.image_context.image_canvas.classList.add("flex");
      })
      .catch((err) => {
        console.log("Error occured while loading image..", err);
      });

    this.image_context.loader.classList.add("d-none");
  }

  // GETS
  getContentById(id) {
    const urlRequest = `${this.CORS_PROXY}/${this.API_URL}/${id}/${this.API_URL_FORMAT}`;

    fetch(urlRequest)
      .then(ResponseStatus) // Check response status, if fail, throw error code
      .then(json)
      .then((data) => {
        // generate image content
        this.generateContent(data);
        this.setCurrentIdNumber(data.num);
      })
      .catch((err) => {
        console.log("Error occured while loading image..", err);
      });
  }

  getRandomId() {
    const min = 1;
    const max = this.MAX_ID_NUM;
    const ran = Math.floor(Math.random() * (max - min + 1)) + min;
    return ran;
  }

  // SETS
  setCurrentIdNumber(num) {
    this.CURRENT_ID = num;
  }

  setMaxIdNumber(num) {
    this.MAX_ID_NUM = num;
  }
} // Request_API class

function ResponseStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(new Error(res.status));
  }
}

function json(res) {
  return res.json();
}

const requestOnLoad = new RequestAPI();
