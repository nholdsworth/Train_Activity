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
        // variable for the train table
        let trains = $("#trains");

        // append the data to the tablebody from firebase
        // creating a funciton to dynamically render the tableData entered by user into a new table row each time
        function renderTableRow() {

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
            renderCell('need formula');
            //render a cell with the value of minutes away
            renderCell('need formula');

            // appending the new table row with all the newly appended table data to the table "#trains"
            trains.append(newTR);

        };

        // calling the function render table row after the event listener for child_added in firebase
        renderTableRow();

        /*these variables will hold my moments
        now holds a reference to the current time from moment.js*/
        let now = moment();
        console.log("It is now exactly: " + now.format("hh:mm"));
        
        let tFrequency = parseInt(childSnapshot.val().frequency);
        console.log(tFrequency);
 
        // I want the most Recent train to be updated using the if statement below, right now the vairables do not match but I want to clone the first train time in the variable mostRecentTrain and then have it updated by the frequency variable so that the most recent train time will always be the most recent one that has arrived since now 
        
        // DISREGARD the comments above because getting the difference of that first train
        let firstTrainEver = moment(childSnapshot.val().firstTrainTime, "HH:mm").subtract(2, "days");
        console.log(firstTrainEver);

        
        let timeDifference = now.diff(moment(firstTrainEver), "minutes");
        console.log("The time difference between the first train and now is:" + timeDifference);

        let sinceRecentArrival = timeDifference % tFrequency;
        console.log("It's been " + sinceRecentArrival + " minutes since the last train arrived!");

        let minutesAway = tFrequency - sinceRecentArrival;
        console.log("The next train will arrive in " + minutesAway + " minutes.");

        let nextArrival = now.add(minutesAway, "minutes");
        console.log("The next train will arrive at: " + moment(nextArrival).format("hh:mm"));



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

        

    });

});