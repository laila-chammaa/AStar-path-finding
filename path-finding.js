// How many columns and rows?
var cols = 40;
var rows = 40;

// This will be the 2D array
var grid = new Array(cols);

// Width and height of each cell of grid
var w, h;

// Open and closed set
var openSet = [];
var closedSet = [];
var start, end;

function removeFromArray(arr, elt) {
  arr.splice(arr.indexOf(elt), 1);
}

//the educated guess for distance between two points for A*
function heuristics(a, b) {
  var d = dist(a.i, a.j, b.i, b.j)
  return d;
}

function Spot(i, j) {
  //coordinates of spot
  this.i = i;
  this.j = j;

  //f, g, h values for A*
  this.f = 0;
  this.h = 0;
  this.g = 0;

  //where did I come from?
  this.previous = undefined;
  
  this.neighbors = [];

  // Am I a wall?
  this.wall = false;
  if (Math.random(1) < 0.4) {
    this.wall = true;
  }

  this.show = function (color) {
    fill(color);
    rect(this.i*w-1, this.j*h-1, w, h)
  }
  this.addNeighbors = function (grid) {
    if (this.i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (this.i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (this.j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (this.j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    //diagonals
    if (this.i < cols - 1 && this.j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
    if (this.i > 0 && this.j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (this.i > 0 && this.j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (this.i < cols - 1 && this.j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }

  }
}

function setup() {
  createCanvas(600, 600);

  // Grid cell size
  w = width / cols;
  h = height / rows;

  // Making a 2D array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  // All the neighbors
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1]
  start.wall = false;
  end.wall = false;

  //adding the start spot to the openSet
  openSet.push(start);
}

function draw() {
  //Am I still searching?
  if (openSet.length > 0) {

    //the node in openSet having the lowest f value
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      //if found better path
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    // Best option moves from openSet to closedSet
    removeFromArray(openSet, current);
    closedSet.push(current);

    // Did I finish?
    if (current == end) {
      noLoop();
      console.log("DONE!")
    }

    //check all the neighbors
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      //if valid spot
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + heuristics(neighbor, current);

        //is this a better path?
        var newPath = false;

        if (openSet.includes(neighbor)) {
          //if we found a better g value for this spot
          if (tempG < neighbors[i].g) {
            newPath = true;
            neighbor.g = tempG;
            neighbor.previous = current;
            neighbor.h = heuristics(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
          }
        } else {
          newPath = true;
          neighbor.g = tempG;
          openSet.push(neighbor)
        }

        if (newPath) {
          neighbor.previous = current;
          neighbor.h = heuristics(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
  } else {
    console.log("no solution")
    noLoop();
    return -1;
  }

  //draw the state of everything
  background(255);

  strokeWeight(2)
  stroke(0);
  noFill();
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].wall == true) {
        grid[i][j].show(color(0))
      } else {
        grid[i][j].show(color(255))
      }
    }
  }
  start.show(color(255, 204, 0))
  end.show(color(255, 204, 0))

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0))
  }
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0))
  }

  //finding the path by working backwards
  var path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    temp = temp.previous;
    path.push(temp);
  }
  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255))
  }

}
