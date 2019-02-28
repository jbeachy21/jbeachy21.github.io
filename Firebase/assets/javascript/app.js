$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyAj8p-PKorkRHiRsSVFd_mEzOTgdWlqEys",
    authDomain: "trainscheduler-36c34.firebaseapp.com",
    databaseURL: "https://trainscheduler-36c34.firebaseio.com",
    projectId: "trainscheduler-36c34",
    storageBucket: "trainscheduler-36c34.appspot.com",
    messagingSenderId: "583997939867"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  database.ref().on("value", function(childSnapshot) {
     //Get content back from Firebase in the form of the childSnapshot
    var TrainName = childSnapshot.val().Tname;
    var TrainDestination = childSnapshot.val().Tdestination;
    var TrainTime = childSnapshot.val().Ttime; //Next arrival
    var TrainFrequency = childSnapshot.val().Tfreq;

    
   
   });

  $("#submit").on("click", function(event) {

    event.preventDefault();
    var name = $("#train-name").val();
    var destination = $("#destination-text").val();
    var Traintime = $("#train-time").val();
    var frequency = $("#frequency").val();
    

    //form values gathered
    var newTrain = {
      Tname: name,
      Tdestination: destination,
      Ttime: Traintime,
      Tfreq: frequency,
    };


    



    //All new train information is pushed to firebase
    database.ref().push(newTrain);

    console.log("Tname: " + newTrain.Tname);
    console.log("Tdestination: " + newTrain.Tdestination);
    console.log("Ttime: " + newTrain.Ttime);
    console.log("Tfreq: " + newTrain.Tfreq);
    

    //resets text fields
    $("#train-name").val("");
    $("#destination-text").val("");
    $("#train-time").val("");
    $("#frequency").val("");
    
  });




  database.ref().on("child_added", function(childSnapshot) {
    
    //Get content back from Firebase in the form of the childSnapshot
    var TrainName = childSnapshot.val().Tname;
    var TrainDestination = childSnapshot.val().Tdestination;
    var TrainTime = childSnapshot.val().Ttime; //Next arrival
    var TrainFrequency = childSnapshot.val().Tfreq;
  


    var whenTheTrainFirstArrives = moment(TrainTime, "HH:mm");
    console.log("whenTheTrainFirstArrives: " + whenTheTrainFirstArrives);

    var Frequency = moment(TrainFrequency, "m");
    console.log("TrainFrequency: " + TrainFrequency);

    var rightNow = moment().format("HH:mm:s");
    console.log("rightNow: " + rightNow);

    var timeDiff = moment().diff(moment(whenTheTrainFirstArrives), "minutes");
    if (timeDiff < 0) { 
      timeDiff = timeDiff * -1;
    }
    console.log("timeDiff: " + timeDiff);

    var offset = timeDiff % TrainFrequency;
    console.log("offset: " + offset);
    var timeTillTrain = TrainFrequency - offset;
    var nextTrain = moment().add(timeTillTrain, 'minutes');
    console.log("\n");



    //Add contents to the new rows of the table
    var newRow = $("<tr>").append(
      $("<td>").text(TrainName),
      $("<td>").text(TrainDestination),
      $("<td>").text(TrainFrequency),
      $("<td>").text(TrainTime),
      $("<td>").text(nextTrain)
    );
    
    $("#train-table > tbody").append(newRow);
  });
});
