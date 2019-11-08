// BLACKJACK WINDOW
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


$(document).ready(function() {
    getToken();
});



const setup = function(csrf) {

    createBlackJackWindow(csrf);
    
    

};

