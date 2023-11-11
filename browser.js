class guessingGame{
    #min;
    #max;
    #theNumber;
    #closeRange;    // Close range to the answer
    #chance = 0;    // Number of tries that player can guess correct number
    #costOfEachChance;
    static totalGameScore = 300;
    #score = 0;

    constructor(min=1,max=20){
      this.#max = max;
      this.#min = min;  
    }

    set min(value){
        this.#min = value;
    }

    get min(){
        return this.#min;
    }

    set max(value){
        this.#max = value;
    }

    get max(){
        return this.#max;
    }

    set setChance(value){
        this.#chance = value;
    }

    get getChance(){
        return this.#chance;
    }

    set setNumber(value){
        this.#theNumber = value;
    }

    get getNumber(){
        return this.#theNumber;
    }

    set costOfEachChance(value){
        this.#costOfEachChance = value
    }

    get costOfEachChance(){
        return this.#costOfEachChance;
    }
    
    get getCloseRange(){
        return this.#closeRange;
    }

    set setCloseRange(value){
        this.#closeRange = value;
    }

    get score(){
        return this.#score;
    }

    scoring(){
        this.#score = this.#chance * this.#costOfEachChance;
    }

    generateRandomNumber(){
        this.setNumber =  Math.floor(Math.random()*(this.#max-this.#min)+this.#min)
    }

    decreaseChance(){
         --this.#chance;
    }

}

let app;

let min = 1;
let max = 20;

let answersList = new Set();

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

// Preload stuffs
document.addEventListener('DOMContentLoaded',function(e){
    // min = prompt('Enter the minimum number to generate random number.',1);
    // max = prompt('Enter the maximum number to generate random number.',10);
    
    let minmax = prompt("Enter min and max number to generate random number.\nSeparate MIN and MAX with \",\" sign.\nexample: 1,20");
    if(minmax == null) minmax = [min,max].join();
    minmax = minmax.split(',').map(value => parseInt(value));

    // min = Math.min(...minmax);
    // max = Math.max(...minmax);

    [min,max] = minmax;
        
    if(isNaN(min) || !min) min = 1;
    if(isNaN(max) || !max) max = 20;
    
    if( min > max) {
        [min,max] = [max,min];
    }

    app = new guessingGame(min,max);

    // Generate Random Number
    app.generateRandomNumber();
    
    // Defining close range to the answer
    // let CloseRange =  Math.abs(Math.floor(difference(app.min,app.max) / 5));
    app.setCloseRange = app.setChance = Math.abs(Math.floor(difference(app.min,app.max) / 5));
    
    // Defining number of tries and score  
    remainingTriesLabel.innerText = app.getChance; //chance;

    // Preparing Score
    app.costOfEachChance = guessingGame.totalGameScore / app.getChance; //chance;    
    scoringSystem();

    // Guide Label
    guideLabel.innerHTML = `You must guess a number between ${min} to ${max} in only ${app.getChance} smart steps.<br><span class="badge badge-info">Tip:</span> <span class="badge badge-light text-info">Your close range is ${app.getChance}.</span>`;

    // Load Prevues game score
    loadScore();

    console.log('Target: ', app.getNumber);
    console.log('Close Range: ', app.getCloseRange);
})

function difference(numA,numB){
    return Math.abs(numA-numB);
}

function afterEntering(){
    guessField.value = '';
    guessField.focus();
}

function modifyAndCheckRemainingTries(){
    app.decreaseChance();
    remainingTriesLabel.innerText = app.getChance;
    scoringSystem();
    return new Promise((resolve,reject)=>{
        if(app.getChance == 0){
            reject(0);
        }else{
            resolve(app.getChance)
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
    // score = app.getChance * app.costOfEachChance;
    app.scoring();
    scoreLabel.innerText = Math.floor(app.score);
}

function loadScore(){
    lastGameScore = localStorage.getItem('lastGameScore') || 0;
    bestGameScore = localStorage.getItem('bestGameScore') || 0;

    lastScoreLabel.innerText = Math.floor(lastGameScore);
    bestScoreLabel.innerText = Math.floor(bestGameScore);
}

function saveScore(){
    localStorage.setItem('lastGameScore',app.score);
    if (app.score > bestGameScore) {
        // localStorage.removeItem('bestGameScore');
        localStorage.setItem('bestGameScore',app.score);
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
            if(guessedNumber == app.getNumber){
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

                    let differenceNumb = difference(guessedNumber,app.getNumber);

                    if(guessedNumber > app.getNumber){
                        if((differenceNumb) > app.getCloseRange){
                            answerLabel.innerHTML = `<p class="text-danger"><strong>${guessedNumber}</strong> is too HIIIIIIIIGH. Try again</p>`
                        }else{
                            answerLabel.innerHTML = `<p class="text-primary"><strong>${guessedNumber}</strong> is a little more. Try one more time.</p>`
                        }
                    }else{
                        if((differenceNumb) > app.getCloseRange){
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