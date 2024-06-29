"use strict"
const search = document.querySelector("#search");
const submit = document.querySelector("#submit");
const weatherDis = document.querySelector(".row");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const base = `https://api.weatherapi.com/v1`;
const apiKey = 'd0ad977c2b5245b186e223932242506';

// geolocation
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                console.log('Latitude:', lat);
                console.log('Longitude:', long);
                resolve({ lat, long });
            }, (error) => {
                reject(error);
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        };
    });
};

async function getCurrentWeather(lat, long) {
    try {
        let response = await fetch(`${base}/forecast.json?key=${apiKey}&q=${lat},${long}&days=3`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error)
        throw error;
    };
};

async function getLocationAndWeather() {
    try {
        let location = await getCurrentLocation(); //{lat, long}
        let weather = await getCurrentWeather(location.lat, location.long);
        displayWeather(weather)
    } catch (err) {
        console.error('faild to get location and weather', err);
    };
};

getLocationAndWeather();


// API function to fetch weather data
async function api(countryName = 'alexandria') {
    try {
        let response = await fetch(`${base}/forecast.json?key=${apiKey}&q=${countryName}&days=3`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

// Display weather function
function displayWeather(data) {
    let box = '';
    let currentDate = new Date();
    box += `
        <div class="col-lg-4 forecast mb-3 rounded p-0 pb-3 border">
            <div class="card-header d-flex justify-content-between py-2 px-3 rounded">
                <h5 class="m-0">${days[currentDate.getDay()]}</h5>
                <h5 class="m-0"><span>${currentDate.getDate()}</span>${months[currentDate.getMonth()]}</h5>
            </div>
            <h3 class="my-5 ms-4">${data.location.name}</h3>
            <div class="status d-flex justify-content-evenly align-items-center">
                <h1 class="fw-bold">${data.current.temp_c}<sup>o</sup>C</h1>
                <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
            </div>
            <span class="text-primary mt-3 ms-4 mb-3">${data.current.condition.text}</span>
            <div class="d-flex justify-content-start gap-4 m-4">
                <div class="d-flex">
                        <div class="me-2">
                            <img src="images/icon-umberella.png" class="w-100" alt="umbrella-icon">
                        </div>
                        <span>20%</span>
                </div>
                <div class="d-flex">
                        <div class="me-2">
                            <img src="images/icon-wind.png" alt="umbrella-icon">
                        </div>    
                        <span>${data.current.wind_kph}km/h</span>
                </div>
                <div class="d-flex">
                        <div class="me-2">
                            <img src="images/icon-compass.png" alt="umbrella-icon">
                        </div>
                        <span>East</span>
                </div>
                
            </div>
        </div>
    `;
    for (let i = 1; i < data.forecast.forecastday.length; i++) {
        let forecast = data.forecast.forecastday[i];
        let forecastDate = new Date(forecast.date);
        box += `
            <div class="col-lg-4 forecast mb-3 rounded p-0 pb-3 border">
                <div class="card-header d-flex justify-content-between text-center py-2 px-3 rounded">
                    <h5 class="m-0">${days[(currentDate.getDay() + i) % 7]}</h5>
                    <h5 class="m-0"><span>${forecastDate.getDate()}</span> ${months[forecastDate.getMonth()]}</h5>
                </div>
                <div class="status d-flex flex-column align-items-center justify-content-center">
                <img class="mt-4 pt-3" src="https:${forecast.day.condition.icon}" alt="${forecast.day.condition.text}">
                    <h1 class="fw-bold mb-2 ms-4">${forecast.day.maxtemp_c}<sup>o</sup>C</h1>
                    <h5> ${forecast.day.mintemp_c}<sup>o</sup>C</h5>
                </div>
                <span class="text-primary mt-3 ms-4 mb-3">${forecast.day.condition.text}</span>
            </div>
        `;
    }
    weatherDis.innerHTML = box;
}



submit.addEventListener("click", async function () {
    if (search.value === "") {
        return;
    }
    try {
        let data = await api(search.value);
        displayWeather(data);
        search.value = "";
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});

// document.addEventListener('keydown', (e)=>{console.log(e.key)})

document.addEventListener("keydown", async function (e) {
    if (e.key == "Enter") {
        e.preventDefault();
        if (search.value === "") {
            return;
        }
        try {
            let data = await api(search.value);
            displayWeather(data);
            search.value = "";
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }
});

// search 
async function searchCities(query) {
    try {
        let response = await fetch(`${base}/forecast.json?key=${apiKey}&q=${query}&days=3`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
search.addEventListener("input", async function () {
    if (search.value === "") {
        return;
    }
    try {
        let data = await searchCities(search.value.trim());
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
})