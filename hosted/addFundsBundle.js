'use strict';

// addFunds WINDOW
var addFundsWindow = function addFundsWindow(props) {
    return React.createElement(
        'div',
        null,
        'It works!'
    );
};

// addFunds WINDOW
var createaddFundsWindow = function createaddFundsWindow(csrf) {
    ReactDOM.render(React.createElement(addFundsWindow, { csrf: csrf }), document.querySelector("#game"));
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

    createaddFundsWindow(csrf);
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


