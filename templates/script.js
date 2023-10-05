//defines html elements
let submitButton = document.getElementsByClassName("btn-danger")[0]
let timerDisplay = document.getElementById("placeholder")

//make cookie functions (stolen from online)
function bakeCookie(name, value, seconds) {
    let date = new Date();
    date.setTime(date.getTime()+(seconds*1000));
    let expires = "; expires="+date.toGMTString();             
    document.cookie = name+"="+value + expires + "; path=/"
}
function fetchCookie(name) {
    let ca = document.cookie.split(';');
    let value = null
    let nameEQ = name + "=";
    for(var i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ')
            c = c.substring(1, c.length); //delete spaces
        if (c.indexOf(nameEQ) == 0) {
           value= c.substring(nameEQ.length, c.length);          
       }
    }
    return value
} 



//get candidate values

function candidateList() {
    let list = []
    let candidates = document.getElementsByClassName("Selection")
    for (let i=0; i<5; i++) {
        list.push(candidates[i].value)
    }
    return list
}

//turn votes into javascript object

function objectify(arr) {
    obj = {}
    for (let i=0; i<arr.length; i++) {
        newKey = String(i+1) + "choice"
        obj.newKey = arr[i]
    }
    return JSON.stringify(obj)
}

//define functions for submit

function submit() {
    timerDisplay.innerHTML = "submit"

    //check if timeout is done
    if (fetchCookie("BIMNHasVoted") != "yes") {

        //send ballot over AJAX to vote_counting.py
        $.ajax({
            type: "POST",
            url: "/../voteCounting.py/store_vote",
            data: objectify(candidateList()),
        })
        .done(function(response) {
            alert(response);
        })
        .fail(function() {
            alert("error")
        })
        .always(function() {
            alert("sent")
        });

        bakeCookie("BIMNHasVoted", "yes", 30)
        }
}
//add event listeners for submit button
submitButton.addEventListener("click", function() {submit()})

//function that repeats itself once per second as a loop
function loop() {


    for (let i=0; i<5; i++) {
        if (candidateList()[i] != "0" && candidateList()[i] != "None") {
            document.getElementById("1"+String(candidateList()[i])).setAttribute("disabled", "true")
            document.getElementById("2"+String(candidateList()[i])).setAttribute("disabled", "true")
            document.getElementById("3"+String(candidateList()[i])).setAttribute("disabled", "true")
            document.getElementById("4"+String(candidateList()[i])).setAttribute("disabled", "true")
            document.getElementById("5"+String(candidateList()[i])).setAttribute("disabled", "true")
        }
    }
    //take candidate list and list of all candidates
    allCandidates = ["AM", "HS", "LA", "CC", "MM"]
    //make list of candidates not listed
    notListed = allCandidates
    for (let i=0; i<allCandidates.length; i++) {
        for (let j=0; j<5; j++) {
            if (notListed[i] == candidateList()[j]) {
                notListed.splice(i, 1)
            }
        }
    }
    //go through that list
    //remove attribute disabled from all of those
    for (let i=0; i<notListed.length; i++) {
        document.getElementById("1"+String(notListed[i])).removeAttribute("disabled")
        document.getElementById("2"+String(notListed[i])).removeAttribute("disabled")
        document.getElementById("3"+String(notListed[i])).removeAttribute("disabled")
        document.getElementById("4"+String(notListed[i])).removeAttribute("disabled")
        document.getElementById("5"+String(notListed[i])).removeAttribute("disabled")
    }

    timerDisplay.innerHTML = fetchCookie("BIMNHasVoted")

    if (fetchCookie("BIMNHasVoted") != "yes") {
        for (let i=0; i<5; i++) {
            document.getElementsByClassName("Selection")[i].removeAttribute("disabled")
        }
    }
    else {
        for (let i=0; i<5; i++) {
            document.getElementsByClassName("Selection")[i].value = "0"
            document.getElementsByClassName("Selection")[i].setAttribute("disabled", "true")
        } 
    }

    setTimeout(loop, 100)
}

loop()
