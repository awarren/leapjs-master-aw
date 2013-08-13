// MATH

var mathFactor1 = Math.floor(Math.random()*5+1);
var mathFactor2 = Math.floor(Math.random()*5+1);
var mathProduct = mathFactor1*mathFactor2;
var hand0Pointables;
var hand1Pointables;

console.log(mathFactor1, " x ", mathFactor2, " = ", mathProduct);
mathProductDiv.innerHTML = mathProduct;

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

  // -----------------------------------------------------------------------------------------------------
  // COUNT HANDS AND FINGERS AND SHOW THIS
  var hands = obj.hands.length;
  var fingers = obj.pointables.length;

  // If more than 2 "hands" are detected, it will still only say 2 hands
  if (hands>2) {
    hands = 2;
  };

  handsDiv.innerHTML = hands;
  fingersDiv.innerHTML = fingers;

  var a = hands == 1 ? "hand" : "hands";
  var b = fingers == 1 ? "finger" : "fingers";

  handsDesc.innerHTML = a;
  fingersDesc.innerHTML = b;

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

      // Set pointable color per hand
      if (handNumber==0) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        hand0PointablesDiv.innerHTML = hand.pointables.length;
        hand0Pointables = hand.pointables.length;
        // console.log(hand0Pointables);
      }
      else if (handNumber=1) {
        ctx.fillStyle = "rgba(0,128,128,0.7)";
        hand1PointablesDiv.innerHTML = hand.pointables.length;
        hand1Pointables = hand.pointables.length;
        // console.log(hand1Pointables);
      }
      else {
        ctx.fillStyle = "#003300";
      }

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
          var radius = Math.min(1000/Math.abs(pos[2]),20);
          ctx.beginPath();
          ctx.arc(pos[0]-radius/2,-pos[1]-radius/2,radius,0,2*Math.PI);
          ctx.fill();

        }
        if (fingerIds.length > 0) {
          handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
        }
        if (toolIds.length > 0) {
          handString += "Tools IDs: " + toolIds.join(", ") + "<br />";
        }

        // CHECK IF ANSWER IS CORRECT AND RESPOND
        var mathAnswerCheck = hand0Pointables*hand1Pointables;

        if (mathProduct == mathAnswerCheck) {
          mathAnswer.innerHTML = "Correct!";
          console.log("Correct! hand0Pointables: ", hand0Pointables, " x hand1Pointables: ", hand1Pointables, " = mathProduct: ", mathProduct);
        }
        else {
          mathAnswer.innerHTML = "Think again!";
          console.log("Thing again! hand0Pointables: ", hand0Pointables, " x hand1Pointables: ", hand1Pointables, " = mathProduct: ", mathProduct);
        };

      }

      handString += "</div>";
    }
  }

  // Show div of descriptive text about hand and fingers being sensed
  handOutput.innerHTML = handString;  

};

// LISTEN TO LEAP MOTION AND LOOP
Leap.loop(draw);