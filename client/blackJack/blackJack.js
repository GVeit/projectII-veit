// BLACKJACK WINDOW
var userMoney = 0;
const BlackJackWindow = (props) => {
    return (
        <div>It works!</div>
    );
};

// BLACKJACK WINDOW
const createBlackJackWindow = (csrf) => {
    ReactDOM.render(
        <BlackJackWindow csrf={csrf} />,
        document.querySelector("#game")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const getMoney = () =>{
    sendAjax('Get', '/getFunds', null, (result) => {
        userMoney = result.funds;
        player.money = userMoney;
        document.getElementById("player").innerHTML= "Your money: $" + userMoney;
    });
}


const sendMoney = () => {
    sendAjax('POST', '/addFunds',{
        fundField: bet}, (result) => {
            console.dir(result);
        };
    });
}

$(document).ready(function() {
    getToken();
});



const setup = function(csrf) {
    
    createBlackJackWindow(csrf);
    getMoney();

};


//document.getElementById("confirm-purchase").addEventListener("click", function(){
//  document.getElementById("credit").innerHTML = userMoney;
//});

var totalCardsPulled = 0;
var deckArray = [];
var player = {
        cards: [],
        score: 0,
        money: userMoney
    };
var playerHand = '';


var dealer = {
    cards: [],
    score: 0
};
var dealerHand = '';


//document.getElementById("player").innerHTML = "Your money: $" + player.money;
document.getElementById("hit-button").disabled = true;
document.getElementById("stand-button").disabled = true;

function getCard(x)
{
    var valueArray = [];
    var total = 0;
    var ace = 0;

    valueArray = x;

    // run through the value of each cards
    for(var i = 0; i < valueArray.length; i++)
    {
        // aces worth 11 or 1
        if (valueArray[i].rank === "A") 
        {
            total += 11;
            // keep track number of aces just in case if someone went over 21
            ace += 1;
        } 
        // J, Q, K cards worth 10
        else if (valueArray[i].rank === "J" || valueArray[i].rank === "Q" || valueArray[i].rank === "K") 
        {
            total += 10;
        } 
        // rest of them worth itself
        else 
        {
            total += valueArray[i].rank;
        }

        //console.log(total);
    }
    
    //if over 21, reset ace value to 1
    while (ace > 0 && total > 21) {
        total -= 10;
        ace -= 1;
    }
    
    return total;

}

beginGame();
shuffle();

function beginGame(){
    var iconArray = ["clubs", "diamonds", "hearts", "spades"];
    var rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

        for (var s = 0; s < iconArray.length; s += 1) {

            for (var r = 0; r < rankArray.length; r += 1) {

                deckArray[s * 13 + r] = {
                    // value of the cards
                    rank: rankArray[r],
                    // suits 
                    icon: iconArray[s]

                };
            }
        }
}


function shuffle(){
    
    var temp; 
    var rnd;

    // switch the values of two random cards
    for (var i = 0; i < deckArray.length; i += 1) {
        rnd = Math.floor(Math.random() * deckArray.length);
        temp = deckArray[i];
        deckArray[i] = deckArray[rnd];
        deckArray[rnd] = temp;
    }
}

function bet(won) {

    var playerBet = document.getElementById("bet").valueAsNumber;

    if (won === true) {

        player.money += playerBet;
        sendMoney(playerBet);
    }
    if (won === false) {

        player.money -= playerBet;
        sendMoney(-playerBet);
    }

}

// reset the game
function restartGame() {

    // restart everything 
    totalCardsPulled = 0;
    player.cards = [];
    dealer.cards = [];
    player.score = 0;
    dealer.score = 0;

    beginGame();
    shuffle();

    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("new-game-button").disabled = false;
}

function endGame() {
    // if player has exact 21, player would auto win the game
    if (player.score === 21) {
        document.getElementById("message-board").innerHTML = "You win! You got blackjack.";
        bet(true);
        document.getElementById("player").innerHTML = "Your money: $" + player.money;
        restartGame();
    }
    // if player went over 21, player would lose
    if (player.score > 21) {
        document.getElementById("message-board").innerHTML = "You went over 21! The dealer wins";
        bet(false);
        document.getElementById("player").innerHTML = "Your money: $" + player.money;
        restartGame();
    }
    // if dealer has exact 21, it would win 
    if (dealer.score === 21) {
        document.getElementById("message-board").innerHTML = "You lost. Dealer got blackjack";
        bet(false);
        document.getElementById("player").innerHTML = "Your money: $" + player.money;
        restartGame();
    }
    // if dealer went over 21, dealer would lose
    if (dealer.score > 21) {
        document.getElementById("message-board").innerHTML = "Dealer went over 21! You win!";
        bet(true);
        document.getElementById("player").innerHTML = "Your money: $" + player.money;
        restartGame();
    }
    // if dealer has 17 scores and still less than player's current scores, it would lose
    if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
        document.getElementById("message-board").innerHTML = "You win! You beat the dealer.";
        bet(true);
        document.getElementById("player").innerHTML = "Your money: $" + player.money;
        restartGame();
    }
    // if dealer has 17 scores and greater than player's current scores, it would win
    if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
        document.getElementById("message-board").innerHTML = "You lost. Dealer had the higher score.";
        bet(false);
        document.getElementById("player").innerHTML = "Your money: $" + player.money;
        restartGame();
    }
    // if both player and dealer have same scores, it would be tie
    if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {
        document.getElementById("message-board").innerHTML = "You tied! ";
        restartGame();
    }
    if (player.money <= 0) {
        document.getElementById("new-game-button").disabled = true;
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
        document.getElementById("message-board").innerHTML = "You lost!" + "<br>" + "You are out of money";
    }

}

function dealerDraw() {
    // draw a card
    dealer.cards.push(deckArray[totalCardsPulled]);
    // get value of the card
    dealer.score = getCard(dealer.cards);

    var icon = '';
    var suit = dealer.cards[dealer.cards.length-1].icon
    var valueOfCard = dealer.cards[dealer.cards.length-1].rank

    if (suit == 'hearts'){
        icon='&hearts;';
        console.log("&hearts" + valueOfCard);
    }
    else if (suit == 'spades'){
        icon = '&spades;';
        console.log("&spades" + valueOfCard);
    }
    else if (suit == 'diamonds'){
        icon = '&diams;';
        console.log("Diamonds" + valueOfCard);
    }
    else{
        icon = '&clubs;';
        console.log("Clubs" + valueOfCard);
    }
    document.getElementById("dealer-cards").innerHTML = dealerHand + '<div>' + valueOfCard + '<br/>' + icon + '</div>';
    dealerHand = dealerHand + '<div>' + valueOfCard + '<br/>' + icon + '</div>';



    // display the score
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + dealer.score;
    // keep track of how many cards are there
    totalCardsPulled += 1;
}



function newGame() {

    // reset everything
    dealerHand = '';
    playerHand = '';

    document.getElementById("new-game-button").disabled = true;
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
    document.getElementById("message-board").innerHTML = "";
    hit();
    hit();
    dealerDraw();
    endGame();
}

function hit() {
    player.cards.push(deckArray[totalCardsPulled]);
    player.score = getCard(player.cards);
    //document.getElementById("player-cards").innerHTML = "Player Cards: " + JSON.stringify(player.cards);

    var icon = '';
    var suit = player.cards[player.cards.length-1].icon
    var valueOfCard = player.cards[player.cards.length-1].rank
    
    
    if (suit == 'hearts'){
        icon='&hearts;';
        console.log("Hearts" + valueOfCard);
    }
    else if (suit == 'spades'){
        icon = '&spades;';
        console.log("Spades" + valueOfCard);
    }
    else if (suit == 'diamonds'){
        icon = '&diams;';
        console.log("Diamonds" + valueOfCard);
    }
    else{
        icon = '&clubs;';
        console.log("Clubs" + valueOfCard);
    }
    
    document.getElementById("player-cards").innerHTML = playerHand + '<div>' + valueOfCard + '<br/>' + icon + '</div>';
        
    playerHand = playerHand + '<div>' + valueOfCard + '<br/>' + icon + '</div>';
    
    document.getElementById("player-score").innerHTML = "Player Score: " + player.score;
    

    totalCardsPulled += 1;
    if (totalCardsPulled > 2) {
        endGame();
    }

}

function stand() {
    while (dealer.score < 17) {
        dealerDraw();
    }
    endGame();
}
