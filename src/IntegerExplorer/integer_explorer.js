// INTEGER EXPLORER PROGRAM

// GLOBAL VARIABLES

console.log("integer explorer script.js loaded")

var C = { // Object. C is short for Current State.
    numChoice : 0,
    gridType : 'regular',
    dimensions : [0,0],
    cellSelection: 'none',
    cellInternals : 'all',
    internalsDisplay : 'highlight',
    externalsDisplay : 'factorOfInput',
    borderWidth : 2,
    cellSize : 40,
    colorMode : 'mono',
    SpiralType : 'x',
    elemList : null,
}

var D = { // Object. D is short for Desired State.
    numChoice : 72,
    gridType : 'regular',
    dimensions : [9,9],
    cellSelection: 'none',
    cellInternals : 'factorOfInput',
    internalsDisplay : 'highlight',
    externalsDisplay : 'plain',
    borderWidth : 2,
    cellSize : 40,
    colorMode : 'mono',
    SpiralType : 'x',
}

// State Properties explained: (possible values)
// grid types: regular / spiral / multiplication table
// display modes: all / some
// info types: plain / PF / numOfPrimes / numOfFactors / OEISY
// hconditions: factorOfInput / multipleOfInput / asManyPrimesAsInput /
// -> / asManyFactorsAsInput / OEISY
// spiralTypes: x / y

// METHODS FOR INTERPRETING THE INPUTS (ORDERED BY DEPTH IN THE CALL STACK)

// LEVEL ONE

const form = document.querySelector('form');
form.addEventListener('change', function() {
  manageInputs()
});

var manageInputs = function() {
    updateDesiredState();
    if(gridNeedsBuilding()) {
        stripGrid();
        buildGrid();
        setCellAppearances();
        setGridAppearance();
    } else if(gridInfoNeedsChanging()) {
        resetCellAppearances();
        setCellAppearances();
        setGridAppearance();
    } else if(gridAppearanceNeedsChanging()) {
        setGridAppearance();
    } // else no changes needed
    updateCurrentState();
}

// LEVEL TWO

var updateDesiredState = function() {
    let form = document.getElementById("inputForm");
    D.numChoice = Number(form.numChoice.value);
    D.gridType = form.gridType.value;
    D.dimensions[0] = Number(form.width.value);
    D.dimensions[1] = Number(form.height.value);
    D.cellSelection = form.cellSelection.value;
    D.cellInternals = form.cellInternals.value;
    D.internalsDisplay = form.internalsDisplay.value;
    D.externalsDisplay = form.externalsDisplay.value;
    D.borderWidth = Number(form.borderWidth.value);
    D.cellSize = Number(form.cellSize.value);
    D.colorMode = form.colorMode.value;
    D.spiralType = form.spiralType.value;
}

var gridNeedsBuilding = function() {
    if (gridTypeChanged() || gridDimensionsChanged()) {
        return true;
    } else return false;
}

var gridInfoNeedsChanging = function() {
    if (numChoiceChanged()
        || cellSelectionChanged()
        || cellInternalsChanged()
        || internalsDisplayChanged()
        || externalsDisplayChanged()
        || colorModeChanged()) {
        return true;
    } else return false;
}

var gridAppearanceNeedsChanging = function() {
    if(borderWidthHasChanged() || cellSizeHasChanged()) {
        return true;
    } else return false;
}

var allCellsNeedInternals = function() {
    if(D.cellInternals == 'all') {
        return true;
    } else return false;
}

var allCellsHadInternals = function() {
    if(C.cellInternals == 'all') {
        return true;
    } else return false;
}

var updateCurrentState = function() {
    C.numChoice = D.numChoice;
    C.gridType = D.gridType;
    C.dimensions[0] = D.dimensions[0];
    C.dimensions[1] = D.dimensions[1];
    C.cellSelction = D.cellSelection;
    C.cellInternals = D.cellInternals;
    C.internalsDisplay = D.internalsDisplay;
    C.externalsDisplay = D.externalsDisplay;
    C.borderWidth = D.borderWidth;
    C.cellSize = D.cellSize;
    C.colorMode = D.colorMode;
    C.spiralType = D.spiralType;
}

// LEVEL THREE

var gridTypeChanged = function() {
    if(C.gridType !== D.gridType) {
        return true;
    } else return false;
}

var gridDimensionsChanged = function() {
    if(!arraysEqual(C.dimensions, D.dimensions)) {
        return true;
    } else return false;
}

var numChoiceChanged = function() {
    if(D.numChoice !== C.numChoice) {
        return true;
    } else return false;
}

var cellSelectionChanged = function() {
    if(D.cellSelection !== C.cellSelection) {
        return true;
    } else return false;
}

var cellInternalsChanged = function() {
    if(D.cellInternals !== C.cellInternals) {
        return true;
    } else return false;
}

var cellExternalsChanged = function() {
    if(D.cellExternals !== C.cellExternals) {
        return true;
    } else return false;
}

var internalsDisplayChanged = function() {
    if(D.internalsDisplay !== C.internalsDisplay) {
        return true;
    } else return false;
}

var externalsDisplayChanged = function() {
    if(D.externalsDisplay !== C.externalsDisplay) {
        return true;
    } else return false;
}

var colorModeChanged = function() {
    if(D.colorMode !== C.colorMode) {
        return true;
    } else return false;
}

var borderWidthHasChanged = function() {
    if(C.borderWidth !== D.borderWidth) {
        return true;
    } else return false;
}

var cellSizeHasChanged = function() {
    if(C.cellSize !== D.cellSize) {
        return true;
    } else return false;
}

// METHODS THAT CHANGE THE DOM (ORDERED BY DEPTH IN THE CALL STACK)

// LEVEL ONE

var stripGrid = function() {
    let grid = document.getElementById("gridcontainer");
    while(grid.firstChild) {
	grid.removeChild(grid.firstChild);
    }
}

var buildGrid = function() {
    switch(D.gridType) {
    case 'regular':
        buildRegularGrid();
        break;
    case 'spiral':
        buildSpiralGrid();
        break;
    case 'multiplicationTable':
        buildMultiplicationTable();
        break;
    }
}

var resetCellAppearances = function() {
    let elemList = C.elemList;
    if(allCellsHadInternals()) {
        CAI(removeStyle, []);
    } else {
        CSP(removeStyle, elemList);
    }
}

var setCellAppearances = function() {
    let elemList = getSelectedCells();
    if(allCellsNeedInternals()) {
        colorInternals(CAI, []);
    } else {
        colorInternals(CSP, elemList);
    }
    colorExternals(elemList);
}

// LEVEL TWO

var buildRegularGrid = function() {
    let container = document.getElementById('gridcontainer');
    for(let i = 1; i <= D.dimensions[0]*D.dimensions[1]; ++i) {
        createCell(container, i);
    }
}

var buildSpiralGrid = function() {
    let spiralInfo = createCoordArrayForSpiral(D.dimensions, D.spiralType);
    let container = document.getElementById('gridcontainer');
    let coords = [];
    coords[0] = spiralInfo.topLeftCoord[0];
    coords[1] = spiralInfo.topLeftCoord[1];
    for(let j = 0; j < D.dimensions[1]; ++j) {
        for(let i = 0; i < D.dimensions[0]; ++i) {
            coords[0] = spiralInfo.topLeftCoord[0] + i;
            coords[1] = spiralInfo.topLeftCoord[1] - j;
            createCell(container, getSpiralCellNum(spiralInfo.coordArray, coords));
        }
    }
}

var buildMultiplicationTable = function() {
    let container = document.getElementById('gridcontainer');
    for(let i = 1; i <= D.dimensions[0]*D.dimensions[1]; ++i) {
        let rowNum = 1 + Math.floor(i/D.dimensions[0]);
        let colNum = i % D.dimensions[0];
        if (colNum == 0) {
            colNum = D.dimensions[0]
            rowNum -= 1;
        }
        let identifier = rowNum * colNum ;
        createCell(container, identifier);
    }
}

var getSelectedCells = function() {
    let elemList = [];
    switch (D.cellSelection) {
    case 'none':
        break;
    case 'all':
        elemList = 'all';
        break;
    case 'primeFactorOfInput':
        elemList = getPrimeFactorCells(elemList);
        break;
    case 'factorOfInput':
        elemList = getFactorCells(elemList);
        break;
    case 'multipleOfInput':
        elemList = getMultiplesCells(elemList);
        break;
    case 'asManyPrimesAsInput':
        elemList = getSamePrimesCells(elemList);
        break;
    case 'asManyFactorsAsInput':
        elemList = getSameFactorsCells(elemList);
        break;
    case 'ifPresentInSequence':
        elemList = getCellsInSequence(elemList);
        break;
    }
    C.elemList = elemList;
    return elemList;
}

var colorInternals = function(func, elemList) {
    switch (D.internalsDisplay) {
    case 'highlight':
        func(highlight_rules_i, elemList);
        break;
    case 'PF':
        func(PF_rules_i, elemList);
        break;
    case 'numOfPrimes':
        func(numOfPrimes_rules_i, elemList);
        break;
    case 'numOfFactors':
        func(numOfFactors_rules_i, elemList);
        break;
    case 'sequenceValue':
        func(sequenceValue_rules_i, elemList);
        break;
    case 'userDefinedFunction':
        func(userDefinedFuncion_rules_i, elemList);
        break;
    }
}

var colorExternals = function(elemList) {
    let func = CSP;
    if(elemList == 'all') {
        func = CAI;
    }
    switch (D.externalsDisplay) {
    case 'highlight':
        func(highlight_rules_e, elemList);
        break;
    case 'numOfPrimes':
        func(numOfPrimes_rules_e, elemList);
        break;
    case 'numOfFactors':
        func(numOfFactors_rules_e, elemList);
        break;
    case 'sequenceValue':
        func(sequenceValue_rules_e, elemList);
        break;
    case 'userDefinedFunction':
        func(userDefinedFunction_rules_e, elemList);
        break;
    }
}

var setGridAppearance = function() {
    setContainerSize();
    setCellSize();
    setBorderWidth();
}

// LEVEL THREE


var createCoordArrayForSpiral = function(dimensions, whichFirst) {
    let seed = new Array;
    seed = getSeed(dimensions, whichFirst);
    let runningDimensions = seed;
    let info = {
        coordArray : [[0,0]],
        topLeftCoord : [0,0],
    }
    let direction = 1;
    if(seed[0] > seed[1]) direction = 0;
    let i = { ref : 0 };
    getFirstLine(info, seed, i);
    if(!arraysEqual([0,0], info.coordArray[i.ref])) {
        info.topLeftCoord = info.coordArray[i.ref];
    }
    for(; i.ref + 1 < dimensions[0]*dimensions[1]; ++direction) {
        switch(direction % 4) {
        case 0:
            // row on bottom, numbers increasing right
            addNextLine(0, -1, 1, 0, i, info, runningDimensions);
            break;
        case 1:
            // row on right, numbers increasing up
            addNextLine(1, 0, 0, 1, i, info, runningDimensions);
            break;
        case 2:
            // row on top, numbers increasing left
            addNextLine(0, 1, -1, 0, i, info, runningDimensions);
            break;
        case 3:
            // row on left, numbers increasing down
            addNextLine(-1, 0, 0, -1, i, info, runningDimensions);
            break;
        }
    }
    return info;
}

var getSpiralCellNum = function(array, coords) {
    let k = 0;
    while(!arraysEqual(array[k], coords)) {
        ++k;
    }
    return k + 1;
}

var createCell = function(container, identifier) {
    let cell = document.createElement('div');
    cell.className = " cell "
    cell.className += "n" + identifier.toString();
    container.appendChild(cell);
}

var CAI = function(rules, emptyList) {
    for(let i = 1; i <= D.dimensions[0]*D.dimensions[1]; ++i) {
        if(document.getElementsByClassName('n' + i)) {
            for(let j = 0; j < document.getElementsByClassName('n' + i).length; ++j) {
            rules(document.getElementsByClassName('n' + i)[j], i);
            }
        }
    }
}

var CSP = function(rules, elemList) {
    for(let i = 0; i < elemList.length; ++i) {
        for(let j = 0; j < elemList[i].length; ++j) {
            let name = elemList[i][j].className;
            let index = name.indexOf(' n');
            let n = name.substring(index + 2, name.length);
            if(!Number(n)) {
                n = n.substring(0, n.indexOf(' '));
            }
            rules(elemList[i][j], n);
        }
    }
}

var getPrimeFactorCells = function(elemList) {
    //cells that have with identifiers equalling prime factors of the input number
    primes = getPrimes(D.numChoice);
    for(let i = 0; i < primes.length; ++i) {
        if(document.getElementsByClassName('n' + primes[i])) {
            elemList.push(document.getElementsByClassName('n' + primes[i]));
        }
    }
    return elemList;
}

var getFactorCells = function(elemList) {
    factors = getFactors(getPrimes(D.numChoice));
    for(let i = 0; i < factors.length; ++i) {
        if(document.getElementsByClassName('n' + factors[i])) {
            elemList.push(document.getElementsByClassName('n' + factors[i]));
        }
    }
    return elemList;
}

var getMultiplesCells = function(elemList) {
    let k = 1;
    while(k * D.numChoice <= D.dimensions[0] * D.dimensions[1]) {
        if(document.getElementsByClassName('n' + k * D.numChoice).length !== 0)
        elemList.push(document.getElementsByClassName('n' + k * D.numChoice));
        ++k;
    }
    return elemList;
}

var getSamePrimesCells = function(elemList) {
    // can be optimized
    numOfPrimes = D.numChoice - 1;
    for(let i = 1; i <= D.dimensions[0]*D.dimensions[1]; ++i) {
        if(document.getElementsByClassName('n' + i)) {
            if(getPrimes(i).length == numOfPrimes) {
                elemList.push(document.getElementsByClassName('n' + i));
            }
        }
    }
    return elemList;
}

var getSameFactorsCells = function(elemList) {
    // can be optimized
    let numOfFactors = D.numChoice;
    for(let i = 1; i <= D.dimensions[0]*D.dimensions[1]; ++i) {
        if(document.getElementsByClassName('n' + i)) {
            if(getFactors(getPrimes(i)).length == numOfFactors) {
                elemList.push(document.getElementsByClassName('n' + i));
            }
        }
    }
    return elemList;
}

var getCellsInSequence = function(elemList) {
    // tbf
    return elemList;
}

var changeBorderWidth = function() {
    let styleSheet = document.styleSheets[0];
    let size = D.borderWidth.toString() + 'px';
    // rule 1 refers to cells and rule 2 is for inner cells.
    // if CELLS have borders, then rule 1 should be changed.
    if(dState.cellsHaveBorders == true) {
        styleSheet.cssRules[1].style.border = size + " solid black";
    } else {
        styleSheet.cssRules[2].style.border = size + " solid black";
    }
}

var reSizeElements = function() {
    setContainerSize();
    setCellSize();
    if(dState.displayMode == 1) {
        setInnerCellSize();
    }
}

var setCellSize = function() {
    let styleSheet = document.styleSheets[0];
    let size = D.cellSize + 'px';
    styleSheet.cssRules[1].style.width = size;
    styleSheet.cssRules[1].style.height = size;
    styleSheet.cssRules[3].style.width = size;
    styleSheet.cssRules[3].style.height = size;
}

var setContainerSize = function() {
    let width = D.dimensions[0] * D.cellSize.toString() + "px";
    let height = D.dimensions[1] * D.cellSize.toString() + "px";
    let styleSheet = document.styleSheets[0];
    styleSheet.cssRules[0].style.width = width;
    styleSheet.cssRules[0].style.height = height;
}

var setBorderWidth = function() {
    let styleSheet = document.styleSheets[0];
    let size = D.borderWidth.toString() + 'px';
    styleSheet.cssRules[1].style["border-width"] = size;
    styleSheet.cssRules[2].style["border-width"] = size;
}

// LEVEL FOUR

var removeStyle = function(elem, n) {
    elem.className = "cell n" + n;
    elem.setAttribute('style', '');
    while(elem.firstChild) {
	elem.removeChild(elem.firstChild);
    }
}

var highlight_rules_i = function(elem, n) {
    elem.style["background-color"] = "red";
}

var PF_rules_i = function(elem, n) {
    let primes = getPrimes(n);
    elem.className = "outerCell n" + n;
    for(let i = 0; i < primes.length; ++i) {
        let div = document.createElement('div');
        div.style.height = D.cellSize;
        div.style.width = Math.floor(D.cellSize/primes.length);
        if(D.colorMode == 'colorful') {
            div.className = "innerCell nn" + primes[i];
        } else {
            div.className = "innerCell";
            let rgbValue = Math.floor(primes[i] * 5)
            div.style['background-color'] = "rgb("+rgbValue+","+rgbValue+","+rgbValue+")";
        }
        elem.appendChild(div);
    }
}

var numOfPrimes_rules_i = function(elem, n) {
    numOfPrimes = getPrimes(n).length;
    if(D.colorMode == 'colorful') {
        elem.className += " c" + numOfPrimes;
    } else {
        let rgbValue = Math.floor(numOfPrimes * 10);
        elem.style['background-color'] = "rgb("+rgbValue+","+rgbValue+","+rgbValue+")";
    }
}

var numOfFactors_rules_i = function(elem, n) {
    numOfFactors = getFactors(getPrimes(n)).length;
    if(D.colorMode == 'colorful') {
        elem.className += " c" + numOfFactors;
    } else {
        let rgbValue = Math.floor(numOfFactors * 10);
        elem.style['background-color'] = "rgb("+rgbValue+","+rgbValue+","+rgbValue+")";
    }
}

var sequenceValue_rules_i = function(elem, n) {
    if(D.colorMode == 'colorful') {
    } else {
    }
}

var userDefinedFunction_rules_i = function(elem, n) {
    if(D.colorMode == 'colorful') {
    } else {
    }
}

var highlight_rules_e = function(elem, n) {
    elem.style["border-color"] = "red";
}

var numOfPrimes_rules_e = function(elem, n) {
    numOfPrimes = getPrimes(n).length;
    if(D.colorMode == 'colorful') {
        elem.className += " ce" + numOfPrimes;
    } else {
        let rgbValue = Math.floor(numOfPrimes * 10);
        elem.style['border-color'] = "rgb("+rgbValue+","+rgbValue+","+rgbValue+")";
    }
}

var numOfFactors_rules_e = function(elem, n) {
    numOfFactors = getFactors(getPrimes(n)).length;
    if(D.colorMode == 'colorful') {
        elem.className += " ce" + numOfFactors;
    } else {
        let rgbValue = Math.floor(numOfFactors * 10);
        elem.style['border-color'] = "rgb("+rgbValue+","+rgbValue+","+rgbValue+")";
    }
}

var sequenceValue_rules_e = function(elem, n) {
    if(D.colorMode == 'colorful') {
    } else {
    }
}

var userDefinedFunction_rules_e = function(elem, n) {
    if(D.colorMode == 'colorful') {
    } else {
    }
}

var getSeed = function(dimensions, whichFirst) {
    let seed = [0,0];
    seed[0] = dimensions[0];
    seed[1] = dimensions[1];
    let wideGrid = (seed[1] <= seed[0]);
    switch (whichFirst) {
    case 'x':
        if(wideGrid) reduceArrayToSeed(0, 1, seed);
        else reduceArrayToSeed(0, 0, seed);
        break;
    case 'y':
        if(wideGrid) reduceArrayToSeed(1, 1, seed);
        else reduceArrayToSeed(1, 0, seed);
        break;
    }
    return seed;
}

var reduceArrayToSeed = function(a, b, seed) {
    // 'a' is 0 for wide grid, 1 for tall grid
    // 'b' is 0 for choice == x, 1 for choice == y. (choice of which to reduce first)
    if((seed[0] == 0) || (seed[1] == 0)) {
        return;
    }
    let flip = true
    let c = (a + 1) % 2
    while(seed[b] !== 1) {
        if(flip) {
            --seed[a];
            flip = false;
        } else {
            --seed[c];
            flip = true;
        }
    }
}

var getFirstLine = function(info, seed, i) {
    if(seed[1] < seed[0]) {
        // means that the grid is wider than taller
        for(; i.ref < seed[0] - 1; ++i.ref) {
            let newCoord = new Array;
            newCoord[0] = info.coordArray[i.ref][0] - 1;
            newCoord[1] = info.coordArray[i.ref][1];
            info.coordArray[i.ref + 1] = newCoord;
        }
        // if the grid is wider than tall then the first move is down
        // (direction = 0)
    } else {
        // means the grid is taller than wider
        for(; i.ref < seed[1] - 1; ++i.ref) {
            let newCoord = new Array;
            newCoord[0] = info.coordArray[i.ref][0];
            newCoord[1] = info.coordArray[i.ref][1] - 1;
            info.coordArray[i.ref + 1] = newCoord;
        }
        direction = 1;
        // if the grid is taller than it is wide then the first move is on the
        // right
    }
}

var addNextLine = function(a, b, c, d, i, info, runningDimensions) {
    let max = runningDimensions[0];
    if(a !== 0) max = runningDimensions[1];
    let j = 0;
    while(j < max) {
        if(j == 0) {
            let newCoord = new Array;
            newCoord[0] = info.coordArray[i.ref][0] + a;
            newCoord[1] = info.coordArray[i.ref][1] + b;
            info.coordArray[i.ref + 1] = newCoord;
            ++j, ++i.ref;
            if((info.coordArray[i.ref][0] <= info.topLeftCoord[0])
               && (info.coordArray[i.ref][1] >= info.topLeftCoord[1])) {
                info.topLeftCoord = info.coordArray[i.ref];
            }
        } else {
            let newCoord = new Array;
            newCoord[0] = info.coordArray[i.ref][0] + c;
            newCoord[1] = info.coordArray[i.ref][1] + d;
            info.coordArray[i.ref + 1] = newCoord;
            ++j, ++i.ref;
        }
    }
    if(a == 0) runningDimensions[1] += 1;
    else runningDimensions[0] += 1;
    if((info.coordArray[i.ref][0] <= info.topLeftCoord[0])
       && (info.coordArray[i.ref][1] >= info.topLeftCoord[1])) {
        info.topLeftCoord = info.coordArray[i.ref];
    }
}

// functions for calculating primes/factors
var validinput = function(number) { //returns bool
    if((number % 1) !== 0
       || number < 1) {
	return false;
    } else return true;
}

var getPrimes = function(number) {
    let primelist = new Array();
    if(validinput(number)) {
        primelist = primelist.concat(checksmalldivisors(number));
        let runningproduct = 1;
        for(let i = 0; i < primelist.length; ++i) {
	    runningproduct *= primelist[i];
        }
        if (runningproduct === number) {
	    return primelist;
        } else {
	    number /= runningproduct;
	    primelist = primelist.concat(checkbigdivisors(number));
	    return primelist;
        }
    } else return [1];
}

var checkbigdivisors = function(number) {
    let upperbound = Math.ceil(Math.sqrt(number));
    let i = 13;
    let bigdivisors = new Array();
    while(number !== 1) {
	if(i > upperbound) {
	    bigdivisors.push(number)
	    return bigdivisors;
	}
	if((number % i) !== 0) {
	    if((i % 6) === 1) {
		i += 4;
	    } else {
		i += 2;
	    }
	} else {
	    bigdivisors.push(i);
	    number /= i;
	}
    }
    return bigdivisors;
}

var checksmalldivisors = function(number) {
    let smalldivisors = new Array();
    while((number % 2) === 0){
	number /= 2;
	smalldivisors.push(2);
    }
    while((number % 3) === 0){
	number /= 3;
	smalldivisors.push(3);
    }
    while((number % 5) === 0){
	number /= 5;
	smalldivisors.push(5);
    }
    while((number % 7) === 0){
	number /= 7;
	smalldivisors.push(7);
    }
    while((number % 11) === 0){
	number /= 11;
	smalldivisors.push(11);
    }
    return smalldivisors;
}

var multiply = function(list, multiplier, n) {
    let multiples = new Array;
    for(let i = 1; i <= n; ++i) {
	for(let j = 0; j < list.length; ++j) {
	    multiples.push(list[j] * Math.pow(multiplier, i));
	}
    }
    return multiples;
}

var getFactors = function(primes) {
    let factors = [1];
    if(arraysEqual(primes, [1])){
        return factors;
    } else {
        let j = 1;
        while(j <= primes.length) {
	    let n = 1;
	    let multiplier = primes [j - 1];
	    let k = j;
	    for(k - 1; k < primes.length; ++k) {
	        if(primes[k - 1] == primes[k]) {
		    ++n;
	        } else {
		    break;
	        }
	    }
	    factors = factors.concat(multiply(factors, multiplier, n));
	    j += n;
        }
    }
    return factors;
}

//array comparison function
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    enumerable: false,
    value: function(obj) {
        var newArr = this.filter(function(el) {
          return el == obj;
        });
        return newArr.length > 0;
      }
  });
}

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length) {
        return false;
    }
    for(let i = 0; i <= arr1.length; ++i) {
        if(arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
