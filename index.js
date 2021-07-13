const authorEl = document.getElementById("author");
const cryptoEl = document.getElementById("crypto");

const unsplashUrl =
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature";

const cryptoUrl = "https://api.coingecko.com/api/v3/coins/dogecoin";

fetch(unsplashUrl)
  .then((res) => {
    if (!res.ok) throw new Error(`Oopsie doopsie: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    const imgUrl = data.urls.full;
    const author = data.user.name;
    console.log(author, imgUrl);
    document.body.style.backgroundImage = `url(${imgUrl})`;
    authorEl.textContent = `By: ${author}`;
  })
  .catch((err) => {
    console.error(`Something went wrong 😱 ${err}`);
    document.body.style.backgroundImage =
      'url("https://images.unsplash.com/38/L2NfDz5SOm7Gbf755qpw_DSCF0490.jpg?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjYxNzgwMDk&ixlib=rb-1.2.1&q=85")';
    authorEl.textContent = "By: Tyssul Patel";
  });

fetch(cryptoUrl)
  .then((res) => {
    if (!res.ok) throw new Error(`Oopsie doopsie: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    console.log(data);
    let html = `
    <div class="crypto-top">
        <img src=${data.image.thumb} alt=${data.name}/>
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
