const unsplashUrl =
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature";

fetch(unsplashUrl)
  .then((res) => res.json())
  .then((data) => {
    const imgUrl = data.urls.full;
    document.body.style.backgroundImage = `url(${imgUrl})`;
  });
