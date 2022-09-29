import React from 'react';
import { render, screen } from '@testing-library/react';
import Model from './model/Model.js';

//default puzzle to use
import {puzzleInformation} from './model/Model.js';
var actualPuzzle = JSON.parse(JSON.stringify(puzzleInformation));  // parse string into JSON object

var model = new Model(actualPuzzle); 

test('renders learn react link', () => {
 
});
