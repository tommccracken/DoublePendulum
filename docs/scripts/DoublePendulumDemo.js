/*

  Double Pendulum Web Experiment - Demonstration App

  Source repository (at time of writing):
  https://github.com/tommccracken/DoublePendulum


  Copyright 2018 Thomas O. McCracken

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

// The HTML5 canvas element
var canvas = document.getElementById("SketchCanvas");
// Create a graphics context
var ctx = canvas.getContext("2d")
// Rendering scaling variables
var draw_size;
var draw_scaling_factor;
var debug_mode = false;
// The double pendulum model
var double_pendulum;
// The world size
var world_size;
// Declare loop timing variables
var time_now;
var time_prev;
var delta;
var paused;
// Used to debounce resize calculations
var debounce;

function get_time() {
  //return performance.now();
  return Date.now();
}

function draw_world() {

  // Clear the scene
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw border
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.stroke();

  // Draw the link l1
  ctx.beginPath();
  ctx.moveTo(0 + world_size / 2 * draw_scaling_factor, world_size / 2 * draw_scaling_factor - 0 * draw_scaling_factor);
  ctx.lineTo(double_pendulum.m1x * draw_scaling_factor + world_size / 2 * draw_scaling_factor, world_size / 2 * draw_scaling_factor - double_pendulum.m1y * draw_scaling_factor);
  ctx.strokeStyle = 'rgba(53,53,53,1)';
  ctx.stroke();

  // Draw the link l2
  ctx.beginPath();
  ctx.moveTo(world_size * draw_scaling_factor / 2 + double_pendulum.m1x * draw_scaling_factor, world_size / 2 * draw_scaling_factor - double_pendulum.m1y * draw_scaling_factor);
  ctx.lineTo(double_pendulum.m2x * draw_scaling_factor + world_size / 2 * draw_scaling_factor, world_size / 2 * draw_scaling_factor - double_pendulum.m2y * draw_scaling_factor);
  ctx.strokeStyle = 'rgba(53,53,53,1)';
  ctx.stroke();

  // Draw the pendulum mass m1
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(53,53,53,1)';
  ctx.arc(world_size * draw_scaling_factor / 2 + double_pendulum.m1x * draw_scaling_factor, world_size / 2 * draw_scaling_factor - double_pendulum.m1y * draw_scaling_factor, double_pendulum.m1 / 10 * draw_scaling_factor, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'rgba(33,220,33,1)';
  ctx.fill();
  ctx.stroke();

  // Draw the pendulum mass m2
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(53,53,53,1)';
  ctx.arc(world_size * draw_scaling_factor / 2 + double_pendulum.m2x * draw_scaling_factor, world_size / 2 * draw_scaling_factor - double_pendulum.m2y * draw_scaling_factor, double_pendulum.m2 / 10 * draw_scaling_factor, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'rgba(60,70,240,1)';
  ctx.fill();
  ctx.stroke();

  // Draw debug information
  if (debug_mode) {
    ctx.font = draw_size * 0.03 + 'px ariel';
    ctx.fillStyle = 'black';
    ctx.fillText("Physics steps: " + double_pendulum.steps + ", Physics time: " + double_pendulum.time.toFixed(3) + "s, Physics dt: " + double_pendulum.time_step.toFixed(3) + "s", 7, 16);
    ctx.fillText("m1x: " + double_pendulum.m1x.toFixed(3) + ", m1y: " + double_pendulum.m1y.toFixed(3) + ", m2x: " + double_pendulum.m2x.toFixed(3) + ", m2y: " + double_pendulum.m2y.toFixed(3), 7, 16 + draw_size * 1 * 0.04);
    ctx.fillText("Ep: " + double_pendulum.Ep.toFixed(3) + ", Ek: " + double_pendulum.Ek.toFixed(3) + ", Et: " + double_pendulum.Et.toFixed(3), 7, 16 + draw_size * 2 * 0.04);
  }

}

function app_loop() {
  if (!paused) {
    draw_world();
    time_now = get_time();
    delta = delta + (time_now - time_prev);
    while (delta > (double_pendulum.time_step * 1000)) {
      delta = delta - (double_pendulum.time_step * 1000);
      double_pendulum.update();
    }
    time_prev = get_time();
    window.requestAnimationFrame(app_loop);
  }
}

function resize_canvas() {
  // Resize the canvas element to suit the current viewport size/shape
  var viewport_width = $(window).width();
  var viewport_height = $(window).height();
  draw_size = Math.round(0.80 * Math.min(viewport_width, 0.85 * viewport_height));
  ctx.canvas.height = draw_size;
  ctx.canvas.width = draw_size;
  // Recalculate the draw scaling factor
  draw_scaling_factor = draw_size / world_size;
  // Draw the world
  draw_world();
}

function initilise() {
  // Load default scene and calculate initial energy states and mass positions
  scenes[0][1].call();
  double_pendulum.Ep = -(double_pendulum.m1 + double_pendulum.m2) * double_pendulum.g * double_pendulum.l1 * Math.cos(double_pendulum.theta1) - double_pendulum.m2 * double_pendulum.g * double_pendulum.l2 * Math.cos(double_pendulum.theta2);
  double_pendulum.Ek = 0;
  double_pendulum.Et = double_pendulum.Ek + double_pendulum.Ep;
  double_pendulum.m1x = double_pendulum.l1 * Math.sin(double_pendulum.theta1);
  double_pendulum.m1y = -double_pendulum.l1 * Math.cos(double_pendulum.theta1);
  double_pendulum.m2x = double_pendulum.m1x + double_pendulum.l2 * Math.sin(double_pendulum.theta2);
  double_pendulum.m2y = double_pendulum.m1y - double_pendulum.l2 * Math.cos(double_pendulum.theta2);
  // Resize the canvas
  resize_canvas();
  // Draw the world
  draw_world();
  // Initialise the loop timing variables
  time_now = get_time();
  time_prev = get_time();
  delta = 0;
  // Start the loop
  window.requestAnimationFrame(app_loop);
}

function randomise() {
  // Load randomised scene and calculate initial energy states and mass positions
  scenes[1][1].call();
  double_pendulum.Ep = -(double_pendulum.m1 + double_pendulum.m2) * double_pendulum.g * double_pendulum.l1 * Math.cos(double_pendulum.theta1) - double_pendulum.m2 * double_pendulum.g * double_pendulum.l2 * Math.cos(double_pendulum.theta2);
  double_pendulum.Ek = 0;
  double_pendulum.Et = double_pendulum.Ek + double_pendulum.Ep;
  double_pendulum.m1x = double_pendulum.l1 * Math.sin(double_pendulum.theta1);
  double_pendulum.m1y = -double_pendulum.l1 * Math.cos(double_pendulum.theta1);
  double_pendulum.m2x = double_pendulum.m1x + double_pendulum.l2 * Math.sin(double_pendulum.theta2);
  double_pendulum.m2y = double_pendulum.m1y - double_pendulum.l2 * Math.cos(double_pendulum.theta2);
  // Resize the canvas
  resize_canvas();
  // Draw the world
  draw_world();
  // Initialise the loop timing variables
  time_now = get_time();
  time_prev = get_time();
  delta = 0;
  // Start the loop
  window.requestAnimationFrame(app_loop);
}

$('#randomise').on('click', function (e) {
  randomise();
});

$('#ResumePause').on('click', function (e) {
  if (paused) {
    paused = false;
    $('#ResumePause').text('Pause');
    $("#Step").addClass("disabled");
    time_now = get_time();
    time_prev = get_time();
    window.requestAnimationFrame(app_loop);
  } else {
    paused = true;
    $('#ResumePause').text('Resume');
    $('#Step').removeClass("disabled");
  }
  draw_world();
});

$('#Step').on('click', function (e) {
  double_pendulum.update();
  draw_world();
});

$('#debug_checkbox').change(function () {
  debug_mode = $(this).prop('checked');
  if (paused) {
    draw_world();
  }
});

$(window).resize(function () {
  clearTimeout(debounce);
  debounce = setTimeout(function () {
    resize_canvas();
  }, 50);
});

$(document).ready(function () {
  // Set the initial state of debug_mode to false
  $('#debug_checkbox').prop('checked', false);
  debug_mode = false;
  // Ensure the width of the "Resume/Pause" button is consistent
  paused = false;
  var button_width = $('#ResumePause').width();
  $('#ResumePause').text('Pause');
  $('#ResumePause').width(button_width);
  // Initialise the scene
  initilise();
});