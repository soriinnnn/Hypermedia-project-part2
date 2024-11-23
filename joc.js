// VARIABLES GLOBALS
const CardCategories = ["Spade", "Heart", "Diamond", "Club"];
var player;		
var dealer;
var deck;		

// FUNCIONS EXTERNES
function startGame() {
	let playerName = document.getElementById("nom_jugador").value;
	let initialMoney = parseInt(document.getElementById("diners_inicials").value);
	
	if (!isNaN(initialMoney) && initialMoney > 0) {
		console.log("Player detected: " + playerName);
		console.log("Money: " + initialMoney);

		// Inicialitza els jugadors i la baralla.
		player = new Player(playerName, initialMoney);
		dealer = new Player("Dealer", Number.MAX_SAFE_INTEGER);
		deck = new Deck();
		deck.shuffle();
		
		// Modifica el document
		let container = document.getElementsByClassName("contenidor_info_jugador")[0]; // Contenidor qualsevol.
		let element = document.createElement("p"); // Element qualsevol.

		container.getElementsByTagName("h1")[0].innerHTML = playerName;
		container.removeChild(document.getElementById("entrada_info"));
		element.innerHTML = "Total money: " + initialMoney + " €";
		element.setAttribute("id", "diners_actuals");
		container.appendChild(element);

		container = document.getElementsByClassName("contenidor_entrada_joc")[0];
		container.removeChild(container.getElementsByTagName("button")[0]);
		element = document.createElement("button");
		element.innerHTML = "New Round";
		element.setAttribute("onclick", "newRound()");
		container.appendChild(element);
		element = document.createElement("button");
		element.innerHTML = "End Game";
		element.setAttribute("onclick", "endGame()");
		container.appendChild(element);

		container = document.getElementsByClassName("contenidor_sortida_joc")[0];
		element = document.createElement("div");
		element.setAttribute("id", "local");
		element.setAttribute("class", "jugador");
		container.appendChild(element);
		element = document.createElement("div");
		element.setAttribute("id", "rival");
		element.setAttribute("class", "jugador");
		container.appendChild(element);

		container = document.getElementById("local");
		element = document.createElement("h1");
		element.innerHTML = "Your cards:";
		container.appendChild(element);
		element = document.createElement("div");
		element.setAttribute("class", "cartes");
		container.appendChild(element);

		container = document.getElementById("rival");
		element = document.createElement("h1");
		element.innerHTML = "Dealer's cards:";
		container.appendChild(element);
		element = document.createElement("div");
		element.setAttribute("class", "cartes");
		container.appendChild(element);

		window.addEventListener("beforeunload", beforeUnloadHandler);
	}
	else if (isNaN(initialMoney)) { 
		alert("Initial money's inserted value is not a number!");
	}
	else {
		alert("Initial money's inserted value can't be negative!")
	}
}

function newRound() {
	let bet = parseInt(prompt("Money bet"));

	if (!isNaN(bet) && bet > 0 && bet <= player.money()) {
		console.log("Bet accepted: " + bet);
		playerTakeCard(bet);
	}
	else if (isNaN(bet)) {
		alert("Bet's inserted value is not a number!");
	}
	else if (bet < 0) {
		alert("Bet's inserted value can't be negative!")
	}
	else {
		alert("Bet's inserted value can't be greater than your money!");
	}
}

function endGame() {
	alert("You receive " + player.money() + " €. See you next time!!");
	window.removeEventListener("beforeunload", beforeUnloadHandler);
	location.reload();
}

// FUNCIONS INTERNES
function playerTakeCard(bet) {
	let card = deck.removeLastCard();
	player.takeCard(card);

	// Afegeix la carta a la taula.
	let container = document.getElementsByClassName("cartes")[0];
	let element = document.createElement("img");
	element.setAttribute("src", "./cards/" + card.category() + card.value() + ".png");
	element.setAttribute("alt", card.category() + card.value());
	container.appendChild(element);

	if (player.points(bet) <= 7.5) {
		setTimeout(function() {
			if (confirm("Do you want another card?")) {
				playerTakeCard(bet);
			}
			else {
				dealerTakeCard(bet);
			}
		}, 200);
	}
	else {
		setTimeout(function() { dealerWins(bet); }, 100);
	}
}

function dealerTakeCard(bet) {
	let card = deck.removeLastCard();
	dealer.takeCard(card);

	// Afegeix la carta a la taula.
	let container = document.getElementsByClassName("cartes")[1];
	let element = document.createElement("img");
	element.setAttribute("src", "./cards/" + card.category() + card.value() + ".png");
	element.setAttribute("alt", card.category() + card.value());
	container.appendChild(element);

	if (dealer.points() <= 7.5) {
		setTimeout(function() {
			if (dealer.points() < player.points() || (dealer.points() == player.points() && probsGoodCard(dealer.points()) >= 37)) {
				dealerTakeCard(bet);
			}
			else if (player.points() > dealer.points()) {
				playerWins(bet);
			}
			else if (player.points() < dealer.points()) {
				dealerWins(bet);
			}
			else {
				draw();
			}
		}, 750);
	}
	else {
		setTimeout(function() { playerWins(bet); }, 100);
	}
}

function playerWins(bet) {
	console.log("Player won.");

	player.takeMoney(bet);
	document.getElementById("diners_actuals").innerHTML = "Total money: " + player.money() + " €";
	alert("You have won " + bet + ". New amount of money: " + player.money() + " €");
	reShuffleDeck();
}

function dealerWins(bet) {
	console.log("Dealer won.");

	player.giveMoney(bet);
	document.getElementById("diners_actuals").innerHTML = "Total money: " + player.money() + " €";
	alert("You have lost " + bet + ". Remaining money: " + player.money() + " €");
	reShuffleDeck();
}

function draw() {
	console.log("No one won.");

	alert("No one won. You get your money back.");
	reShuffleDeck();
}

/*
	Ajunta totes les cartes de la baralla i les torna a barrejar.
*/
function reShuffleDeck() {
	let containers = document.getElementsByClassName("cartes");
	for (let i = 0; i < containers.length; i++) {
		let cards = containers[i].getElementsByTagName("img");
		while (cards.length > 0) {
			containers[i].removeChild(cards[0]);
		}
	}

	player.throwCards();
	dealer.throwCards();
	deck = new Deck();
	deck.shuffle();
}

/* 
	Retorna la probabilidad de que surti una carta 'bona' que no faci superar el límit de punts.
	Els possibles valors a retornar són [0, 100]. 
*/
function probsGoodCard(points) {
	let leftPoints = 7.5 - points;
	let goodCards = []; // Els valors de les cartes 'bones'.
	let ncards = 0;
	
	for (let i = 1; i <= 7; i++) {
		if (leftPoints - i >= 0) {
			goodCards.push(i);
			ncards += 4;
		}
	}
	if (leftPoints - 0.5 >= 0) {
		goodCards.push(11, 12, 13);
		ncards += 12;
	}

	let containers = document.getElementsByClassName("cartes");
	for (let i = 0; i < containers.length; i++) {
		let cards = containers[i].getElementsByTagName("img");
		for (let j = 0; j < cards.length; j++) {
			let altText = cards[j].getAttribute("alt");

			let found = false;
			let k = 0;
			while (k < goodCards.length && !found) {
				if (altText.includes(goodCards[k].toString())) {
					ncards -= 1;
					found = true;
				}
				else k++;
			}
		}
	}
	return ncards / deck.remainingCards() * 100;
}

/*
	Event handler de 'beforeUnload'. 
*/
function beforeUnloadHandler(event) {
	// Estableix el missatge d'avís.
	const message = "Are you sure you want to leave? Changes you made may not be saved.";
	event.returnValue = message;
	return message;
}

// CLASSES
class Player {
	// ATRIBUTS
	#name;	 // Nom del jugador.
	#money;  // Diners del jugador.
	#points; // Total de punts del jugador.
	
	// CONSTRUCTOR
	constructor(name, initialMoney) {
		this.#name = name;
		this.#money = initialMoney;
		this.#points = 0;
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
		let points = card.value();
		if (points > 7) points = 0.5;
		this.#points += points;
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