import { doc } from "prettier";
import { displayText } from "./UI";

export default class GameBoard {
  constructor(name) {
    this.name = name;
    this.ships = [];
    this.missedAttacks = [];
    this.gameOver = false;
    this.attacks = [];
    this.attackArray = null;
    this.cellTaken = false;
  }
  // jedes Feld bekommt ein Objekt ob es besetzt oder getroffen ist.
  buildBoard() {
    let battleGround = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        battleGround.push([i, j]);
      }
    }
    return battleGround;
  }

  placeShips(ship) {
    if (ship.board === this.name) this.ships.push(ship);
  }

  receiveAttack(coord) {
    let result = false;
    this.ships.forEach((ship) => {
      ship.position.forEach((pos) => {
        if (pos[0] === coord[0] && pos[1] === coord[1]) {
          ship.hit();
          displayText(
            `${ship.name} getroffen! Jetzt eine Größe von ${ship.health} übrig!`,
          );
          this.attacks.push(coord);
          result = true;
        }
      });
    });
    this.missedAttacks.push(coord);
    console.log(coord);
    return result;
  }

  getAttacks() {
    return this.attacks;
  }

  getMissedAttacks() {
    return this.missedAttacks;
  }

  getShips() {
    return this.ships;
  }

  sinkShips() {
    this.ships.forEach((ship) => {
      let n = ship.health;
      while (n > 0) {
        ship.hit();
        n--;
      }
    });
    this.gameOver = true;
  }

  allShipsGone() {
    //return this.ships.every((ship) => ship.sunk);
    if (this.ships.every((ship) => ship.sunk)) {
      this.gameOver = true;
      return true;
    }
  }

  allShipsSet() {
    return this.ships.every((ship) => ship.position.length !== 0);
  }

  invalidPosition(array) {
    return this.ships.some((ship) => {
      return ship.position.some((element) => {
        return element[0] === array[0] && element[1] === array[1];
      });
    });
  }

  createRandomArray() {
    let array = this.buildBoard();
    let shuffled = array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    // console.log(shuffled);
    this.attackArray = shuffled;
  }

  randomShot() {
    if (this.attackArray.length <= 0) return;
    console.log(this.attackArray[0]);
    this.receiveAttack(this.attackArray[0]);
    let tmp = this.attackArray[0];
    let element = document.querySelector(`[data-id="${tmp}"`);
    element.style.backgroundColor = "red";
    this.attackArray.shift();
    this.missedAttacks.push(tmp);
  }

  checkGameOver() {
    const checkShipsSunk = this.ships.every((ship) => ship.sunk);
    if (checkShipsSunk) {
      this.gameOver = true;
      return true;
    } else {
      return false;
    }
  }
}

export { GameBoard };
