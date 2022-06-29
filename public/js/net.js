///////////
// setup //
///////////

var canvas = document.getElementById("netCanvas");

// get the size of the document
// var win = window,
//     doc = document,
//     elem = doc.documentElement,
//     body = doc.getElementsByTagName('body')[0],
//     doc_width = win.innerWidth || elem.clientWidth || body.clientWidth,
//     doc_height = win.innerHeight|| elem.clientHeight|| body.clientHeight;
// var sidebar_size = ((doc_width >= 768)?250:0);

// state variables for the simulation
var voltage = [];             // array of arrays; membrane voltages
var spike = [];               // array of arrays; whether a spike happened in the last step
var input = [];               // array of arrays; synaptic inputs for each neuron
// synapses are formed with the 8 nearest neighbors
var weight = [];              // array of arrays of arrays; synaptic weights

var output = [];              // array of arrays; smoothed spike trains for the neurons
var showInfo = false;
var infoOpacity = 0.0;

var infoElem = document.getElementById("sketchDescription");

var buttons = [{
  imageName: '/public/img/info.png', image: null, position: [10, 10], onclick: function () {
    showInfo = !showInfo;
    if (showInfo) {
      infoElem.style.visibility = "visible";
      if (running)
        infoOpacity = 0.0;
      else
        infoOpacity = 1.0;
      infoElem.style.opacity = infoOpacity;
    } else {
      infoElem.style.visibility = "hidden";
    }
  },
  scale: 1.0,
  visible: true, size: null
},
{
  imageName: '/public/img/start_button.png', image: null, position: [-100, 10], onclick: startSketch,
  scale: 1.0, visible: false, size: null
},
{
  imageName: '/public/img/stop_button.png', image: null, position: [-100, 10], onclick: stopSketch,
  scale: 1.0, visible: true, size: null
}];

var explanation = "This is a simulation of a neural network with nearest-neighbor interactions and \
synaptic time-dependent plasticity (STDP). Each blob is a neuron and each neuron is connected with its \
8 nearest neighbors (up, down, left, right, and the diagonals). The color of the neuron, from black to bright \
red is indicative of its membrane potential. The membrane potential follows a noisy leaky-integrate-and-fire \
dynamics, with sharp resets and no refractory period. The relative timing of pre- and post-synaptic spikes \
is responsible for the change in synaptic weights: postsynaptic spikes preceded by presynaptic activity \
lead to potentiation, while the opposite order leads to depression. The mouse cursor (or touch on mobile \
devices) acts as a source: the neurons in a certain area around the cursor receive an input current with a \
Gaussian profile. The interplay between these input currents and the synaptic plasticity leads to very \
interesting effects -- give it a try!";

function loadButtons(processing) {
  for (var i = 0; i < buttons.length; ++i) {
    buttons[i].image = processing.requestImage(buttons[i].imageName);
  }
}

function drawButtons(processing) {
  for (var i = 0; i < buttons.length; ++i) {
    var img = buttons[i].image;
    if (img && img.width > 0) {
      var w = img.width * buttons[i].scale;
      var h = img.height * buttons[i].scale;

      buttons[i].size = [w, h];

      if (buttons[i].visible) {
        var x = buttons[i].position[0];
        var y = buttons[i].position[1];
        if (x < 0) x += processing.width;
        if (y < 0) y += processing.height;

        processing.image(img, x, y, w, h);
      }
    }
  }
}

function handleButtonClick(processing, x, y) {
  for (var i = 0; i < buttons.length; ++i) {
    if (!buttons[i].visible || buttons[i].onclick === null) continue;

    var bx = buttons[i].position[0];
    var by = buttons[i].position[1];
    if (bx < 0) bx += processing.width;
    if (by < 0) by += processing.height;

    if (x >= bx && y >= by && x < bx + buttons[i].size[0] && y < by + buttons[i].size[1]) {
      buttons[i].onclick();
      processing.redraw();
      break;
    }
  }
}

//////////////////////////////////////////
// here goes the actual simulation code //
//////////////////////////////////////////

function sketchProc(processing) {
  // var px_width = Math.floor((doc_width - sidebar_size) * 0.9),
  //   px_height = Math.floor(px_width / 2);

  var div = document.getElementById("netContainer");
  // div.style.width = px_width + "px";
  // div.style.height = px_height + "px";

  var px_width = div.offsetWidth, px_height = px_width / 2;

  var dev_width = px_width * window.devicePixelRatio;
  var dev_height = px_height * window.devicePixelRatio;

  neuron_size_dev = neuron_size_px * window.devicePixelRatio;
  lattice_dev = lattice_px * window.devicePixelRatio;

  processing.size(dev_width, dev_height);

  canvas.style.width = px_width + "px";
  canvas.style.height = px_height + "px";

  // infoElem.style.top = 82.0 / window.devicePixelRatio + "px";

  // figure out how many neurons we'll have, and create their potentials
  m = Math.floor(px_width / lattice_px);
  n = Math.floor(px_height / lattice_px);

  var i, j;
  var w0 = total_weight / 6.8;
  // use a 1-neuron edge of virtual neurons to make connectivity calculations easier
  for (i = 0; i <= m + 1; ++i) {
    voltage.push([]);
    spike.push([]);
    weight.push([]);
    input.push([]);
    output.push([]);
    for (j = 0; j <= n + 1; ++j) {
      voltage[i].push(0.0);
      spike[i].push(false);
      input[i].push(0.0);
      output[i].push(0.0);
      // order of weights: N, NE, E, SE, S, SW, W, NW
      weight[i].push([w0, 0.7 * w0, w0, 0.7 * w0, w0, 0.7 * w0, w0, 0.7 * w0]);
    }
  }

  processing.setup = function () {
    loadButtons(processing);
  }

  processing.drawNeuron = function (i, j, v) {
    if (spike[i][j]) {
      processing.fill(255.0, 10, 10);
    } else {
      processing.fill(200.0 * v / v_theta, 10, 10);
    }
    processing.noStroke();
    processing.ellipseMode(processing.CENTER);
    i -= 0.5;
    j -= 0.5;
    processing.ellipse(i * lattice_dev, j * lattice_dev, neuron_size_dev, neuron_size_dev);
  }

  processing.drawLink = function (i, j, k1, k2, w) {
    processing.stroke(255.0 * w / total_weight, 0, 0);
    processing.line(i * lattice_dev, j * lattice_dev, (i + k1) * lattice_dev, (j + k2) * lattice_dev);
  }

  processing.drawNet = function () {
    for (i = 1; i <= m; ++i) {
      for (j = 1; j <= n; ++j) {
        processing.drawNeuron(i, j, voltage[i][j]);
      }
    }

    // XXX draw connections?
    /*    processing.noFill();
        for (i = 1; i <= m; ++i) {
          for (j = 1; j <= n; ++j) {
            // order of weights: N, NE, E, SE, S, SW, W, NW
            processing.drawLink(i, j, -1, 0, weight[i][j][0]);
            processing.drawLink(i, j, -1, 1, weight[i][j][1]);
            processing.drawLink(i, j, 0, 1, weight[i][j][2]);
            processing.drawLink(i, j, 1, 1, weight[i][j][3]);
            processing.drawLink(i, j, 1, 0, weight[i][j][4]);
            processing.drawLink(i, j, 1, -1, weight[i][j][5]);
            processing.drawLink(i, j, 0, -1, weight[i][j][6]);
            processing.drawLink(i, j, -1, -1, weight[i][j][7]);
          }
        }*/
  }

  processing.touchStart = function (e) {
    touching = true;
  }

  processing.touchEnd = function (e) {
    touching = false;
    if (e.changedTouches.length > 0)
      lastTouch = new PVector(e.changedTouches[0].offsetX, e.changedTouches[0].offsetY);
    handleButtonClick(processing,
      lastTouch.x * window.devicePixelRatio,
      lastTouch.y * window.devicePixelRatio);
  }

  processing.touchCancel = function (e) {
    touching = false;
  }

  processing.touchMove = function (e) {
    lastTouch = new PVector(e.touches[0].offsetX, e.touches[0].offsetY);
  }

  processing.animate = function (dt) {
    // neural dynamics
    var i, j;

    // start by calculating synaptic inputs
    for (i = 1; i <= m; ++i) {
      for (j = 1; j <= n; ++j) {
        // order of weights: N, NE, E, SE, S, SW, W, NW
        input[i][j] += weight[i][j][0] * spike[i - 1][j] +
          weight[i][j][1] * spike[i - 1][j + 1] +
          weight[i][j][2] * spike[i][j + 1] +
          weight[i][j][3] * spike[i + 1][j + 1] +
          weight[i][j][4] * spike[i + 1][j] +
          weight[i][j][5] * spike[i + 1][j - 1] +
          weight[i][j][6] * spike[i][j - 1] +
          weight[i][j][7] * spike[i - 1][j - 1];
        input[i][j] -= dt * input[i][j] / tau_s;

        if (have_stdp)
          output[i][j] += spike[i][j] - dt * output[i][j] / tau_stdp;
      }
    }

    // now update voltages and synaptic weights
    var rad2 = mouse_rad_idx * mouse_rad_idx;
    for (i = 1; i <= m; ++i) {
      for (j = 1; j <= n; ++j) {
        var from_mouse = 0;
        if (mouse_inside || touching) {
          var dx, dy;
          if (mouse_inside) {
            dx = processing.mouseX / lattice_px - i;
            dy = processing.mouseY / lattice_px - j;
          } else if (touching) {
            dx = lastTouch.x / lattice_px - i;
            dy = lastTouch.y / lattice_px - i;
          }
          var dist2 = dx * dx + dy * dy;
          from_mouse = (mouse_size * dt) * Math.exp(-0.5 * dist2 / rad2);
        }

        // XXX this should be gaussian
        var noise = Math.sqrt(dt) * noise_size * (2 * Math.random() - 1);
        voltage[i][j] += -dt * voltage[i][j] / tau_m + noise + from_mouse + input[i][j];
        if (voltage[i][j] > v_theta) {
          // XXX spike
          voltage[i][j] = 0.0;
          spike[i][j] = true;

          // update synaptic weights
          if (have_stdp) {
            // acting as postsynaptic spike --> potentiation
            // order of weights: N, NE, E, SE, S, SW, W, NW
            weight[i][j][0] += stdp_ap * output[i - 1][j];
            weight[i][j][1] += stdp_ap * output[i - 1][j + 1];
            weight[i][j][2] += stdp_ap * output[i][j + 1];
            weight[i][j][3] += stdp_ap * output[i + 1][j + 1];
            weight[i][j][4] += stdp_ap * output[i + 1][j];
            weight[i][j][5] += stdp_ap * output[i + 1][j - 1];
            weight[i][j][6] += stdp_ap * output[i][j - 1];
            weight[i][j][7] += stdp_ap * output[i - 1][j - 1];

            // acting as presynaptic spike --> depression
            weight[i + 1][j][0] -= stdp_am * output[i + 1][j];
            weight[i + 1][j - 1][1] -= stdp_am * output[i + 1][j - 1];
            weight[i][j - 1][2] -= stdp_am * output[i][j - 1];
            weight[i - 1][j - 1][3] -= stdp_am * output[i - 1][j - 1];
            weight[i - 1][j][4] -= stdp_am * output[i - 1][j];
            weight[i - 1][j + 1][5] -= stdp_am * output[i - 1][j + 1];
            weight[i][j + 1][6] -= stdp_am * output[i][j + 1];
            weight[i + 1][j + 1][7] -= stdp_am * output[i + 1][j + 1];

            // now normalize the weights
            /*            var k1, k2;
                        for (k1 = -1; k1 <= 1; ++k1) {
                          for (k2 = -1; k2 <= 1; ++k2) {
                            // now normalize the weights!
                            var k;
                            var sum = 0;
                            crt_weights = weight[i+k1][j+k2];
                            for (k = 0; k < 8; ++k) {
                              sum += crt_weights[k];
                            }
                            var scale = total_weight/sum;
                            for (k = 0; k < 8; ++k) {
                              crt_weights[k] *= scale;
                            }
                          }
                        }*/
          }
        } else {
          spike[i][j] = false;
        }
      }
    }
  }

  processing.mouseOver = function () {
    mouse_inside = true;
  }

  processing.mouseOut = function () {
    mouse_inside = false;
  }

  processing.mouseClicked = function () {
    handleButtonClick(processing,
      processing.mouseX * window.devicePixelRatio,
      processing.mouseY * window.devicePixelRatio);
  }

  processing.draw = function () {
    var width = processing.width;
    var height = processing.height;

    processing.background(255);

    // figure out how long it's been since last update
    var dt = 0.0;
    if (last_display >= 0) {
      dt = processing.millis() - last_display;
    }
    last_display = processing.millis();

    // but don't jump too far
    if (dt > max_dt)
      dt = max_dt;

    // draw the net
    processing.drawNet();

    // draw the buttons
    drawButtons(processing);

    if (showInfo && infoOpacity < 1.0) {
      infoOpacity += 0.25;
      infoElem.style.opacity = infoOpacity;
    }

    // draw the information text
    /*    if (showInfo) {
          processing.stroke(32);
          processing.fill(255, 255, 255, 240);
    
          var info_x = 150;
          var info_y = 150;
          var info_w = processing.width - 2*info_x;
          var info_h = processing.height - 2*info_y;
    
          var border = 24;
    
          processing.rect(info_x, info_y, info_w, info_h);
    
          processing.noStroke();
          processing.fill(16);
          processing.textSize(32);
          processing.text(explanation, info_x+border, info_y+border, info_w-border, info_h-border);
        }*/


    // run the dynamics
    if (running)
      processing.animate(dt / 1000.0);
  }
}

//////////////////////////////////////////
// initial conditions and other options //
//////////////////////////////////////////

// simulation parameters
var lattice_px = 15;          // size in pixels of lattice constant; sets number of neurons
var tau_m = 0.2;            // membrane time constant (s)
var tau_s = 0.5;            // time constant of EPSP
var v_theta = 10.0;           // threshold potential (mV)
var noise_size = 15.0;      // magnitude of noise
var mouse_size = 1000.0;       // maximum activation due to mouse position (per s)
var mouse_rad_idx = 1.0;      // how far mouse activation works, in lattice constants
var total_weight = 0.5;      // sum of synaptic weights for each neuron
var tau_stdp = 1.0;           // time constant for STDP
var have_stdp = true;         // whether to do STDP
var stdp_ap = 1.0;            // size of synaptic potentiation
var stdp_am = 1.0;            // ...and depression

var m = 0;                    // number of rows and columns of neurons
var n = 0;

// display-related constants
var neuron_size_px = 10;      // diameter of each neuron
var max_dt = 100;             // maximum time step (ms)

// display-related variables
var neuron_size_dev = 10;     // dimensions in device coordinates
var lattice_dev = 15;

var mouse_inside = false;     // whether the mouse is over the canvas

var last_display = -1;        // last display time
var running = false;          // whether the simulation is running

var touching = false;         // whether finger is touching
var lastTouch = new PVector(0.0, 0.0);

////////////////
// final bits //
////////////////

function startSketch() {
  last_display = processingInstance.millis();
  buttons[1].visible = false;
  buttons[2].visible = true;

  running = true;

  processingInstance.loop();
}

function stopSketch() {
  running = false;
  buttons[1].visible = true;
  buttons[2].visible = false;
  processingInstance.noLoop();
  processingInstance.redraw();
}

function flipSketch() {
  if (running)
    stopSketch();
  else
    startSketch();
}

function initSketch() {
  running = true;
  processingInstance = new Processing(canvas, sketchProc);
}

var processingInstance;
