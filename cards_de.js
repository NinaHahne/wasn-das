
let section = document.querySelector('section');
let buttonBox = document.getElementsByClassName('buttonBox');

let requestURL = 'https://ninahahne.github.io/WasnDas/cards_de.json';
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
  firstCard = cards.shift();

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