/*
 * Copyright 2015, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

var v3 = {};

/**
 *
 * Vec3 math math functions.
 *
 * Almost all functions take an optional `dst` argument. If it is not passed in the
 * functions will create a new Vec3. In other words you can do this
 *
 *     var v = v3.cross(v1, v2);  // Creates a new Vec3 with the cross product of v1 x v2.
 *
 * or
 *
 *     var v3 = v3.create();
 *     v3.cross(v1, v2, v);  // Puts the cross product of v1 x v2 in v
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always save to pass any vector as the destination. So for example
 *
 *     v3.cross(v1, v2, v1);  // Puts the cross product of v1 x v2 in v1
 *
 * @module twgl/v3
 */

v3.VecType = Float32Array;

/**
 * A JavaScript array with 3 values or a Float32Array with 3 values.
 * When created by the library will create the default type which is `Float32Array`
 * but can be set by calling {@link module:twgl/v3.setDefaultType}.
 * @typedef {(number[]|Float32Array)} Vec3
 * @memberOf module:twgl/v3
 */

/**
 * Sets the type this library creates for a Vec3
 * @param {constructor} ctor the constructor for the type. Either `Float32Array` or `Array`
 * @return {constructor} previous constructor for Vec3
 */
v3.setDefaultType = function(ctor) {
  var oldType = v3.VecType;
  v3.VecType = ctor;
  return oldType;
}

/**
 * Creates a vec3; may be called with x, y, z to set initial values.
 * @return {Vec3} the created vector
 * @memberOf module:twgl/v3
 */
v3.create = function(x, y, z) {
  var out = new v3.VecType(3);
  if (x) {
    out[0] = x;
  }
  if (y) {
    out[1] = y;
  }
  if (z) {
    out[2] = z;
  }
  return out;
}

/**
 * Adds two vectors; assumes a and b have the same dimension.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @memberOf module:twgl/v3
 */
v3.add = function(a, b, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];

  return out;
}

/**
 * Subtracts two vectors.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @memberOf module:twgl/v3
 */
v3.subtract = function(a, b, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];

  return out;
}

/**
 * Performs linear interpolation on two vectors.
 * Given vectors a and b and interpolation coefficient t, returns
 * (1 - t) * a + t * b.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {number} t Interpolation coefficient.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @memberOf module:twgl/v3
 */
v3.lerp = function(a, b, t, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = (1 - t) * a[0] + t * b[0];
  out[1] = (1 - t) * a[1] + t * b[1];
  out[2] = (1 - t) * a[2] + t * b[2];

  return out;
}

/**
 * Mutiplies a vector by a scalar.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {number} k The scalar.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} dst.
 * @memberOf module:twgl/v3
 */
v3.mulScalar = function(v, k, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = v[0] * k;
  out[1] = v[1] * k;
  out[2] = v[2] * k;

  return out;
}

/**
 * Divides a vector by a scalar.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {number} k The scalar.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} dst.
 * @memberOf module:twgl/v3
 */
v3.divScalar = function(v, k, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = v[0] / k;
  out[1] = v[1] / k;
  out[2] = v[2] / k;

  return out;
}

/**
 * Computes the cross product of two vectors; assumes both vectors have
 * three entries.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} The vector a cross b.
 * @memberOf module:twgl/v3
 */
v3.cross = function(a, b, dst) {
  var out = dst ? dst : new v3.VecType(3);

  var t1 = a[2] * b[0] - a[0] * b[2];
  var t2 = a[0] * b[1] - a[1] * b[0];
  out[0] = a[1] * b[2] - a[2] * b[1];
  out[1] = t1;
  out[2] = t2;

  return out;
}

/**
 * Computes the dot product of two vectors; assumes both vectors have
 * three entries.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @return {number} dot product
 * @memberOf module:twgl/v3
 */
v3.dot = function(a, b) {
  return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
}

/**
 * Computes the length of vector
 * @param {module:twgl/v3.Vec3} v vector.
 * @return {number} length of vector.
 * @memberOf module:twgl/v3
 */
v3.length = function(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

/**
 * Computes the square of the length of vector
 * @param {module:twgl/v3.Vec3} v vector.
 * @return {number} square of the length of vector.
 * @memberOf module:twgl/v3
 */
v3.lengthSq = function(v) {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}

/**
 * Computes the distance between 2 points
 * @param {module:twgl/v3.Vec3} a vector.
 * @param {module:twgl/v3.Vec3} b vector.
 * @return {number} distance between a and b
 * @memberOf module:twgl/v3
 */
v3.distance = function(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Computes the square of the distance between 2 points
 * @param {module:twgl/v3.Vec3} a vector.
 * @param {module:twgl/v3.Vec3} b vector.
 * @return {number} square of the distance between a and b
 * @memberOf module:twgl/v3
 */
v3.distanceSq = function(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Divides a vector by its Euclidean length and returns the quotient.
 * @param {module:twgl/v3.Vec3} a The vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} The normalized vector.
 * @memberOf module:twgl/v3
 */
v3.normalize = function(a, dst) {
  var out = dst ? dst : new v3.VecType(3);

  var lenSq = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
  var len = Math.sqrt(lenSq);
  if (len > 0.00001) {
    out[0] = a[0] / len;
    out[1] = a[1] / len;
    out[2] = a[2] / len;
  } else {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}

/**
 * Negates a vector.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} -v.
 * @memberOf module:twgl/v3
 */
v3.negate = function(v, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = -v[0];
  out[1] = -v[1];
  out[2] = -v[2];

  return out;
}

/**
 * Copies a vector.
 * @param {module:twgl/v3.Vec3} v The vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} A copy of v.
 * @memberOf module:twgl/v3
 */
v3.copy = function(v, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = v[0];
  out[1] = v[1];
  out[2] = v[2];

  return out;
}

/**
 * Multiplies a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} The vector of products of entries of a and
 *     b.
 * @memberOf module:twgl/v3
 */
v3.multiply = function(a, b, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];

  return out;
}

/**
 * Divides a vector by another vector (component-wise); assumes a and
 * b have the same length.
 * @param {module:twgl/v3.Vec3} a Operand vector.
 * @param {module:twgl/v3.Vec3} b Operand vector.
 * @param {module:twgl/v3.Vec3} [dst] vector to hold result. If not new one is created..
 * @return {module:twgl/v3.Vec3} The vector of quotients of entries of a and
 *     b.
 * @memberOf module:twgl/v3
 */
v3.divide = function(a, b, dst) {
  var out = dst ? dst : new v3.VecType(3);

  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];

  return out;
}

