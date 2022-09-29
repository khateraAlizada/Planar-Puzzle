const configuration_1 = {
    "name": "Configuration #1",
    "numRows" : "2",
    "numColumns" : "4",
    "baseSquares" : [
        {"color" : "red", "row" : "0", "column" : "0"},
        {"color" : "red", "row" : "0", "column" : "2"},
        {"color" : "orange", "row" : "0", "column" : "3"},
        {"color" : "orange", "row" : "1", "column" : "2"}],
    "unusedSquares" : [],
}  
const configuration_2 = {
    "name": "Configuration #2",
     "numRows" : "4",
     "numColumns" : "8",
     "baseSquares" : [
       { "color" : "red", "row": "0", "column" : "1" },
       { "color" : "red", "row": "2", "column" : "4"  },

       { "color" : "yellow", "row": "1", "column" : "4" },
       { "color" : "yellow", "row": "3", "column" : "4" },

       { "color" : "blue", "row": "0", "column" : "2" },
       { "color" : "blue", "row": "0", "column" : "5" } ],
    "unusedSquares" : [
        { "color" : "black", "row": "1", "column" : "1" }],
};


const configuration_3 = {
    "name": "Configuration #3",
     "numRows" : "8",
     "numColumns" : "8",
     "baseSquares" : [
        { "color" : "red", "row": "7", "column" : "0" },
        { "color" : "red", "row": "4", "column" : "4"  },

        { "color" : "yellow", "row": "2", "column" : "4" },
        { "color" : "yellow", "row": "6", "column" : "7" },

        { "color" : "blue", "row": "0", "column" : "7" },
        { "color" : "blue", "row": "7", "column" : "7" } ],
      "unusedSquares" : [],
};

export {configuration_1, configuration_2, configuration_3}
