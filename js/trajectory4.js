/////////////////////////////////////////////////
/* Parameters */
/////////////////////////////////////////////////

const CANVAS_WIDTH = 170;
const CANVAS_HEIGHT = 280;
document.getElementById("projectile-motion-canvas").style.width = `${CANVAS_WIDTH}px`;
document.getElementById("projectile-motion-canvas").style.height = `${CANVAS_HEIGHT}px`;

const SVG_WIDTH = 270;
const SVG_HEIGHT = 300;

const TRANSITION_TIME = 10; // ms
const FRAME_RATE = 1; // ms
const dt = 0.01;

const x_initial = 0;
const y_initial = 0;

const g = 2;
const m = 1;

const min_y = parseInt(document.getElementById("y1-slider").min);
const max_y = parseInt(document.getElementById("y1-slider").max);

var yList = [0, 
              parseInt(document.getElementById("y1-slider").value), 
              parseInt(document.getElementById("y2-slider").value), 
              parseInt(document.getElementById("y3-slider").value), 
              parseInt(document.getElementById("y4-slider").value),  
              parseInt(document.getElementById("y5-slider").value), 
              0];

// var y1 = parseInt(document.getElementById("y1-slider").value);
// var y2 = parseInt(document.getElementById("y2-slider").value);
// var y3 = parseInt(document.getElementById("y3-slider").value);
// var y4 = parseInt(document.getElementById("y4-slider").value);
// var y5 = parseInt(document.getElementById("y5-slider").value);

const tList = [0, 3, 6, 10, 14, 17, 20];

// const t1 = 3;
// const t2 = 6;
// const t3 = 10;
// const t4 = 14;
// const t5 = 17;

// const y0 = 0;
// const yf = 0;
// const t0 = 0;
// const tf = 20;

/////////////////////////////////////////////////
/* CANVAS ANIMATIONS */
/////////////////////////////////////////////////

// wrapper function to start animations
function startAnimation() {
    // 1D projectiles
    param1D = new component(10, 10, "orange", CANVAS_WIDTH/3, transformYCoord(y_initial), 1);
    actual1D = new component(10, 10, "purple", 2 * CANVAS_WIDTH/3, transformYCoord(y_initial), 2);
    animArea.start();
}

// wrapper function to end animations
function endAnimation() {
    animArea.stop();
}

// parameterized coord -> canvas coord
function transformXCoord(x) {
    // 0 -> 20
    // 20 -> CANVAS_WIDTH - 20
    return 20 + x * (CANVAS_WIDTH - 40) / 20;
}

// parameterized coord -> canvas coord
function transformYCoord(y) {
    // -500 -> CANVAS_HEIGHT
    // 1000 -> 0
    return CANVAS_HEIGHT - (y + 500) * CANVAS_HEIGHT / 1500;
}

// JS object for both canvases
var animArea = {
    parameterized_data: [],
    actual_data: [],
    panel: document.getElementById("projectile-motion-canvas"),
    start: function(){
        this.panel.width = CANVAS_WIDTH;
        this.panel.height = CANVAS_HEIGHT;
        this.context = this.panel.getContext("2d");
        this.time = 0;   
        this.interval = setInterval(updateFrame, FRAME_RATE);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.panel.width, this.panel.height);
        }, 
    stop : function() {
        this.time = 0;
        this.parameterized_data = [];
        this.actual_data = [];
        clearInterval(this.interval); 
    },
}

// to create projectiles
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;

    this.update = function(){
        animArea.context.fillStyle = this.color;
        animArea.context.fillRect(this.x, transformYCoord(this.y), this.width, this.height);
    }

    this.newPos = function(t) {
        // var prevY, currY, prevT, currT;
        if (this.type == 1) {   // param 1D
            var i;
            if (t < tList[1]) {
              i = 1;
            } else if (t == tList[1]) {
              this.y = yList[1];
              return; 
            } else if (t < tList[2]) {
              i = 2;
            } else if (t == tList[2]) {
              this.y = yList[2];
              return;
            } else if (t < tList[3]) {
              i = 3;
            } else if (t == tList[3]) {
              this.y = yList[3];
              return;
            } else if (t < tList[4]) {
              i = 4;
            } else if (t == tList[4]) {
              this.y = yList[4];
              return;
            } else if (t < tList[5]) {
              i = 5;
            } else if (t == tList[5]) {
              this.y = yList[5];
              return;
            } else if (t < tList[6]) {
              i = 6;
            } else if (t >= tList[6]) {
              this.y = yList[6];
              return;
            }

            this.y = yList[i-1] + ((yList[i] - yList[i-1] + 0.5 * g * (tList[i] - tList[i-1]) ** 2) / (tList[i] - tList[i-1])) * (t - tList[i-1]) - 0.5 * g * (t - tList[i-1]) ** 2;

            // if (t < t1) {
            //   prevY = y0;
            //   currY = y1
            //   prevT = t0;
            //   currT = t1;
            // } else if (t == t1) {
            //   this.y = y1;
            //   return; 
            // } else if (t < t2) {
            //   prevY = y1;
            //   currY = y2;
            //   prevT = t1;
            //   currT = t2;
            // } else if (t == t2) {
            //   this.y = y2;
            //   return;
            // } else if (t < t3) {
            //   prevY = y2;
            //   currY = y3;
            //   prevT = t2;
            //   currT = t3;
            // } else if (t == t3) {
            //   this.y = y3;
            //   return;
            // } else if (t < t4) {
            //   prevY = y3;
            //   currY = y4;
            //   prevT = t3;
            //   currT = t4;
            // } else if (t == t4) {
            //   this.y = y4;
            //   return;
            // } else if (t < t5) {
            //   prevY = y4;
            //   currY = y5;
            //   prevT = t4;
            //   currT = t5;
            // } else if (t == t5) {
            //   this.y = y5;
            //   return;
            // } else if (t < tf) {
            //   prevY = y5;
            //   currY = yf;
            //   prevT = t5;
            //   currT = tf;
            // } else if (t >= tf) {
            //   this.y = yf;
            //   return;
            // }
            // this.y = prevY + ((currY - prevY + 0.5 * g * (currT - prevT) ** 2) / (currT - prevT)) * (t - prevT) - 0.5 * g * (t - prevT) ** 2;

        } else if (this.type == 2) {   // actual 1D
            // y = v0 t - t**2     v0 = Math.sqrt(2*g*this.y)
            this.y = t * (20 - t);
        }
    }
}

// create frames for animation
function updateFrame() {
    // clear frame and move to next
    animArea.clear();
    animArea.time += dt;

    // add ground
    animArea.context.fillStyle = "black";
    animArea.context.fillRect(20, transformYCoord(-0.05), CANVAS_WIDTH-40, 3);

    // update projectile positions
    param1D.newPos(animArea.time);
    actual1D.newPos(animArea.time);
    animArea.parameterized_data.push({x: animArea.time, y: param1D.y});
    animArea.actual_data.push({x: animArea.time, y: actual1D.y});

    // update plots
    param1D.update();
    actual1D.update();
    plotPosition(animArea.actual_data, animArea.parameterized_data);

    // add text
    animArea.context.font = "20px Arial";
    animArea.context.fillStyle = "black";
    animArea.context.fillText("Projectile Motion", 10, 30);

    // end animation when t = 20
    if (animArea.time >= tList[6]) {endAnimation();}
}


/////////////////////////////////////////////////
/* MASTER GRAPHING CAPABILITY */
/////////////////////////////////////////////////

// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 50, left: 60 },
  width = SVG_WIDTH - margin.left - margin.right,
  height = SVG_HEIGHT - margin.top - margin.bottom;

// plots some data
function plotData(input) {

  // Update the line
  var u = input.line.selectAll(".line").data([input.data], d => input.xScale(d.x));

  u.enter()
    .append("path")
    .attr("class", "line")
    .merge(u)
    .transition()
    .duration(TRANSITION_TIME)
    .attr("d", d3.line()
        .x((d) => input.xScale(d.x))
        .y((d) => input.yScale(d.y))
    )
    .attr("fill", "none")
    .attr("stroke", input.color)
    .attr("stroke-width", 1.5);
}

// creates svg element for a plot
function createPlot(input) {
  // append the svg object to the body of the page
  var svg = d3
    .select(input.divID)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", input.divID)
    .attr("class", "plot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // initialize an x-axis scaling function
  var xScale = d3.scaleLinear().domain([input.domain.lower, input.domain.upper]).range([0, width]);

  // add x-axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")
    .call(d3.axisBottom(xScale));

  // add x-axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 20)
    .text(input.xLabel);

  // initialize a y-axis scaling function
  var yScale = d3.scaleLinear().domain([ input.range.lower, input.range.upper ]).range([height, 0]);
  
  // add y-axis
  svg.append("g")
    .attr("class","myYaxis")
    .call(d3.axisLeft(yScale));

  // add y-axis label
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top)
    .text(input.yLabel)

  return {svg: svg, xScale: xScale, yScale: yScale};
}

// POSITION
const position_input = {
  divID: "#position-graph",
  svgID: "svg-for-position-plots",
  domain: {lower: 0, upper: tList[tList.length - 1]},
  xLabel: "Time",
  range: {lower: 0, upper: 200},
  yLabel: "Displacement"};
const position_plot = createPlot(position_input);
var x_actual_line = position_plot.svg.append("g").attr("id", "x-actual-line");
var x_parameterized_line = position_plot.svg.append("g").attr("id", "x-parameterized-line");

y1_point = position_plot.svg.append("circle")
.attr("id", "fixed-point").attr("r", 3).attr("fill", "red")
.attr("cx", position_plot.xScale(tList[1])).attr("cy", position_plot.yScale(yList[1]));

y2_point = position_plot.svg.append("circle")
.attr("id", "fixed-point").attr("r", 3).attr("fill", "red")
.attr("cx", position_plot.xScale(tList[2])).attr("cy", position_plot.yScale(yList[2]));

y3_point = position_plot.svg.append("circle")
.attr("id", "fixed-point").attr("r", 3).attr("fill", "red")
.attr("cx", position_plot.xScale(tList[3])).attr("cy", position_plot.yScale(yList[3]));

y4_point = position_plot.svg.append("circle")
.attr("id", "fixed-point").attr("r", 3).attr("fill", "red")
.attr("cx", position_plot.xScale(tList[4])).attr("cy", position_plot.yScale(yList[4]));

y5_point = position_plot.svg.append("circle")
.attr("id", "fixed-point").attr("r", 3).attr("fill", "red")
.attr("cx", position_plot.xScale(tList[5])).attr("cy", position_plot.yScale(yList[5]));

// update position plot
function plotPosition(actual, parameterized) {

    // prepare input for actual displacement plot
    var input = {
      data: actual,
      svg: position_plot.svg,
      line: x_actual_line,
      xScale: position_plot.xScale,
      yScale: position_plot.yScale,
      color: "blue"};
  
    // plot the data
    plotData(input);
  
    // prepare input for parameterized displacement plot
    input = {
      data: parameterized,
      svg: position_plot.svg,
      line: x_parameterized_line,
      xScale: position_plot.xScale,
      yScale: position_plot.yScale,
      color: "red"};
  
    // plot the data
    plotData(input);
}

// calculate action
function action() {
  var ki = 0;
  var pi = 0;
  for (let i=1; i < yList.length; i++) {
    let kConst = (yList[i]-yList[i-1]+0.5*g*(tList[i]-tList[i-1])**2)/(tList[i]-tList[i-1]);
    ki += (kConst - g*(tList[i]-tList[i-1]))**3 - kConst**3;

    let pConst = (yList[i]-yList[i-1]+0.5*g*(tList[i]-tList[i-1])**2)/(tList[i]-tList[i-1]);
    pi += yList[i-1]*tList[i] + pConst*(tList[i]-tList[i-1])**2-g*(tList[i]-tList[i-1])**3/6 - yList[i-1]*tList[i-1];
  }
  return -m*ki/(6*g) - m*g*pi;
}

// generate all integral data
function integralData() {
  var s_data = [];
  for (let cy = min_y; cy <= max_y; cy++) {
      s_data.push({x: cy, y: action(cy)});
  }
  return {s: s_data};
}

// CALCULATE ALL DATA ON LOAD
// const integral_data = integralData();

// INTEGRAL OF ENERGY
const integral_input = {
  divID: "#integral-graph",
  svgID: "svg-for-integral-plots",
  domain: {lower: min_y, upper: max_y},
  xLabel: "y coord",
  range: {lower: -2000, upper: 0},
  yLabel: "Integral of Energy (dt)"};
const integral_plot = createPlot(integral_input);
var si_line = integral_plot.svg.append("g").attr("id", "action-line");
var si_point = integral_plot.svg.append("circle")
.attr("id", "action-point").attr("r", 3).attr("fill", "blue");

// integral plots initialized only on load
function plotIntegral() {

  // prepare input
  var input = {
      data: integral_data.s,
      svg: integral_plot.svg,
      line: si_line,
      xScale: integral_plot.xScale,
      yScale: integral_plot.yScale,
      color: "blue"};
  
  // plot the data
  plotData(input);
}

// updates integral points
function plotIntegralPoints(cy) {

  // x-axis is control point cy
  si_point.attr("cx", integral_plot.xScale(cy));

  // y-axis is integral energy
  let si = integral_data["s"][cy].y;
  si_point.attr("cy", integral_plot.yScale(si));
}

// PLOT ON LOAD
// plotIntegral();
// plotIntegralPoints(y1);


/////////////////////////////////////////////////
/* EVENT LISTENERS */
/////////////////////////////////////////////////

function updateSliderInfo(x) {
    yList[x] = parseInt(document.getElementById(`y${x}-slider`).value);
    document.getElementById(`print-y${x}`).innerHTML = yList[x];
    if (x == 1) {y1_point.attr("cy", position_plot.yScale(yList[x]));}
    else if (x == 2) {y2_point.attr("cy", position_plot.yScale(yList[x]));}
    else if (x == 3) {y3_point.attr("cy", position_plot.yScale(yList[x]));}
    else if (x == 4) {y4_point.attr("cy", position_plot.yScale(yList[x]));}
    else if (x == 5) {y5_point.attr("cy", position_plot.yScale(yList[x]));}
    document.getElementById("debug").innerHTML = parseInt(action());
}


document.getElementById("y1-slider").oninput = function() {
    updateSliderInfo(1);
}

document.getElementById("y1-slider").onchange = function() {
    updateSliderInfo(1);
    endAnimation();
    startAnimation();
}

document.getElementById("y2-slider").oninput = function() {
  updateSliderInfo(2);
}

document.getElementById("y2-slider").onchange = function() {
  updateSliderInfo(2);
  endAnimation();
  startAnimation();
}

document.getElementById("y3-slider").oninput = function() {
  updateSliderInfo(3);
}

document.getElementById("y3-slider").onchange = function() {
  updateSliderInfo(3);
  endAnimation();
  startAnimation();
}

document.getElementById("y4-slider").oninput = function() {
  updateSliderInfo(4);
}

document.getElementById("y4-slider").onchange = function() {
  updateSliderInfo(4);
  endAnimation();
  startAnimation();
}

document.getElementById("y5-slider").oninput = function() {
  updateSliderInfo(5);
}

document.getElementById("y5-slider").onchange = function() {
  updateSliderInfo(5);
  endAnimation();
  startAnimation();
}



