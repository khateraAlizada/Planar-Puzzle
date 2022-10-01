import React from "react";
import { render, screen } from "@testing-library/react";
import Model from "./model/Model.js";
import { Up, Down, Left, Right } from "./model/Model.js";
import {fillSquare} from "./controller/Controller.js";

//default puzzle to use
//import { initialConfigs } from "./model/Model.js";
import {
    configuration_1,
    configuration_2,
    configuration_3,
} from "./model/Puzzle.js";

var actualPuzzle = JSON.parse(JSON.stringify(configuration_2)); // parse string into JSON object

test("victory is false when model created", () => {
    var model = new Model(actualPuzzle);
    expect(model.victory).toBe(false);
});

test("hasWon()is false when model created", () => {
    var model = new Model(actualPuzzle);
    expect(model.puzzle.hasWon()).toBe(false);
});

// test("Properly render false victory", () => {
//   const { getByText } = render(<App />);
//   const victoryElement = getByText(/victory: false/);
//   expect(victoryElement).toBeInTheDocument();
// });

test("find unused square", () => {
    var model = new Model(actualPuzzle);
    var unused = model.puzzle.squares.find((p) => p.ununsed === true);
    model.puzzle.select(unused);
    expect(model.puzzle.selected).toBe(unused);
    
    // now what moves are available? only right and down
    expect(model.available(Left)).toBe(false);
    expect(model.available(Right)).toBe(false);
    expect(model.available(Up)).toBe(false);
    expect(model.available(Down)).toBe(false);
});

test("find valid moves", () => {
    var model = new Model(actualPuzzle);
    var bs = model.puzzle.squares.find((p) =>  p.row=== 0 && p.column=== 0);
    model.puzzle.select(bs);
    expect(model.puzzle.selected).toBe(bs);
    
    // now what moves are available? none because it is not a base
    expect(model.available(Left)).toBe(false);
    expect(model.available(Right)).toBe(false);
    expect(model.available(Up)).toBe(false);
    expect(model.available(Down)).toBe(false);
    
    
    
});

test("find valid moves for another piece", () => {
    var model = new Model(actualPuzzle);
    let s = model.puzzle.squares.find((p) => p.row === 0 && p.column === 1);
    model.puzzle.select(s);
    expect(model.puzzle.selected).toBe(s);
    
    // now what moves are available? none because it is not a base
    expect(model.available(Left)).toBe(true);
    expect(model.available(Right)).toBe(false);
    expect(model.available(Up)).toBe(false);
    expect(model.available(Down)).toBe(false);
    
    // fillSquare
    
    let newmodel = fillSquare(Model, Left);
    //let ss = newmodel.puzzle.squares.find((p) => p.row === 0 && p.column === 1);
    var c = newmodel.puzzle.squares.find((p) => p.row === 0 && p.column === 0);
    
   // newmodel.puzzle.select(ss);
    
    
   // expect(newmodel.puzzle.selected).toBe(s);
    expect(c.color).toBe("red"); // moved piece s to the edge
});





// test(" find square with label 0 when model created", () => {
//   var model = new Model(actualPuzzle);
//   expect(model.victory).toBe(false);
// });
