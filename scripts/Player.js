import Card from "./Card.js";

export default class Player {
  //a true si joueur est la banque
  constructor(nb, bank = false) {
    this._name = "player" + nb;
    this._parent = document.querySelector("[data-js-players]");
    this._bank = bank;
    this._score = 0;
    this._avatar = `./img/icon/player${Math.floor(Math.random() * 7)}.png`;
    this._state = "palying";
    this._audio = document.querySelector("[data-js-draw]");
    this._turn = false;
    this._dialog = [
      "C'est mon tour!",
      "À moi!",
      "C'est à moi",
      "Mon tour",
      "Je joue",
    ];

    this.init();
  }

  init = () => {
    this.createPlayerUI();
  };

  incrementScore = (score) => {
    this._score += score;
  };

  //creation element du joueur
  createPlayerUI = () => {
    let div = ` <div class='player ${this._name}' data-js-player>
                    <div class="hand flex" data-js-hand>
                    </div>
                    <div class="player-ui center">
                        <div class="action flex">
                            <button class="play btn-green" data-js-play>Jouer</button>
                            <button class="stop btn-red" data-js-stop>Arrêter</button>
                        </div>
                        <div class="profile">
                            <span class='player-name'>${this._name}</span>
                            <img src=${
                              this._avatar
                            } class="profile" data-js-avatar/>
                            <div class='hidden' data-js-bubble>
                              <p>${
                                this._dialog[
                                  Math.floor(
                                    Math.random() * (this._dialog.length - 1)
                                  )
                                ]
                              }</p>
                            </div>
                            <div data-js-score>                              
                                <span>0</span>                             
                            </div>
                        </div>
                    </div>
                    <div data-js-state></div>
                </div>`;
    let divBank = ` <div class='player ${this._name}' data-js-player>                    
                    <div class="player-ui center">
                        <div class="action flex">
                            <button class="play btn-green noClick hidden" data-js-play>Jouer</button>
                            <button class="stop btn-red noClick hidden" data-js-stop>Arrêter</button>
                        </div>
                        <div class="profile">
                            <span class='bank-name'>Banque</span>
                            <img src="./img/icon/bank.png" class="profile" data-js-avatar/>
                            <div class='hidden' data-js-bubble>
                              <p>Tour de la Banque</p>
                            </div>
                            <div data-js-score>
                              <span>0</span>
                            </div>
                        </div>
                    </div>
                    <div class="hand flex" data-js-hand>
                    </div>
                    <div data-js-state></div>
                </div>`;
    if (this._name !== "player0") {
      this._parent.insertAdjacentHTML("beforeend", div);
      this._div = this._parent.lastElementChild;
    }
    if (this._name == "player0") {
      document
        .querySelector("[data-js-board]")
        .insertAdjacentHTML("afterbegin", divBank);
      this._div = document.querySelector("[data-js-board]").firstElementChild;
    }

    this._play = this._div.querySelector("[data-js-play]");
    this._stop = this._div.querySelector("[data-js-stop]");
    this._hand = this._div.querySelector("[data-js-hand]");
    this._scoreDiv = this._div.querySelector("[data-js-score]");
    this._stateDiv = this._div.querySelector("[data-js-state]");
    this._bubleDiv = this._div.querySelector("[data-js-bubble]");
    this._avatar = this._div.querySelector("[data-js-avatar]");
  };

  //effet sympa que j'ai trouver par hasard on jouant avec les prop dans .style de l'element
  stretchEffect = () => {
    setTimeout(() => {
      this._scoreDiv.style.width = "30px";
      setTimeout(() => {
        this._scoreDiv.style.width = "";
      }, 100);
    }, 900);
  };

  playBehaviour = (deck) => {
    //creer la carte tirée
    let card = new Card(deck.shift(), this);
    //MAJ score du joueur
    this.incrementScore(card._value);
    //joue effet sonore carte
    this._audio.volume = 0.1;
    this._audio.play();
    //afficher score avec delay de 1000ms en attendant l'affichage de la carte
    setTimeout(() => {
      this._scoreDiv.firstElementChild.innerHTML = this._score;
    }, 1000);
    this.stretchEffect();
    this._turn = false;
  };
  //action si click sur jouer
  stopBehaviour = () => {
    //desactive boutons
    this._play.disabled = true;
    this._play.classList.add("opacity");
    this._stop.classList.add("opacity");
    //change state joueur
    this._state = "stop";
    this.setState();
  };
  //desactive les boutons
  disableBehaviour = () => {
    this._play.disabled = true;
    this._play.classList.add("opacity");
    this._stop.classList.add("opacity");
    this._avatar.classList.remove("active");
  };
  //Active les boutons
  unableBehaviour = () => {
    this._play.disabled = false;
    this._play.classList.remove("opacity");
    this._stop.classList.remove("opacity");
    this._avatar.classList.add("active");
  };
  //affiche Etat
  setState = () => {
    this._stateDiv.innerHTML = `<img src="./img/icon/${this._state}.png" class="state-img" />`;
  };
  //affiche et cache bulle dialogue
  toggleBubble = () => {
    this._bubleDiv.classList.toggle("hidden");
  };
}
