
let section = document.querySelector('section');
let buttonBox = document.getElementsByClassName('buttonBox');

// let requestURL = 'https://ninahahne.github.io/wasn-das/cards_de.json';
// Get JSON URL dynamically (e.g., from `data-source` attribute or query parameter)
let sourceElement = document.getElementById('cardSource');
let requestURL = sourceElement ? sourceElement.getAttribute('data-source') : 'https://ninahahne.github.io/wasn-das/cards_de.json';

let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

let stuffCards = [];
let discardPile = [];
let firstCard;
let newPile =  false;

request.onload = function() { // draws a card as soon as JSON file is loaded
  let cards = request.response;
  discardPile = cards;
  shuffleCards(discardPile); // discard pile gets shuffled and builds the new stuffCards pile
  drawCard(stuffCards);
}

// Get card ID from URL (hash or query string)
function getCardIdFromUrl() {
  const urlWithoutHashAndParams = window.location.origin + window.location.pathname;  
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || window.location.hash.slice(1);
  // Remove hash and query parameters from URL
  // Workaround for `SecurityError` when loading a local file in some browsers
  if (window.location.protocol !== 'file:') {
    window.history.replaceState(null, '', urlWithoutHashAndParams);
  }
  return id;
}

function updateHashWithCardId(cardId) {
  window.location.hash = `#${cardId}`; // Update the hash in the URL
}

//the modern version of the Fisher–Yates shuffle algorithm:
function shuffleCards(cards) {    //shuffles array in place 
  let j, x, i;
  for (i = cards.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = cards[i];
      cards[i] = cards[j];
      cards[j] = x;
  }
  stuffCards = discardPile;
  discardPile = [];
  return cards;
}

function drawCard(cards) {
  let cardId = getCardIdFromUrl(); // Retrieve card ID from URL
  
  if (cardId) {
    // Find the card by ID in the `cards` array
    firstCard = cards.find(card => card.id.toString() === cardId);
    if (!firstCard) {
      console.warn(`Card with ID ${cardId} not found, drawing a random card instead.`);
      firstCard = cards.shift(); // Fallback to random
    } else {
      // Remove the specified card from the array
      cards.splice(cards.indexOf(firstCard), 1);
    }
  } else {
    firstCard = cards.shift(); // Random card if no ID is specified
  }

  // updateHashWithCardId(firstCard.id); // Update the URL with the drawn card's ID

  let myArticle = document.createElement('article');
  let myH2 = document.createElement('h2');
  let myList = document.createElement('ol');

  myH2.innerHTML = firstCard.title;
  let cardItems = firstCard.items;

  for(let i = 0; i < cardItems.length; i++) {
    let listItem = document.createElement('li');

    listItem.innerHTML = cardItems[i];
    myList.appendChild(listItem);
  }
  myArticle.appendChild(myH2);
  myArticle.appendChild(myList);
  section.appendChild(myArticle);

  console.log(`du hast Karte Nr. ${firstCard.id} gezogen.`);             //TEST
}

function discardCard() { 
  if (newPile === false){
    discardPile.push(firstCard);
  };
  
  console.log(`${discardPile.length} Karten im Ablagestapel.`); //TEST
  console.log(`${stuffCards.length} Karten im Ziehstapel übrig.`);     //TEST
  let card = document.querySelector("section"); 
  let first = card.firstElementChild; 
  while (first) { 
      first.remove(); 
      first = card.firstElementChild; 
  }
}

function replaceCard() {
  if (newPile === true){
    let buttonText = '<button type="submit"  onClick="replaceCard();">draw new card</button>';
    buttonBox[0].innerHTML = buttonText;
  };
  discardCard();
  if (stuffCards.length > 0){
    newPile = false;    
    drawCard(stuffCards);
  } else {
    let shuffleButtonBox = document.createElement('div');
    let shuffleButton = document.createElement('div');

    let shuffleButtonText = '<button type="submit"  onClick="replaceCard();">mischen<br>&<br>Karte ziehen</button>';
    buttonBox[0].innerHTML = shuffleButtonText;

    shuffleCards(discardPile);
    newPile = true;
  }
}
