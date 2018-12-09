/*

  Double Pendulum Web Experiment - Double Pendulum Model

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

const PI = Math.PI;

class DoublePendulum {

  constructor() {

    // Declare simulation variables
    this.steps = 0;
    this.time = 0;
    this.time_step = 1 / 100;
    this.world_size;
    this.g = 9.81;
    this.integration_method = 2;

    // Declare pendulum model variables
    this.m1;
    this.m1x;
    this.m1y;
    this.l1;
    this.theta1;
    this.omega1;
    this.alpha1;
    this.m2;
    this.m2x;
    this.m2y;
    this.l2;
    this.theta2;
    this.omega2;
    this.alpha2;

    // Calculate initial energy states
    this.update_energy_states();

    // Calculate initial mass positions
    this.update_cartesian_mass_coordinates();

  }

  update() {

    // Numerically integrate the calculated angular accelerations to find velocities and positions
    if (this.integration_method == 0) {
      // Explicit Euler
      this.calculate_accelerations();
      this.theta1 = this.theta1 + this.omega1 * this.time_step;
      this.theta2 = this.theta2 + this.omega2 * this.time_step;
      this.omega1 = this.omega1 + this.alpha1 * this.time_step;
      this.omega2 = this.omega2 + this.alpha2 * this.time_step;
    } else if (this.integration_method == 1) {
      // Semi-implicit Euler
      this.calculate_accelerations();
      this.omega1 = this.omega1 + this.alpha1 * this.time_step;
      this.omega2 = this.omega2 + this.alpha2 * this.time_step;
      this.theta1 = this.theta1 + this.omega1 * this.time_step;
      this.theta2 = this.theta2 + this.omega2 * this.time_step;
    } else if (this.integration_method == 2) {
      // Velocity Verlet
      this.omega1mid = this.omega1 + 0.5 * this.alpha1 * this.time_step;
      this.omega2mid = this.omega2 + 0.5 * this.alpha2 * this.time_step;
      this.theta1 = this.theta1 + this.omega1mid * this.time_step;
      this.theta2 = this.theta2 + this.omega2mid * this.time_step;
      this.calculate_accelerations();
      this.omega1 = this.omega1mid + 0.5 * this.alpha1 * this.time_step;
      this.omega2 = this.omega2mid + 0.5 * this.alpha2 * this.time_step;
    }

    // Update energy states
    this.update_energy_states();

    // Update mass positions
    this.update_cartesian_mass_coordinates();

    // Advance time and step count
    this.steps = this.steps + 1;
    this.time = this.steps * this.time_step;

  }

  update_energy_states() {

    // Calculate energy states
    this.Ep = -(this.m1 + this.m2) * this.g * this.l1 * Math.cos(this.theta1) - this.m2 * this.g * this.l2 * Math.cos(this.theta2);
    this.Ek = 0.5 * this.m1 * this.l1 * this.l1 * this.omega1 * this.omega1 + 0.5 * this.m2 * (this.l1 * this.l1 * this.omega1 * this.omega1 + this.l2 * this.l2 * this.omega2 * this.omega2 + 2 * this.l1 * this.l2 * this.omega1 * this.omega2 * Math.cos(this.theta1 - this.theta2));
    this.Et = this.Ek + this.Ep;

  }

  update_cartesian_mass_coordinates() {

    // Calculate mass cartesian positions
    this.m1x = this.l1 * Math.sin(this.theta1);
    this.m1y = -this.l1 * Math.cos(this.theta1);
    this.m2x = this.m1x + this.l2 * Math.sin(this.theta2);
    this.m2y = this.m1y - this.l2 * Math.cos(this.theta2);

  }

  calculate_accelerations() {

    // Calculate the angular accelerations alpha1 and alpha2. These equations can be derived from the Euler-Lagrange differential equations for theta1 and theta2 which can be formulated analytically from the double pendulum model. For this simulation the equations for calculating alpha1 and alpha2 were sourced from here: http://www.physics.usyd.edu.au/~wheat/dpend_html/
    this.alpha1 = (this.m2 * this.l1 * this.omega1 * this.omega1 * Math.sin(this.theta2 - this.theta1) * Math.cos(this.theta2 - this.theta1) + this.m2 * this.g * Math.sin(this.theta2) * Math.cos(this.theta2 - this.theta1) + this.m2 * this.l2 * this.omega2 * this.omega2 * Math.sin(this.theta2 - this.theta1) - (this.m1 + this.m2) * this.g * Math.sin(this.theta1)) / ((this.m1 + this.m2) * this.l1 - this.m2 * this.l1 * Math.cos(this.theta2 - this.theta1) * Math.cos(this.theta2 - this.theta1));
    this.alpha2 = (-this.m2 * this.l2 * this.omega2 * this.omega2 * Math.sin(this.theta2 - this.theta1) * Math.cos(this.theta2 - this.theta1) + (this.m1 + this.m2) * (this.g * Math.sin(this.theta1) * Math.cos(this.theta2 - this.theta1) - this.l1 * this.omega1 * this.omega1 * Math.sin(this.theta2 - this.theta1) - this.g * Math.sin(this.theta2))) / ((this.m1 + this.m2) * this.l2 - this.m2 * this.l2 * Math.cos(this.theta2 - this.theta1) * Math.cos(this.theta2 - this.theta1));

  }

}