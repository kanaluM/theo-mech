# Theoretical Mechanics Applets
# by Kanalu Monaco
# Summer '22

See the trajectory.js file for very well-commented code that will hopefully help introduce you to how I built these applets.

I used raw JavaScript for the vast majority of the things I built, and hopefully this will make things easier for future coders to use

If you are just starting to learn HTML, JavaScript, and CSS, use the Internet! 
The Internet will be your friend

Some common JavaScript mistakes I ran into:
    - Don't forget semicolons and brackets!
    - Sometimes HTML sliders will give you strings instead of numbers, 
    so you might have to use the parseInt() function to convert a 
    slider's value into an integer
    - Use console.log() to print things to the console for debugging.
    I use Google Chrome on a Mac and can view lots of important things
    like the console and errors in the inspector (command + option + i). You should
    always leave the inspector open so you can see what errors are happening
    - Almost always declare variables with "var" (if the variable can change) or 
    "const" (if the value will stay constant). Don't use "let" unless you actually 
    know what it means

To make graphs and animations in JavaScript, I used SVG (scalable graphics vector) and CANVAS elements
SVGs images are created using parameterized curves and are sharp no matter how zoomed in you are, 
but they cannot handle as much data as a canvas.
A canvas draws pixel by pixel and is suited to handle lots of image data.
I used SVGs for graphing smooth curves (with the help of the library d3) 
and canvases for creating animations of physical systems.
You can also look at the HTML file to see where the canvases are.
