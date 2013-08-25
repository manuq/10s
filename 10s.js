var stage = new createjs.Stage("canvas");
stage.addEventListener("stagemousedown", handleMouseDown);

var CELL = 19.75;

var spriteData = {
    images: ["sprite.png"],
    frames: [
        [0, 0, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 3 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 6 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 9 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 12 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 15 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 18 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 21 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 24 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 27 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 30 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 33 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 36 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 39 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [0, 42 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0]
    ],
    animations: {
        jump: [0, 14],
        fly: {frames: [0, 0, 1, 1, 13, 13, 14, 14]}
    }
};


var bg = new createjs.Shape();
bg.graphics.beginFill("#c9f6f3").drawRect(0, 0, 640, 400);
stage.addChild(bg);

var sceneNumber = 1;

var timer = new createjs.Shape();
timer.graphics.beginFill("#555").arc(25, 0, 25, 0, Math.PI, false);
timer.x = 295;
timer.y = 0;
timer.scaleX = 0;
timer.scaleY = 0;
timer.regX = 25;
stage.addChild(timer);

function animateTimer() {
    createjs.Tween.get(timer).
        to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.quadInOut).
        to({scaleX: 0, scaleY: 0}, 9700, createjs.Ease.linear).
        call(onTimerComplete);
}
animateTimer();

var spriteSheet = new createjs.SpriteSheet(spriteData);
var me = new createjs.BitmapAnimation(spriteSheet);
me.x = 100;
me.y = 100;
me.regX = CELL * 1.5;
me.regY = CELL * 1.5;
me.gotoAndPlay("fly");
stage.addChild(me);

stage.update();

var mode = "air"; // air, lake

var moving = false;

function handleMouseDown(event) {
    if (moving) {
        return;
    }
    moving = true;
    if (mode == "air") {
        createjs.Tween.get(me).
            to({x: stage.mouseX, y: stage.mouseY}, 400, createjs.Ease.quadInOut).
            call(onAirComplete);
    }
    else {
        if (mode == "lake") {
            var yMed = Math.min(me.y, stage.mouseY) - 50;

            createjs.Tween.get(me).
                to({x: stage.mouseX}, 400, createjs.Ease.linear);

            createjs.Tween.get(me).
                to({y: yMed}, 200, createjs.Ease.circOut).
                to({y: stage.mouseY}, 200, createjs.Ease.circIn).
                call(onLakeComplete);

            me.gotoAndPlay("jump");
        }
    }
}

createjs.Ticker.setFPS(24);
createjs.Ticker.addEventListener("tick", mainloop);

function mainloop(event) {
    stage.update();
}

function onTimerComplete() {
    sceneNumber += 1;
    if (sceneNumber % 2 == 0) {
        mode = "lake";
        bg.graphics.beginFill("#89dbda").drawRect(0, 0, 640, 400);
    }
    else {
        mode = "air";
        bg.graphics.beginFill("#c9f6f3").drawRect(0, 0, 640, 400);
    }
    animateTimer();
}

function onAirComplete() {
    me.gotoAndPlay("fly");
    moving = false;
}

function onLakeComplete() {
    me.gotoAndPlay("fly");
    moving = false;
}
