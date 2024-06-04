// functions
// events / content
let slideNum = 0;
let preset = 'binaryTree';
let lockBox = document.getElementById('lock-box');
let presets = [...document.getElementById('presets').childNodes];
let loadPreset = (e) => {
  preset = e.target.alt;
  getFrame(frames[slideNum]);
}
for (index in presets) {
  if(presets[index].nodeName == 'INPUT') {
    presets[index].onclick = (e) => {
      for(indexB in presets) {
        presets[indexB].style = "background-color: #ddd; font-weight: lighter;"
      }
      e.target.style = "background-color: #ddd; font-weight: heavier;"
      preset = e.target.alt;
      console.log(preset);
      if (preset == 'random') {
        lockBox.style = "visibility: visible;";
      } else {
        lockBox.style = "visibility: hidden;";
      }
      getFrame(frames[slideNum]);
    };
  }
}
let frameDescriptionContainer = document.getElementsByName('frame-description-container');
let nextButton = document.getElementById('next-button');
let prevButton = document.getElementById('previous-button');
let frameDescription = document.getElementById('frame-description');
let frameTitle = document.getElementById('frame-title');
let checkBox = document.getElementById('check-box');
let frameCanvas;
let frameContext;
let slideControls = document.getElementById('slide-controls');
let canvasContainer = document.getElementById('canvas-container');
let options = 
    nextButton.onclick = () => { 
      slideNum = (slideNum + 1 + 10) % 10;
      getFrame(frames[slideNum]);
    };
prevButton.onclick = () => { 
  slideNum = (slideNum - 1 + 10) % 10;
  getFrame(frames[slideNum]);
};
const getFrame = (frame) => {
  if (canvasContainer.hidden == true) {
    canvasContainer.hidden = false;
    frameCanvas = document.createElement('canvas');
    canvasContainer.appendChild(frameCanvas);
    let containerWidth = window.screen.width;
    let containerHeight = window.screen.height;
    if (canvasContainer.offsetWidth < 490) {
      //MathJax.Hub.Config({
      //  CommonHTML: {
      //    scale: 50
      //  }
      //});
    }
    frameCanvas.style = "margin-right:auto; margin-left:auto; display:block;"
    let scale = 1.5;
    let displaySize =
        (containerWidth > containerHeight) ? containerHeight : containerWidth
    frameCanvas.style.width = displaySize + 'px';
    frameCanvas.style.height = displaySize + 'px';
    frameCanvas.width = scale * displaySize;
    frameCanvas.height = scale * displaySize;
    frameCanvas.id = "frame-canvas"
    frameCanvas.onclick = () => {
      if (checkBox.checked) { 
        frames[slideNum].options.new = false;
      } else {
        frames[slideNum].options.new = true;
      }
      paint(frameCanvas, frames[slideNum].imageData())
      frameDescription.innerHTML = frames[slideNum].description();
      MathJax.typesetPromise([frameDescription])
    };
  }
  slideControls.hidden = false;
  frameTitle.innerHTML = frame.title;
  if (preset == "random" || preset == "mapleLeaf") {
    IFS.defaultOptions.scale = 0.7;
  } else if (preset == "binaryTree") {
    IFS.defaultOptions.scale = 0.8;
  } else {
    IFS.defaultOptions.scale = 0.9;
  }
  if (checkBox.checked) { 
    frame.options.new = false;
  } else {
    frame.options.new = true;
  }
  paint(frameCanvas, frame.imageData());
  frameDescription.innerHTML = frame.description();
  MathJax.typesetPromise([frameDescription])
}
