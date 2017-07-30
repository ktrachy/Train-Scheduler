  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyA1vTVZIrhva6TrSCOyuq6fi3PUU7SwmU4",
      authDomain: "train-schedule-3a8bc.firebaseapp.com",
      databaseURL: "https://train-schedule-3a8bc.firebaseio.com",
      projectId: "train-schedule-3a8bc",
      storageBucket: "",
      messagingSenderId: "993645140871"
  };
  firebase.initializeApp(config);

  // Initializing variables

  var database = firebase.database();
  var trainName = "";
  var destination = "";
  var frequency = 0;
  var nextArrival = "";
  var minutesAway = 0;
  var firstTrain = 0;


  // This function acts upon clicking the submit button
  // We take the values that are filled in the form and clean them up and 
  // update the variables with the values submitted from the form

  $(".submit").on("click", function() {
      event.preventDefault();
      trainName = $("#trainInput").val().trim();
      destination = $("#destinationInput").val().trim();
      frequency = $("#frequencyInput").val();
      firstTrain = $("#firstTrain").val().trim();


      // Pushing the data into firebase

      database.ref().push({
          trainName: trainName,
          destination: destination,
          frequency: frequency,
          nextarrival: nextArrival,
          minutesaway: minutesAway,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

  });


  // Pulls data from firebase and assigns the values to variables

  database.ref().on("child_added", function(childSnapshot) {

      // Store everything into a variable.
      var tName = childSnapshot.val().trainName;
      var tDst = childSnapshot.val().destination;
      var tFrq = childSnapshot.val().frequency;
      var tRt = childSnapshot.val().nextarrival;
      var tmin = childSnapshot.val().minutesaway;


      // Time calculations using moment

      var firstTime = "0";
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);
      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
      // Time apart (remainder)
      var tRemainder = diffTime % tFrq;
      console.log(tRemainder);
      // Minute Until Train
      var tMinutesTillTrain = tFrq - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      // This creates and appends the data inserted in Train Schedule

      $("tbody").append("<tr> <td>" + tName + "</td> <td>" + tDst + "</td> <td>" +
          tFrq + " mins" + "</td> <td>" + moment(nextTrain).format("hh:mm a") + "</td> <td>" + tMinutesTillTrain + "</td> </tr>");
  });