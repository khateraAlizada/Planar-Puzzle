import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Model from "./model/Model.js";
import { Up, Down, Left, Right, extendColor, parse } from "./model/Model.js";
import { fillSquare } from "./controller/Controller.js";
import App from "./App";
import boundary from "./boundary/Boundary.js";

//default puzzle to use
//import { initialConfigs } from "./model/Model.js";
import {
  configuration_1,
  configuration_2,
  configuration_3,
} from "./model/Puzzle.js";

var actualPuzzle = JSON.parse(JSON.stringify(configuration_2)); // parse string into JSON object

var puzzleIsSet = false;
var isKeyDown = false; 

// test fails?
  //  test ('static parse', () =>{
  //   const value = parse(Down);
  //   expect (value).toBe(Down)
  //  });

  // export class Position {
  // constructor(row, column) {
  //   this.row = row;
  //   this.column = column;
  // }

  //??
  // test('position', ()=>{
  //   const p = Postion(0,0)
  // });

 

test("test text not in document", async () => {
  const { queryByText } = render(<App />);
  const linkElement = queryByText("You won!!!");
  expect(linkElement).not.toBeInTheDocument();
});

test("test render text", async () => {
  const { getByText } = render(<App />);
  const linkElement = getByText("Try more!!!");
  expect(linkElement).toBeInTheDocument();
});

test("reset button", () => {
  //  const wrapper = render(<App />);
  const { getByTestId } = render(<App />);
  // const linkElement = getByTestId("resetbutton");
  const resetButton = screen.getByTestId("resetbutton");
  expect(resetButton).toBeInTheDocument();
});

// test("Properly render false victory", () => {
//   const { getByText } = render(<App />);
//   const victoryElement = getByText(/victory: false/);
//   expect(victoryElement).toBeInTheDocument();
// });

// test("get square", () => {
//   var model = new Model(actualPuzzle);
//   var sq = model.puzzle.squares.find((p) => p.row === 2 && p.column === 4);
//   let sq2 = model.puzzle.getSquare(2, 4);

//   expect(model.puzzle.sq.place().isEqual(sq2.place())).toBeTruthy();
// });

test("victory is false when model created", () => {
  var model = new Model(actualPuzzle);
  expect(model.victory).toBe(false);
});

test("hasWon()is false when model created", () => {
  var model = new Model(actualPuzzle);
  expect(model.puzzle.hasWon()).toBe(false);
});

test("hasWon() if all squares filled", () => {
  var model = new Model(actualPuzzle);
  model.puzzle.squares.forEach(p => {
    p.color = "red" 
    if(p.row===3 && p.column===2 ){
      p.label=3
    }
  });
  expect(model.puzzle.hasWon()).toBe(false);
});

// test("Properly render null victory-label", () => {
//   const { getByText } = render(<App />);
// const victoryElement = getByText(/victory-label: null/);
//   const victoryL = screen.getByLabelText(null);
//expect(victoryElement).toBeInTheDocument();
// expect(victoryElment.textContent).toBe(null)
//   expect(victoryL.textContent).toBe(null);
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

test("check label", () => {
  var model = new Model(actualPuzzle);
  var bs = model.puzzle.squares.find((p) => p.row === 3 && p.column === 7);
  expect(bs.label).toBe(0); 
  expect(bs.color).toBe(null); 
});

test("find valid moves", () => {
  var model = new Model(actualPuzzle);
  var bs = model.puzzle.squares.find((p) => p.row === 0 && p.column === 0);
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
  expect(model.available(Left)).toBe(true); // CAN ONLY GO LEFT
  expect(model.available(Right)).toBe(false);
  expect(model.available(Up)).toBe(false);
  expect(model.available(Down)).toBe(false);

  let s2 = model.puzzle.squares.find((p) => p.row === 0 && p.column === 0);
  model.puzzle.select(s2);
  expect(model.puzzle.selected).toBe(s2);

  // now what moves are available? none because it is not a base
  expect(model.available(Left)).toBe(false);
  expect(model.available(Right)).toBe(false);
  expect(model.available(Up)).toBe(false);
  expect(model.available(Down)).toBe(false);

  //     // fillSquare
  model.puzzle.select(s); // go back and select 0,1
  let amodel = fillSquare(model, Left);
  var c = amodel.puzzle.squares.find((p) => p.row === 0 && p.column === 0);
  console.log("S:", amodel.puzzle.selected, s);
  //expect(amodel.puzzle.selected).toBe(s);
  expect(amodel.puzzle.selected.place().isEqual(s.place())).toBeTruthy();
  console.log("CC:", c);
  expect(c.color).toBe("red"); // color the square
  expect(c.label).toBe(1); // color the square
});

//     // fillSquare right
test("extend color to the right", () => {
  var bmodel = new Model(actualPuzzle);
  let selected = bmodel.puzzle.squares.find(
    (p) => p.row === 0 && p.column === 2
  );
  bmodel.puzzle.select(selected);
  expect(bmodel.puzzle.selected).toBe(selected);
  // now what moves are available? none because it is not a base
  expect(bmodel.available(Left)).toBe(false);
  expect(bmodel.available(Right)).toBe(true);
  expect(bmodel.available(Up)).toBe(false);
  expect(bmodel.available(Down)).toBe(true);

  let dmodel = fillSquare(bmodel, Right);

  var d = dmodel.puzzle.squares.find((p) => p.row === 0 && p.column === 3);

  expect(d.color).toBe("blue"); // color the square
  expect(d.label).toBe(1); // color the square
});

//     // fillSquare up
test("extend color to the up", () => {
  var bmodel = new Model(actualPuzzle);
  let selected = bmodel.puzzle.squares.find(
    (p) => p.row === 1 && p.column === 4
  );
  bmodel.puzzle.select(selected);
  expect(bmodel.puzzle.selected).toBe(selected);
  // now what moves are available? none because it is not a base
  expect(bmodel.available(Left)).toBe(true);
  expect(bmodel.available(Right)).toBe(true);
  expect(bmodel.available(Up)).toBe(true);
  expect(bmodel.available(Down)).toBe(false);

  let dmodel = fillSquare(bmodel, Up);

  var d = dmodel.puzzle.squares.find((p) => p.row === 0 && p.column === 4);

  expect(d.color).toBe("yellow"); // color the square
  expect(d.label).toBe(1); // color the square
});

//     // fillSquare down
test("extend color to the down", () => {
  var bmodel = new Model(actualPuzzle);
  let selected = bmodel.puzzle.squares.find(
    (p) => p.row === 0 && p.column === 5
  );
  bmodel.puzzle.select(selected);
  expect(bmodel.puzzle.selected).toBe(selected);
  // now what moves are available? none because it is not a base
  expect(bmodel.available(Left)).toBe(true);
  expect(bmodel.available(Right)).toBe(true);
  expect(bmodel.available(Up)).toBe(false);
  expect(bmodel.available(Down)).toBe(true);

  let dmodel = fillSquare(bmodel, Down);

  var d = dmodel.puzzle.squares.find((p) => p.row === 1 && p.column === 5);

  expect(d.color).toBe("blue"); // color the square
  expect(d.label).toBe(1); // color the square
});

test("extend color", () => {
  var amodel = new Model(actualPuzzle);

  let ss = amodel.puzzle.squares.find((p) => p.row === 0 && p.column === 1);
  var c = amodel.puzzle.squares.find((p) => p.row === 0 && p.column === 0);

  amodel.puzzle.select(ss);
  expect(amodel.puzzle.selected).toBe(ss);
  amodel.puzzle.extendColor(Left);

  expect(c.color).toBe("red"); // color the square
});

//   getSquare(row, column) {
//     this.squares.forEach((sq) => {
//       if (sq.row === row && sq.column === column) {
//         return sq;
//       }
//     });
//   }

test("list neighbors", () => {
  var amodel = new Model(actualPuzzle);

  var c = amodel.puzzle.squares.find((p) => p.row === 0 && p.column === 0);

  let others = amodel.puzzle.neighbors(c.row, c.column);
  var right = amodel.puzzle.squares.find((p) => p.row === 0 && p.column === 1);
  var down = amodel.puzzle.squares.find((p) => p.row === 1 && p.column === 0);

  console.log("NL", others);
  expect(others.includes(down)).toBeTruthy();
  expect(others.includes(right)).toBeTruthy();
   expect(others.includes(Left)).toBeFalsy();

  //expect(others).toBe([down, right]);
  //  expect(amodel.puzzle.neighbors(c.row, c.column)).toBe({nl});
});

// how do we check unused. is this correct
test("ununsed square", () => {
  var model = new Model(actualPuzzle);
  var unused = model.puzzle.squares.find((p) => p.row === 1 && p.column === 1);
  model.puzzle.select(unused);
  expect(model.puzzle.selected).toBe(unused);
});

// test("Access GUI", () => {
//   const wrapper = render(<App />);

//   const leftButton = screen.getByTestId("leftbutton");
//   const rightButton = screen.getByTestId("rightbutton");
//   const upButton = screen.getByTestId("upbutton");
//   const downButton = screen.getByTestId("downbutton");
//   const canvasElement = screen.getByTestId("canvas");

//   const restButton = screen.getByTestId("resetbutton");

//   // what kind of test to have for resetbutton

//   //Initially, this button
//   expect(leftButton.disabled).toBeTruthy();
//   expect(rightButton.disabled).toBeTruthy();
//   expect(downButton.disabled).toBeTruthy();
//   expect(upButton.disabled).toBeTruthy();

//   // where I click the mouse and this enables some of the buttons
//   // (0,0) level 2 configuration
//   fireEvent.click(canvasElement, {
//     screenX: 438,
//     screenY: 238,
//     clientX: 55,
//     clientY: 66,
//   });
//   //still all the buttons will be disabled for (0,0)

//   expect(leftButton.disabled).toBeTruthy();
//  // expect(rightButton.disabled).toBeTruthy();
//  // expect(downButton.disabled).toBeTruthy();
//   expect(upButton.disabled).toBeTruthy();

//   // where I click the mouse and this enables some of the buttons
//   //(3,4)
//   fireEvent.click(canvasElement, {
//     screenX: 685,
//     screenY: 452,
//     clientX: 563,
//     clientY: 445,
//   });
//   expect(downButton.disabled).toBeTruthy();
//   expect(rightButton.disabled).toBeFalsy();
//   expect(leftButton.disabled).toBeFalsy();
// });
// test("Access GUI down button disabled", () => {
//   const wrapper = render(<App />);

//  // const leftButton = screen.getByTestId("leftbutton");
//  // const rightButton = screen.getByTestId("rightbutton");
//  // const upButton = screen.getByTestId("upbutton");
//   const downButton = screen.getByTestId("downbutton");
//   const canvasElement = screen.getByTestId("canvas");

//  //const restButton = screen.getByTestId("resetbutton");

//   // what kind of test to have for resetbutton

//   //Initially, this button
//   //expect(leftButton.disabled).toBeTruthy();
//  // expect(rightButton.disabled).toBeTruthy();
//   expect(downButton.disabled).toBeTruthy();
//  // expect(upButton.disabled).toBeTruthy();

//   // change down button disabled to be falsy for (0,5)
//   fireEvent.click(canvasElement, {
//     screenX: 630,
//     screenY: 155,
//     clientX: 688,
//     clientY: 70,
//   });

//   expect(downButton.disabled).toBeFalsy();
// });

// test("Access GUI Upbutton disabled", () => {
//   const wrapper = render(<App />);

//   const upButton = screen.getByTestId("upbutton");
//   const canvasElement = screen.getByTestId("canvas");

//   expect(upButton.disabled).toBeTruthy();
//   // change down button disabled to be falsy for (1,4)
//   fireEvent.click(canvasElement, {
//     screenX: 565,
//     screenY: 211,
//     clientX: 559,
//     clientY: 182
//   });
//   expect(upButton.disabled).toBeFalsy();
// });
// test("Access GUI leftbutton disabled", () => {
//   const wrapper = render(<App />);

//   const leftButton = screen.getByTestId("leftbutton");
//   const canvasElement = screen.getByTestId("canvas");

//   expect(leftButton.disabled).toBeTruthy();
//   // change down button disabled to be falsy for (3,4)
//   fireEvent.click(canvasElement, {
//     screenX: 697,
//     screenY: 436,
//     clientX: 573,
//     clientY: 463,
//   });
//   expect(leftButton.disabled).toBeFalsy();
// });



// test(" find square with label 0 when model created", () => {
//   var model = new Model(actualPuzzle);
//   expect(model.victory).toBe(false);
// });
