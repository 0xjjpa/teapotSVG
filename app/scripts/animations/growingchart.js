define(['raphael'], function (Raphael) {
  'use strict';
  var R = Raphael
  /* Finance animation
  We need to display a growing up chart when the user scrolls down to that segment, and lower it when it scrolls up.
  Options: Using a chart software (eg. d3.js), making it from scratch (hell no) or raphaeljs.
  RaphaelJs was choose because using a charting software would mean to learn a new DSL, a even Raphael's plugin for chart
  has poor documentation on triggering chart redrawing. I can make it work in Raphael through a simple LinkedList data 
  structure, with the old add(), pop() thingy.

  CSS3 was not even considered, as the animation is too complex for CSS3.
  */

  var self = {};
  var paper = null;

  var _debug = false;
  var _circleRadius = 6;
  var _linkLinesPerConnection = 4;
  var _animationsTimeoutinMS = 1000;
  var _coords = [ // Retrieven with the original image as a BG and DevTools
    {cx: 21, cy: 220},
    {cx: 30, cy: 181}, // Left dot, second level
    {cx: 62, cy: 181}, // Right dot, second level
    {cx: 48, cy: 140}, // Left dot, third level
    {cx: 92, cy: 140}, // Right dot, third level
    {cx: 59, cy: 101}, // Left dot, 4th level
    {cx: 117, cy: 101}, // Right dot, 4th level
    {cx: 84, cy: 62}, // Left dot, 5th level
    {cx: 174, cy: 62}, // Right dot, 5th level
    {cx: 121, cy: 33}, // Left dot, 6th level
    {cx: 254, cy: 33}, // Left dot, 6th level
    {cx: 164, cy: 10}, // Left dot, 7th level
    {cx: 364, cy: 10} // Left dot, 7th level
  ];
  var _properties = {
    "stroke-width": 2,
    "fill": "white"
  }

  var getStrokeColor = function() {
    self.counter = self.counter || 0;
    if(++self.counter === 4) { // 5 times 
      self.counter = 0;
      return "rgb(176,212,225)"; // Light
    } else {
      return "rgb(121,151,171)"; // Dark
      
    }
  }

  //Class Definition
  var Node = function(cx, cy) {
    var self = this;
    self.cx = cx;
    self.cy = cy;
    self.element = null;
    self.painted = false;
    self.linkToPrev = null;
    self.linkLines = [];
  }

  Node.prototype.loadLinkLines = function(node) {
    // We need to interpolate (lerp) the coords from two points
    var x, x0, x1, y, y0, y1;
    x0 = node.cx; y0 = node.cy;
    x1 = this.cx; y1 = this.cy;

    for(var i = 0; i < _linkLinesPerConnection; i++) {
      x = x0 + (((x1 - x0) / _linkLinesPerConnection) * i);
      y = y0 + (y1 - y0)*((x - x0)/(x1 - x0));
      this.linkLines[i] = {cx: x, cy: y};
    }
  };

  Node.prototype.drawLink = function(node) {
    this.linkToPrev = 
    paper.path([
      ["M",node.cx,node.cy],
      ["L",node.cx,node.cy]
    ])
    .attr({stroke: getStrokeColor(), "stroke-width": _properties["stroke-width"]})
    .toBack()
    .animate({path: [
      ["M",node.cx,node.cy],
      ["L",this.cx,this.cy]
    ]}, _animationsTimeoutinMS, 'linear')
  };

  Node.prototype.draw = function() {
    if(!this.painted) {
      this.element =
      paper.circle(this.cx, this.cy, 0)
      .attr({"stroke-width": _properties["stroke-width"], stroke: getStrokeColor(), fill: _properties.fill})
      .toFront()
      .animate({r: _circleRadius}, _animationsTimeoutinMS, 'linear')

      this.painted = true;

      if(_debug && this.element) {
        this.element.attr({stroke: "black", opacity: 0.5}) // Debugging  
      }

      if(!Node.prototype.rootNode) {
        Node.prototype.rootNode = this;
      }
    }
    return this;
  };

  //Class Definition
  var GraphicLinkedList = function() {
    var self = this;
    self.nodes = [];
    self.currentPointer = 0;
  }

  GraphicLinkedList.prototype.drawNext = function() {
    var prevNode; var node;
    if(this.nodes && this.nodes.length) {
      node = this.nodes[this.currentPointer]
      if(node) { // We have a specific node
        if(node instanceof Node) {
          prevNode = this.nodes[this.currentPointer - 1];
          if(prevNode) {
            node.drawLink(prevNode);
            node.loadLinkLines(prevNode);
            this.requiresConnection = true;
          }
          node.draw();
          this.nodes[this.currentPointer] = node; // Save node data
          this.currentPointer++;
          return node;
        } else {
          throw new Error("The given node is not a Node class element");
        } 
      } else { // We are at the end of our list
        return null;
      } 
    }
  }

  GraphicLinkedList.prototype.addNode = function(node) {
    if(!this.nodes)
      this.nodes = [];
    else
      this.nodes.push(node);
  };

  // Module private methods
  var initGraph = function() {
    paper.circle(22, 220, circleRadius)
    .attr({"stroke-width": "2", stroke: "rgb(121,151,171)", fill: "white"})
    .attr({stroke: "black"})

    drawLine(_coords[0].cx, _coords[0].cy, _coords[1].cx, _coords[1].cy);
  }

  var connectLinkedLists = function(l, r) {
    var lnode, rnode;
    if(l.nodes && l.nodes.length) {
      lnode = l.nodes[l.currentPointer - 1];
    }
    if(r.nodes && r.nodes.length) {
      rnode = r.nodes[r.currentPointer - 1];
    }
    if(lnode && rnode) {
      for(var i = 0; i < _linkLinesPerConnection; i++) {
        lnode.linkLines[i].element = paper.path([ // Only the left node stores the connections atm.
          ["M",lnode.linkLines[i].cx,lnode.linkLines[i].cy],
          ["L",lnode.linkLines[i].cx,lnode.linkLines[i].cy]
        ])
        .attr({stroke: "rgb(176,212,225)"})
        .toBack()
        .animate({path: [
          ["M",lnode.linkLines[i].cx,lnode.linkLines[i].cy],
          ["L",rnode.linkLines[i].cx,rnode.linkLines[i].cy]
        ]}, _animationsTimeoutinMS, 'linear')
      }
    }
  }

  var loadGraphicLinkedLists = function() {
    self.leftList = new GraphicLinkedList(); // Left line chart
    self.rightList = new GraphicLinkedList(); // Right line chart
    var rootNode = new Node(_coords[0].cx, _coords[0].cy); // Our base node!
    self.leftList.addNode(rootNode);
    self.rightList.addNode(rootNode);

    var n;
    for (var i = 1, len = _coords.length; i < len; i++) { // First noded already added
      n = new Node(_coords[i].cx, _coords[i].cy)
      if(i%2) { // odd ones go left, even ones right
        self.leftList.addNode(n);
      } else {
        self.rightList.addNode(n);
      }
    };
  }

  var drawNext = function() {
    var ldrawedNode = self.leftList.drawNext();
    var rdrawedNode = self.rightList.drawNext();
    if(self.leftList.requiresConnection && self.rightList.requiresConnection) {
      self.leftList.requiresConnection = self.rightList.requiresConnection = false;
      connectLinkedLists(self.leftList, self.rightList)
    }
    return ldrawedNode && rdrawedNode;
  }

  // Public methods from module
  self.init = function() {
    paper = R("growingchart", 450, 241);
    loadGraphicLinkedLists();
    drawNext();

    var timeout = setTimeout(function triggerChart(){
    if(self.drawNext()) {
      timeout = setTimeout(triggerChart, self.getAnimationTimeout());
    } else {
      clearTimeout(timeout);
    }
  }, self.getAnimationTimeout());
    return self;
  }

  self.getAnimationTimeout = function() {
    return _animationsTimeoutinMS;
  }

  self.drawNext = function() {
    return drawNext();
  }
  return self;  

});