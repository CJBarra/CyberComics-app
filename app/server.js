const express = require("express");
const app = express();

// Allow PORT to be SET by Heroku or SET default 8080
const port = process.env.PORT || 8080;

app.use(express.static(__dirname));

// SET routes, on app load send a request and respond by rendering FRONTEND from index.
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("app is running..");
});
