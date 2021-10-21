/* API DOCUMENTATION
// If you want to fetch comics and metadata automatically,
// you can use the JSON interface. The URLs look like this:
// https://xkcd.com/info.0.json (current comic)
// or:
// https://xkcd.com/614/info.0.json (comic #614)
// Those files contain, in a plaintext and easily-parsed format: comic titles,
// URLs, post dates, transcripts (when available), and other metadata. 
*/

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

const image_result = document.getElementById("ciw");

// Here is the Controller class for making requests to the API.
// API_URL and FORMAT required separating to account for queries
// involving specific IDs of comics.  (Eg. Comic id 1626 require the
// url to change from the documented: 'https://xkcd.com/info.0.json (current comic)'
// which only displays the latest comic uploaded to the json file, to
// ...//xkcd.com/1626/info.0.json )
class RequestAPI {
  constructor() {
    this.CORS_PROXY = "https://fierce-beach-79817.herokuapp.com/"; // needed to bypass CORS
    this.API_URL = "https://xkcd.com";
    this.API_URL_FORMAT = "info.0.json";
    this.MAX_INDEX_NUMBER = 0; // indicates the max number of comics in json
    this.CURRENT_INDEX_NUMBER = 0; // grabs the current displayed comic id number

    this.getLatestComic();
  }

  // on page load
  // display the current latest comic added to json file on screen
  getLatestComic() {
    const urlRequest = `${this.CORS_PROXY}${this.API_URL}/${this.API_URL_FORMAT}`;

    fetch(urlRequest)
      .then(ResponseStatus)
      .then(json)
      .then((data) => {
        console.log(data.img);
        image_result.innerHTML = `<img src="${data.img}"/>`;
      })
      .catch((err) => {
        console.log("Error occured while loading image..", err);
      });
  }
}

const comic = new RequestAPI();
