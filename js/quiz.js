// the varaibles we use in this app
let quizapp = document.querySelector(".quizapp")
let divctegory = document.querySelector(".divctegory");
let question = document.querySelector(".question");
let answers = document.querySelector(".answers");
let button_submit = document.querySelector(".button button")
let divbutton = document.querySelector(".button")
let spans = document.querySelector(".spans");
let time = document.querySelector(".timer .time");
let timer = document.querySelector(".timer");
let resultElement = document.querySelector(".resultElement");
let TheQuestionInJF = 0;
let spanclass = 0;
var RightAnswer = 0;
let CountDownInterval;

// get data from json fils  (JF)
function getdatafromjson(){
    var xttp = new XMLHttpRequest()
    xttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            // get repons 
            let  reponse = JSON.parse(this.responseText)
            let CountOfQuestion = reponse.length

            // function to create the elements and function countdown 
            createquizapp(CountOfQuestion,reponse,TheQuestionInJF,spanclass)
            countdown(60,CountOfQuestion,reponse);

            // after click on button submit 
            button_submit.addEventListener("click" , ()=>{
                GetAnswerSelected(reponse)
                AccessTheElements(CountOfQuestion,reponse,RightAnswer);
                clearInterval(CountDownInterval)
                time.innerHTML = "";
                countdown(60,CountOfQuestion,reponse);
            })
        }
    }
    xttp.open("GET" ,"TheQuestions.json",true)
    xttp.send()
}
// call the function to get the data 
getdatafromjson()

// function to create the quiz app
let arr = []
function createquizapp(CountOfQuestion,response,TheQuestionInJF,sclass){
    for(var i = TheQuestionInJF ; i < TheQuestionInJF+1 ; i++){
        // create span category 
        let category = document.createElement("span");
        let categorytext = document.createTextNode("catergory : html") ;
        category.className = "category" ;
        category.appendChild(categorytext) ; 
                
        // create span count of questions 
        let count = document.createElement("span") ;
        count.innerHTML = `Qustion count : ${CountOfQuestion}`
        count.className = "count" ; 
            
        divctegory.appendChild(category)
        divctegory.appendChild(count)
        question.innerHTML = `Q${i+1} - ${response[i].title}`
    
        // bockel to create the questions element
        for(var j = 1 ; j <= 4 ; j++){
            // create div parent of inputs and labels
            let div = document.createElement("div");
            var input = document.createElement("input") ;
            let label = document.createElement("label");
            input.type="radio";
            input.name="radio";
            input.id = `answer_${j}`
            input.dataset.answer = `${response[i][`answer_${j}`]}`
            label.htmlFor = `answer_${j}`
            label.innerHTML = `${response[i][`answer_${j}`]}`
            div.appendChild(input)
            div.appendChild(label)
            answers.appendChild(div)
            answers.firstElementChild.firstElementChild.checked =true
        }
        // bockel to create spans 
        for (let i = 0 ; i < CountOfQuestion ; i++){
            let span = document.createElement("span");
            spans.appendChild(span)
        }
        // give the spans class on 
        arr.push(sclass);
        for(let i = 0 ; i < arr.length ; i++){               
            spans.childNodes[i].className="on"
        }
    }
}
// function to get the right answer
function GetAnswerSelected(reponse){
    for(var j = TheQuestionInJF ; j < TheQuestionInJF+1 ; j++){
        for(let i = 0 ; i < answers.childElementCount ; i++){
            // console.log(answers.children[i].firstElementChild)
            if(answers.children[i].firstElementChild.checked){
                if(answers.children[i].firstElementChild.getAttribute("data-answer") == reponse[j]["right_answer"]){
                    RightAnswer++
                }
            }
        }
    }
}
function AccessTheElements(CountOfQuestion,reponse,RightAnswer){
    spanclass++
    if(spanclass >= CountOfQuestion){
        let a = 2 ;
        deletdata(a)
        Result(RightAnswer,CountOfQuestion)
    }else{
        let a = 1
        deletdata(a)
        TheQuestionInJF++
        createquizapp(CountOfQuestion,reponse,TheQuestionInJF,spanclass)
    }
}
// countdown 
function countdown(d,CountOfQuestion,reponse){
    if(spanclass < CountOfQuestion){
        let munite;
        let second; 
        CountDownInterval = setInterval(function(){
            munite = parseInt(d / 60); 
            second = parseInt(d % 60); 
            munite = munite < 10 ? `0${munite}` : munite
            second = second < 10 ? `0${second}` : second
            time.innerHTML = `${munite}:${second}`;
            d--
            if(d < 0){
                clearInterval(CountDownInterval);
                GetAnswerSelected(reponse)
                AccessTheElements(CountOfQuestion,reponse,RightAnswer);
                time.innerHTML = "";
                countdown(60,CountOfQuestion,reponse);
                /* another solution is take the button and add click evnent on it like that :
                        button_submit.click();
                */
            }
        } , 1000)
    }
}
// function to delete the elements 
function deletdata(a){
    if(a==1){
        divctegory.innerHTML = "";
        question.innerHTML = "";
        answers.innerHTML = "";
        spans.innerHTML = "" ;
    }
    if(a==2){
        question.remove(); 
        answers.remove();
        divbutton.remove();
        timer.remove();
    }
}
// the results
function Result(RightAnswer,CountOfQuestion){
    if(RightAnswer == CountOfQuestion){
        resultElement.innerHTML = `<div class="divctegory">
        <p><span class="perfect">Perfect :</span> your result is ${RightAnswer} from ${CountOfQuestion}</p>
        </div>`;
        Swal.fire({
            title: 'Perfect',
            width: 700,
            padding: '1em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            showConfirmButton: true,
            timer: 1500,
            backdrop: ` rgba(0,0,123,0.4) `
        })
    }else if(RightAnswer >= (CountOfQuestion / 2) && RightAnswer < CountOfQuestion){
        resultElement.innerHTML = `<div class="divctegory">
        <p><span class="good">Good :</span> your result is ${RightAnswer} from ${CountOfQuestion}</p>
        </div>`;
        Swal.fire({
            title: 'Good',
            width: 700,
            padding: '1em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            showConfirmButton: true,
            timer: 1500,
            backdrop: ` rgba(0,0,123,0.4) `
        })
    }else{
        resultElement.innerHTML = `<div class="divctegory">
        <p><span class="bad">Bad :</span> your result is ${RightAnswer} from ${CountOfQuestion}</p>
        </div>`;
        Swal.fire({
            title: 'Not Good',
            width: 700,
            padding: '1em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            showConfirmButton: true,
            timer: 1500,
            backdrop: ` rgba(0,0,123,0.4) `
        })
    }
}