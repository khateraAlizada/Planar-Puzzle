import React from 'react';
import { useState } from "react";
import './App.css';
import Model from './model/Model.js';
import { Up, Down, Left, Right } from './model/Model.js';
import { redrawCanvas } from './boundary/Boundary.js';
import { selectSquare, fillSquare, movePiece, /* solvePuzzle */} from './controller/Controller.js';

// load images from src. This fixes problem when being hosted on github.io pages
//import fireworks from './fireworks.apng';

import { mobileLayout } from './Mobile.js';
import { desktopLayout } from './Desktop.js';
import { useMediaQuery } from 'react-responsive'

// default puzzle to use
import { configuration_1,configuration_2, configuration_3 } from './model/Puzzle.js'; 

var actualPuzzle = JSON.parse(JSON.stringify(configuration_1));   // parses string into JSON object, used below.

var initialConfigs = [
  JSON.parse(JSON.stringify(configuration_1)),
  JSON.parse(JSON.stringify(configuration_2)),
  JSON.parse(JSON.stringify(configuration_3))
];

var puzzleIsSet = false; 
// Used to record when key is pressed, since there will be duplicate events generated,
// and we only want to process the first one.
var isKeyDown = false;

function App() {
  const [model, setModel] = React.useState(new Model(initialConfigs[0]));
  //const [solved, setSolved] = React.useState(false);
  const [solution, setSolution] = React.useState("");
  const [isInputPuzzleVisible, setInputPuzzleVisible] = React.useState(false);
  const [inputPuzzle, setInputPuzzle] = React.useState("");
  
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 900px)' })
  const layout = isDesktopOrLaptop ? desktopLayout : mobileLayout;
  const appRef = React.useRef(null);      // need to be able to refer to App to get background color in Boundary
  const canvasRef = React.useRef(null);   // need to be able to refer to Canvas
  
  /** Ensures initial rendering is performed, and that whenever model changes, it is re-rendered. */
  React.useEffect (() => {
    function handleResize() {
      setDimensions({
        height:window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize);
    
    
    /** Happens once. */
    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model])   // this second argument is CRITICAL, since it declares when to refresh (whenever Model changes)
  /*
  const toggleVisibility = () => {
    setInputPuzzleVisible(!isInputPuzzleVisible);
  };
  */
  const selectConfigHandler = (config) => {
    let newModel = new Model(config);
    setModel(newModel); // react to changes, if model has changed. 
    puzzleIsSet = true;
  }
  
  const updatePuzzle = (e) => {
    setInputPuzzle(e.target.value);
  };
  
  const handleClick = (e) => {
    let newModel = selectSquare(model, canvasRef.current, e);
    setModel(newModel);   // react to changes, if model has changed.
  }
  
 
  const movePieceHandler = (direction) => {
    let newModel = movePiece(model, direction);
    // if (solved) {
    //   let idx = solution.indexOf("\n"); // extract first move
    //   let result = solution.substring(idx+1);
    //   setSolution(result);
    //   if (result.length === 0) { setSolved(false); } // remove the text solution....
    // }
    setModel(newModel);   // react to changes, if model has changed.
  }
  
  const handleKeyUpEvent = (e) => {
    isKeyDown = false;
  }
  
 
  const resetHandler = () => {
    let m = new Model(initialConfigs[0]);
    setModel(m);                    // react to changes since model has changed.
    
  }
  
  // const solveHandler = () => {
  //   // if previously not solved, this makes it visible and records the solution.
  //   if (!solved) {
  //       let moves = solvePuzzle(model);
  //   	setSolution(moves);
  //   }
  
  //   setSolved(!solved);
  // }
  
  
  const changePuzzle = (e) => {
    setInputPuzzleVisible(!isInputPuzzleVisible);
    actualPuzzle = JSON.parse(inputPuzzle);
    try {
      let m = new Model(actualPuzzle)
      setModel(m);
      
    } catch (err) {
      console.log("Problem parsing input:" + err);
    }
  }
  
  const colorSquareHandler = (direction) => {
    let newModel = fillSquare(model, direction);
    // if (solved) {
    //   let idx = solution.indexOf("\n"); // extract first move
    //   let result = solution.substring(idx+1);
    //   setSolution(result);
    //   if (result.length === 0) { setSolved(false); } // remove the text solution....
    // }
    setModel(newModel);   // react to changes, if model has changed.
  }
  const handleKeyDownEvent = (e) => { 
    if (isKeyDown) { return; }
    isKeyDown = true;
    
    var direction = null;
    if      ((e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 100) && model.available(Left))  { direction = Left; }
    else if ((e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 104) && model.available(Up))    { direction = Up; }
    else if ((e.keyCode === 39 || e.keyCode === 68 || e.keyCode === 102) && model.available(Right)) { direction = Right; }
    else if ((e.keyCode === 40 || e.keyCode === 83 || e.keyCode === 98)  && model.available(Down))  { direction = Down; }
    if (direction) { colorSquareHandler(direction); } 
  }
  
  
 
  // top-level application
  return (
    <main style={layout.Appmain} ref={appRef}>
    {/* Allows key events, with tabIndex */}
    <canvas tabIndex="1"  
    className="App-canvas"
    ref={canvasRef}
    width={layout.canvas.width}
    height={layout.canvas.height}
    onClick={handleClick} onKeyDown={handleKeyDownEvent} onKeyUp={handleKeyUpEvent} />
    
     <label data-testid="victory-label" style={layout.text} className={"display-5 mb-3"}> {model.isVictorious() ? "Congratulations, you won!!!" : "Try more!!!"}</label>
   
    {/* Using '?' construct is proper React way to make image visible only when victorious. */}  
      { model.isVictorious() ? console.log( "Congratulations You won" ) : null }
    <textarea style={layout.inputPuzzle} placeholder="Enter JSON here" rows={5} onChange={updatePuzzle} hidden={!isInputPuzzleVisible}></textarea>
    { isInputPuzzleVisible ? ( <button style={layout.inputPuzzleChange} onClick={changePuzzle} hidden={isInputPuzzleVisible}>Change Puzzle</button> ) : null }
    {/* Configuration buttons*/}
    <div style={layout.configButtons}>
    <button style={layout.level1button}    onClick={(e) => selectConfigHandler(configuration_1)}>Level1</button>
    <button style={layout.level2button}  onClick={(e) => selectConfigHandler(configuration_2)}>Level2</button>
    <button style={layout.level3button} onClick={(e) => selectConfigHandler(configuration_3)}>Level3</button>
    
    
    </div>
    
    {/* extraButtons */}
    <div style = {layout.extraButtons}>
    
    
    </div>
    
    {/* Group buttons together */}
    <div style={layout.buttons}>
    
    
    <button style={layout.upbutton}    onClick={(e) => colorSquareHandler(Up)} disabled={!model.available(Up)}     >&#8593;</button>
    <button style={layout.leftbutton}  onClick={(e) => colorSquareHandler(Left)} disabled={!model.available(Left)}   >&#8592;</button>
    <button style={layout.rightbutton} onClick={(e) => colorSquareHandler(Right)} disabled={!model.available(Right)}  >&#8594;</button>
    <button style={layout.downbutton}  onClick={(e) => colorSquareHandler(Down)} disabled={!model.available(Down)}    >&#8595;</button> 
    
    <button style={layout.resetbutton} onClick={(e) => resetHandler()} >Reset</button>
 
    
    
    </div>
    </main>
    );
    
  }
  
  export default App;