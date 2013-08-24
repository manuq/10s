declare var createjs;

var stage = new createjs.Stage("canvas");

var circle = new createjs.Shape();
circle.graphics.beginFill("#555").drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;
stage.addChild(circle);

stage.update();
