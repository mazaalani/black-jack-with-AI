export default class Card {
  constructor(card, drawer) {
    this._suit = card.suit;
    this._value = card.value;
    this._player = drawer;

    this.init();
  }
  //creation de la carte dans le DOM
  init = () => {
    let div = ` <div class='card' data-js-card>
                    <div class="value" data-js-value>
                        ${this._value}
                    </div>
                    <div class="suit ${this._suit}" data-js-suit>                        
                    </div>
                </div>`;
    this._player._div
      .querySelector("[data-js-hand]")
      .insertAdjacentHTML("beforeend", div);
  };
}
