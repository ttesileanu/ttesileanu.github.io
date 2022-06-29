///////////
// setup //
///////////

var canvas = document.getElementById("springCanvas");

// get the size of the document
// var win = window,
//     doc = document,
//     elem = doc.documentElement,
//     body = doc.getElementsByTagName('body')[0],
//     doc_width = win.innerWidth || elem.clientWidth || body.clientWidth,
//     doc_height = win.innerHeight|| elem.clientHeight|| body.clientHeight;
// var sidebar_size = ((doc_width >= 768)?250:0);

// state variables for the simulation
var ms = [];                  // ball masses
var pos = [];                 // positions of balls
var vel = [];                 // ball velocities
var movable = [];             // whether balls are movable or not

var spring_left = [];         // spring left end (corresponding ball index)
var spring_right = [];        // spring right end (corresponding ball index)
var ks = [];                  // spring constants
var ls = [];                  // spring equilibrium lengths
var showInfo = false;
var infoOpacity = 0.0;

var infoElem = document.getElementById("sketchDescription");

var buttons = [{
  imageName: 'public/img/info.png', image: null, position: [10, 10], onclick: function () {
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
  imageName: 'public/img/start_button.png', image: null, position: [-100, 10], onclick: startSketch,
  scale: 1.0, visible: false, size: null
},
{
  imageName: 'public/img/stop_button.png', image: null, position: [-100, 10], onclick: stopSketch,
  scale: 1.0, visible: true, size: null
}];

var explanation = "This is a simulation of a system of masses moving in 2d under the effect of ideal springs, \
viscosity, and a uniform acceleration akin to gravity. The masses can have different sizes, as shown by the \
radii of the spheres. The springs have nonzero equilibrium lengths and their color depicts the amount of \
stress, with highly stretched or highly compressed springs colored in brighter reds. The masses have perfectly \
elastic collisions with each other, and partially plastic collisions with the walls. The little red arrow in \
the lower-right corner of the simulation shows the direction and magnitude of 'gravity'; you can click in \
that area to change this and make the masses 'fall' up, left, right, or any other direction. The masses are \
also continuously experiencing a force proportional to velocity, akin to viscosity in a fluid. Finally, the \
little black dots are guiding points, whose velocities are constant except for reflections at the walls. These \
ensure that the system keeps moving despite energy losses due to viscosity and inelastic reflections at the \
walls. The simulation is completely generic in that it allows any number of masses with different properties, \
and springs connecting any of the masses."

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
  // var px_width = Math.floor((doc_width - sidebar_size)*0.9),
  //     px_height = Math.floor(px_width/2);
  // var px_width = 800, px_height = 400;

  var div = document.getElementById("springContainer");
  // div.style.width = px_width + "px";
  // div.style.height = px_height + "px";

  var px_width = div.offsetWidth, px_height = px_width / 2;

  var dev_width = px_width * window.devicePixelRatio;
  var dev_height = px_height * window.devicePixelRatio;

  scale = Math.max(px_width, px_height);
  scale_dev = scale * window.devicePixelRatio;

  processing.size(dev_width, dev_height);

  canvas.style.width = px_width + "px";
  canvas.style.height = px_height + "px";

  // infoElem.style.top = 82.0 / window.devicePixelRatio + "px";

  processing.setup = function () {
    loadButtons(processing);
  }

  processing.drawBall = function (v, rad, move) {
    if (!move) {
      processing.fill(0);
    } else {
      processing.fill(85);
    }
    processing.noStroke();
    processing.ellipseMode(processing.CENTER);
    processing.ellipse(scale_dev * v.x, scale_dev * v.y, 2 * scale_dev * rad, 2 * scale_dev * rad);
  }

  processing.drawSpring = function (v1, v2, k, l0, width) {
    // get a normalized vector along the spring
    var u = PVector.sub(v2, v1);
    var len = u.mag()
    u.div(len);

    var norm = new PVector(-u.y, u.x);  // normal to spring direction
    var n = Math.floor(k * 5);            // how many "periods" to display
    var link = len / n;                 // length of one link

    var stretch = l0 / len;               // spring stress
    if (stretch > 1)
      stretch = 1.0 / stretch;

    // color the spring based on stress
    stretch = 1 - stretch * stretch;
    processing.stroke(200 * stretch, 30 * stretch, 10 * stretch);

    // convert to screen coordinates
    var p1 = PVector.mult(v1, scale_dev);
    var p2 = PVector.mult(v2, scale_dev);

    link *= scale_dev
    width *= scale_dev

    var p = PVector.add(PVector.add(p1, PVector.mult(u, link / 4.0)),
      PVector.mult(norm, width / 2.0));
    processing.line(p1.x, p1.y, p.x, p.y);

    var i;
    var sign = -1;
    for (i = 0; i < 2 * n - 1; ++i) {
      var new_p = PVector.add(PVector.add(p, PVector.mult(u, link / 2.0)),
        PVector.mult(norm, sign * width))
      processing.line(p.x, p.y, new_p.x, new_p.y);
      p = new_p;
      sign = -sign;
    }
    processing.line(p.x, p.y, p2.x, p2.y);
  }

  processing.animate = function (dt, bdry_x, bdry_y) {
    // use leapfrog integration
    // update positions
    var N_balls = ms.length;
    var i;
    for (i = 0; i < N_balls; ++i) {
      //      if (movable[i])
      pos[i].add(PVector.mult(vel[i], dt));
    }

    // handle collisions with the walls
    for (i = 0; i < N_balls; ++i) {
      var rad = rad1 * ms[i];
      var bdry_x_rad = bdry_x - rad;
      var bdry_y_rad = bdry_y - rad;
      var wall_r = wall_restitution;
      if (!movable[i])
        wall_r = 1.0;
      if (pos[i].x < rad) {
        pos[i].x = rad + wall_r * (rad - pos[i].x);
        vel[i].x = -wall_r * vel[i].x;
      }
      if (pos[i].y < rad) {
        pos[i].y = rad + wall_r * (rad - pos[i].y);
        vel[i].y = -wall_r * vel[i].y;
      }
      if (pos[i].x >= bdry_x_rad) {
        pos[i].x = bdry_x_rad - wall_r * (pos[i].x - bdry_x_rad);
        vel[i].x = -wall_r * vel[i].x;
      }
      if (pos[i].y >= bdry_y_rad) {
        pos[i].y = bdry_y_rad - wall_r * (pos[i].y - bdry_y_rad);
        vel[i].y = -wall_r * vel[i].y;
      }
    }

    // handle collisions between the balls
    var j;
    for (i = 0; i < N_balls; ++i) {
      // collisions with immobile objects
      if (!movable[i]) continue;

      var p1 = pos[i];
      var v1 = vel[i];
      var r1 = rad1 * ms[i];
      var m1 = ms[i];
      for (j = i + 1; j < N_balls; ++j) {
        // collisions with immobile objects
        if (!movable[j]) continue;

        var p2 = pos[j];
        var v2 = vel[j];
        var r2 = rad1 * ms[j];
        var m2 = ms[j];

        var d = PVector.sub(p2, p1);
        var dmag = d.mag();
        var d2 = dmag * dmag;
        var D = r1 + r2;
        if (dmag <= D) {
          // collision!

          // find where and when the collision happened, assuming constant velocities
          var v = PVector.sub(v2, v1);
          var vsq = Math.pow(v.mag(), 2);
          var v_dot_d = PVector.dot(v, d);

          // the collision happened a time t *before* the end of the time step
          t = (v_dot_d + Math.sqrt(v_dot_d * v_dot_d + vsq * (D * D - d2))) / vsq;

          // the positions of the balls at that time were given by
          var p1c = PVector.sub(p1, PVector.mult(v1, t));
          var p2c = PVector.sub(p2, PVector.mult(v2, t));

          // only the component of the velocities along the line connecting the two centers
          // changes; the other component stays the same (we're ignoring friction)
          var radial = PVector.normalize(d);
          var tangential = new PVector(-radial.y, radial.x);

          var v1t = PVector.dot(v1, tangential);
          var v2t = PVector.dot(v2, tangential);

          var v1r = PVector.dot(v1, radial);
          var v2r = PVector.dot(v2, radial);

          var new_v1r = (m1 - ball_restitution * m2) * v1r / (m1 + m2) +
            m2 * (1 + ball_restitution) * v2r / (m1 + m2);
          var new_v2r = (m2 - ball_restitution * m1) * v2r / (m1 + m2) +
            m1 * (1 + ball_restitution) * v1r / (m1 + m2);

          var new_v1 = PVector.add(PVector.mult(radial, new_v1r),
            PVector.mult(tangential, v1t));
          var new_v2 = PVector.add(PVector.mult(radial, new_v2r),
            PVector.mult(tangential, v2t));

          // update the velocities
          vel[i] = new_v1;
          vel[j] = new_v2;

          // update the positions
          pos[i] = PVector.add(p1c, PVector.mult(new_v1, t));
          pos[j] = PVector.add(p2c, PVector.mult(new_v2, t));
        }
      }
    }

    // calculate accelerations
    a = [];

    // ...start with the constant acceleration
    for (i = 0; i < N_balls; ++i) {
      a.push(new PVector(g.x, g.y));
    }

    // ...add in the drag
    for (i = 0; i < N_balls; ++i) {
      a[i].sub(PVector.mult(vel[i], drag));
    }

    // ...finally, add in the springs
    var N_springs = spring_left.length;
    for (i = 0; i < N_springs; ++i) {
      var k1 = spring_left[i];
      var k2 = spring_right[i];

      var p1 = pos[k1];
      var p2 = pos[k2];

      var d = PVector.sub(p2, p1);
      var dist = d.mag();
      if (dist > 1e-6) {
        var force = PVector.mult(d, (dist - ls[i]) / dist);
        force.mult(ks[i]);
        a[k1].add(force);
        a[k2].sub(force);
      }
    }

    // update velocities
    for (i = 0; i < N_balls; ++i) {
      if (movable[i])
        vel[i].add(PVector.mult(a[i], dt));
    }
  }

  processing.mousePressed = function () {
    clicking = true;
  }

  processing.mouseReleased = function () {
    clicking = false;
  }

  processing.mouseOut = function () {
    clicking = false;
  }

  processing.mouseClicked = function () {
    handleButtonClick(processing,
      processing.mouseX * window.devicePixelRatio,
      processing.mouseY * window.devicePixelRatio);
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

  processing.mouseToGravity = function () {
    if (!clicking && !touching) return;

    var mouse;
    if (clicking) {
      mouse = new PVector(processing.mouseX, processing.mouseY);
    } else if (touching) {
      mouse = new PVector(lastTouch.x, lastTouch.y);
    }
    mouse.mult(window.devicePixelRatio);
    /*    var center = new PVector(processing.width/2.0, processing.height/2.0);
        var radius = Math.min(processing.width, processing.height)/4.0;*/

    var max_rad = 25;

    var width = processing.width;
    var height = processing.height;
    var p0 = new PVector(width - 1.5 * max_rad, height - 1.5 * max_rad);

    if (mouse.x >= p0.x - 1.5 * max_rad && mouse.y >= p0.y - 1.5 * max_rad) {
      g = PVector.div(PVector.sub(mouse, p0), max_rad);
      if (g.mag() > 1.0)
        g.normalize();
    }
  }

  processing.drawGravity = function () {
    var width = processing.width;
    var height = processing.height;
    var max_rad = 25;

    var x0 = width - 1.5 * max_rad;
    var y0 = height - 1.5 * max_rad;

    var x1 = x0 + g.x * max_rad;
    var y1 = y0 + g.y * max_rad;

    processing.stroke(255 * g.mag(), 10, 10);
    processing.line(x0, y0, x1, y1);

    if (g.mag() > 0.1) {
      var arrow_p = 10.0 * g.mag();
      var arrow_n = 5.0 * g.mag();

      var u = PVector.normalize(g);
      processing.line(x1, y1, x1 - arrow_p * u.x + arrow_n * u.y, y1 - arrow_p * u.y - arrow_n * u.x);
      processing.line(x1, y1, x1 - arrow_p * u.x - arrow_n * u.y, y1 - arrow_p * u.y + arrow_n * u.x);
    }
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

    // draw the springs
    var i;
    var N_springs = spring_left.length;
    for (i = 0; i < N_springs; ++i) {
      var v1 = pos[spring_left[i]];
      var v2 = pos[spring_right[i]];
      processing.drawSpring(v1, v2, ks[i], ls[i], spring_w);
    }

    // draw the balls
    var N_balls = ms.length;
    for (i = 0; i < N_balls; ++i) {
      processing.drawBall(pos[i], rad1 * ms[i], movable[i]);
    }

    // get direction and magnitude of gravity from mouse position
    processing.mouseToGravity();

    // draw a little gravity vector
    processing.drawGravity();

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


    // run the dynamics, with the given boundaries
    if (running)
      processing.animate(dt / 1000.0, width / scale_dev, height / scale_dev);
  }
}

function addBall(m, x, y, vx, vy) {
  // handle default parameters
  vx = typeof vx !== 'undefined' ? vx : 0.0;
  vy = typeof vy !== 'undefined' ? vy : 0.0;

  // fill out the data
  ms.push(m);
  pos.push(new PVector(x, y));
  vel.push(new PVector(vx, vy));
  movable.push(true);
}

function addFixedBall(m, x, y, vx, vy) {
  addBall(m, x, y, vx, vy);
  movable[movable.length - 1] = false;
}

function addSpring(i1, i2, k, l0) {
  spring_left.push(i1);
  spring_right.push(i2);
  ks.push(k);
  ls.push(l0);
}

//////////////////////////////////////////
// initial conditions and other options //
//////////////////////////////////////////

// simulation parameters
var g = new PVector(0.0, 0.5);// uniform acceleration field
var drag = 0.05;              // drag coefficient (force = -drag*v)
var wall_restitution = 0.8;   // coefficient of velocity restitution at wall
var ball_restitution = 1.0;   // coefficient of velocity restitution at ball-ball collision

// display-related constants
var rad1 = 0.02;              // radius of ball of unit mass
var spring_w = 0.03;          // width of spring
var scale = 1000;             // scale factor to convert to screen coordinates
var max_dt = 250;             // maximum time step (ms)

// display-related variables
var last_display = -1;        // last display time
var scale_dev = 1000;         // scale in device coordinates
var running = false;          // whether the simulation is running
var touching = false;         // whether finger is touching
var clicking = false;         // whether the mouse is clicking
var lastTouch = new PVector(0.0, 0.0);

// initialize the simulation by adding some balls and springs
addBall(1.0, 0.1, 0.1);       // mass, x, y[, vx, vy]
addFixedBall(0.1, 0.3, 0.05, 0.15, 0.0); // immovable ball
addFixedBall(0.1, 0.5, 0.05, 0.07, 0.03);
addBall(0.5, 0.8, 0.2);
addBall(0.75, 0.9, 0.1);

addSpring(0, 1, 2.5, 0.1);    // ball1, ball2, k, eq. length
//addSpring(1, 2, 3.0, 0.1);
addSpring(2, 3, 2.5, 0.1);
addSpring(2, 3, 2.5, 0.1);
addSpring(4, 3, 4.0, 0.1);
addSpring(0, 4, 0.75, 0.1);

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
