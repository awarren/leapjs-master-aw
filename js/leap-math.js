var paused = false;

// MATH
var mathFactor1 = Math.floor(Math.random()*5+1);
var mathFactor2 = Math.floor(Math.random()*5+1);
var mathProduct = mathFactor1*mathFactor2;
var hand0Pointables;
var hand1Pointables;
var mathAnswerCheck; // The product of hand0Pointables and hand1Pointables
var mathAnswerCorrect = false; // If the correct answer has been given

console.log(mathFactor1, " x ", mathFactor2, " = ", mathProduct);
mathProductDiv.innerHTML = mathProduct;

// console.log(InteractionBox);

var gesturePause = 0;

// xxxxx

var handsDiv = document.getElementById("hands");
var fingersDiv = document.getElementById("fingers");

var handsDesc = document.getElementById("description-hands");
var fingersDesc = document.getElementById("description-fingers");

// Create context to show fingers
var fingerCanvas = document.getElementById("leap-overlay");
// Fullscreen
fingerCanvas.width = document.body.clientWidth;
fingerCanvas.height = document.body.clientHeight;
// Create a rendering context
var ctx = fingerCanvas.getContext("2d");
ctx.translate(fingerCanvas.width/2,fingerCanvas.height);

// TO BE LOOPED BY LEAP
function draw(obj) {

  if (paused) {
    return; // Skip this update
  }

  // Preventing gestures happening in rapid succession
  // Disables gesture detection for a number of frames
 
  // A gesture has been triggered recently
  if (gesturePause != 0 && gesturePause < 50) {
    gesturePause++;
    console.log("Gesture blocking: gesturePause != 0, increasing to: ", gesturePause);
  }
  if (gesturePause >= 50) {
    gesturePause = 0;
  }

  /*
  Need to initiate LeapManager, figure out how it loops instead.
  May be better to build using Cecily's code.

  fingerCanvas.addEventListener("leap-circle-stop", function(e){
      console.log("leap-circle-stop");
  });
  */

  var gestureString = "";
  console.log("gestureString created");
  if (obj.gestures.length > 0) {
    console.log("gesture fired...");
    for (var i = 0; i < obj.gestures.length; i++) {
      var gesture = obj.gestures[i];
      gestureString += "Gesture ID: " + gesture.id + ", "
                    + "type: " + gesture.type + ", "
                    + "state: " + gesture.state + ", "
                    + "hand IDs: " + gesture.handIds.join(", ") + ", "
                    + "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
                    + "duration: " + gesture.duration + " &micro;s, ";

      switch (gesture.type) {
        case "swipe":
          if (gesturePause == 0 && mathAnswerCorrect) {
            var mathFactor1 = Math.floor(Math.random()*5+1);
            mathFactor2 = Math.floor(Math.random()*5+1);
            mathProduct = mathFactor1*mathFactor2;
            console.log(mathFactor1, " x ", mathFactor2, " = ", mathProduct);
            mathProductDiv.innerHTML = mathProduct;
            gesturePause = 1;
            console.log("end of gesture function: ", gesturePause);
          }
        break;
        /*
        case "circle":
          gestureString += "radius: " + gesture.radius.toFixed(1) + " mm, "
                        + "progress: " + gesture.progress.toFixed(2) + " rotations";
          break;
        case "screenTap":
        case "keyTap":
          gestureString += "keytap";
          break;
        */
        /*
        default:
          gestureString += "unkown gesture type";
        */
      }
      // console.log("Gesture fired: ", gestureString);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // COUNT HANDS AND FINGERS AND SHOW THIS
  var hands = obj.hands.length;
  var fingers = obj.pointables.length;

  // If more than 2 "hands" are detected, it will still only say 2 hands
  if (hands>2) {
    hands = 2;
  };

  /*
  handsDiv.innerHTML = hands;
  fingersDiv.innerHTML = fingers;

  var a = hands == 1 ? "hand" : "hands";
  var b = fingers == 1 ? "finger" : "fingers";

  handsDesc.innerHTML = a;
  fingersDesc.innerHTML = b; 
  */

  // -----------------------------------------------------------------------------------------------------
  // RENDER POINTABLE POSITIONS AND SHOW DESCRIPTION TEXT

  // Clear last frame
  ctx.clearRect(-fingerCanvas.width/2,-fingerCanvas.height,fingerCanvas.width,fingerCanvas.height);

  // Display Hand object data
  var handOutput = document.getElementById("handData");
  var handString = "";
  if (obj.hands.length > 0) {
    // This loop runs for each hand
    for (var i = 0; i < obj.hands.length; i++) {
      var hand = obj.hands[i];
      var handNumber = i;

      handString += "<div style='width:300px; float:left; padding:5px'>";
      handString += "Hand ID: " + hand.id + "<br />";

      if (obj.hands[0]) {
        // nothing
        //console.log("hand 0 exists.");
      }
      else {
        if (mathAnswerCorrect == false) {
          hand1PointablesDiv.innerHTML = "?";
          //console.log("hand 0 doesn't exist");
        }
      }

      if (obj.hands[1]) {
        // nothing
        //console.log("hand 1 exists.");
      }
      else {
        if (mathAnswerCorrect == false) {
          hand1PointablesDiv.innerHTML = "?";
          //console.log("hand 1 doesn't exist");
        }
      }

      // Set pointable color per hand
      if (handNumber==0) {
        ctx.fillStyle = "rgba(146,167,199,0.7)";
        if (mathAnswerCorrect == false) {
          hand0Pointables = hand.pointables.length;
            if (hand.pointables.length != 0) {
              hand0PointablesDiv.innerHTML = hand.pointables.length;
            }
            else {
              hand0PointablesDiv.innerHTML = "?";
            }
        }
        // console.log(hand0Pointables);
      }
      else if (handNumber==1) {
        ctx.fillStyle = "rgba(135,209,199,0.7)";
        if (mathAnswerCorrect == false) {
          hand1Pointables = hand.pointables.length;
            if (hand.pointables.length != 0) {
              hand1PointablesDiv.innerHTML = hand.pointables.length;
            }
            else {
              hand1PointablesDiv.innerHTML = "?";
            }
        }
        // console.log(hand1Pointables);
      }
      else {
        ctx.fillStyle = "#003300";
      }

      // CHECK IF ANSWER IS CORRECT
      if (mathProduct == hand0Pointables*hand1Pointables) {
        mathAnswerCorrect = true;
      }
      else {
        mathAnswerCorrect = false;
      };

      // IDs of pointables (fingers and tools) associated with this hand
      if (hand.pointables.length > 0) {
        var fingerIds = [];
        var toolIds = [];

        // Loops per pointable for a hand
        for (var j = 0; j < hand.pointables.length; j++) {
          var pointable = hand.pointables[j];
          if (pointable.tool) {
            toolIds.push(pointable.id);
          }
          else {
            fingerIds.push(pointable.id);
          }

          // Render circles based on pointable positions
          var pos = pointable.tipPosition;
          var radius = Math.min(600/Math.abs(pos[2]),20);
          ctx.beginPath();
          ctx.arc((pos[0]-radius/2)*3,(-pos[1]-radius/2)*2,radius*2,0,2*Math.PI);
          ctx.fill();

        }
        if (fingerIds.length > 0) {
          handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
        }
        if (toolIds.length > 0) {
          handString += "Tools IDs: " + toolIds.join(", ") + "<br />";
        }

        // RESPOND IF ANSWER IS CORRECT
        if (mathAnswerCorrect) {
          // mathAnswer.innerHTML = "=";
          mathProductDiv.style.color = "rgba(101,190,97,1)";
          hand0PointablesDiv.style.color = "rgba(101,190,97,1)";
          hand1PointablesDiv.style.color = "rgba(101,190,97,1)";
          // console.log("Correct! hand0Pointables: ", hand0Pointables, " x hand1Pointables: ", hand1Pointables, " = mathProduct: ", mathProduct);
        }
        else {
          // mathAnswer.innerHTML = "!=";
          mathProductDiv.style.color = "rgba(0,0,0,1)";
          hand0PointablesDiv.style.color = "rgba(146,167,199,1)";
          hand1PointablesDiv.style.color = "rgba(135,209,199,1)";
          // console.log("Thing again! hand0Pointables: ", hand0Pointables, " x hand1Pointables: ", hand1Pointables, " = mathProduct: ", mathProduct);
        };

      }

      handString += "</div>";
    }
  }

  // Show div of descriptive text about hand and fingers being sensed
  // handOutput.innerHTML = handString;  

};


// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

// LISTEN TO LEAP MOTION AND LOOP
Leap.loop(controllerOptions, draw);