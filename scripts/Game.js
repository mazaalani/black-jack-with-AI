import Player from "./Player.js";
import Deck from "./Deck.js";

//c'est ici que toutes les régles et elements du jeu sont gérés les autres classes liées servent a modéliser et créer les elements a manipuler ici

export default class Game {
  constructor(nbPlayers, nbParties = null) {
    this._nbPlayers = parseInt(nbPlayers);
    this._players = [];
    //creation de jeu de cartes unique a chaque game
    this._deck = new Deck();
    this._donePlaying = [];
    //valeur qui permet de relancer la partie en creant une nouvelle game au lieu de reset les proprietes une par une (idée originale de moi :)
    if (nbParties) this._counter = nbParties;
    else this._counter = 1;
    this._audio = document.querySelector("audio");
    this.init();
  }

  init = () => {
    //rends la selection de nb joueurs et start game hidden
    this.createBoard();
    this.closeStart();
    this.createPlayers();
    //commence le tout par tour
    this.startGame();
    this.playMusic();
  };
  createBoard = () => {
    //creer la table
    let contentDiv = document.querySelector(".content");
    contentDiv.insertAdjacentHTML(
      "beforeend",
      `<div class='game' data-js-game><div data-js-board></div></div>`
    );
    this._gameBoard =
      document.querySelector("[data-js-game]").firstElementChild;
    //creer div pour joueurs
    this._gameBoard.innerHTML = `<div data-js-players></div>`;
    this._playersDiv = this._gameBoard.firstElementChild;
  };
  //cache menu selection joueurs
  closeStart = () => {
    document.querySelector("form").classList.add("hidden");
  };
  //creer les joueurs (la banque est le joueur 0)
  createPlayers = () => {
    for (let i = 0; i < this._nbPlayers + 1; i++) {
      if (i == 0) this._players[i] = new Player(i, true);
      else this._players[i] = new Player(i);
    }
  };
  //affiche bouton rejouer partie
  displayReset = () => {
    let div = ` <div class='reset-div'>
                        <button class="reset" data-js-reset>Rejouer</button>
                        <div data-js-counter>
                            <span>Partie No: ${this._counter}</span>
                        </div>
                  </div>`;
    this._gameBoard.insertAdjacentHTML("beforeend", div);
    this._reset = this._gameBoard.querySelector("[data-js-reset]");
    this._reset.addEventListener("click", () => {
      this.reset();
    });
    this.createExit();
  };
  //réinitialiser la partie
  reset = () => {
    //incrementer le compteur de parties
    this._counter++;
    //supprimer table
    this._gameBoard.parentNode.remove();
    this._exit.parentNode.remove();
    new Game(this._nbPlayers, this._counter);
  };
  //bouton de sortie
  createExit = () => {
    //creer la table
    let contentDiv = document.querySelector(".content");
    contentDiv.insertAdjacentHTML(
      "beforeend",
      `<div data-js-exit><img src="./img/icon/exit.png" /></div>`
    );
    this._exit = document.querySelector("[data-js-exit]").firstElementChild;
    this._exit.addEventListener("click", () => {
      location.reload();
    });
  };
  //debut game avec tour du 1er joueur activé
  startGame = () => {
    this.btnBehaviours();
    //mettre la banque en fin de file et active btn premier joueur
    this.updateTurn();
  };
  //joue la musique de fond
  playMusic = () => {
    this._audio.loop = true; //https://www.w3schools.com/jsref/prop_audio_loop.asp
    this._audio.volume = 0.05;
    this._audio.play();
  };
  //mets en place les listeners des boutons
  btnBehaviours = () => {
    this._players.forEach((player) => {
      //desactive actions pour joueurs don't ce n'est pas le tour
      player.disableBehaviour();
      //place un listener sur le bouton play de chaque joueur
      player._play.addEventListener("click", () => {
        //actions si tour du joueur actuel
        player.playBehaviour(this._deck._cards);
        this.playerTurn(player);
        this.checkPlayerScore(player);
      });
      //place un listener sur le bouton stop de chaque joueur
      player._stop.addEventListener("click", () => {
        player.stopBehaviour();
        this.playerTurn(player);
        //deplacer joueur a l'arret vers tableau de _donePlaying
        this.removeStopPlayer(player);
      });
    });
  };
  //gére le tour des joueurs et declare la fin de la partie
  updateTurn = () => {
    //bouge premier element vers la fin
    this._players.push(this._players.shift());
    setTimeout(() => {
      if (this._players[0] != undefined) {
        //si c'est la banque jouer un tour
        if (this._players[0]._bank == true) {
          this.bankTurn(this._players[0]);
          //les autres joueurs affiche dialogue pour jouer son tour
        } else {
          this._players[0].toggleBubble();
          this._players[0].unableBehaviour();
        }
      }
    }, 1200);
  };
  //enleve les joueurs non actifs de la liste des joueurs actifs
  removeStopPlayer = (player) => {
    this._donePlaying.push(player);
    this._players.splice(this._players.indexOf(player), 1);
    //si plus de joueurs actifs
    if (this._players.length == 0)
      setTimeout(() => {
        this.gameScore();
      }, 600);
  };

  //Calculer score de la partie
  gameScore = () => {
    this._winners = [];
    //comparaison scores
    for (let i = 21; i > 0; i--) {
      if (this._winners.length == 0) {
        for (let k = 0, l = this._donePlaying.length; k < l; k++) {
          if (this._donePlaying[k]._score == i) {
            this._winners.push(this._donePlaying[k]);
            this._donePlaying[k]._state = "winner";
          }
        }
      }
    }
    setTimeout(() => {
      //affiche l'image de winner
      this.displayWinners();
      //reduit l'opacité des losers
      this._donePlaying.forEach((dplayer) => {
        if (dplayer._state != "winner") dplayer._div.classList.add("loser");
      });
    }, 1200);
  };
  //verifier score du joueur et action si perdant
  checkPlayerScore = (player) => {
    if (player._score > 21) {
      player._state = "loser";
      this.removeStopPlayer(player);
      setTimeout(() => {
        player.setState();
      }, 1000);
    }
  };
  //tours de la banque
  bankTurn = (player) => {
    player.toggleBubble();
    //Actions si score est de 21 arret
    if (player._score == 21) {
      setTimeout(() => {
        player.stopBehaviour();
        this.removeStopPlayer(player);
        this.updateTurn(player);
      }, 800);
    } else {
      if (player._score >= 0 && 21 - player._score >= 4) {
        setTimeout(() => {
          player.playBehaviour(this._deck._cards);
          player.toggleBubble();
          this.updateTurn(player);
          this.checkPlayerScore(player);
        }, 800);
      } else {
        setTimeout(() => {
          player.stopBehaviour();
          this.removeStopPlayer(player);
          this.updateTurn(player);
        }, 800);
      }
    }
  };
  //tours de joueur
  playerTurn = (player) => {
    player.disableBehaviour(); //desactive actions a remettre en fonction du tour
    player.toggleBubble();
    this.updateTurn(player);
  };
  //affche Gagnants
  displayWinners = () => {
    this._winners.forEach((winner) => {
      winner._state = "winner";
      winner.setState();
      winner._stateDiv.firstElementChild.classList.add("win-animation");
    });
    //affiche reset
    setTimeout(() => {
      this.displayReset();
    }, 2200);
  };
}
