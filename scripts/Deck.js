export default class Deck {
  constructor() {
    this._suits = ["spades", "diamonds", "clubs", "hearts"];
    this._values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    this._tempDeck = [];
    this._cards = [];

    this.init();
  }

  init = () => {
    this.createDeck();
    this.shuffle();
  };

  //creation de des cartes (combinaison suite / valeur)
  createDeck = () => {
    this._suits.forEach((suite) => {
      this._values.forEach((val) => {
        let card = { suit: suite, value: val };
        this._tempDeck.push(card);
      });
    });
  };
  //mélanger les cartes
  shuffle = () => {
    for (let i = 0, l = this._tempDeck.length; i < l; i++) {
      let rendIndex = Math.floor(Math.random() * l);
      this._cards.push(this._tempDeck[rendIndex]);
    }
  };
}
