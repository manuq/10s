var stage = new createjs.Stage("canvas");
stage.addEventListener("stagemousedown", handleMouseDown);

var CELL = 19.75;

var TEN = 10000;
var DEBUG = false; //|| true;

var SCREEN_W = 640;
var SCREEN_H = 400;
var HORIZON = 50;

var AIR_PROP_W = CELL * 5;
var AIR_PROP_H = CELL * 5;
var AIR_COLLIDE_RADIUS = 55;

var LAKE_PLAT_W = CELL * 6;
var LAKE_PLAT_H = CELL * 4;

var spriteData = {
    images: ["sprite.png"],
    frames: [
        // 0 - 14: leaf anim jump
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

        // 15 - 20: leaf anim fly
        [3 * CELL, 0, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 3 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 6 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 9 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 12 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],
        [3 * CELL, 15 * CELL, 3 * CELL, 3 * CELL, 0, 0, 0],

        // 21 - 24: air props
        [7 * CELL, 0, 5 * CELL, 5 * CELL, 0, 0, 0],
        [7 * CELL, 6 * CELL, 5 * CELL, 5 * CELL, 0, 0, 0],
        [7 * CELL, 12 * CELL, 5 * CELL, 5 * CELL, 0, 0, 0],
        [7 * CELL, 18 * CELL, 5 * CELL, 5 * CELL, 0, 0, 0],

        // 25 - 28: lake plats
        [13 * CELL, 0, 6 * CELL, 4 * CELL, 0, 0, 0],
        [13 * CELL, 5 * CELL, 6 * CELL, 4 * CELL, 0, 0, 0],
        [13 * CELL, 10 * CELL, 6 * CELL, 4 * CELL, 0, 0, 0],
        [13 * CELL, 15 * CELL, 6 * CELL, 4 * CELL, 0, 0, 0],

        // 29 - 31: fall
        [7 * CELL, 32 * CELL, 6 * CELL, 3 * CELL, 0, 0, 0],
        [7 * CELL, 28 * CELL, 6 * CELL, 3 * CELL, 0, 0, 0],
        [7 * CELL, 24 * CELL, 6 * CELL, 3 * CELL, 0, 0, 0]

    ],
    animations: {
        stand: {frames: [0, 0, 1, 1, 13, 13, 14, 14]},
        jump: [0, 14, "stand"],
        fly: {frames: [15, 16, 17, 18, 19, 20, 18, 16],
             next: "stand"},
        splash: [29, 31, false, 2]
    }
};

var lives = 5;
var respawning = false;

var transitionTime = 600;

var bg = new createjs.Shape();

bg.graphics.beginFill("#c9f6f3").
    drawRect(0, 0,SCREEN_W, SCREEN_H - HORIZON);

bg.graphics.beginFill("#89dbda").
    drawRect(0, SCREEN_H - HORIZON, SCREEN_W, SCREEN_H - HORIZON);

stage.addChild(bg);

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
        to({scaleX: 0, scaleY: 0}, TEN - 300, createjs.Ease.linear).
        call(onTimerComplete);
}
animateTimer();

var allThings = new createjs.Container();
stage.addChild(allThings);

var prevPlatTime = 0;
var lakePlatTimer = 1000;
var lakePlatList = new createjs.Container();
lakePlatList.y = SCREEN_H;
allThings.addChild(lakePlatList);

var airPropList = new createjs.Container();
allThings.addChild(airPropList);

function createLakePlat(dx) {
    var xIni;
    var xFin;
    if (!dx) {
        var xIni = SCREEN_W;
        var xFin = -LAKE_PLAT_W;
    }
    else {
        var xIni = dx;
        var xFin = dx - SCREEN_W - LAKE_PLAT_W;
    }

    var container = new createjs.Container();
    lakePlatList.addChild(container);

    var lakePlat = new createjs.BitmapAnimation(spriteSheet);
    lakePlat.gotoAndStop(25 + Math.floor(Math.random() * 4));
    container.x = xIni;
    container.y = 30 + Math.random() * (SCREEN_H - LAKE_PLAT_H - 30);

    createjs.Tween.get(container).
        to({x: xFin}, 5000, createjs.Ease.linear).
        call(onLakePlatComplete);

    container.addChild(lakePlat);
    return container;
}

function createAirProp() {
    var container = new createjs.Container();
    container.x = SCREEN_W;
    container.y = Math.random() * (SCREEN_H - AIR_PROP_H);
    airPropList.addChild(container);

    var airProp = new createjs.BitmapAnimation(spriteSheet);
    airProp.gotoAndStop(21 + Math.floor(Math.random() * 4));

    airProp.regX = AIR_PROP_W / 2;
    airProp.regY = AIR_PROP_H / 2;

    createjs.Tween.get(container).
        to({x: -AIR_PROP_W}, 5000, createjs.Ease.linear).
        call(onAirPropComplete);

    createjs.Tween.get(container, {loop: true}).
        to({y: container.y - 30}, 1000, createjs.Ease.quadInOut).
        to({y: container.y}, 500, createjs.Ease.quadInOut);

    createjs.Tween.get(airProp, {loop: true}).
        to({rotation: 360}, 3000, createjs.Ease.linear);

    container.addChild(airProp);

    if (DEBUG) {
        var r = AIR_COLLIDE_RADIUS;
        var p = new createjs.Shape();
        p.graphics.beginFill("#f00").drawCircle(r, r, r);
        p.alpha = 0.3;
        p.regX = r;
        p.regY = r;
        container.addChild(p);
    }

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
            to({x: stage.mouseX, y: stage.mouseY}, SCREEN_H,
               createjs.Ease.quadInOut).
            call(onAirComplete);

        moving = true;
        me.gotoAndPlay("fly");
    }
    else {
        if (mode == "lake") {
            // horizon
            if (stage.mouseY < HORIZON) {
                return;
            }

            exitPlat();

            var yMed = Math.min(me.y, stage.mouseY) - 50;

            createjs.Tween.get(me).
                to({x: stage.mouseX}, SCREEN_H, createjs.Ease.linear);

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

function respawnLake() {
    respawning = true;

    me.x = 320;
    me.y = -100;
    var container = lakePlatList.children[lakePlatList.children.length-1];
    createjs.Tween.removeTweens(me);
    createjs.Tween.get(me).
        to({x: container.x + LAKE_PLAT_H / 2,
            y: container.y + 50 - LAKE_PLAT_H / 2},
           200, createjs.Ease.circIn).
        call(enterPlat, [container]);
}

function collidePointWithRect(x, y, rx, ry, rw, rh) {
    return (rx < x) && (x < rx + rw) && (ry < y) && (y < ry + rh);
}

function collidePointWithCircle(x, y, cx, cy, cr) {
    var squareDist = Math.pow(x - cx, 2) + Math.pow(y - cy, 2);
    return Math.pow(cr, 2) > squareDist;
    console.log("CIRC!")
}

function detectCollisions() {
    for (i=0; i<airPropList.children.length; i++) {
        var prop = airPropList.children[i];
        if (collidePointWithCircle(me.x, me.y, prop.x, prop.y,
                                 AIR_COLLIDE_RADIUS)) {
            lives -= 1;
            console.log(lives);

            respawning = true;
            createjs.Tween.get(me).
                to({x: -100}, me.x * 4, createjs.Ease.circOut).
                call(function () {respawning = false;});
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
        respawnLake();
    }
}

createjs.Ticker.setFPS(24);
createjs.Ticker.addEventListener("tick", mainloop);

function mainloop(event) {
    stage.update();

    if (!respawning) {
        if (mode == "air") {
            detectCollisions();
        }
        if (mode == "lake") {
            detectOutOfScreen();
        }
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
    if (!respawning) {
        respawning = true;
    }

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
            to({y: -SCREEN_H}, transitionTime, createjs.Ease.quadInOut);

        var container = createLakePlat(320);

        createjs.Tween.removeTweens(me);
        createjs.Tween.get(me).
            to({x: container.x + LAKE_PLAT_H / 2,
                y: container.y + SCREEN_H - LAKE_PLAT_H / 2},
               200, createjs.Ease.circIn).
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
        if (collidePointWithRect(me.x, me.y, container.x, container.y,
                                 LAKE_PLAT_W, LAKE_PLAT_H)) {
            enterPlat(container);
            return;
        }
    }
    // fall in lake

    var splash = new createjs.BitmapAnimation(spriteSheet);
    splash.x = me.x - CELL * 3;
    splash.y = me.y - CELL * 1.5;
    stage.addChild(splash);
    splash.gotoAndPlay("splash");

    createjs.Tween.get(splash).
        wait(250).
        call(function () {stage.removeChild(this)});

    lives -= 1;
    console.log(lives);

    respawnLake();
}
