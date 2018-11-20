$(document).ready(function () {
    // variable for the train table
    let trains = $("#trains");

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAGtPthuhW7xfVdLPUp3ArfxIz0C9sxJys",
        authDomain: "bootcamp-homework-week-8.firebaseapp.com",
        databaseURL: "https://bootcamp-homework-week-8.firebaseio.com",
        projectId: "bootcamp-homework-week-8",
        storageBucket: "bootcamp-homework-week-8.appspot.com",
        messagingSenderId: "995589490300"
    };
    // reference to the database   
    firebase.initializeApp(config);

    // creating a variable for referencing the database in JS 
    database = firebase.database();

    // click handler for the submit button to push data to firebase
    $(document).on("click", ".btn", function (event) {
        event.preventDefault();

        // variables that hold the reference to the data entered in the form
        let trainName = $("#train-name").val().trim();
        let destination = $("#destination").val().trim();
        let firstTrainTime = $("#first-train-time").val().trim();
        let frequency = $("#frequency").val().trim();

        // sends data as a JSON object to firebase 
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

        // Empty form after table is updated
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train-time").val("");
        $("#frequency").val("");

    });

    // appending the data from the database to the table from firebase whenever data is added
    database.ref().on("child_added", function (childSnapshot) {
        
        /*these variables will hold my moments
        now holds a reference to the current time from moment.js*/
        let now = moment();
        console.log("It is now exactly: " + now.format("hh:mm"));

        // this variable changes the frequency of the most recently added train from a string into a number so that we can do math with it.
        let tFrequency = parseInt(childSnapshot.val().frequency);
        console.log(tFrequency);

        // This Variable holds a reference to the time of the first train and sets it back in time by two days so that we can always get a difference between the first train time and now.  Otherwise if the first train is at 4 pm and it is only 3 pm then the solution would not work.   
        let firstTrainEver = moment(childSnapshot.val().firstTrainTime, "HH:mm").subtract(2, "days");
        console.log(firstTrainEver);

        // This variable holds a reference to the difference between now and the first train time 
        let timeDifference = now.diff(moment(firstTrainEver), "minutes");
        console.log("The time difference between the first train and now is:" + timeDifference);

        // This variable holds the time difference between now and the first train divided by the frequency to provide the number of minutes passed since the most recent train arrival
        let sinceRecentArrival = timeDifference % tFrequency;
        console.log("It's been " + sinceRecentArrival + " minutes since the last train arrived!");

        // Subtracting the frequency from the amount of time since the last train arrived gives us the minutes away
        let minutesAway = tFrequency - sinceRecentArrival;
        console.log("The next train will arrive in " + minutesAway + " minutes.");

        // adding the minutes away to now gives us how long until the next train arrives
        let nextArrival = now.add(minutesAway, "minutes");
        console.log("The next train will arrive at: " + moment(nextArrival).format("hh:mm"));

        // variable for the train table
        let trains = $("#trains");

        // append the data to the tablebody from firebase

        // this variable holds a reference to a new table row HTML element
        let newTR = $("<tr>");

        // this function creates an new td element with the text of the most recently entered data for each input on the form 
        function renderCell(cellData) {
            // variable that holds a reference to a new td created each time a new data set is added to firebase
            let newTD = $("<td>");
            // sets the text of the new td equal to the value passed as an argument into the renderCell function
            newTD.text(cellData);
            // appends the new table data cell to the new table row
            newTR.append(newTD);
        }
        //render a cell with the value of the most recently added train name
        renderCell(childSnapshot.val().trainName);
        //render a cell with the value of the most recently added destination
        renderCell(childSnapshot.val().destination);
        //render a cell with the value of the most recently added train frequency
        renderCell(childSnapshot.val().frequency);
        // //render a cell with the value of the next arrival
        renderCell(moment(nextArrival).format("LT"));
        //render a cell with the value of minutes away
        renderCell(minutesAway);

        // appending the new table row with all the newly appended table data to the table "#trains"
        trains.append(newTR);



        // I want the most Recent train to be updated using the if statement below, right now the vairables do not match but I want to clone the first train time in the variable mostRecentTrain and then have it updated by the frequency variable so that the most recent train time will always be the most recent one that has arrived since now.  I am saving all of these comments and commented out stuff becuase I think it helps show my process and the fact that I didn't just jump right to the provided solution to the logical problem in the train example excercise.  I worked through it first and got to a solution, albeit a terrible and not actually workable solution but never the less a solution that allowed for solving the bulk of the logic problem on my own becuase it gave me a framework in which to think about the solution.  Here's what I was originally thinking that helped me even though it was wrong, it gave me a good understanding of the whole problem and what was needed:

        // let minutesPassedSinceLastTrain = timeDifference % parseInt(moment(childSnapshot.val().frequency));
        // console.log("this is the number of minutes since the last train arrived")

        // // subtracts current time from the last arrival time to give us the number of minutes since the last train
        // console.log(moment(childSnapshot.val().firstTrainTime));
        // let minutesPassed = parseInt(now) - parseInt(mostRecentTrain);

        // subtracts the minutes passed since the last train arrived by the Arrival frequency in order to determine how many ninutes away the next train is 
        // let minutesAway = (parseInt(frequency) - minutesPassed);
        // console.log(nextArrival);

        // holds references to the moment calculation updated using the conditional statement below
        // let nextArrival = (parseInt(now) + parseInt(minutesAway));

        // If right now equals the time of the first train to arrive plus the amount of time it takes for the next train to arrive then change the firstTrainTime to right now 
        // if (parseInt(now) === parseInt(childSnapShot.val().firstTrainTime) + parseInt(frequency)) {
        //     firstTrainTime = now;
        //     nextArrival = frequency;
        // };

        // Using the solution in the train excercise helped me understand a cleaner way of arriving at the time since the most recent train arrived.  Getting the difference in time  between that first train and now using the handy dandy .diff method gives us a way to figure out how many minutes since the last train arrived without having to set an interval and have a function constantly checking to see if it's time to update the mostRecentTrain variable as I had originally envisioned.  Thanks for reading my story.

    });

});