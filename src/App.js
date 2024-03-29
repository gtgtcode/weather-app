import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import states from "../src/json/states.json";
import dayjs from "dayjs";
import {
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  let localStorageJSON = "";

  if (localStorage.getItem("searchHistory") !== null) {
    localStorageJSON = JSON.parse(
      "[" +
        localStorage
          .getItem("searchHistory")
          .slice(0, localStorage.getItem("searchHistory").length - 1) +
        "]"
    );
  }

  function deleteHistory() {
    localStorage.setItem("searchHistory", "");
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (localStorageJSON !== undefined) {
      setTimeout(() => {
        document.getElementById("history-container").innerHTML = "";
        for (let i = 0; i < localStorageJSON.length; i++) {
          let historyButton = document.createElement("Button");
          historyButton.setAttribute("id", "history-button");
          historyButton.setAttribute(
            "class",
            "w-3/4 container mx-auto m-2 p-4 border border-gray-800 rounded-[40px] text-center"
          );
          historyButton.onclick = function () {
            handleClose();
            document.getElementById("city-search").value =
              localStorageJSON[i][0];
            let rawState = localStorageJSON[i][1];

            for (let x = 0; x < states.length; x++) {
              if (rawState == states[x].state) {
                document.getElementById("state-search").value = states[x].code;
              }
            }
          };

          historyButton.innerHTML = localStorageJSON[i];

          document.getElementById("history-container").append(historyButton);
        }
      }, 300);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  function Search() {
    const cityLocation = document.getElementById("city-search").value;
    const stateLocation = document.getElementById("state-search").value;
    console.log(cityLocation + ", " + stateLocation);
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${
        cityLocation + "," + stateLocation
      },US&units=imperial&appid=98350c03e7de7277f5c99b44dcb2fc51`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (localStorage.getItem("searchHistory") !== null) {
          localStorage.setItem(
            "searchHistory",
            localStorage.getItem("searchHistory") +
              `["` +
              data[0].name +
              `", "` +
              data[0].state +
              `"],`
          );
        } else {
          localStorage.setItem(
            "searchHistory",
            `["` + data[0].name + `", "` + data[0].state + `"],`
          );
        }
        localStorageJSON = JSON.parse(
          "[" +
            localStorage
              .getItem("searchHistory")
              .slice(0, localStorage.getItem("searchHistory").length - 1) +
            "]"
        );

        document.getElementById("location").innerHTML =
          data[0].name + ", " + data[0].state;
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&appid=98350c03e7de7277f5c99b44dcb2fc51`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data.length);
            const currentTemp = data.list[0].main.temp;
            const weatherDesc = data.list[0].weather[0].description;
            weatherDesc[0].toUpperCase();
            const feelsLike = data.list[0].main.feels_like;
            const tempMax = data.list[0].main.temp_max;
            const tempMin = data.list[0].main.temp_min;
            const windSpeed = data.list[0].wind.speed;
            document.getElementById("currentTemp").innerHTML =
              Math.round(currentTemp) + "°";
            document.getElementById("feels-like").innerHTML =
              "Feels like: " + Math.round(feelsLike) + "°";
            document.getElementById("temp-hi").innerHTML =
              "HI: " + Math.round(tempMax) + "°";
            document.getElementById("temp-lo").innerHTML =
              "LO: " + Math.round(tempMin) + "°";
            document.getElementById("wind-speed").innerHTML =
              "Wind: " + Math.round(windSpeed) + "MPH";
            document.getElementById("weather-desc").innerHTML =
              weatherDesc[0].toUpperCase() + weatherDesc.slice(1);

            const dayOne = data.list[8];
            const dayTwo = data.list[16];
            const dayThree = data.list[24];
            const dayFour = data.list[30];
            const dayFive = data.list[38];

            const dayOneTemp = dayOne.main.temp;
            document.getElementById("day-1-temp").innerHTML =
              Math.round(dayOneTemp) + "°";
            const dayTwoDate = dayjs(dayTwo.dt_txt).format("MM/DD");
            const dayTwoTemp = dayTwo.main.temp;
            document.getElementById("day-2-date").innerHTML = dayTwoDate;
            document.getElementById("day-2-temp").innerHTML =
              Math.round(dayTwoTemp) + "°";
            const dayThreeDate = dayjs(dayThree.dt_txt).format("MM/DD");
            const dayThreeTemp = dayThree.main.temp;
            document.getElementById("day-3-date").innerHTML = dayThreeDate;
            document.getElementById("day-3-temp").innerHTML =
              Math.round(dayThreeTemp) + "°";
            const dayFourDate = dayjs(dayFour.dt_txt).format("MM/DD");
            const dayFourTemp = dayFour.main.temp;
            document.getElementById("day-4-date").innerHTML = dayFourDate;
            document.getElementById("day-4-temp").innerHTML =
              Math.round(dayFourTemp) + "°";
            const dayFiveDate = dayjs(dayFive.dt_txt).format("MM/DD");
            const dayFiveTemp = dayFive.main.temp;
            document.getElementById("day-5-date").innerHTML = dayFiveDate;
            document.getElementById("day-5-temp").innerHTML =
              Math.round(dayFiveTemp) + "°";
          });
      });
  }

  React.useEffect(() => {
    const successCallback = (position) => {
      console.log(position);

      fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&apiKey=08c19143a5ad4f4fb25e2bdb2088cf78`
      )
        .then(function (resp) {
          return resp.json();
        }) // Convert data to json
        .then(function (data) {
          console.log(data.features[0].properties);
          let cityLocation = data.features[0].properties.city;
          let stateLocation = data.features[0].properties.state;
          document.getElementById("location").innerHTML =
            cityLocation + ", " + stateLocation;
          fetch(
            `https://api.openweathermap.org/geo/1.0/zip?zip=${data.features[0].properties.postcode},US&appid=98350c03e7de7277f5c99b44dcb2fc51`
          )
            .then((response) => response.json())
            .then((postdata) => {
              console.log(postdata);
              let apiLink = `api.openweathermap.org/data/2.5/forecast?lat=${postdata.lat}&lon=${postdata.lon}&appid=98350c03e7de7277f5c99b44dcb2fc51`;
              console.log(apiLink);
              fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${postdata.lat}&lon=${postdata.lon}&units=imperial&appid=98350c03e7de7277f5c99b44dcb2fc51`
              )
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  const currentTemp = data.list[0].main.temp;
                  const weatherDesc = data.list[0].weather[0].description;
                  weatherDesc[0].toUpperCase();
                  const feelsLike = data.list[0].main.feels_like;
                  const tempMax = data.list[0].main.temp_max;
                  const tempMin = data.list[0].main.temp_min;
                  const windSpeed = data.list[0].wind.speed;
                  document.getElementById("currentTemp").innerHTML =
                    Math.round(currentTemp) + "°";
                  document.getElementById("feels-like").innerHTML =
                    "Feels like: " + Math.round(feelsLike) + "°";
                  document.getElementById("temp-hi").innerHTML =
                    "HI: " + Math.round(tempMax) + "°";
                  document.getElementById("temp-lo").innerHTML =
                    "LO: " + Math.round(tempMin) + "°";
                  document.getElementById("wind-speed").innerHTML =
                    "Wind: " + Math.round(windSpeed) + "MPH";
                  document.getElementById("weather-desc").innerHTML =
                    weatherDesc[0].toUpperCase() + weatherDesc.slice(1);

                  const dayOne = data.list[8];
                  const dayTwo = data.list[16];
                  const dayThree = data.list[24];
                  const dayFour = data.list[30];
                  const dayFive = data.list[38];

                  const dayOneTemp = dayOne.main.temp;
                  document.getElementById("day-1-temp").innerHTML =
                    Math.round(dayOneTemp) + "°";
                  const dayTwoDate = dayjs(dayTwo.dt_txt).format("MM/DD");
                  const dayTwoTemp = dayTwo.main.temp;
                  document.getElementById("day-2-date").innerHTML = dayTwoDate;
                  document.getElementById("day-2-temp").innerHTML =
                    Math.round(dayTwoTemp) + "°";
                  const dayThreeDate = dayjs(dayThree.dt_txt).format("MM/DD");
                  const dayThreeTemp = dayThree.main.temp;
                  document.getElementById("day-3-date").innerHTML =
                    dayThreeDate;
                  document.getElementById("day-3-temp").innerHTML =
                    Math.round(dayThreeTemp) + "°";
                  const dayFourDate = dayjs(dayFour.dt_txt).format("MM/DD");
                  const dayFourTemp = dayFour.main.temp;
                  document.getElementById("day-4-date").innerHTML = dayFourDate;
                  document.getElementById("day-4-temp").innerHTML =
                    Math.round(dayFourTemp) + "°";
                  const dayFiveDate = dayjs(dayFive.dt_txt).format("MM/DD");
                  const dayFiveTemp = dayFive.main.temp;
                  document.getElementById("day-5-date").innerHTML = dayFiveDate;
                  document.getElementById("day-5-temp").innerHTML =
                    Math.round(dayFiveTemp) + "°";
                });
            });
        })
        .catch(function () {
          console.log("couldn't load");
        });
    };

    const errorCallback = (error) => {
      console.log(error);
      const fallbackDefault = "Richmond";
      document.getElementById("location").innerHTML = "Richmond, Virginia";
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=37.5385&lon=-77.4342&units=imperial&apiKey=98350c03e7de7277f5c99b44dcb2fc51`
      )
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("searchHistory", "[Richmond,Virginia]");
          console.log(data);
          const currentTemp = data.list[0].main.temp;
          const weatherDesc = data.list[0].weather[0].description;
          weatherDesc[0].toUpperCase();
          const feelsLike = data.list[0].main.feels_like;
          const tempMax = data.list[0].main.temp_max;
          const tempMin = data.list[0].main.temp_min;
          const windSpeed = data.list[0].wind.speed;
          document.getElementById("currentTemp").innerHTML =
            Math.round(currentTemp) + "°";
          document.getElementById("feels-like").innerHTML =
            "Feels like: " + Math.round(feelsLike) + "°";
          document.getElementById("temp-hi").innerHTML =
            "HI: " + Math.round(tempMax) + "°";
          document.getElementById("temp-lo").innerHTML =
            "LO: " + Math.round(tempMin) + "°";
          document.getElementById("wind-speed").innerHTML =
            "Wind: " + Math.round(windSpeed) + "MPH";
          document.getElementById("weather-desc").innerHTML =
            weatherDesc[0].toUpperCase() + weatherDesc.slice(1);

          const dayOne = data.list[8];
          const dayTwo = data.list[16];
          const dayThree = data.list[24];
          const dayFour = data.list[30];
          const dayFive = data.list[38];

          const dayOneTemp = dayOne.main.temp;
          document.getElementById("day-1-temp").innerHTML =
            Math.round(dayOneTemp) + "°";
          const dayTwoDate = dayjs(dayTwo.dt_txt).format("MM/DD");
          const dayTwoTemp = dayTwo.main.temp;
          document.getElementById("day-2-date").innerHTML = dayTwoDate;
          document.getElementById("day-2-temp").innerHTML =
            Math.round(dayTwoTemp) + "°";
          const dayThreeDate = dayjs(dayThree.dt_txt).format("MM/DD");
          const dayThreeTemp = dayThree.main.temp;
          document.getElementById("day-3-date").innerHTML = dayThreeDate;
          document.getElementById("day-3-temp").innerHTML =
            Math.round(dayThreeTemp) + "°";
          const dayFourDate = dayjs(dayFour.dt_txt).format("MM/DD");
          const dayFourTemp = dayFour.main.temp;
          document.getElementById("day-4-date").innerHTML = dayFourDate;
          document.getElementById("day-4-temp").innerHTML =
            Math.round(dayFourTemp) + "°";
          const dayFiveDate = dayjs(dayFive.dt_txt).format("MM/DD");
          const dayFiveTemp = dayFive.main.temp;
          document.getElementById("day-5-date").innerHTML = dayFiveDate;
          document.getElementById("day-5-temp").innerHTML =
            Math.round(dayFiveTemp) + "°";
        });
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <header className="w-full bg-gray-700">
          <p className="p-4 text-center font-bold">Weather App</p>
        </header>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="container absolute top-1/2 left-1/2 mx-auto h-[600px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[40px] bg-gray-700 ">
            <p className="p-6 text-center">Search History</p>
            <div
              id="history-container"
              className="container mx-auto h-[400px] w-full overflow-auto text-center"
            ></div>
            <div className="mt-10 text-center">
              <Button
                variant="outlined"
                startIcon={<DeleteSweepIcon />}
                onClick={() => {
                  deleteHistory();
                  handleClose();
                  setTimeout(() => {
                    Search();
                  }, 600);
                }}
              >
                Clear History
              </Button>
            </div>
          </Box>
        </Modal>
        <div
          id="search-container"
          className="sm-only:w-[22rem] container relative relative mx-auto mt-4 rounded-[40px] bg-gray-700 p-4 text-center md:w-[30rem] md:pb-10"
        >
          <TextField
            id="city-search"
            label="City"
            variant="outlined"
            size="small"
            className="w-[200px] md:mr-2"
          ></TextField>
          <TextField
            id="state-search"
            label="State"
            variant="outlined"
            size="small"
            className="!ml-4 w-[100px]"
            inputProps={{ maxLength: 2 }}
          ></TextField>
          <div className="mt-4 block md:hidden"></div>
          <Button
            variant="contained"
            disableElevation
            className="sm-only:!mt-2 sm:!ml-0 md:!ml-4 md:!mt-[0.09rem]"
            startIcon={<SearchIcon />}
            onClick={Search}
          >
            Search
          </Button>
          <IconButton
            aria-label="history dropdown"
            className="!absolute sm:bottom-4 sm:left-10 sm:translate-x-0 md:bottom-0 md:left-1/2 md:-translate-x-1/2"
            onClick={handleOpen}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </div>
        <div
          id="mainContainer"
          className="container relative mx-auto mt-4 h-[22rem] w-[22rem] rounded-[40px] bg-gray-700 p-4"
        >
          <p id="location" className="pl-4"></p>
          <p
            id="rain-chance-container"
            className="absolute right-[2rem] top-[1rem]"
          >
            TODAY
          </p>
          <div id="temp-container" className="relative">
            <h1 id="currentTemp" className="pl-5 text-[6rem]"></h1>
            <p
              id="feels-like"
              className="absolute left-[12rem] top-[1.75rem]"
            ></p>
            <p
              id="wind-speed"
              className="absolute top-[3.75rem] left-[12rem]"
            ></p>
            <p
              id="weather-desc"
              className="absolute top-[5.75rem] left-[12rem]"
            ></p>
          </div>
          <div
            id="high-low-container"
            className="container relative mx-auto w-[60%]"
          >
            <p id="temp-hi" className="float-left"></p>
            <div
              id="divider"
              className="absolute top-1/2 left-1/2 h-[1px] w-[50px] -translate-x-1/2 translate-y-[12px] border-t"
            ></div>
            <p id="temp-lo" className="float-right"></p>
          </div>
        </div>
        <div
          id="five-day-container"
          className="md-only:grid-rows-2 container mx-auto mt-4 grid gap-4 max-sm:block md:grid-cols-3 lg:grid-cols-5"
        >
          <div
            id="day-1"
            className="container relative mx-auto rounded-[40px] bg-gray-700 max-md:h-[6rem] max-md:w-[22rem]  md:h-[16rem] md:w-[10rem]"
          >
            <div
              id="day-1-date"
              className="absolute text-right max-md:top-2 max-md:right-10 md:top-4 md:right-6"
            >
              TMRW.
            </div>
            <div
              id="day-1-temp"
              className="text-[3rem] max-md:pt-2 max-md:pl-10 md:pt-10 md:pl-3 md:text-center"
            ></div>
          </div>
          <div
            id="day-2"
            className="container relative mx-auto rounded-[40px] bg-gray-700 max-md:mt-4 max-md:h-[6rem] max-md:w-[22rem] md:h-[16rem] md:w-[10rem]"
          >
            <div
              id="day-2-date"
              className="absolute text-right max-md:top-2 max-md:right-10 md:top-4 md:right-6"
            ></div>
            <div
              id="day-2-temp"
              className="text-[3rem] max-md:pt-2 max-md:pl-10 md:pt-10 md:pl-3 md:text-center"
            ></div>
          </div>
          <div
            id="day-3"
            className="container relative mx-auto rounded-[40px] bg-gray-700 max-md:mt-4 max-md:h-[6rem] max-md:w-[22rem] md:h-[16rem] md:w-[10rem]"
          >
            <div
              id="day-3-date"
              className="absolute text-right max-md:top-2 max-md:right-10 md:top-4 md:right-6"
            ></div>
            <div
              id="day-3-temp"
              className="text-[3rem] max-md:pt-2 max-md:pl-10 md:pt-10 md:pl-3 md:text-center"
            ></div>
          </div>
          <div
            id="day-4"
            className="container relative mx-auto rounded-[40px] bg-gray-700 max-md:mt-4 max-md:h-[6rem] max-md:w-[22rem]  md:h-[16rem] md:w-[10rem]"
          >
            <div
              id="day-4-date"
              className="absolute text-right max-md:top-2 max-md:right-10 md:top-4 md:right-6"
            ></div>
            <div
              id="day-4-temp"
              className="text-[3rem] max-md:pt-2 max-md:pl-10 md:pt-10 md:pl-3 md:text-center"
            ></div>
          </div>
          <div
            id="day-5"
            className="container relative mx-auto rounded-[40px] bg-gray-700 max-md:mt-4 max-md:mb-4 max-md:h-[6rem] max-md:w-[22rem] md:h-[16rem] md:w-[10rem] "
          >
            <div
              id="day-5-date"
              className="absolute text-right max-md:top-2 max-md:right-10 md:top-4 md:right-6"
            ></div>
            <div
              id="day-5-temp"
              className="text-[3rem] max-md:pt-2 max-md:pl-10 md:pt-10 md:pl-3 md:text-center"
            ></div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
