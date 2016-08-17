var _ = require("underscore");
var request = require('request');
var firebase = require("firebase");

var listTarget = [];
var messages = [];

var firebaseBDDparams = {
  apiKey: "AIzaSyAIcRpj2ZVuOqVm0Fbx16aXGHKjNC3rdZo",
  authDomain: "be-happy-fb01b.firebaseapp.com",
  databaseURL: "https://be-happy-fb01b.firebaseio.com",
  storageBucket: "be-happy-fb01b.appspot.com",
}

var app = firebase.initializeApp(firebaseBDDparams);

/* KEEP TOKENS UP TO DATE */
var tokensRef = app.database().ref('tokens/');
tokensRef.on("child_added", function(snapshot) {
  listTarget.push(snapshot.key);
  console.log(listTarget.length + ' listening');
});

tokensRef.on("child_removed", function(snapshot) {
  if (listTarget.indexOf(snapshot.key) >= 0) {
    listTarget = listTarget.splice(listTarget.indexOf(snapshot.key), 0);
  }
  console.log(listTarget.length + ' listening');
});

setInterval(function() {
  pushAll(listTarget, 'test');
}, 10000);

var apikey = "AIzaSyB03q3xTZLIP2KYt6AXEXsDcD6t48c6jcs";

function pushAll(listTarget, message) {

  if(listTarget.length == 0) {
    return false;
  }

  console.log("Sending happy messages to "+listTarget.length);

  request.post({
    uri: 'https://android.googleapis.com/gcm/send',
    json: {
      registration_ids: listTarget, // this is the device token (phone)
      //time_to_live: 180, // just 30 minutes
      data: {
        message: message // your payload data
      }
    },
    headers: {
      Authorization: 'key=' + apikey
    }
  }, function(err, response, body) {
    callback(err, body);
  })

  function callback(err, body) {
    if(!err) {
      console.log(body.success+' messages success');
    } else {
      console.log('ERROR: ' + JSON.stringify(err));
    }
  }
}

//curl -k --header "Authorization: key=AIzaSyB03q3xTZLIP2KYt6AXEXsDcD6t48c6jcs" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"e37LnkIDJbM:APA91bEpctKbM16SykNrIbcfzdvDdbnpAyoECIBcVQuLXVb9NnSpT_Q93OLBTjXijEIkMoyi7hhJ8TqIAfjXSLE67opOjpAj3cgpIbXliMYipjUH2UYmNIi2ZnthoRyiEYF-THOI8cMS\"]}"
/*
curl --header "Authorization: key=<YOUR_API_KEY>" --header
"Content-Type: application/json" https://android.googleapis.com/gcm/send -d
"{\"registration_ids\":[\"<YOUR_REGISTRATION_ID>\"]}"
*/
