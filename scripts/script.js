import Game from "./Game.js";

(() => {
  let eForm = document.querySelector("form"),
    eBtn = eForm.querySelector("button"),
    audio = document.querySelector("[data-js-shuffle]");

  eBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //creation de jeu au click sur jouer
    new Game(eForm.nbPlayers.value);
    //joue effet sonore melange du jeu de cartes
    audio.volume = 0.1;
    audio.play();
  });
})();
