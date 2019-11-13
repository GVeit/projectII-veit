// addFunds WINDOW
const addFundsWindow = (props) => {
    return (
        <div>It works!</div>
    );
};

// addFunds WINDOW
const createaddFundsWindow = (csrf) => {
    ReactDOM.render(
        <addFundsWindow csrf={csrf} />,
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

    createaddFundsWindow(csrf);

};