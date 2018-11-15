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
        console.log(trainName);
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
        // variable for the train table
        let trains = $("#trains");

        console.log(childSnapshot.val().trainName);

        // append the data to the tablebody from firebase
        // creating a funciton to dynamically render the tableData entered by user
        function renderTableRow() {

            let newTR = $("<tr>");


            function renderCell(cellData) {

                let newTD = $("<td>");
                newTD.text(cellData);
                newTR.append(newTD);
            }

            renderCell(childSnapshot.val().trainName);
            renderCell(childSnapshot.val().destination);
            renderCell(childSnapshot.val().frequency);
            renderCell('need formula');
            renderCell('need formula');

            trains.append(newTR);

        };

        renderTableRow();

        /*these variables will hold my moments
        now holds a reference to the current time from moment.js*/
        let now = moment();
        console.log(now);

        let mostRecentTrain = moment(childSnapshot.val().firstTrainTime);
        console.log(mostRecentTrain);

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

        // this variable holds a reference to a new table row HTML element

    });

});