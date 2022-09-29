export class Position {
    constructor (row, column) {
        this.row = row;
        this.column = column;
    }
}

export class NeighborType {
    constructor(dr, dc, label){
        this.deltar = dr
        this.deltac = dc;
        this.label = label;  
    }
    static parse(s) {
        if ((s === "down")  || (s === "Down"))   { return Down; }
        if ((s === "up")    || (s === "Up"))     { return Up; }
        if ((s === "left")  || (s === "Left"))   { return Left; }
        if ((s === "right") || (s === "Right"))  { return Right; }
        
        return NoMove;
    }
}

export const Down = new NeighborType(1, 0, "down");
export const Up = new NeighborType(-1, 0, "up");
export const Left = new NeighborType(0, -1, "left");
export const Right = new NeighborType(0, +1, "right");
export const NoMove = new NeighborType(0, 0, "*"); // No neighbor 



export class Square {
    constructor(row, column){
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
    
    fillColor(color, label){
        this.color = color;
        this.label = label
    }
    
    
    location() {
        return new Position(this.row, this.column);
    }
    
    // used for solving
    copy(){
        let p = new Square(this.row, this.column);
        p.baseSquare = this.baseSquare;
        p.color = this.color;
        p.label = this.label;
        p.unused = this.unused;
        
        return p;
    }
    
}


export class Puzzle {
    constructor(numRows, numColumns){
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.squares = []
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numColumns; c++) {
                this.squares.push(new Square(r,c));
            }
        }
        
        this.selected = null; 
        this.maxRow = 10;
        this.maxColumn = 10;
        this.maxColors = 5; 
    }
    setInfo (row, column, color, baseSquare, unused){
        this.squares.forEach ((sq)=> {
            if (sq.row === row && sq.column === column){
                sq.color=color;
                sq.baseSquare = baseSquare;
                sq.unused = unused;
            }
        }) 
    }
    
    getSquare (row, column){
        this.squares.forEach ((sq)=> {
            if (sq.row === row && sq.column === column){
                return sq
            }
        }) 
    }
    
    //colors all available directions 
    extendColor (direction){
        let p = this.selected;
        if (direction===Left){
            this.squares.forEach ((sq)=> {
                if (sq.row === p.row && sq.column === p.column-1 && sq.baseSquare===false && sq.unused===false){
                    sq.color = p.color;
                    sq.label = p.label+1;
                }
            })
        }
        if (direction=== Right) {
            this.squares.forEach((sq)=> {
                if(sq.row ===p.row && sq.column===p.column+1 && sq.baseSquare===false && sq.unused===false){
                    sq.color = p.color;
                    sq.label = p.label +1
                }
            })
        }
        if (direction=== Up) {
            this.squares.forEach((sq)=>{
                if(sq.row===p.row-1 && sq.column ===p.column && sq.baseSquare===false && sq.unused===false){
                    sq.color = p.color;
                    sq.label = p.label +1
                }
            })
        }
        if (direction=== Down) {
            this.squares.forEach((sq)=>{
                if(sq.row===p.row+1 && sq.column ===p.column && sq.baseSquare===false && sq.unused===false){
                    sq.color = p.color;
                    sq.label = p.label +1
                }
            })
        }
    }
    
    
    
    
    
    // return all blocks
    *blocks() {
        for (let i = 0; i < this.squares.length; i++) {
            yield this.squares[i];
        }
    }
    initialize (squares){
        //make sure to create new piece objects
        this.squares = squares.map(p=> p.copy());
    }
    /** Make a deep copy of this puzzle. */
    
    clone(){
        let copy = new Puzzle( this.numRows, this.numColumns);
        copy.squares = [];
        for (let p of this.squares){
            let dup = p.copy();
            copy.squares.push(dup);
            if (p === this.selected){
                copy.selected = dup;
            }
        }
        return copy;
    }
    select (square){
        this.selected = square;
    }
    
    isSelected(square){
        return square === this.selected;
    }
    
    
    
    neighbors(square){
        let neighbors = [];
        if (square.col > 0) {
            neighbors.push(this.getSquare(square.row, square.col - 1));// left neighbor
        }
        if (square.row > 0){
            neighbors.push(this.getSquare(square.row - 1, square.col )); // up neighbor
        }
        if(square.row < this.numRows -1){
            neighbors.push(this.getSquare(square.row + 1, square.col )); // down neighbor
        }
        if (square.col < this.numColumns -1) {
            neighbors.push(this.getSquare(square.row, square.col + 1 )); //right neighbor
        }
        console.log(neighbors)
        return neighbors
    }
   
  
    
    validExtend(){
        let p = this.selected;
        if(p== null){ return [];}
        if(p.color===null){return [];}
        
        let largest = -1;
        this.squares.forEach((sq)=> {
            if (sq.color ===p.color && sq.label >p.label){
                largest = sq.label;
                return largest}})
                if(p.label <largest){return [];}
                
                let valids = [];
                let coord = this.selected.location();
                
                let available =false;
                
                // can move left?
                if (coord.column > 0  ){
                    available = true;
                    if (available) {
                        this.squares.forEach((sq)=>{
                            if(sq.row===p.row && sq.column ===p.column-1 && sq.baseSquare===true  |sq.unused===true |sq.label>p.label|sq.color !=null){
                                available =false;  
                            }
                        })
                    }
                    if(available){
                        valids.push(Left)  //can extend left?
                    }
                }
                // can move right?
                if(coord.column < this.numColumns -1 ){
                    available = true;
                    if (available) {
                        this.squares.forEach((sq)=>{
                            if(sq.row===p.row && sq.column ===p.column+1 && sq.baseSquare===true |sq.unused===true |sq.label>p.label |sq.color !=null){
                                available =false; 
                            }
                        })
                    }  
                    if(available){
                        valids.push(Right)  // can extend right? 
                    }
                }
                // can move down?
                if(coord.row < this.numRows -1 ){
                    available = true;
                    if (available) {
                        this.squares.forEach((sq)=>{
                            if(sq.row===p.row+1 && sq.column ===p.column && sq.baseSquare===true |sq.unused===true |sq.label>p.label |sq.color !=null){
                                available =false; 
                            }
                        })
                    }
                    
                    if(available){
                        valids.push(Down) // can extend down
                    }
                }
                // can move up?
                if(coord.row > 0 ){
                    available = true;
                    if (available) {
                        this.squares.forEach((sq)=>{
                            if(sq.row===p.row-1 && sq.column ===p.column && sq.baseSquare===true |sq.unused===true|sq.label>p.label |sq.color !=null){
                                available =false; 
                            }
                        })
                    }
                    
                    if(available){
                        valids.push(Up)
                    }
                }
                return valids;
            }   
            
            
            hasWon(){
                
                let usedSqs =[]
                usedSqs = this.squares.filter(sq => sq.unused===false);
                console.log(usedSqs);
                
                // let notUsedsq = []
                //  notUsedsq = this.squares.filter(sq => sq.unused===true);
                // console.log(notUsedsq);
                let basesquares =[];
                this.squares.forEach((sq)=> {
                    if(sq.baseSquare===true){
                        basesquares.push(sq)
                    }
                })
                
                for(let bs in basesquares){
                    let largest = -1;
                    let smallest = 99;
                    let others =  this.neighbors(bs);
                    this.squares.forEach((sq)=> {
                        if (sq.color ===bs.color && sq.label >largest){
                            largest = sq.label;
                        }
                    }) 
                    
                    this.squares.forEach((sq)=> {
                        if (sq.color === bs.color && sq.label < smallest && sq.label > 0){
                            smallest = sq.label;
                        }
                    })
                    
                    let won = false;
                    others.forEach((sq)=>{
                        if(sq.label ===largest && sq.color===bs.color ){
                            won = true;
                        }
                        
                        if(sq.label ===smallest && sq.color===bs.color ){
                            won = true;   
                        } 
                        
                    });
                    if(won === false){
                        return false;
                    }
                }
                return true;
                
            }
            
        }
        
        
        
        export default class Model {
            static _id = 0; // helpful for debugging. Can be used to show which 'version' Model is being processed
            
            /** Construct a Model for this puzzle information. If info is undefined, then defaults to no-op constructor. */
            constructor(info) {
                this.id = Model._id;
                Model._id += 1;
                
                if (typeof info === 'undefined') {return; }
                
                this.initialize(info);
            }
            //info is going to be JSON-encoded puzzle
            
            
            initialize(info){
                let numRows = parseInt(info.numRows);
                let numColumns = parseInt(info.numColumns); 
                this.puzzle = new Puzzle(numRows, numColumns);
                
                
                //BaseSquares (baseColor, row, column)
                this.baseSquares = [];
                for (let p of info.baseSquares) {
                    this.puzzle.setInfo(parseInt(p.row), parseInt(p.column),p.color,true,false)
                    //row, column, color, label, unused
                }
                
                
                
                // for (let p of info.squares) {
                //     allSquares.push(new Square(p.color, parseInt(p.label), (p.unused=== 'true')));
                //     //row, column, color, label, unused
                // }
                
                
                var unusedSquares = [];
                for (let p of info.unusedSquares){
                    this.puzzle.setInfo(parseInt(p.row), parseInt(p.column),p.color,false,true)
                }
                
                // for (let loc of info.locations) {
                //     let coord = new Position (parseInt(loc.location.row), parseInt(loc.location.column));
                //     let idx = allSquares.findIndex(square => (square.label ===loc.square));
                //     allSquares[idx].place(coord.row, coord.column); 
                // }
                
                
                //this.puzzle = new Puzzle(numRows, numColumns)
                
                // this.puzzle.initialize(allSquares);
                // this.squares = allSquares;
                this.victory = false;
                
            }
            victorious () {
                this.victory = true;
            }
            
            isVictorious() {
                return this.victory;
            }
            
            /** Is it possible to extend current selected square (if one exists) in this direction? */
            available(direction){
                // if no piece selected? Then none are available.
                if (!this.puzzle.selected) { return false; }
                if (direction === NoMove) { return false; }
                
                let allValids = this.puzzle.validExtend();
                console.log(allValids);
                
                // HANDLE WINNING CONDITION
                if (this.puzzle.hasWon()=== true){
                    return true;
                };
                // all others come here...
                return allValids.includes(direction);
                
            }
            // wood puzzle haswon method in puzzle class
            //                  hasWon() {
            //      let idx = this.pieces.findIndex(piece => piece.isWinner);
            //      return this.destination.row === this.pieces[idx].row && this.destination.column === this.pieces[idx].column;
            //   }
            // wood puzzle haswon 
            // HANDLE WINNING CONDITION
            // if (this.puzzle.selected.isWinner && this.puzzle.selected.row === this.puzzle.destination.row && this.puzzle.selected.column === this.puzzle.destination.column && this.puzzle.finalMove === direction) {
            //   return true;
            // }
            
            
            
            copy() {
                let m = new Model();
                m.puzzle = this.puzzle.clone();
                m.victory = this.victory;
                return m
            }
            
            
        }