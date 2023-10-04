//defines html elements
let submitButton = document.getElementsByClassName("btn-danger")[0]
let timerDisplay = document.getElementById("placeholder")

//define time, necessary later

timer = 0

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
    if (timer <= 0) {
        //alert(objectify(candidateList))

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

        for (let i=0; i<5; i++) {
            document.getElementsByClassName("Selection")[i].value = "0"
            document.getElementsByClassName("Selection")[i].setAttribute("disabled", "true")
            }
        timer = 30
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

    timerDisplay.innerHTML = Math.floor(timer)
    timer -= 0.1

    if (timer <= 0 && timer >= -1) {
        for (let i=0; i<5; i++) {
            document.getElementsByClassName("Selection")[i].removeAttribute("disabled")
        }
    }

    setTimeout(loop, 100)
}

loop()
