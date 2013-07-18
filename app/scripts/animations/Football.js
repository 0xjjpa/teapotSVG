define([], function () {
/*
    Some kind of black magic for optimizing the frames for a canvas JS animations suggested by Paul Irish blog:
    http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/*
    Only one object for the whole animations.
    FTW!
 */
var Football = {

    /*
        Defining general variables
     */
    canvas1 : null,
    canvas2 : null,
    canvas3 : null,
    canvas4 : null,
    canvas5 : null,
    canvas6 : null,
    canvas7 : null,
    context1 : null,
    context2 : null,
    context3 : null,
    context4 : null,
    context5 : null,
    context6 : null,
    context7 : null,
    centerX : null,
    centerY : null,
    linesWidth : null,
    color : null,
    circlesRadius : null,

    /*
         Initializing function.
         Starting point for the whole code.
         This is the only function that is being called.
         This functions include every other function calling.
     */
    init:function() {
        this.setVariables();
        this.mainBorder.init();
        this.cornerArc.init();
        this.halfWayLine.init();
        this.middleCircle.init();
        this.penaltyArea.init();
        this.generatePlayers.init();
    },

    /*
        setting defined variables
    */
    setVariables:function() {
        this.canvas1 = document.getElementById('footballFieldCanvas1');
        this.canvas2 = document.getElementById('footballFieldCanvas2');
        this.canvas3 = document.getElementById('footballFieldCanvas3');
        this.canvas4 = document.getElementById('footballFieldCanvas4');
        this.canvas5 = document.getElementById('footballFieldCanvas5');
        this.canvas6 = document.getElementById('footballFieldCanvas6');
        this.canvas7 = document.getElementById('footballFieldCanvas7');
        this.context1 = this.canvas1.getContext('2d');
        this.context2 = this.canvas2.getContext('2d');
        this.context3 = this.canvas3.getContext('2d');
        this.context4 = this.canvas4.getContext('2d');
        this.context5 = this.canvas5.getContext('2d');
        this.context6 = this.canvas6.getContext('2d');
        this.context7 = this.canvas7.getContext('2d');
        this.centerX = this.canvas1.width / 2;
        this.centerY = this.canvas1.height / 2;
        this.linesWidth = 4; /* it has to be 2px, but you have to set up twice the size because of retina display */
        this.color = '#7997ab';
        this.circlesRadius = 60; /* it has to be 30, but you have to set up twice the size because of retina display */
    },

    /*
        Generating a random number in a defined range.
        The defined range is being passed as argument in this function.
        This is being used for generating a random X and Y coordinates for the footbal players in the animation.
     */
    getRandomInt:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /*
        Custom function for cloning/copy-pasting an object with the whole content.
        This is being used for generating more than 1 football player,
        I am simply cloning the football player object and reusing it.
     */
    cloneObject:function(source) {
        for (i in source) {
            if (typeof source[i] == 'source') {
                this[i] = new cloneObject(source[i]);
            }
            else{
                this[i] = source[i];
            }
        }
    },

    /*
        Drawing the side border of a football field.
     */
    mainBorder : {
        /*
            Starting point.
            Init().
         */
        init:function() {
            this.draw();
        },

        /*
            Drawing the side lines of a football field.
            Drawing it not a line after line, but as an rectangle.
         */
        draw:function() {
            Football.context1.beginPath();
            Football.context1.rect(2, 2, 676, 436);
            Football.context1.lineWidth = 4;
            Football.context1.strokeStyle = '#7997ab';
            Football.context1.stroke();
        }
    },

    /*
        Drawing the 4 corner arc for a football field.
     */
    cornerArc : {
        /*
             Starting point.
             Init().
             Drawing 4 arcs.
         */
        init:function() {
            this.draw(0, 0, 0 * Math.PI, 0.5 * Math.PI, false);
            this.draw(680,0, 0.5 * Math.PI, 1 * Math.PI, false);
            this.draw(0, 440, 1.5 * Math.PI, 1 * Math.PI, false);
            this.draw(680, 440, 1 * Math.PI, 1.5 * Math.PI, false);
        },

        /*
            Function for drawing an arc.
         */
        draw:function(x, y, startAngle, endAngle, counterClockwise) {
            var radius = 20;

            Football.context1.beginPath();
            Football.context1.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            Football.context1.lineWidth = Football.linesWidth;
            Football.context1.strokeStyle = Football.color;
            Football.context1.stroke();
        }
    },

    /*
        Middle half way line for a football field.
     */
    halfWayLine : {
        /*
             Starting point.
             Init().
         */
        init:function() {
            this.draw();
        },

        /*
            Drawing.
         */
        draw:function() {
            Football.context1.beginPath();
            Football.context1.moveTo(340, 0);
            Football.context1.lineTo(340, 680);
            Football.context1.lineWidth = Football.linesWidth;
            Football.context1.strokeStyle = Football.color;
            Football.context1.stroke();
        }
    },

    /*
        Drawing the middle circle for a football field and the middle spot inside the cirle.
     */
    middleCircle : {

        /*
            Starting point.
            init()
         */
        init:function() {
            this.circle.draw();
            this.spot.draw();
        },

        circle : {
            /*
                Drawing the circle.
             */
            draw:function() {
                Football.context1.beginPath();
                Football.context1.arc(Football.centerX, Football.centerY, Football.circlesRadius, 0, 2 * Math.PI, false);
                Football.context1.lineWidth = Football.linesWidth;
                Football.context1.strokeStyle = Football.color;
                Football.context1.stroke();
            }
        },

        spot : {
            /*
                Drawing the spot.
             */
            draw:function() {
                Football.context1.beginPath();
                Football.context1.arc(Football.centerX, Football.centerY, 4, 0, 2 * Math.PI, false);
                Football.context1.fillStyle = Football.color;
                Football.context1.fill();
            }
        }
    },

    /*
        Drawing a penalty area (penalty box, small box, spot, half circle)
     */
    penaltyArea : {

        /*
             Starting point.
             init()
         */
        init:function() {
            this.mainArea.draw();
            this.arc.draw();
            this.goalArea.draw();
        },

        mainArea : {

            /*
                Drawing the 2 main penalty boxes as a rectangle based on 4 coordinates points.
             */
            draw:function() {
                this.area(2, 90, 120, 260);
                this.area(560, 90, 120, 260);
            },

            /*
                Reusable function for drawing area just by parsing needed coordinates as arguments.
             */
            area:function(x, y, sizeX, sizeY) {
                Football.context1.beginPath();
                Football.context1.rect(x, y, sizeX, sizeY);
                Football.context1.lineWidth = 4;
                Football.context1.strokeStyle = '#7997ab';
                Football.context1.stroke();
            }
        },

        arc : {

            /*
                Drawing the needed arcs for it.
             */
            draw:function() {
                this.arc(105, 1.65 * Math.PI, 0.35 * Math.PI, false);
                this.arc(578, 1.35 * Math.PI, 0.65 * Math.PI, true);
            },

            /*
                Reusable function for drawing arcs just by parsing needed coordinates as arguments.
             */
            arc:function(point, startAngle, endAngle, counterClockwise) {
                var radius = 40;

                Football.context1.beginPath();
                Football.context1.arc(point, Football.centerY, radius, startAngle, endAngle, counterClockwise);
                Football.context1.lineWidth = Football.linesWidth;
                Football.context1.strokeStyle = Football.color;
                Football.context1.stroke();
            }
        },

        goalArea : {

            /*
                Drawing the 2 small penalty boxes/goal area as a rectangle based on 4 coordinates points.
             */
            draw:function() {
                this.area.draw(2, 160, 30, 120);
                this.area.draw(648, 160, 30, 120);
                this.spot.draw();
            },

            area : {

                /*
                    Reusable function for drawing areas just by parsing needed coordinates as arguments.
                 */
                draw:function(x, y, width, height) {
                    Football.context1.beginPath();
                    Football.context1.rect(x, y, width, height);
                    Football.context1.lineWidth = Football.linesWidth;
                    Football.context1.strokeStyle = Football.color;
                    Football.context1.stroke();
                }
            },

            spot : {

                /*
                    Drawing two spots.
                 */
                draw:function() {
                    this.spot(80);
                    this.spot(600);
                },

                /*
                    Reusable function for drawing spots just by parsing needed coordinates as arguments.
                 */
                spot:function(x) {
                    Football.context1.beginPath();
                    Football.context1.arc(x, Football.centerY, 4, 0, 2 * Math.PI, false);
                    Football.context1.fillStyle = Football.color;
                    Football.context1.fill();
                }
            }
        }
    },

    /*
        Football player
     */
    player : {
        currentX : 330,
        currentY : 430,
        radius : 18,
        frameCount : 50,
        timer : null,
        points : null,
        currentFrame : null,

        /*
             Starting point.
             Init().
         */
        init:function(minX, maxX, minY, maxY, context) {
            /*
                Passing the min and max range for generating a random number for X and Y coordinates.
                Passing the canvas context on which a player has to be drawn.
                (for every player we use a different canvas element).
             */
            this.coordinates(minX, maxX, minY, maxY, context);
        },

        /*
            Drawing that shit.
         */
        draw:function(x, y, context) {
                // cleaning/deleting the complete canvas before putting anything on it in the first line.
            context.clearRect(0, 0, Football.canvas1.width, Football.canvas1.height);
            context.beginPath();
            context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = "#b0d4e1";
            context.fill();
        },

        animate:function(minX, maxX, minY, maxY, context) {

            var that = this;

            var point = this.points[this.currentFrame++];
            this.draw(point.x, point.y, context);

            // re-fire the timer until out-of-points
            if (this.currentFrame < this.points.length) {
                // using an anonymous function otherwise it is not going to work
                this.timer = setTimeout(function() {that.animate(minX, maxX, minY, maxY, context)}, 1000 / 60);
            } else {
                requestAnimFrame(function() {
                    var $$that = that;
                    $$that.coordinates(minX, maxX, minY, maxY, context);
                });
            }
        },

        /*
            This function si dealing with calculating/generating the path (all X and Y coordinates on the path) between
            two points on a canvas.
         */
        linePoints:function(currentX, currentY, newX, newY, frames) {

            var dx = newX - currentX;
            var dy = newY - currentY;
            var incrementX = dx / frames;
            var incrementY = dy / frames;
            var a = new Array();

            a.push({
                x: currentX,
                y: currentY
            });

            for (var frame = 0; frame < frames - 1; frame++) {
                a.push({
                    x: currentX + (incrementX * frame),
                    y: currentY + (incrementY * frame)
                });
            }

            a.push({
                x: newX,
                y: newY
            });

            return (a);
        },

        /*
            Just binding everything together from above.
            No comments needed.
         */
        coordinates:function(minX, maxX, minY, maxY, context) {
            var newX = Football.getRandomInt(minX, maxX);
            var newY = Football.getRandomInt(minY, maxY);

            this.points = this.linePoints(this.currentX, this.currentY, newX, newY, this.frameCount);
            this.currentFrame = 0;
            this.currentX = newX;
            this.currentY = newY;
            this.animate(minX, maxX, minY, maxY, context);
        }
    },

    /*
        Drawing a football for a later implementation.
        Was not yet implemented, and is also inactive at this moment.
     */
    ball : {

        /*
             Starting point.
             Init().
         */
        init:function() {
            this.draw(200, 200);
        },

        /*
            Drawing the ball.
         */
        draw:function(x, y) {
            Football.context1.beginPath();
            Football.context1.arc(x, y, 4, 0, 2 * Math.PI, false);
            Football.context1.fillStyle = "#000000";
            Football.context1.fill();
        }
    },

    generatePlayers : {

        /*
             Starting point.
             Init().
         */
        init:function() {
            this.generate();
        },

        /*
            Finally generating the players.
            - Creating new players by copying the football player object
              (here we are using the cloning object function from above)
              and assigning them to particular canvas element.
            - Bringing those players to running and animating.
         */
        generate:function() {
            var player2 = new Football.cloneObject(Football.player);
            var player3 = new Football.cloneObject(Football.player);
            var player4 = new Football.cloneObject(Football.player);
            var player5 = new Football.cloneObject(Football.player);
            var player6 = new Football.cloneObject(Football.player);
            Football.player.init(10, 320, 10, 210, Football.context2);
            player2.init(350, 670, 10, 210, Football.context3);
            player3.init(330, 670, 230, 430, Football.context4);
            player4.init(10, 320, 230, 430, Football.context5);
            player5.init(10, 670, 10, 430, Football.context6);
            player6.init(10, 670, 10, 430, Football.context7);
        }
    }
};
    return Football;

});
