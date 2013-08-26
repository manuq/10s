var stage = new createjs.Stage("canvas");
stage.addEventListener("stagemousedown", handleMouseDown);

var CELL = 19.75;

var spriteData = {
    images: ["sprite.png"],
    frames: [
        // leaf anim jump
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
        [0, 42 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],

        // leaf anim fly
        [3 * CELL, 0, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 3 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 6 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 9 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 12 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 15 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],

        // air props
        [7 * CELL, 0, 5 * CELL, 5 * CELL, 0, 0, 0],
        [7 * CELL, 6 * CELL, 5 * CELL, 5 * CELL, 0, 0, 0],
        [7 * CELL, 12 * CELL, 5 * CELL, 5 * CELL, 0, 0, 0],
        [7 * CELL, 18 * CELL, 5 * CELL, 5 * CELL, 0, 0, 0],

        // lake plats
        [13 * CELL, 0, 6 * CELL, 4 * CELL, 0, 0, 0],
        [13 * CELL, 5 * CELL, 6 * CELL, 4 * CELL, 0, 0, 0],
        [13 * CELL, 10 * CELL, 6 * CELL, 4 * CELL, 0, 0, 0],
        [13 * CELL, 15 * CELL, 6 * CELL, 4 * CELL, 0, 0, 0]
    ],
    animations: {
        stand: {frames: [0, 0, 1, 1, 13, 13, 14, 14]},
        jump: [0, 14, "stand"],
        fly: {frames: [15, 16, 17, 18, 19, 20, 18, 16],
             next: "stand"}
    }
};

var lives = 5;

var transitionTime = 600;

var bg = new createjs.Shape();
bg.graphics.beginFill("#c9f6f3").drawRect(0, 0, 640, 350);
bg.graphics.beginFill("#89dbda").drawRect(0, 350, 640, 350);
stage.addChild(bg);

var timer = new createjs.Shape();
timer.graphics.beginFill("#555").arc(25, 0, 25, 0, Math.PI, false);
timer.x = 295;
timer.y = 0;
timer.scaleX = 0;
timer.scaleY = 0;
timer.regX = 25;
stage.addChild(timer);

var TEN = 10000;

function animateTimer() {
    createjs.Tween.get(timer).
        to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.quadInOut).
        to({scaleX: 0, scaleY: 0}, TEN - 300, createjs.Ease.linear).
        call(onTimerComplete);
}
animateTimer();

var allThings = new createjs.Container();
stage.addChild(allThings);

var prevPlatTime = 0;
var lakePlatTimer = 1000;
var lakePlatList = new createjs.Container();
lakePlatList.y = 400;
allThings.addChild(lakePlatList);

var airPropList = new createjs.Container();
allThings.addChild(airPropList);

function createLakePlat(dx) {
    var xIni;
    var xFin;
    if (!dx) {
        var xIni = 640;
        var xFin = -CELL * 6;
    }
    else {
        var xIni = dx;
        var xFin = dx - 640 - CELL * 6;
    }

    var container = new createjs.Container();
    lakePlatList.addChild(container);

    var lakePlat = new createjs.BitmapAnimation(spriteSheet);
    lakePlat.gotoAndStop(25 + Math.floor(Math.random() * 4));
    container.x = xIni;
    container.y = 30 + Math.random() * (400 - CELL * 4 - 30);

    createjs.Tween.get(container).
        to({x: xFin}, 5000, createjs.Ease.linear).
        call(onLakePlatComplete);

    container.addChild(lakePlat);
    return container;
}

function createAirProp() {
    var airProp = new createjs.BitmapAnimation(spriteSheet);
    airProp.gotoAndStop(21 + Math.floor(Math.random() * 4));
    airProp.x = 640;
    airProp.y = Math.random() * (400 - CELL * 5);

    airProp.regX = CELL * 2.5;
    airProp.regY = CELL * 2.5;

    createjs.Tween.get(airProp).
        to({x: -CELL * 5}, 5000, createjs.Ease.linear).
        call(onAirPropComplete);

    createjs.Tween.get(airProp, {loop: true}).
        to({y: airProp.y - 30}, 1000, createjs.Ease.quadInOut).
        to({y: airProp.y}, 500, createjs.Ease.quadInOut);

    createjs.Tween.get(airProp, {loop: true}).
        to({rotation: 360}, 3000, createjs.Ease.linear);

    airPropList.addChild(airProp);
}

var spriteSheet = new createjs.SpriteSheet(spriteData);
var me = new createjs.BitmapAnimation(spriteSheet);
me.x = 100;
me.y = 100;
me.regX = CELL * 1.5;
me.regY = CELL * 1.5;
me.gotoAndPlay("stand");
stage.addChild(me);

stage.update();

var sceneNumber = 1;
var mode; // air, lake
updateMode();

var inTransition = false;
var moving = false;
var platContainer;

function handleMouseDown(event) {
    if (inTransition) {
        return;
    }
    if (moving) {
        return;
    }
    if (mode == "air") {
        createjs.Tween.get(me).
            to({x: stage.mouseX, y: stage.mouseY}, 400, createjs.Ease.quadInOut).
            call(onAirComplete);

        moving = true;
        me.gotoAndPlay("fly");
    }
    else {
        if (mode == "lake") {
            // horizon
            if (stage.mouseY < 50) {
                return;
            }

            exitPlat();

            var yMed = Math.min(me.y, stage.mouseY) - 50;

            createjs.Tween.get(me).
                to({x: stage.mouseX}, 400, createjs.Ease.linear);

            createjs.Tween.get(me).
                to({y: yMed}, 200, createjs.Ease.circOut).
                to({y: stage.mouseY}, 200, createjs.Ease.circIn).
                call(onLakeComplete);

            moving = true;
            me.gotoAndPlay("jump");
        }
    }
}

function exitPlat() {
    if (platContainer !== undefined) {
        var p = platContainer.localToGlobal(me.x, me.y);
        me.x = p.x;
        me.y = p.y;
        stage.addChild(me);
        platContainer = undefined;
    }
}

function restartLake() {
    me.x = 320;
    me.y = -100;
    var container = lakePlatList.children[lakePlatList.children.length-1];
    createjs.Tween.removeTweens(me);
    createjs.Tween.get(me).
        to({x: container.x + CELL * 2, y: container.y + 50 - CELL * 2},
           200, createjs.Ease.circIn).
        call(enterPlat, [container]);
}

function collidePointWithRect(x, y, rx, ry, rw, rh) {
    return (rx < x) && (x < rx + rw) && (ry < y) && (y < ry + rh);
}

function detectCollisions() {
    for (i=0; i<airPropList.children.length; i++) {
        var prop = airPropList.children[i];
        if (collidePointWithRect(me.x, me.y, prop.x, prop.y, CELL * 5, CELL * 5)) {
            lives -= 1;
            console.log(lives);
            createjs.Tween.get(me).
                to({x: -100}, me.x * 4, createjs.Ease.circOut);
            break;
        }
    }
}

function detectOutOfScreen() {
    var lost = false;
    if (platContainer == undefined) {
        if (me.x < 0) {
            lost = true;
        }
    }
    else {
        if (platContainer.x + me.x < 0) {
            lost = true;
        }
    }
    if (lost) {
        lives -= 1;
        console.log(lives);

        exitPlat();
        restartLake();
    }
}

createjs.Ticker.setFPS(24);
createjs.Ticker.addEventListener("tick", mainloop);

function mainloop(event) {
    stage.update();

    if (mode == "air") {
        detectCollisions();
    }

    if (mode == "lake") {
        detectOutOfScreen();
    }

    if ((createjs.Ticker.getTime() - prevPlatTime) > lakePlatTimer) {
        prevPlatTime = createjs.Ticker.getTime();
        if (mode == "lake") {
            createLakePlat();
        }
        else {
            createAirProp();
        }
    }
}

function enterPlat(container) {
    createjs.Tween.get(container).
        to({y: container.y + 20}, 100, createjs.Ease.quadInOut).
        to({y: container.y}, 300, createjs.Ease.quadInOut);

    createjs.Tween.removeTweens(me);
    var p = container.globalToLocal(me.x, me.y);
    me.x = p.x;
    me.y = p.y;

    container.addChild(me);
    platContainer = container;
}

function endTransition() {
    inTransition = false;
}

function updateMode() {
    moving = false;
    inTransition = true;

    me.gotoAndPlay("fly");

    if (sceneNumber % 2 == 0) {
        mode = "lake";
        exitPlat();

        createjs.Tween.get(bg).
            to({y: -300}, transitionTime, createjs.Ease.quadInOut).
            call(endTransition);

        createjs.Tween.get(allThings).
            to({y: -400}, transitionTime, createjs.Ease.quadInOut);

        var container = createLakePlat(320);

        createjs.Tween.removeTweens(me);
        createjs.Tween.get(me).
            to({x: container.x + CELL * 2, y: container.y + 400 - CELL * 2}, 200, createjs.Ease.circIn).
            call(enterPlat, [container]);
    }
    else {
        mode = "air";
        exitPlat();

        createjs.Tween.get(bg).
            to({y: 0}, transitionTime, createjs.Ease.quadInOut).
            call(endTransition);

        createjs.Tween.get(allThings).
            to({y: 0}, transitionTime, createjs.Ease.quadInOut);

        createAirProp();
    }
}

function onTimerComplete() {
    sceneNumber += 1;
    updateMode();
    animateTimer();
}

function onAirComplete() {
    me.gotoAndPlay("stand");
    moving = false;
}

function onLakePlatComplete() {
    lakePlatList.removeChild(this);
}

function onAirPropComplete() {
    airPropList.removeChild(this);
}

function onLakeComplete() {
    moving = false;
    for (i=0; i<lakePlatList.children.length; i++) {
        var container = lakePlatList.children[i];
        // FIXME use lakePlat.hitTest(me.x, me.y)
        if (collidePointWithRect(me.x, me.y, container.x, container.y, CELL * 6, CELL * 4)) {
            enterPlat(container);
            return;
        }
    }
    // fall in lake
    lives -= 1;
    console.log(lives);

    restartLake();
}
