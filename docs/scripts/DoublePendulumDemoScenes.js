/*

  Double Pendulum Web Experiment - Demonstration App Scenes

  Source repository (at time of writing):
  https://github.com/tommccracken/DoublePendulum


  Copyright 2018 Thomas O. McCracken

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use double_pendulum file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

var scenes = [

  [

    name = "Scene01",

    loader = function () {

      world_size = 12;
      double_pendulum = new DoublePendulum();

      double_pendulum.m1 = 2;
      double_pendulum.l1 = 2;
      double_pendulum.theta1 = PI / 1.1;
      double_pendulum.omega1 = 0;
      double_pendulum.alpha1 = 0;

      double_pendulum.m2 = 3;
      double_pendulum.l2 = 2.5;
      double_pendulum.theta2 = -PI / 1.1;
      double_pendulum.omega2 = 0;
      double_pendulum.alpha2 = 0;

    }

  ],

  [

    name = "Random",

    loader = function () {

      world_size = 12;
      double_pendulum = new DoublePendulum();

      double_pendulum.m1 = Math.random() + 1.5;
      double_pendulum.l1 = Math.random() + 1.5;
      double_pendulum.theta1 = Math.random() * (PI - PI / 3) + PI / 3;
      double_pendulum.omega1 = 0;
      double_pendulum.alpha1 = 0;

      double_pendulum.m2 = Math.random() + 1.5;
      double_pendulum.l2 = Math.random() + 1.5;
      double_pendulum.theta2 = Math.random() * 2 * PI;
      double_pendulum.omega2 = 0;
      double_pendulum.alpha2 = 0;

    }

  ]

];