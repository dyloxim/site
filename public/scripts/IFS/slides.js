  let frames = [
    { // 0
      title:
      "The final result of the image generation process.",
      description: () =>
      "The image you've just generated is entirely determined the following set of equations:" + IFS.latex + "but how? How exactly are these functions used to generate the above image? That is what we are going to examine.",
      options: {},
      imageData: () => IFS.get(eval(preset), 5000000, frames[0].options),
    },
    { // I
      title:
      "I. The initial starting point",
      description: () => 
      "Yes, the image is generated from a handful (three, four, more perhaps) functions. What are these functions though? You can think of each function as representing a system of rules which tell you how to move points around. That is, if I have a point located in the top right of the image, where should I move it to? how about if it was in the top left?<br><br> Each function is a different set of rules describing exactly where each point should end up depending on where it started. That is why the first step in the image-generation process is to draw just one point. It is our first point. In the next step we will use the position of that first point to figure out where the second point should go, according to one of the functions.",
      options: {style: 'blobs', blobsSize: 3},
      imageData: () => IFS.get(eval(preset), 0, frames[1].options),
    },
    { // II
      title:
      "II. The very first iteration",
      description: () =>
      "This is the very core process. The initial position, marked in red, was fed into one of the functions and the new position (as determined by the function) was spat out - the new position now marked in black. But hang on, which function? There was more than one function in the definition, and if each one is a different set of rules - how was it decided which rules got used? Well that's the funny part of the algorithm - it was chosen at random. At each step in the process the function which is used gets selected randomly from the handful given in the beginning. Recall that our functions are given by:" + IFS.latex + "In thise case the <i>particular</i> function which decided where the black point went in <i>this</i> iteration was: $f_{" + (IFS.lastTransform + 1) +"(\\mathbf{x})}$. If you want to see what would have happened if a different set of rules was applied, click on the image to regenerate it and the function will be randomised again! <br><br> Note: Although the functions are chosen at random, some are chosen more often than others (so if you've regenerated the image a few times and got the same one each time that's probably why).",
      options: {style: 'lines', blobsSize: 3},
      imageData: () => IFS.get(eval(preset), 1, frames[2].options),
    },
    { // III
      title:
      "III. One more step, now with colour!",
      description: () => 
      "Picking up from where we left off, we choose another function at random. This time instead of moving the starting point like before, we work with the most recent position, after the last function was applied. The result is three dots, one where we started, one after the first (randomly chosen) function was applied, and then the last one after the new (also randomly chosen) function was used. We draw a line following the path made by our point. <br><br>For a little more clarity we have coloured the lines tracing each movement from one position to the next. The colour of each line should correspond with the colour of one of our functions shown here:" + IFS.latex,
      options: {style: 'lines', color: 'last', blobsSize: 3},
      imageData: () => IFS.get(eval(preset), 2, frames[3].options),
      // function call:
      // IFS.get(eval(preset), 5, {style: 'lines', color: 'last'});
    },
    { // IV
      title:
      "IV. 50 Steps in, some patterns emerge.",
      description: () =>
      "So now you get how it works - we choose a function at random, use it to calculate a new position based on the last one, then colour the path in-between according to which function was used. <br><br> Now you know how the process works, we can start cranking up the number of steps! Here we've done fifty steps, and the path is definitely random, but there's some order too. The same sorts of arcs traced out over and over. What do you think it will look like when we do even more?<br><br> The functions, for reference:" + IFS.latex,
      options: {style: 'lines', color: 'last', blobsSize: 3},
      imageData: () => IFS.get(eval(preset), 50, frames[4].options),
      // function call:
      // IFS.get(eval(preset), 10-1000, {style: 'lines', color: 'last'});
    },
    { // V
      title:
      "V. The output after 2000 of these random jumps",
      description: () =>
      "Pretty tangled! Is it what you expected? I've reduced the size of the blobs left at each stopping point so they are just little dots, that way you can see the lines better. The outline of the shape has been completely traced now, and as for what's going on in the middle - something interesting! While the lines are very helpful for visualising the process, they are of course absent from the final image so in the next step we will be removing them. <br><br> The functions, for reference:" + IFS.latex,
      options: {style: 'lines', color: 'last', blobsSize: 0},
      imageData: () => IFS.get(eval(preset), 100000, frames[5].options),
      // function call:
      // IFS.get(eval(preset), 10,0000, {style: 'lines', color: 'last'});
    },
    { // VI
      title:
      "VI. What you see when you remove all the connecting lines",
      description: () =>
      "You should just be able to make out the final form now, but a bit faint perhaps - turns out that with the lines removed 2000 iterations doesn't seem like so many after all. Note: when we removed the lines, we kept colour on the points - that is to say: each point is coloured according to which function was responsible for moving it to its current position from whichever position came before.<br><br> The functions, for reference:" + IFS.latex,
      options: {color: 'last'},
      imageData: () => IFS.get(eval(preset), 2000, frames[6].options),
    },
    { // VII
      title:
      "VII. From 2,000 to 100,000",
      description: () =>
      "The image is revealed! At this point the main work is done, the core process is not so complex actually. Of course, this image has colour and the original didn't, but it's for pedagogical purposes! I don't know about you, but when I first saw the pattern coloured like this, I was quite surprised. Something caught me off guard about how the colours segregate themselves into clearly defined regions like that. I think I expected them to be messier and mixed together more. (that does happen to be the case for some of the randomly generated IFSs however). You can see how different regions in the image correspond to specific functions from the definition. <br><br>The functions, for reference:" + IFS.latex,
      options: {color: 'last'},
      imageData: () => IFS.get(eval(preset), 100000, frames[7].options),
    },
    { // VIII
      title:
      "VIII. Superimposing the bounding boxes to indicate the different rules",
      description: () =>
      "To make that relationship (hopefully) even clearer, I've drawn a coloured box for each function which is supposed to give some indication of what it's really doing, let me explain what they mean: Look at the largest box, the black one. Now choose one of the coloured ones, and compare what you see in the big black box to the contents of the smaller, warped, coloured box. The contents of the smaller box should be a small copy of what was in the larger box! That's how the functions really work, you can describe their effect by drawing input/output boxes like this because they keep everything which is within and without in proportion to the change in shape and position of the box. Changing the numbers in the functions essentially correspons to changing the coordinates of these output boxes. <br><br>The functions, for reference:" + IFS.latex,
      options: {color: 'last', bboxes: true},
      imageData: () => IFS.get(eval(preset), 5000000, frames[8].options),
    },
    { // IX
      title:
      "IX. Ending where we started",
      description: () =>
      "Removing the colours and the boxes, and adding a few more iterations (now 250,000), we're back where we started. Now you know why the points seem to dance about just slightly every time the image is regenerated - because the randomness in the procedure makes each image unique, yet still they each reveal the same underlying pattern. I hope you found this exposition both interesting and clear! ",
      options: {color: 'last'},
      imageData: () => IFS.get(eval(preset), 5000000, frames[9].options),
    },
  ];
