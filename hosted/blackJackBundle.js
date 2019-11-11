'use strict';

// BLACKJACK WINDOW
var BlackJackWindow = function BlackJackWindow(props) {
    return React.createElement(
        
            <div id="game-board">

                    <div id="dealer-cards"></div>

                    <br>

                    <div id="dealer-score"></div>

                    <br>

                    <div id="player-cards"></div>

                    <br>

                    <div id="player-score"></div>

                    <br>

            </div>

            <div class="wrapperFunctions">
                    <input type='button' id='new-game-button' value='New Game' onclick='newGame();'/>
                    <input type='button' id='hit-button' value='Hit' onclick='hit();'/>
                    <input type='button' id='stand-button' value='Stand' onclick='stand();'/>

                    <div class="wrapperBet">
                            <div id=player>
                                Your Money: $0
                            </div>
                            Bet: 
                            <input type='number' id='bet' value='10' min='1'/>
                    </div>
            </div>

            <br>
        
    );
};

// BLACKJACK WINDOW
var createBlackJackWindow = function createBlackJackWindow(csrf) {
    ReactDOM.render(React.createElement(BlackJackWindow, { csrf: csrf }), document.querySelector("#game"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

var setup = function setup(csrf) {

    createBlackJackWindow(csrf);
};
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};


