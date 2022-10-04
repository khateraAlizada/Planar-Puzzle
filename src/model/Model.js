export class Position {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  isEqual(pos) {
    return pos.row == this.row && pos.column == this.column;
  }
}

export class NeighborType {
  constructor(dr, dc, label) {
    this.deltar = dr;
    this.deltac = dc;
    this.label = label;
  }
  static parse(s) {
    if (s === "down" || s === "Down") {
      return Down;
    }
    if (s === "up" || s === "Up") {
      return Up;
    }
    if (s === "left" || s === "Left") {
      return Left;
    }
    if (s === "right" || s === "Right") {
      return Right;
    }

    return NoMove;
  }
}

export const Down = new NeighborType(1, 0, "down");
export const Up = new NeighborType(-1, 0, "up");
export const Left = new NeighborType(0, -1, "left");
export const Right = new NeighborType(0, +1, "right");
export const NoMove = new NeighborType(0, 0, "*"); // No neighbor

export class Square {
  constructor(row, column) {
    this.row = row;
    this.column = column;

    this.baseSquare = false;
    this.color = null;
    this.label = 0;
    this.unused = false;
  }
  place() {
    return new Position(this.row, this.column);
  }

  fillColor(color, label) {
    this.color = color;
    this.label = label;
  }

  location() {
    return new Position(this.row, this.column);
  }

  // used for solving
  copy() {
    let p = new Square(this.row, this.column);
    p.baseSquare = this.baseSquare;
    p.color = this.color;
    p.label = this.label;
    p.unused = this.unused;

    return p;
  }
}

export class Puzzle {
  constructor(numRows, numColumns) {
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.squares = [];
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numColumns; c++) {
        this.squares.push(new Square(r, c));
      }
    }

    this.selected = null;
    this.maxRow = 10;
    this.maxColumn = 10;
    this.maxColors = 5;
  }
  setInfo(row, column, color, baseSquare, unused) {
    this.squares.forEach((sq) => {
      if (sq.row === row && sq.column === column) {
        sq.color = color;
        sq.baseSquare = baseSquare;
        sq.unused = unused;
      }
    });
  }

  getSquare(row, column) {
    this.squares.forEach((sq) => {
      if (sq.row === row && sq.column === column) {
        return sq;
      }
    });
  }

  //colors all available directions
  extendColor(direction) {
    let p = this.selected;
    if (direction === Left) {
      this.squares.forEach((sq) => {
        if (
          sq.row === p.row &&
          sq.column === p.column - 1 &&
          sq.baseSquare === false &&
          sq.unused === false
        ) {
          sq.color = p.color;
          sq.label = p.label + 1;
        }
      });
    }
    if (direction === Right) {
      this.squares.forEach((sq) => {
        if (
          sq.row === p.row &&
          sq.column === p.column + 1 &&
          sq.baseSquare === false &&
          sq.unused === false
        ) {
          sq.color = p.color;
          sq.label = p.label + 1;
        }
      });
    }
    if (direction === Up) {
      this.squares.forEach((sq) => {
        if (
          sq.row === p.row - 1 &&
          sq.column === p.column &&
          sq.baseSquare === false &&
          sq.unused === false
        ) {
          sq.color = p.color;
          sq.label = p.label + 1;
        }
      });
    }
    if (direction === Down) {
      this.squares.forEach((sq) => {
        if (
          sq.row === p.row + 1 &&
          sq.column === p.column &&
          sq.baseSquare === false &&
          sq.unused === false
        ) {
          sq.color = p.color;
          sq.label = p.label + 1;
        }
      });
    }
    this.hasWon();
  }

  // return all blocks
  *blocks() {
    for (let i = 0; i < this.squares.length; i++) {
      yield this.squares[i];
    }
  }
  initialize(squares) {
    //make sure to create new piece objects
    this.squares = squares.map((p) => p.copy());
  }
  /** Make a deep copy of this puzzle. */

  clone() {
    let copy = new Puzzle(this.numRows, this.numColumns);
    copy.squares = [];
    for (let p of this.squares) {
      let dup = p.copy();
      copy.squares.push(dup);
      if (p === this.selected) {
        copy.selected = dup;
      }
    }
    return copy;
  }
  select(square) {
    this.selected = square;
  }

  isSelected(square) {
    return square === this.selected;
  }

  neighbors(row, column) {
    let neighbors = [];
    if (column > 0) {
      this.squares.forEach((sq) => {
        if (sq.row === row && sq.column === column - 1) {
          neighbors.push(sq); //left neighbor
        }
      });
    }
    if (row > 0) {
      this.squares.forEach((sq) => {
        if (sq.row === row - 1 && sq.column === column) {
          neighbors.push(sq); //up neighbor
        }
      });
    }
    if (row < this.numRows - 1) {
      this.squares.forEach((sq) => {
        if (sq.row === row + 1 && sq.column === column) {
          neighbors.push(sq); //down neighbor
        }
      });
    }
    if (column < this.numColumns - 1) {
      this.squares.forEach((sq) => {
        if (sq.row === row && sq.column === column + 1) {
          neighbors.push(sq); //right neighbor
        }
      });
    }
    // console.log(neighbors);
    return neighbors;
  }

  validExtend() {
    let p = this.selected;
    if (p == null) {
      return [];
    }
    if (p.color === null) {
      return [];
    }

    let largest = -1;
    this.squares.forEach((sq) => {
      if (sq.color === p.color && sq.label > p.label) {
        largest = sq.label;
        return largest;
      }
    });
    if (p.label < largest) {
      return [];
    }

    let valids = [];
    let coord = this.selected.location();

    let available = false;

    // can move left?
    if (coord.column > 0) {
      available = true;
      if (available) {
        this.squares.forEach((sq) => {
          if (
            sq.row === p.row &&
            sq.column === p.column - 1 &&
            (sq.baseSquare === true) |
              (sq.unused === true) |
              (sq.label > p.label) |
              (sq.color != null)
          ) {
            available = false;
          }
        });
      }
      if (available) {
        valids.push(Left); //can extend left?
      }
    }
    // can move right?
    if (coord.column < this.numColumns - 1) {
      available = true;
      if (available) {
        this.squares.forEach((sq) => {
          if (
            sq.row === p.row &&
            sq.column === p.column + 1 &&
            (sq.baseSquare === true) |
              (sq.unused === true) |
              (sq.label > p.label) |
              (sq.color != null)
          ) {
            available = false;
          }
        });
      }
      if (available) {
        valids.push(Right); // can extend right?
      }
    }
    // can move down?
    if (coord.row < this.numRows - 1) {
      available = true;
      if (available) {
        this.squares.forEach((sq) => {
          if (
            sq.row === p.row + 1 &&
            sq.column === p.column &&
            (sq.baseSquare === true) |
              (sq.unused === true) |
              (sq.label > p.label) |
              (sq.color != null)
          ) {
            available = false;
          }
        });
      }

      if (available) {
        valids.push(Down); // can extend down
      }
    }
    // can move up?
    if (coord.row > 0) {
      available = true;
      if (available) {
        this.squares.forEach((sq) => {
          if (
            sq.row === p.row - 1 &&
            sq.column === p.column &&
            (sq.baseSquare === true) |
              (sq.unused === true) |
              (sq.label > p.label) |
              (sq.color != null)
          ) {
            available = false;
          }
        });
      }

      if (available) {
        valids.push(Up);
      }
    }
    return valids;
  }

  hasWon() {
    let usedSqs = [];
    usedSqs = this.squares.filter((sq) => sq.unused === false);
    //console.log(usedSqs);

    // let notUsedsq = []
    //  notUsedsq = this.squares.filter(sq => sq.unused===true);
    // console.log(notUsedsq);
    let basesquares = [];
    this.squares.forEach((sq) => {
      if (sq.color === null) {
        return false;
      }
      if (sq.baseSquare === true) {
        basesquares.push(sq);
      }
    });

    let board_won = true; // h: use new variable and assume we have won unless we find we didn't
    basesquares.forEach((bs) => {
      let largest = -1;
      let smallest = 99;
      let others = this.neighbors(bs.row, bs.column);
      this.squares.forEach((sq) => {
        if (sq.color === bs.color && sq.label > largest) {
          largest = sq.label;
        }
      });

      this.squares.forEach((sq) => {
        if (sq.color === bs.color && sq.label < smallest && sq.label > 0) {
          smallest = sq.label;
        }
      });

      let won = false;

      let bs_neighbors = this.neighbors(bs.row, bs.column);
      this.squares.forEach((sq) => {
        // only consider IF neighbor
        if (bs_neighbors.includes(sq)) {
          if (sq.label === largest && sq.color === bs.color) {
            won = true;
          }

          if (sq.label === smallest && sq.color === bs.color) {
            won = true;
          }
        }
      });

      if (won === false) {
        // h: this used to 'return false' and that didn't work.
        board_won = false;
      }
    });
    return board_won;
  }
}

export default class Model {
  static _id = 0; // helpful for debugging. Can be used to show which 'version' Model is being processed

  /** Construct a Model for this puzzle information. If info is undefined, then defaults to no-op constructor. */
  constructor(info) {
    this.id = Model._id;
    Model._id += 1;

    if (typeof info === "undefined") {
      return;
    }

    this.initialize(info);
  }
  //info is going to be JSON-encoded puzzle

  initialize(info) {
    let numRows = parseInt(info.numRows);
    let numColumns = parseInt(info.numColumns);
    this.puzzle = new Puzzle(numRows, numColumns);

    //BaseSquares (baseColor, row, column)
    this.baseSquares = [];
    for (let p of info.baseSquares) {
      this.puzzle.setInfo(
        parseInt(p.row),
        parseInt(p.column),
        p.color,
        true,
        false
      );
    }

    for (let p of info.unusedSquares) {
      this.puzzle.setInfo(
        parseInt(p.row),
        parseInt(p.column),
        p.color,
        false,
        true
      );
    }

    this.victory = false;
  }
  victorious() {
    this.victory = true;
  }

  isVictorious() {
    return this.victory;
  }

  /** Is it possible to extend current selected square (if one exists) in this direction? */
  available(direction) {
    // if no piece selected? Then none are available.
    if (!this.puzzle.selected) {
      return false;
    }
    if (direction === NoMove) {
      return false;
    }

    let allValids = this.puzzle.validExtend();
    //console.log(allValids);

    // all others come here...
    return allValids.includes(direction);
  }

  copy() {
    let m = new Model();
    m.puzzle = this.puzzle.clone();
    m.victory = this.victory;
    return m;
  }
}
