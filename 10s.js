var stage = new createjs.Stage("canvas");

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
bg.graphics.beginFill("#89dbda").drawRect(0, 0, 640, 400);
stage.addChild(bg);

var spriteSheet = new createjs.SpriteSheet(spriteData);
var me = new createjs.BitmapAnimation(spriteSheet);
me.x = 100;
me.y = 100;
me.gotoAndPlay("fly");

stage.addChild(me);

stage.update();

stage.addEventListener("stagemousedown", handleMouseDown);
stage.addEventListener("stagemouseup", handleMouseUp);

var mode = "fly";

var moving = false;

// var vaiveing = true;

// function vaiven() {
//     if (!vaiveing) {
//         return;
//     }
//     createjs.Tween.get(me).
//         to({y: me.x + 20}, 500, createjs.Ease.quadInOut).
//         to({y: me.x - 20}, 500, createjs.Ease.quadInOut).
//         call(vaiven);
// }
// vaiven();

function handleMouseDown(event) {
    if (moving) {
        return;
    }
    moving = true;
    if (mode == "fly") {
//        vaiveing = false;
        createjs.Tween.get(me).
            to({x: stage.mouseX, y: stage.mouseY}, 400, createjs.Ease.quadInOut).
            call(onComplete);
    }
    else {
        if (mode == "jump") {
            var yMed = Math.min(me.y, stage.mouseY) - 50;

            createjs.Tween.get(me).
                to({x: stage.mouseX}, 400, createjs.Ease.linear);

            createjs.Tween.get(me).
                to({y: yMed}, 200, createjs.Ease.circOut).
                to({y: stage.mouseY}, 200, createjs.Ease.circIn).
                call(onComplete);

            me.gotoAndPlay("jump");
        }
    }
}

function handleMouseUp(event) {
}

createjs.Ticker.setFPS(24);
createjs.Ticker.addEventListener("tick", mainloop);

function onComplete() {
    me.gotoAndPlay("fly");
    moving = false;
}

var sceneNumber = 1;

function mainloop(event) {
    if (createjs.Ticker.getTime() < 10000 * sceneNumber) {
        stage.update();
    }
    else {
        console.log("new scene");
        sceneNumber += 1;
        if (sceneNumber % 2 == 0) {
            mode = "jump";
            bg.graphics.beginFill("#4b8e8d").drawRect(0, 0, 640, 400);
        }
        else {
            mode = "fly";
            bg.graphics.beginFill("#89dbda").drawRect(0, 0, 640, 400);
        }
    }
}
