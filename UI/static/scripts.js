//////////////////////////////////////////////////////////////////////
/*Functions to create the message displayed after sentiment analysis*/
//////////////////////////////////////////////////////////////////////

// Main function : bring all parts together
function sendDataToAiDiv(label, proba) {
    const messageInput = document.getElementById('user_input');
    const chatMessages = document.getElementById('chat-messages');

    if (messageInput.value.trim() !== '') {
        // Header (positive or negative)
        var header = getHeader(label, proba);

        // Contains the review written by the user
        var divReview = document.createElement('div');
        divReview.className = "text_review";
        divReview.innerHTML = messageInput.value.replace(/\n/g, '<br>');

        // Header + review
        var fullMessage = document.createElement('div');
        fullMessage.className = 'chat-messages';
        fullMessage.appendChild(header);
        fullMessage.appendChild(divReview);

        // Store this kind of div (aligned to the right)
        var divStockage = document.createElement('div');
        divStockage.className = "align-right";
        divStockage.appendChild(fullMessage);
        divStockage.style.marginBottom = '10px';

        // Insertion in the main div
        chatMessages.insertBefore(divStockage, chatMessages.firstChild);

        // Clear the input field
        messageInput.value = '';
    }
}

// Decide which header to get depending of the value of 'proba' (ie the proba that the review is positive)
function getHeader(sentiment, proba) {
    if (sentiment == 1) {
        return createPositiveHeader(proba);
    } else {
        return createNegativeHeader(proba);
    }
}

// Creation of the positive header
function createPositiveHeader(proba) {
    console.log(proba)
    var header = document.createElement('div');
    header.className = "horizontal-alignement entete";
    var divImage = document.createElement('div');
    divImage.type;
    divImage.className = "thumbs thumbsImage_pos";
    var divComment = document.createElement('div');
    divComment.className = "comment";
    divComment.innerHTML = '<span class="ai_comment">Recommended</span><span class="ai_subcomment">Positive at '+(Math.round(proba*100))+'%</span>';
    header.appendChild(divImage);
    header.appendChild(divComment);
    return header;
}

// Creation of the negative header
function createNegativeHeader(proba) {
    console.log(proba)
    var header = document.createElement('div');
    header.className = "horizontal-alignement entete";
    var divImage = document.createElement('div');
    divImage.className = "thumbs thumbsImage_neg";
    var divComment = document.createElement('div');
    divComment.className = "comment";
    divComment.innerHTML = '<span class="ai_comment">Not Recommended</span><span class="ai_subcomment">Negative at '+(Math.round(proba*100))+'%</span>';
    header.appendChild(divImage);
    header.appendChild(divComment);
    return header;
}





/////////////////////////////////////
/*Two types of calls to the backend*/
/////////////////////////////////////

// Ask the backend (AI) for the sentiment analysis of the review filled by the user
function getSentimentAnalysis() {
    var review = document.getElementById("user_input").value;
    console.log(review.length)
    if ((review.length>0) && (review.length<512)){
        fetch('/backend-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: "sentimentAnalysis",
                data: review,
                positive: null
            }),
        })
        .then(response => response.json())
        .then(data => {
            processResult_sentimentAnalysis(data['label'], data['score']);
        })
        .catch(error => console.error('Erreur:', error));
    } else {
        if (review.length <= 0) {
            displayError("Review must contains at least one character.");
        } else {
            displayError("Review must not contains more than 512 characters.");
        }
        processResult_sentimentAnalysis(0, -1);
    }
}

// Ask the backend to generate a review with two parameters (is positive and is ascii)
function getReviewGeneration() {
    var gameGenre = document.getElementById("genre").value;
    var isPositive = document.getElementById("checkbox_positive").checked;
    fetch('/backend-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task: "generation",
            data: null,
            genre: gameGenre,
            positive: isPositive
        }),
    })
    .then(response => response.json())
    .then(data => {
        processResult_reviewGeneration(data);
    })
    .catch(error => console.error('Erreur:', error));
}





//////////////////////////////////////////////////
/*Functions to ask the AI for sentiment analysis*/
//////////////////////////////////////////////////

// Process the answer of the sentiment analysis
async function processResult_sentimentAnalysis(label, probaOfPositive) {
    if (probaOfPositive>=0) {
        sendDataToAiDiv(label, probaOfPositive);
    }
    // Arrêtez l'animation une fois que la réponse est reçue
    buttonAwakening();
}

// Initialize the process for sentiment analysis
async function sendData() {
    cleanError();
    knockOffButtons();
    // Démarrez l'animation pendant l'attente de la réponse
    animate_send();
    return new Promise(resolve => {
        var response = getSentimentAnalysis();
        resolve(response); // remplacer success par le retour du backend
    });
}

// Display an error message
function displayError(errorMsg) {
    document.getElementById('error_msg').innerHTML = errorMsg;
}

// Erase the error message
function cleanError() {
    document.getElementById('error_msg').innerHTML = "";
}




////////////////////////////////////////////////
/*Functions to ask the AI to generate a review*/  
////////////////////////////////////////////////

// Process the answer of the review generation
async function processResult_reviewGeneration(generatedReview) {
    buttonAwakening();
    var fullMessage = document.createElement('div');
    fullMessage.className = "generatedReview";
    fullMessage.innerHTML = generatedReview.replace(/\n/g, '<br>');
    var divStockage = document.createElement('div');
    divStockage.className = "align-left";
    divStockage.appendChild(fullMessage);
    var chatMessages = document.getElementById('chat-messages');
    chatMessages.insertBefore(divStockage, chatMessages.firstChild);
}

// Initialize the process for the review generation
async function generateReview() {
    knockOffButtons();
    return new Promise(resolve => {
        var response = getReviewGeneration();
        resolve(response); // remplacer success par le retour du backend
    });
}





///////////////////////////////////////
/*Function to display the readme file*/      
///////////////////////////////////////

// Display the readme file of the project
function displayReadme() {
    div_ia = document.getElementById("GUI_to_interact_with");
    div_md = document.getElementById("markdown_div");
    div_text = document.getElementById("markdown_text");

    // We hide the main div and show the readme div
    if (div_ia.style.visibility!=="hidden") {
        document.getElementById("chat-messages").style.display = "none";
        div_ia.style.visibility = 'hidden';
        div_ia.style.opacity = 0;
        div_md.style.visibility = 'visible';
        div_md.style.opacity = 1;

        // Get the readme as html code
        fetch('/README', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                div_text.innerHTML = data;
            })
            .catch(error => console.error('Erreur:', error));
    
    // We hide the readme div and show the main div
    } else {
        document.getElementById("chat-messages").style.display = "block";
        div_text.innerHTML = "";
        div_ia.style.visibility = 'visible';
        div_ia.style.opacity = 1;
        div_md.style.visibility = 'hidden';
        div_md.style.opacity = 0;
    }
}





//////////////////////////////////////////////////
/*Functions to activate and deaviate the buttons*/
//////////////////////////////////////////////////

function knockOffButtons() {
    var buttonG = document.getElementById('generate-button');
    buttonG.style.backgroundImage = 'url("static/css/icons/generate_spinning_gear.gif")';
    buttonG.onclick = null;
    var buttonS = document.getElementById('send-button');
    buttonS.onclick = null;
}

function buttonAwakening() {
    var buttonG = document.getElementById('generate-button');
    buttonG.style.backgroundImage = 'url("static/css/icons/generate_base.png")';
    buttonG.onclick =  function() {generateReview();};

    var buttonS = document.getElementById('send-button');
    buttonS.style.animation = 'none';
    buttonS.style.backgroundImage = 'url("static/css/icons/send.png")';
    buttonS.className = "sendButton";
    buttonS.onclick =  function() {sendData();};
}

function animate_send() {
    var button = document.getElementById('send-button');
    button.style.backgroundImage = 'url("static/css/icons/gear.png")';
    button.style.animation = 'rotate 1s linear infinite';
}
