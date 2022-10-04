import { ModalHeader } from "react-bootstrap";
import { computeRectangle } from "../boundary/Boundary.js";
import {
  Up,
  Down,
  Left,
  Right,
  NoMove,
  Square,
  Puzzle,
  NeighborType,
} from "../model/Model.js";

export function selectSquare(model, canvas, event) {
  const canvasRect = canvas.getBoundingClientRect();

  let idx = model.puzzle.squares.findIndex((square) => {
    let rect = computeRectangle(square);

    return rect.contains(
      event.clientX - canvasRect.left,
      event.clientY - canvasRect.top
    );
  });

  let selected = null;
  if (idx >= 0) {
    let possible = model.puzzle.squares[idx];
    console.log("POSSIBLE:", possible);
    if (possible.unused) {
      return model; // NOTHING CHANGES......
    }
    selected = model.puzzle.squares[idx];
  }

  // select this piece! Construct new model to represent this situation.
  console.log("SEL:", selected);
  model.puzzle.select(selected);
  return model.copy();
}

export function fillSquare(model, direction) {
  let selected = model.puzzle.selected;
  if (!selected) {
    return model;
  }
  model.puzzle.extendColor(direction);

  if (model.puzzle.hasWon() === true) {
    // model.puzzle.squares = model.puzzle.squares.filter(p => p !==selected);
    model.puzzle.selected = null; // Gone!
    model.victorious();
    //} else {
  }

  return model.copy();
}
