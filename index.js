import express from "express";
import axios from "axios";

//Create server application
const app = express();

//Parse JSON
app.use(express.json());

//Dotenv
// dotenv.config();

//Variables
let port = 5100;
// let localhost = "127.0.0.1";

//Entry route
app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

//Other routes
app.get("/api/hello", async (req, res) => {
  try {
    let queryData = req.query;
    // console.log(queryData);

    let clientIP = req.socket.remoteAddress || req.headers["x-forwarded-for"];

    let ipResponse = await axios.get("https://ipapi.co/json/");

    let location = ipResponse;
    // console.log(location);

    let weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.data.city}&appid=fec2e968bd33b3fd04023b0be3ecd320&units=metric`
    );

    console.log(weather);

    res.status(200).json({
      client_ip: clientIP,
      location: location.data.city,
      greeting: `Hello, ${
        queryData.visitor_name
      }!, the temperature is ${Math.ceil(
        weather.data.main.temp
      )} degrees Celcius in ${location.data.city}`,
    });
  } catch (error) {
    res.status(500).send("Something went wrong! Please check and try again.");
  }
});

app.use("*", (req, res) => {
  res
    .status(400)
    .send("You entered the wrong endpoint! Please check and try again.");
});

try {
  app.listen(port, () => {
    console.log(`Server is listening on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
}
