"use strict";

const authorEl = document.getElementById("author");
const cryptoEl = document.getElementById("crypto");
const timeEl = document.getElementById("time");
const weatherEl = document.getElementById("weather");
const quoteEl = document.getElementById("quote");
const formEl = document.getElementById("focus-form");
const focusTitle = document.querySelector(".daily-focus-title");
const focusInput = document.querySelector(".daily-focus-input");

const unsplashUrl =
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature";
const cryptoUrl = "https://api.coingecko.com/api/v3/coins/dogecoin";
const baseWeatherUrl =
  "https://apis.scrimba.com/openweathermap/data/2.5/weather";
const randomQuoteUrl = "https://api.quotable.io/random";

fetch(unsplashUrl)
  .then((res) => {
    if (!res.ok) throw new Error(`Couldn't get an image: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    const imgUrl = data.urls.full;
    const author = data.user.name;
    console.log(author, imgUrl);
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.1)), url(${imgUrl})`;
    authorEl.textContent = `Image by: ${author}`;
  })
  .catch((err) => {
    console.error(`Something went wrong 😱 ${err}`);
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.1)), url("https://images.unsplash.com/38/L2NfDz5SOm7Gbf755qpw_DSCF0490.jpg?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYxNzgwMDk&ixlib=rb-1.2.1&q=85")`;
    authorEl.textContent = "Image by: Tyssul Patel";
  });

fetch(cryptoUrl)
  .then((res) => {
    if (!res.ok) throw new Error(`Couldn't get crypt data: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    const html = `
    <div class="crypto-top">
        <img src=${data.image.thumb} alt="${data.name}"/>
        <span class="crypto-name">${data.name}</span>
    </div>
    <div class="crypto-bottom">
        <p>🎯: ${data.market_data.current_price.eur}</p>
        <p>👆: ${data.market_data.high_24h.eur}</p>
        <p>👇: ${data.market_data.low_24h.eur}</p>
    </div>

    `;
    cryptoEl.innerHTML = html;
  })
  .catch((err) => {
    console.error(err);
    cryptoEl.textContent = "Crypto info currently unavailable";
  });

function getCurrentTime() {
  let time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  timeEl.textContent = time;
}

let interval = setInterval(getCurrentTime, 1000);
// clearInterval(interval);

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  fetch(`${baseWeatherUrl}?lat=${latitude}&lon=${longitude}&units=metric`)
    .then((res) => {
      if (!res.ok) throw new Error(`Weather data not available`);
      return res.json();
    })
    .then((data) => {
      const iconSrc = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
      const currentTemperature = Math.round(data.main.temp);
      const currentLocationName = data.name;

      const html = `
      <div class="weather-top">
        <img class="weather-img" alt="${iconDescription}" src="http://openweathermap.org/img/wn/${iconSrc}@2x.png"/>
        <p>${currentTemperature}°</p>
        </div>
      <div class="weather-bottom">
        <p>${currentLocationName}</p>
      </div>
      `;

      weatherEl.innerHTML = html;
    })
    .catch((err) => console.error(err));
});

fetch(randomQuoteUrl)
  .then((res) => {
    if (!res.ok) throw new Error(`Quote not found`);
    return res.json();
  })
  .then((data) => {
    console.log(data);
    const quote = data.content;
    const author = data.author;
    const html = `
    <h2 class="quote-text">"${quote}"</h2>
    <p class="quote-author">${author}</p>
    `;
    quoteEl.innerHTML = html;
  })
  .catch((err) => console.error(err));

function setDailyFocus(e) {
  e.preventDefault();
  setWithExpiry(`Your today's main focus`, focusInput.value);
  showDailyFocus();
}

function showDailyFocus() {
  const focusValue = getWithExpiry(`Your today's main focus`);
  if (!focusValue) return;
  const submittedFocus = document.createElement("h3");
  submittedFocus.classList.add("daily-focus-value");
  submittedFocus.textContent = focusValue;
  formEl.replaceChild(submittedFocus, focusInput);
  focusTitle.textContent = `Your today's main focus`;
  focusTitle.style.textTransform = "uppercase";
  focusTitle.style.textDecoration = "underline";
}

showDailyFocus();

formEl.addEventListener("submit", setDailyFocus);

// Storing data - localStorage

function setWithExpiry(key, value) {
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 0);
  const midnightTimestamp = midnight.getTime();
  const item = {
    value,
    expiry: midnightTimestamp,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  const now = new Date();
  const timestampNow = now.getTime();
  if (timestampNow > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
