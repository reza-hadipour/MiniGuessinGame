let min = 1;
let max = 10;

let theNumber;
let closeRange;

let chance; // Number of tries that player can guess correct number, each chance has 10 score;
const totalGameScore = 300;
let score = 0;

let lastGameScore;
let bestGameScore;


let guessField =  document.getElementById('guess-field');
let guessForm = document.getElementById('guess-form');
let answerList = document.getElementById("answer-list");
let answerLabel = document.getElementById('answer-label');
let remainingTriesLabel =  document.getElementById("remaining-times");
let guideLabel = document.getElementById('guide-label');

// Score Fields
let scoreLabel = document.getElementById('score-label');
let lastScoreLabel = document.getElementById('last-score-label');
let bestScoreLabel = document.getElementById('best-score-label');

let answersList = new Set();

// Preload stuffs
document.addEventListener('DOMContentLoaded',function(e){
    // min = prompt('Enter the minimum number to generate random number.',1);
    // max = prompt('Enter the maximum number to generate random number.',10);
    
    let minmax = prompt("Enter min and max number to generate random number.\nSeparate MIN and MAX with \",\" sign.\nexample: 1,20");
    minmax = minmax.split(',').map(value => parseInt(value));

    // min = Math.min(...minmax);
    // max = Math.max(...minmax);

    [min,max] = minmax;
        
    if(isNaN(min) || !min) min = 1;
    if(isNaN(max) || !max) max = 20;
    
    if( min > max) {
        [min,max] = [max,min];
    }

    // Generate Random Number
    theNumber = generateRandomNumber(min,max);
    
    // Defining close range to the answer
    closeRange = Math.abs(Math.floor(difference(min,max) / 5));
    
    // Defining number of tries and score
    chance = Math.abs(Math.floor(difference(min,max) / 5));
    remainingTriesLabel.innerText = chance;

    // Preparing Score
    costOfEachChance = totalGameScore / chance;    
    scoringSystem();

    // Guide Label
    guideLabel.innerHTML = `You must guess a number between ${min} to ${max} in only ${chance} smart steps.<br><span class="badge badge-info">Tip:</span> <span class="badge badge-light text-info">Your close range is ${chance}.</span>`;

    // Load Prevues game score
    loadScore();

    console.log('Target: ', theNumber);
    console.log('Close Range: ', closeRange);
})


function generateRandomNumber(min=1,max=10){
    return Math.floor(Math.random()*(max-min)+min)
}

function difference(numA,numB){
    return Math.abs(numA-numB);
}

function afterEntering(){
    guessField.value = '';
    guessField.focus();
}

function modifyAndCheckRemainingTries(){
    remainingTriesLabel.innerText = --chance;
    scoringSystem();
    return new Promise((resolve,reject)=>{
        if(chance == 0){
            reject(0);
        }else{
            resolve(chance)
        }
    })
}

function playAgain(loseMode = false){
    if(loseMode){
        window.location.reload();
     }else{
        if(confirm("Are u sure?")){
            window.location.reload();
        }
    }
}

function finishGame(){
    guessField.setAttribute("disabled",true);
    guessForm.querySelector(".btn").setAttribute('disabled',true)
}

function addToAnswerList(answer){
    // Insert in answer list
    answerList.insertAdjacentHTML("beforeend",`<span class="badge badge-light badge-pill">${answer}</span>`)
    answersList.add(answer);
}

function scoringSystem(){
    score = chance*costOfEachChance;
    scoreLabel.innerText = Math.floor(score);
}

function loadScore(){
    lastGameScore = localStorage.getItem('lastGameScore') || 0;
    bestGameScore = localStorage.getItem('bestGameScore') || 0;

    lastScoreLabel.innerText = Math.floor(lastGameScore);
    bestScoreLabel.innerText = Math.floor(bestGameScore);
}

function saveScore(){
    localStorage.setItem('lastGameScore',score);
    if (score > bestGameScore) {
        // localStorage.removeItem('bestGameScore');
        localStorage.setItem('bestGameScore',score);
    }    
}

function clearRecords(){
    if(confirm("Are you sure to clear all recent records?")){
        localStorage.clear();
        loadScore();
        alert('Your previously records are removed.')
    }
}

guessForm.addEventListener('submit',function(e){
    e.preventDefault()
    let guessedNumber = guessField.value;

        if(isNaN(guessedNumber) || guessedNumber == ''){
            // Invalid Input
            answerLabel.innerHTML = `<p class="text-warning">Wrong input, just enter <strong>N U M B E R S</strong>.</p>`;
            afterEntering();
        }else{
            // Valid Input
            if(guessedNumber == theNumber){
                //Success Answering
                answerLabel.innerHTML = `<p class="text-success"><strong>Excellent, ${guessedNumber} is true.</strong></p>`
                finishGame();
                saveScore();
            }else{
                if(answersList.has(guessedNumber)){
                    answerLabel.innerHTML = `<p class="text-secondary">Already you've tried <strong>${guessedNumber}</strong>.</p>`
                }else{
                    // Insert in answer list and update the answer label
                    addToAnswerList(guessedNumber);
        
                    let differenceNumb = difference(guessedNumber,theNumber);
        
                    if(guessedNumber > theNumber){
                        if((differenceNumb) > closeRange){
                            answerLabel.innerHTML = `<p class="text-danger"><strong>${guessedNumber}</strong> is too HIIIIIIIIGH. Try again</p>`
                        }else{
                            answerLabel.innerHTML = `<p class="text-primary"><strong>${guessedNumber}</strong> is a little more. Try one more time.</p>`
                        }
                    }else{
                        if((differenceNumb) > closeRange){
                            answerLabel.innerHTML = `<p class="text-danger">${guessedNumber} is too LOOOOOOW. Try again.</p>`
                        }else{
                            answerLabel.innerHTML = `<p class="text-primary">${guessedNumber} is a little low. Try one more time.</p>`
                        }
                    }
                    
                    modifyAndCheckRemainingTries()
                    .catch(err=>{
                        answerLabel.innerHTML = `<p class="text-danger">You Lose!!</p>`;
                        
                        if(confirm('Sorry, You lose the game.\n Do you want try again?')){
                            playAgain(true);
                        }else{
                            finishGame();
                        }
                        saveScore();
                    })
                }
                afterEntering();
            }
        }
    
})