//an object to describe a spot in the grid
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