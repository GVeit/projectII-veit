'use strict';

// BLACKJACK WINDOW
var BlackJackWindow = function BlackJackWindow(props) {
    return React.createElement(
        'div',
        null,
        'It works!'
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


