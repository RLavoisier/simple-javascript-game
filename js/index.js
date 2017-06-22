var sizeScale = "px";
var positionScale = "%";
var flyables = [];
var cows = [];
var stormySkyOpacity = 0;
var poped = 0;
var saved = 0;
var difficulty = 1;
flyableTypes = {
  cloud: 1,
  cow: 2
};
getFlyables();
initFlyables();
move();

/*
* Flyables
*
*/


function getFlyables(){
  var flyablesElement = document.querySelectorAll(".flyable");
  for(var i = 0; i < flyablesElement.length; i++){
    var flyableElement = {
      element: flyablesElement[i],
                speed: 0,
                height: 0,
                width: 0,
                isFlying : false,
                horizontalPosition : 0,
                verticalPosition : 0,
                rotation : 0,
                eventAttached : false,
                type : 0,
                options : {
                  canBeTransparent : false,
                  canFly : false,
                  canSpin : false,
                  accelerationCoeff : 1,
                  canBePopped : false,
                  canEscape : false,
                  windForceBeforeShowingUp : 1,
                  chanceOfShowingUp : 1
                }
    }
    setFlyableType(flyableElement);
    flyables.push(flyableElement);
  }
}

function setFlyableType(flyableElement){
  if(flyableElement.element.classList.contains("cloud")){
    flyableElement.type = flyableTypes.cloud;
    flyableElement.options.canBeTransparent = true;
    flyableElement.options.canBePopped = true;
    flyableElement.options.canEscape = true;
    flyableElement.options.canFly = true;
  }

  if(flyableElement.element.classList.contains("cow")){
    flyableElement.type = flyableTypes.cow;
    flyableElement.options.canSpin = true;
    flyableElement.options.accelerationCoeff = 2;
    flyableElement.options.windForceBeforeShowingUp = 3;
    flyableElement.options.chanceOfShowingUp = 0.2;
  }
}

function initFlyables(){
  flyables.forEach(function(flyable){
    initFlyable(flyable);
  });
}

function setFlyableSize(flyable){
  var newValue = (Math.random() * 200) + 32;
    flyable.element.style.height = newValue + sizeScale;
  flyable.height = newValue;
    flyable.element.style.width = newValue + sizeScale;
  flyable.width = newValue;
}

function setFlyableVerticalPosition(flyable){
  var newValue = (Math.random() * 75);
  flyable.element.style.top = newValue + positionScale;
}

function setFlyableAlpha(flyable){
  if(flyable.options.canBeTransparent){
    var newValue = Math.random() + 0.3;
    flyable.element.style.opacity = newValue;
  }
}

function setFlyableSpeed(flyable){
  var newValue = (Math.random() + 0.5) * flyable.options.accelerationCoeff;
  flyable.speed = newValue;
}

function initFlyable(flyable){
  setFlyableSpeed(flyable);
  setFlyableSize(flyable);
  setFlyableAlpha(flyable);
  setFlyableVerticalPosition(flyable);
  var shrinkFunc = function(){
    shrink(flyable);
  };

  flyable.horizontalPosition = 0 - flyable.width;
  if(!flyable.eventAttached && flyable.options.canBePopped){
    flyable.element.addEventListener("click", function(){
      var intervalId = setInterval(frame, 50);
      function frame(){
        if(flyable.element.style.opacity <= 0 || flyable.height <= 0){
          clearInterval(intervalId);
          poped += 1;
          increaseDifficulty();
          updateHud();
          initFlyable(flyable);
        }else{
          flyable.element.style.opacity -= 0.1;
          flyable.height -= 10;
          flyable.width -= 10;
          flyable.element.style.height = flyable.height + sizeScale;
          flyable.element.style.width = flyable.width + sizeScale;
          flyable.eventAttached = true;
        }
      }
    });
  }
}

function move() {
  var id = setInterval(frame, 10);
  function frame() {
    flyables.forEach(function(flyable){
      if(!flyable.isFlying && flyable.type !== flyableTypes.cloud && flyable.options.windForceBeforeShowingUp <= difficulty){
        var chance = Math.random();
        if(chance < flyable.options.chanceOfShowingUp){
          flyable.options.canFly = true;
          flyable.isFlying = true;
        }else{
          flyable.options.canFly = false;
        }
      }
      if(flyable.horizontalPosition - 400 > window.innerWidth){
        if(flyable.options.canEscape){
          saved += 1;
          flyable.isFlying = false;
          updateHud();
        }
        initFlyable(flyable);
      }
      if(flyable.options.canFly){
        flyable.horizontalPosition += flyable.speed * difficulty;
        flyable.element.style.right = flyable.horizontalPosition + sizeScale;
      }

      if(flyable.options.canSpin){
        flyable.rotation -= 3;
        flyable.element.style.transform = "rotate(" + flyable.rotation + "deg)";
      }
    });
  }
}

function updateHud(){
  document.querySelector("#saved").innerHTML = saved;
  document.querySelector("#wind").innerHTML = Math.round(difficulty * 100) / 100;
  document.querySelector("#score").innerHTML = poped;
}

function increaseDifficulty(){
  difficulty += poped/300;
  updateSky();

  flyables.forEach(function(flyable){

  });
}

function updateSky(){
  stormySkyOpacity = difficulty / 8;
  document.querySelector("#stormySky").style.opacity = stormySkyOpacity;
}