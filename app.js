const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');
const errorMessage = document.querySelector('.error');
//omkar --> 8zWQt8DgppmWPGsnKmGuzD14T6Zya8dd
const key = 'vQZtIPn400ivwGMrUZLkA3SK9JR6tPra';

// Function to update the UI
const updateUI = (data) => {
    const { cityDets, weather } = data;

    // Update the details section
    details.innerHTML = `
        <h5 class="my-3 text-light">${cityDets.EnglishName}</h5>
        <div class="my-3 text-light txt">${weather.WeatherText}</div>
        <div class="display-4 my-4">
            <span class="text-light">${weather.Temperature.Metric.Value}</span>
            <span class="text-light">&deg;C</span>
        </div>
        <div class="detail">
            <div class="col">
                <img src="images/humidity.png" alt="">
                <div>
                    <p class="humidity">${weather.RelativeHumidity}%</p>
                    <p>Humidity</p>
                </div>
            </div>
            <div class="col">
                <img src="images/wind.png" alt="">
                <div>
                    <p class="wind">${weather.Wind.Speed.Metric.Value}Km/h</p>
                    <p>Wind Speed</p>
                </div>
            </div>
        </div>
    `;

    // Update the time and icon images
    const iconSrc = `images/${weather.WeatherIcon}.png`; //png jpg
    icon.setAttribute('src', iconSrc);
    const timeSrc = weather.IsDayTime ? 'images/day.svg' : 'images/night.svg';
    time.setAttribute('src', timeSrc);

    // Show the card if it was hidden
    card.classList.remove('d-none');
    errorMessage.style.display = 'none';
};

// Fetch city information
const getCity = async (city) => {
    const base = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    const query = `?apikey=${key}&q=${city}`;
    const response = await fetch(base + query);
    const data = await response.json();

    if (data && data.length > 0) {
        return data[0];
    } else {
        throw new Error('City not found');
    }
};

// Fetch weather information
const getWeather = async (id) => {
    const base = 'https://dataservice.accuweather.com/currentconditions/v1/';
    const query = `${id}?apikey=${key}&details=true`;
    const response = await fetch(base + query);
    const data = await response.json();

    if (data && data.length > 0) {
        return data[0];
    } else {
        throw new Error('Weather data not found');
    }
};

// Update city and weather data
const updateCity = async (city) => {
    const cityDets = await getCity(city);
    const weather = await getWeather(cityDets.Key);
    return { cityDets, weather };
};

// Event listener for form submission
cityForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const city = cityForm.city.value.trim();
    cityForm.reset();

    // Hide the card and error message initially
    card.classList.add('d-none');
    errorMessage.style.display = 'none';

    updateCity(city)
        .then((data) => updateUI(data))
        .catch((err) => {
            console.error('Error:', err);
            errorMessage.style.display = 'block';
        });
});
