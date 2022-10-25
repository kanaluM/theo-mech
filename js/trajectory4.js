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

const min_y = parseInt(document.getElementById("y-slider").min);
const max_y = parseInt(document.getElementById("y-slider").max);
var y1 = parseInt(document.getElementById("y-slider").value);

const y0 = 0;
const yf = 0;
const t0 = 0;
const t1 = 10;
const tf = 20;

/////////////////////////////////////////////////
/* CANVAS ANIMATIONS */
/////////////////////////////////////////////////

// wrapper function to start animations
function startAnimation(t, y) {
    // 1D projectiles
    param1D = new component(10, 10, "orange", CANVAS_WIDTH/3, transformYCoord(y_initial), 1, t, y);
    actual1D = new component(10, 10, "purple", 2*CANVAS_WIDTH/3, transformYCoord(y_initial), 2, t, y);
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
function component(width, height, color, x, y, type, t1, y1) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.t1 = t1;
    this.y1 = y1;

    this.update = function(){
        animArea.context.fillStyle = this.color;
        animArea.context.fillRect(this.x, transformYCoord(this.y), this.width, this.height);
    }

    this.newPos = function(t) {
        if (this.type == 1) {   // param 1D
            if (t < t1) {this.y = y0 + ((this.y1 - y0 + 0.5 * g * (this.t1-t0) ** 2) / (this.t1 - t0)) * (t - t0) - 0.5 * g * (t - t0) ** 2;}
            else if (t > t1) {this.y = this.y1 + ((yf - this.y1 + 0.5 * g * (tf-this.t1) ** 2) / (tf - this.t1)) * (t - this.t1) - 0.5 * g * (t - this.t1) ** 2;}
            else {this.y = this.y1;}
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
    if (animArea.time >= tf) {endAnimation();}
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
  domain: {lower: 0, upper: tf},
  xLabel: "Time",
  range: {lower: 0, upper: 200},
  yLabel: "Displacement"};
const position_plot = createPlot(position_input);
var x_actual_line = position_plot.svg.append("g").attr("id", "x-actual-line");
var x_parameterized_line = position_plot.svg.append("g").attr("id", "x-parameterized-line");

y_point = position_plot.svg.append("circle")
.attr("id", "fixed-point").attr("r", 3).attr("fill", "red")
.attr("cx", position_plot.xScale(t1)).attr("cy", position_plot.yScale(y1));

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
function action(y) {
  c = (y + 100) / 10;
  d = (100 - y) / 10;
  s1 = -((c-20)**3 - c**3)/12 - 2*(c*50-(1000/3));
  s2 = -((d-20)**3 - d**3)/12 - 2*(10*y + 50*d - (1000/3));
  return s1 + s2;
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
const integral_data = integralData();

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
plotIntegral();
plotIntegralPoints(y1);


/////////////////////////////////////////////////
/* EVENT LISTENERS */
/////////////////////////////////////////////////

document.getElementById("y-slider").oninput = function() {
    y1 = parseInt(document.getElementById("y-slider").value);
    document.getElementById("print-y").innerHTML = y1;
    y_point.attr("cy", position_plot.yScale(y1));
    plotIntegralPoints(y1);
}

document.getElementById("y-slider").onchange = function() {
    y1 = parseInt(document.getElementById("y-slider").value);
    document.getElementById("print-y").innerHTML = y1;
    y_point.attr("cy", position_plot.yScale(y1));
    plotIntegralPoints(y1);
    endAnimation();
    startAnimation(t1, y1);
}



