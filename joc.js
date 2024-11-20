// VARIABLES GLOBALS
const CardCategories = ["Spade", "Heart", "Diamond", "Club"];
var player;
var dealer;
var deck;

// FUNCIONS
function startGame() {
	let playerName = document.getElementById("playerName").value;
	let initialMoney = parseInt(document.getElementById("initialMoney").value);
	
	if (!isNaN(initialMoney)) {
		player = new Player(playerName, initialMoney);
		dealer = new Player("Dealer", 100000000);
		deck = new Deck();
		
		/* MODIFICA DOCUMENT */
		let playerInfo = document.getElementsByClassName("info_jugador")[0].innerHTML = playerName;
		
	}
	else { // Si el valor de 'initialMoney' entrat és incorrecte...
		alert("Money's inserted value is invalid.");
	}
}

function newRound() {
	alert("Xd");
}

function endGame() {
	alert("xdd");
}

// WIP
class Player {
	// ATRIBUTS
	#name;	 // Nom del jugador.
	#money;  // Diners del jugador.
	#points; // Total de punts del jugador.
	
	// CONSTRUCTOR
	constructor(name, initialMoney) {
		this.#name = name;
		this.#money = initialMoney;
	}
	
	// CONSULTORS
	name() {
		return this.#name;
	}
	
	money() {
		return this.#money;
	}
	
	points() {
		return this.#points;
	}
	
	// MODIFICADORS
	takeCard(card) {
		if (card > 7) card = 0.5;
		this.#points += card;
	}
	
	throwCards() {
		this.#points = 0;
	}
	
	takeMoney(money) {
		this.#money += money;
	}
	
	giveMoney(money) {
		this.#money -= money;
	}
}

class Card {
	// ATRIBUTS
	#category;	// Categoria de la carta.
	#value; 	// Valor de la carta.
	
	//CONSTRUCTOR
	constructor(category, value) {
		this.#category = category;
		this.#value = value;
	}
	
	//CONSULTORS
	category() {
		return this.#category;
	}
	
	value() {
		return this.#value;
	}
}

class Deck {
	// ATRIBUTS
	#cards;	// Cartes de la baralla.
	
	// CONSTRUCTOR
	constructor() {
		this.#cards = [];
		for (let i = 1; i <= 7; i++) {
			for (let j = 0; j < CardCategories.length; j++) {
				this.#cards.push(new Card(CardCategories[j], i));
			}
		}
		for (let i = 11; i <= 13; i++) {
			for (let j = 0; j < CardCategories.length; j++) {
				this.#cards.push(new Card(CardCategories[j], i));
			}
		}
	}
	
	// CONSULTORS	
	remainingCards() {
		return this.#cards.length;
	}
	
	// MODIFICADORS
	removeLastCard() {
		return this.#cards.pop();
	}
	
	shuffle() {
		for (let i = this.#cards.length-1; i >= 0; i--) {
			let j = Math.floor(Math.random() * (i+1));
			let temp = this.#cards[i];
			this.#cards[i] = this.#cards[j];
			this.#cards[j] = temp;
		}
	}
}