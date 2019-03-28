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

//"use strict";

var twglmath = twglmath || {};
twglmath.m4 = twglmath.m4 || {};
var m4 = twglmath.m4;

/**
 * 4x4 Matrix math math functions.
 *
 * Almost all functions take an optional `dst` argument. If it is not passed in the
 * functions will create a new matrix. In other words you can do this
 *
 *     var mat = m4.translation([1, 2, 3]);  // Creates a new translation matrix
 *
 * or
 *
 *     var mat = m4.create();
 *     m4.translation([1, 2, 3], mat);  // Puts translation matrix in mat.
 *
 * The first style is often easier but depending on where it's used it generates garbage where
 * as there is almost never allocation with the second style.
 *
 * It is always save to pass any matrix as the destination. So for example
 *
 *     var mat = m4.identity();
 *     var trans = m4.translation([1, 2, 3]);
 *     m4.multiply(mat, trans, mat);  // Multiplies mat * trans and puts result in mat.
 *
 * @module twgl/m4
 */
m4.MatType = Float32Array;

m4._tempV3a = v3.create();
m4._tempV3b = v3.create();
m4._tempV3c = v3.create();

/**
 * A JavaScript array with 16 values or a Float32Array with 16 values.
 * When created by the library will create the default type which is `Float32Array`
 * but can be set by calling {@link module:twgl/m4.setDefaultType}.
 * @typedef {(number[]|Float32Array)} Mat4
 * @memberOf module:twgl/m4
 */

/**
 * Sets the type this library creates for a Mat4
 * @param {constructor} ctor the constructor for the type. Either `Float32Array` or `Array`
 * @return {constructor} previous constructor for Mat4
 */
m4.setDefaultType = function(ctor) {
  var oldType = m4.MatType;
  m4.MatType = ctor;
  return oldType;
};

/**
 * Negates a matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} -m.
 * @memberOf module:twgl/m4
 */
m4.negate = function(m, dst) {
  var out = dst ? dst : new m4.MatType(16);

  out[ 0] = -m[ 0];
  out[ 1] = -m[ 1];
  out[ 2] = -m[ 2];
  out[ 3] = -m[ 3];
  out[ 4] = -m[ 4];
  out[ 5] = -m[ 5];
  out[ 6] = -m[ 6];
  out[ 7] = -m[ 7];
  out[ 8] = -m[ 8];
  out[ 9] = -m[ 9];
  out[10] = -m[10];
  out[11] = -m[11];
  out[12] = -m[12];
  out[13] = -m[13];
  out[14] = -m[14];
  out[15] = -m[15];

  return out;
}

/**
 * Copies a matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] The matrix.
 * @return {module:twgl/m4.Mat4} A copy of m.
 * @memberOf module:twgl/m4
 */
m4.copy = function(m, dst) {
  var out = dst ? dst : new m4.MatType(16);

  out[ 0] = m[ 0];
  out[ 1] = m[ 1];
  out[ 2] = m[ 2];
  out[ 3] = m[ 3];
  out[ 4] = m[ 4];
  out[ 5] = m[ 5];
  out[ 6] = m[ 6];
  out[ 7] = m[ 7];
  out[ 8] = m[ 8];
  out[ 9] = m[ 9];
  out[10] = m[10];
  out[11] = m[11];
  out[12] = m[12];
  out[13] = m[13];
  out[14] = m[14];
  out[15] = m[15];

  return out;
}

/**
 * Creates an n-by-n identity matrix.
 *
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} An n-by-n identity matrix.
 * @memberOf module:twgl/m4
 */
m4.identity = function(dst) {
  var out = dst ? dst : new m4.MatType(16);

  out[ 0] = 1;
  out[ 1] = 0;
  out[ 2] = 0;
  out[ 3] = 0;
  out[ 4] = 0;
  out[ 5] = 1;
  out[ 6] = 0;
  out[ 7] = 0;
  out[ 8] = 0;
  out[ 9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Takes the transpose of a matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The transpose of m.
 * @memberOf module:twgl/m4
 */
 m4.transpose = function(m, dst) {
  var out = dst ? dst : new m4.MatType(16);
  if (out === m) {
    var t;

    t = m[1];
    m[1] = m[4];
    m[4] = t;

    t = m[2];
    m[2] = m[8];
    m[8] = t;

    t = m[3];
    m[3] = m[12];
    m[12] = t;

    t = m[6];
    m[6] = m[9];
    m[9] = t;

    t = m[7];
    m[7] = m[13];
    m[13] = t;

    t = m[11];
    m[11] = m[14];
    m[14] = t;
    return out;
  }

  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

  out[ 0] = m00;
  out[ 1] = m10;
  out[ 2] = m20;
  out[ 3] = m30;
  out[ 4] = m01;
  out[ 5] = m11;
  out[ 6] = m21;
  out[ 7] = m31;
  out[ 8] = m02;
  out[ 9] = m12;
  out[10] = m22;
  out[11] = m32;
  out[12] = m03;
  out[13] = m13;
  out[14] = m23;
  out[15] = m33;

  return out;
}

/**
 * Computes the inverse of a 4-by-4 matrix.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The inverse of m.
 * @memberOf module:twgl/m4
 */
m4.inverse = function(m, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0  = m22 * m33;
  var tmp_1  = m32 * m23;
  var tmp_2  = m12 * m33;
  var tmp_3  = m32 * m13;
  var tmp_4  = m12 * m23;
  var tmp_5  = m22 * m13;
  var tmp_6  = m02 * m33;
  var tmp_7  = m32 * m03;
  var tmp_8  = m02 * m23;
  var tmp_9  = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;

  var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  out[ 0] = d * t0;
  out[ 1] = d * t1;
  out[ 2] = d * t2;
  out[ 3] = d * t3;
  out[ 4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  out[ 5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  out[ 6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  out[ 7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  out[ 8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  out[ 9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  out[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  out[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  out[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  out[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  out[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  out[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

  return out;
}

/**
 * Multiplies two 4-by-4 matrices with a on the left and b on the right
 * @param {module:twgl/m4.Mat4} a The matrix on the left.
 * @param {module:twgl/m4.Mat4} b The matrix on the right.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The matrix product of a and b.
 * @memberOf module:twgl/m4
 */
m4.multiply = function(a, b, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[ 4 + 0];
  var a11 = a[ 4 + 1];
  var a12 = a[ 4 + 2];
  var a13 = a[ 4 + 3];
  var a20 = a[ 8 + 0];
  var a21 = a[ 8 + 1];
  var a22 = a[ 8 + 2];
  var a23 = a[ 8 + 3];
  var a30 = a[12 + 0];
  var a31 = a[12 + 1];
  var a32 = a[12 + 2];
  var a33 = a[12 + 3];
  var b00 = b[0];
  var b01 = b[1];
  var b02 = b[2];
  var b03 = b[3];
  var b10 = b[ 4 + 0];
  var b11 = b[ 4 + 1];
  var b12 = b[ 4 + 2];
  var b13 = b[ 4 + 3];
  var b20 = b[ 8 + 0];
  var b21 = b[ 8 + 1];
  var b22 = b[ 8 + 2];
  var b23 = b[ 8 + 3];
  var b30 = b[12 + 0];
  var b31 = b[12 + 1];
  var b32 = b[12 + 2];
  var b33 = b[12 + 3];

  out[ 0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  out[ 1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  out[ 2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  out[ 3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  out[ 4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  out[ 5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  out[ 6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  out[ 7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  out[ 8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  out[ 9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  out[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  out[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  out[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  out[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

  return out;
}

/**
 * Sets the translation component of a 4-by-4 matrix to the given
 * vector.
 * @param {module:twgl/m4.Mat4} a The matrix.
 * @param {Vec3} v The vector.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} a once modified.
 * @memberOf module:twgl/m4
 */
m4.setTranslation = function(a, v, dst) {
  var out = dst ? dst : identity();
  if (a !== dst) {
    out[ 0] = a[ 0];
    out[ 1] = a[ 1];
    out[ 2] = a[ 2];
    out[ 3] = a[ 3];
    out[ 4] = a[ 4];
    out[ 5] = a[ 5];
    out[ 6] = a[ 6];
    out[ 7] = a[ 7];
    out[ 8] = a[ 8];
    out[ 9] = a[ 9];
    out[10] = a[10];
    out[11] = a[11];
  }
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Returns the translation component of a 4-by-4 matrix as a vector with 3
 * entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {Vec3} [dst] vector..
 * @return {Vec3} The translation component of m.
 * @memberOf module:twgl/m4
 */
m4.getTranslation = function(m, dst) {
  var out = dst ? dst : v3.create();
  out[0] = m[12];
  out[1] = m[13];
  out[2] = m[14];
  return out;
}

/**
 * Returns an axis of a 4x4 matrix as a vector with 3 entries
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} axis The axis 0 = x, 1 = y, 2 = z;
 * @return {Vec3} [dst] vector.
 * @return {Vec3} The axis component of m.
 * @memberOf module:twgl/m4
 */
m4.getAxis = function(m, axis, dst) {
  var out = dst ? dst : v3.create();
  var off = axis * 4;
  out[0] = m[off + 0];
  out[1] = m[off + 1];
  out[2] = m[off + 2];
  return out;
}

/**
 * Sets an axis of a 4x4 matrix as a vector with 3 entries
 * @param {Vec3} v the axis vector
 * @param {number} axis The axis  0 = x, 1 = y, 2 = z;
 * @param {module:twgl/m4.Mat4} [dst] The matrix to set. If none a new one is created
 * @return {module:twgl/m4.Mat4} dst
 * @memberOf module:twgl/m4
 */
m4.setAxis = function(a, v, axis, dst) {
  if (dst !== a) {
    dst = copy(a, dst);
  }
  var off = axis * 4;
  out[off + 0] = v[0];
  out[off + 1] = v[1];
  out[off + 2] = v[2];
  return out;
}

/**
 * Computes a 4-by-4 perspective transformation matrix given the angular height
 * of the frustum, the aspect ratio, and the near and far clipping planes.  The
 * arguments define a frustum extending in the negative z direction.  The given
 * angle is the vertical angle of the frustum, and the horizontal angle is
 * determined to produce the given aspect ratio.  The arguments near and far are
 * the distances to the near and far clipping planes.  Note that near and far
 * are not z coordinates, but rather they are distances along the negative
 * z-axis.  The matrix generated sends the viewing frustum to the unit box.
 * We assume a unit box extending from -1 to 1 in the x and y dimensions and
 * from 0 to 1 in the z dimension.
 * @param {number} fieldOfViewYInRadians The camera angle from top to bottom (in radians).
 * @param {number} aspect The aspect ratio width / height.
 * @param {number} zNear The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} zFar The depth (negative z coordinate)
 *     of the far clipping plane.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The perspective matrix.
 * @memberOf module:twgl/m4
 */
m4.perspective = function(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
  var rangeInv = 1.0 / (zNear - zFar);

  out[0]  = f / aspect;
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;

  out[4]  = 0;
  out[5]  = f;
  out[6]  = 0;
  out[7]  = 0;

  out[8]  = 0;
  out[9]  = 0;
  out[10] = (zNear + zFar) * rangeInv;
  out[11] = -1;

  out[12] = 0;
  out[13] = 0;
  out[14] = zNear * zFar * rangeInv * 2;
  out[15] = 0;

  return out;
}

/**
 * Computes a 4-by-4 othogonal transformation matrix given the left, right,
 * bottom, and top dimensions of the near clipping plane as well as the
 * near and far clipping plane distances.
 * @param {number} left Left side of the near clipping plane viewport.
 * @param {number} right Right side of the near clipping plane viewport.
 * @param {number} top Top of the near clipping plane viewport.
 * @param {number} bottom Bottom of the near clipping plane viewport.
 * @param {number} near The depth (negative z coordinate)
 *     of the near clipping plane.
 * @param {number} far The depth (negative z coordinate)
 *     of the far clipping plane.
 * @param {module:twgl/m4.Mat4} [dst] Output matrix.
 * @return {module:twgl/m4.Mat4} The perspective matrix.
 * @memberOf module:twgl/m4
 */
m4.ortho = function(left, right, bottom, top, near, far, dst) {
  var out = dst ? dst : new m4.MatType(16);

  out[0]  = 2 / (right - left);
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;

  out[4]  = 0;
  out[5]  = 2 / (top - bottom);
  out[6]  = 0;
  out[7]  = 0;

  out[8]  = 0;
  out[9]  = 0;
  out[10] = -1 / (far - near);
  out[11] = 0;

  out[12] = (right + left) / (left - right);
  out[13] = (top + bottom) / (bottom - top);
  out[14] = -near / (near - far);
  out[15] = 1;

  return out;
}

/**
 * Computes a 4-by-4 perspective transformation matrix given the left, right,
 * top, bottom, near and far clipping planes. The arguments define a frustum
 * extending in the negative z direction. The arguments near and far are the
 * distances to the near and far clipping planes. Note that near and far are not
 * z coordinates, but rather they are distances along the negative z-axis. The
 * matrix generated sends the viewing frustum to the unit box. We assume a unit
 * box extending from -1 to 1 in the x and y dimensions and from 0 to 1 in the z
 * dimension.
 * @param {number} left The x coordinate of the left plane of the box.
 * @param {number} right The x coordinate of the right plane of the box.
 * @param {number} bottom The y coordinate of the bottom plane of the box.
 * @param {number} top The y coordinate of the right plane of the box.
 * @param {number} near The negative z coordinate of the near plane of the box.
 * @param {number} far The negative z coordinate of the far plane of the box.
 * @param {module:twgl/m4.Mat4} [dst] Output matrix.
 * @return {module:twgl/m4.Mat4} The perspective projection matrix.
 * @memberOf module:twgl/m4
 */
m4.frustum = function(left, right, bottom, top, near, far, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var dx = (right - left);
  var dy = (top - bottom);
  var dz = (near - far);

  out[ 0] = 2 * near / dx;
  out[ 1] = 0;
  out[ 2] = 0;
  out[ 3] = 0;
  out[ 4] = 0;
  out[ 5] = 2 * near / dy;
  out[ 6] = 0;
  out[ 7] = 0;
  out[ 8] = (left + right) / dx;
  out[ 9] = (top + bottom) / dy;
  out[10] = far / dz;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = near * far / dz;
  out[15] = 0;

  return out;
}

/**
 * Computes a 4-by-4 look-at transformation.
 *
 * This is a matrix which positions the camera itself. If you want
 * a view matrix (a matrix which moves things in front of the camera)
 * take the inverse of this.
 *
 * @param {Vec3} eye The position of the eye.
 * @param {Vec3} target The position meant to be viewed.
 * @param {Vec3} up A vector pointing up.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The look-at matrix.
 * @memberOf module:twgl/m4
 */
m4.lookAt = function(eye, target, up, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var xAxis = _tempV3a;
  var yAxis = _tempV3b;
  var zAxis = _tempV3c;

  v3.normalize(
      v3.subtract(eye, target, zAxis), zAxis);
  v3.normalize(v3.cross(up, zAxis, xAxis), xAxis);
  v3.normalize(v3.cross(zAxis, xAxis, yAxis), yAxis);

  out[ 0] = xAxis[0];
  out[ 1] = xAxis[1];
  out[ 2] = xAxis[2];
  out[ 3] = 0;
  out[ 4] = yAxis[0];
  out[ 5] = yAxis[1];
  out[ 6] = yAxis[2];
  out[ 7] = 0;
  out[ 8] = zAxis[0];
  out[ 9] = zAxis[1];
  out[10] = zAxis[2];
  out[11] = 0;
  out[12] = eye[0];
  out[13] = eye[1];
  out[14] = eye[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a 4-by-4 matrix which translates by the given vector v.
 * @param {Vec3} v The vector by
 *     which to translate.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The translation matrix.
 * @memberOf module:twgl/m4
 */
m4.translation = function(v, dst) {
  var out = dst ? dst : new m4.MatType(16);

  out[ 0] = 1;
  out[ 1] = 0;
  out[ 2] = 0;
  out[ 3] = 0;
  out[ 4] = 0;
  out[ 5] = 1;
  out[ 6] = 0;
  out[ 7] = 0;
  out[ 8] = 0;
  out[ 9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Modifies the given 4-by-4 matrix by translation by the given vector v.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {Vec3} v The vector by
 *     which to translate.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} m once modified.
 * @memberOf module:twgl/m4
 */
m4.translate = function(m, v) { //, out) { // dst) {
//m4.translate = function(m, v, out) { // dst) {
//  var out = dst ? dst : new m4.MatType(16);

  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];

//  if (m !== dst) {
//    out[ 0] = m00;
//    out[ 1] = m01;
//    out[ 2] = m02;
//    out[ 3] = m03;
//    out[ 4] = m10;
//    out[ 5] = m11;
//    out[ 6] = m12;
//    out[ 7] = m13;
//    out[ 8] = m20;
//    out[ 9] = m21;
//    out[10] = m22;
//    out[11] = m23;
//  }

//  out[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
//  out[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
//  out[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
//  out[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
//
//  return out;
  m[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
  m[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
  m[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
  m[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;

  return m;
}

/**
 * Creates a 4-by-4 matrix which rotates around the x-axis by the given angle.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The rotation matrix.
 * @memberOf module:twgl/m4
 */
m4.rotationX = function(angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  out[ 0] = 1;
  out[ 1] = 0;
  out[ 2] = 0;
  out[ 3] = 0;
  out[ 4] = 0;
  out[ 5] = c;
  out[ 6] = s;
  out[ 7] = 0;
  out[ 8] = 0;
  out[ 9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Modifies the given 4-by-4 matrix by a rotation around the x-axis by the given
 * angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} m once modified.
 * @memberOf module:twgl/m4
 */
m4.rotateX = function(m, angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var m10 = m[4];
  var m11 = m[5];
  var m12 = m[6];
  var m13 = m[7];
  var m20 = m[8];
  var m21 = m[9];
  var m22 = m[10];
  var m23 = m[11];
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  out[4]  = c * m10 + s * m20;
  out[5]  = c * m11 + s * m21;
  out[6]  = c * m12 + s * m22;
  out[7]  = c * m13 + s * m23;
  out[8]  = c * m20 - s * m10;
  out[9]  = c * m21 - s * m11;
  out[10] = c * m22 - s * m12;
  out[11] = c * m23 - s * m13;

  if (m !== dst) {
    out[ 0] = m[ 0];
    out[ 1] = m[ 1];
    out[ 2] = m[ 2];
    out[ 3] = m[ 3];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
  }

  return out;
}

/**
 * Creates a 4-by-4 matrix which rotates around the y-axis by the given angle.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The rotation matrix.
 * @memberOf module:twgl/m4
 */
m4.rotationY = function(angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  out[ 0] = c;
  out[ 1] = 0;
  out[ 2] = -s;
  out[ 3] = 0;
  out[ 4] = 0;
  out[ 5] = 1;
  out[ 6] = 0;
  out[ 7] = 0;
  out[ 8] = s;
  out[ 9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Modifies the given 4-by-4 matrix by a rotation around the y-axis by the given
 * angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} m once modified.
 * @memberOf module:twgl/m4
 */
m4.rotateY = function(m, angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  out[ 0] = c * m00 - s * m20;
  out[ 1] = c * m01 - s * m21;
  out[ 2] = c * m02 - s * m22;
  out[ 3] = c * m03 - s * m23;
  out[ 8] = c * m20 + s * m00;
  out[ 9] = c * m21 + s * m01;
  out[10] = c * m22 + s * m02;
  out[11] = c * m23 + s * m03;

  if (m !== dst) {
    out[ 4] = m[ 4];
    out[ 5] = m[ 5];
    out[ 6] = m[ 6];
    out[ 7] = m[ 7];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
  }

  return out;
}

/**
 * Creates a 4-by-4 matrix which rotates around the z-axis by the given angle.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The rotation matrix.
 * @memberOf module:twgl/m4
 */
m4.rotationZ = function(angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  out[ 0] = c;
  out[ 1] = s;
  out[ 2] = 0;
  out[ 3] = 0;
  out[ 4] = -s;
  out[ 5] = c;
  out[ 6] = 0;
  out[ 7] = 0;
  out[ 8] = 0;
  out[ 9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Modifies the given 4-by-4 matrix by a rotation around the z-axis by the given
 * angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} m once modified.
 * @memberOf module:twgl/m4
 */
m4.rotateZ = function(m, angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  out[ 0] = c * m00 + s * m10;
  out[ 1] = c * m01 + s * m11;
  out[ 2] = c * m02 + s * m12;
  out[ 3] = c * m03 + s * m13;
  out[ 4] = c * m10 - s * m00;
  out[ 5] = c * m11 - s * m01;
  out[ 6] = c * m12 - s * m02;
  out[ 7] = c * m13 - s * m03;

  if (m !== dst) {
    out[ 8] = m[ 8];
    out[ 9] = m[ 9];
    out[10] = m[10];
    out[11] = m[11];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
  }

  return out;
}

/**
 * Creates a 4-by-4 matrix which rotates around the given axis by the given
 * angle.
 * @param {Vec3} axis The axis
 *     about which to rotate.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} A matrix which rotates angle radians
 *     around the axis.
 * @memberOf module:twgl/m4
 */
m4.axisRotation = function(axis, angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  var oneMinusCosine = 1 - c;

  out[ 0] = xx + (1 - xx) * c;
  out[ 1] = x * y * oneMinusCosine + z * s;
  out[ 2] = x * z * oneMinusCosine - y * s;
  out[ 3] = 0;
  out[ 4] = x * y * oneMinusCosine - z * s;
  out[ 5] = yy + (1 - yy) * c;
  out[ 6] = y * z * oneMinusCosine + x * s;
  out[ 7] = 0;
  out[ 8] = x * z * oneMinusCosine + y * s;
  out[ 9] = y * z * oneMinusCosine - x * s;
  out[10] = zz + (1 - zz) * c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Modifies the given 4-by-4 matrix by rotation around the given axis by the
 * given angle.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {Vec3} axis The axis
 *     about which to rotate.
 * @param {number} angleInRadians The angle by which to rotate (in radians).
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} m once modified.
 * @memberOf module:twgl/m4
 */
m4.axisRotate = function(m, axis, angleInRadians, dst) {
  var out = dst ? dst : new m4.MatType(16);

  var x = axis[0];
  var y = axis[1];
  var z = axis[2];
  var n = Math.sqrt(x * x + y * y + z * z);
  x /= n;
  y /= n;
  z /= n;
  var xx = x * x;
  var yy = y * y;
  var zz = z * z;
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  var oneMinusCosine = 1 - c;

  var r00 = xx + (1 - xx) * c;
  var r01 = x * y * oneMinusCosine + z * s;
  var r02 = x * z * oneMinusCosine - y * s;
  var r10 = x * y * oneMinusCosine - z * s;
  var r11 = yy + (1 - yy) * c;
  var r12 = y * z * oneMinusCosine + x * s;
  var r20 = x * z * oneMinusCosine + y * s;
  var r21 = y * z * oneMinusCosine - x * s;
  var r22 = zz + (1 - zz) * c;

  var m00 = m[0];
  var m01 = m[1];
  var m02 = m[2];
  var m03 = m[3];
  var m10 = m[4];
  var m11 = m[5];
  var m12 = m[6];
  var m13 = m[7];
  var m20 = m[8];
  var m21 = m[9];
  var m22 = m[10];
  var m23 = m[11];

  out[ 0] = r00 * m00 + r01 * m10 + r02 * m20;
  out[ 1] = r00 * m01 + r01 * m11 + r02 * m21;
  out[ 2] = r00 * m02 + r01 * m12 + r02 * m22;
  out[ 3] = r00 * m03 + r01 * m13 + r02 * m23;
  out[ 4] = r10 * m00 + r11 * m10 + r12 * m20;
  out[ 5] = r10 * m01 + r11 * m11 + r12 * m21;
  out[ 6] = r10 * m02 + r11 * m12 + r12 * m22;
  out[ 7] = r10 * m03 + r11 * m13 + r12 * m23;
  out[ 8] = r20 * m00 + r21 * m10 + r22 * m20;
  out[ 9] = r20 * m01 + r21 * m11 + r22 * m21;
  out[10] = r20 * m02 + r21 * m12 + r22 * m22;
  out[11] = r20 * m03 + r21 * m13 + r22 * m23;

  if (m !== dst) {
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
  }

  return out;
}

/**
 * Creates a 4-by-4 matrix which scales in each dimension by an amount given by
 * the corresponding entry in the given vector; assumes the vector has three
 * entries.
 * @param {Vec3} v A vector of
 *     three entries specifying the factor by which to scale in each dimension.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} The scaling matrix.
 * @memberOf module:twgl/m4
 */
m4.scaling = function(v, dst) {
  var out = dst ? dst : new m4.MatType(16);

  out[ 0] = v[0];
  out[ 1] = 0;
  out[ 2] = 0;
  out[ 3] = 0;
  out[ 4] = 0;
  out[ 5] = v[1];
  out[ 6] = 0;
  out[ 7] = 0;
  out[ 8] = 0;
  out[ 9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Modifies the given 4-by-4 matrix, scaling in each dimension by an amount
 * given by the corresponding entry in the given vector; assumes the vector has
 * three entries.
 * @param {module:twgl/m4.Mat4} m The matrix to be modified.
 * @param {Vec3} v A vector of three entries specifying the
 *     factor by which to scale in each dimension.
 * @param {module:twgl/m4.Mat4} [dst] matrix to hold result. If none new one is created..
 * @return {module:twgl/m4.Mat4} m once modified.
 * @memberOf module:twgl/m4
 */
//m4.scale = function(m, v/*, dst*/) {
////  var out = m;
////m4.scale = function(m, v, dst) {
////  var out = dst ? dst : new m4.MatType(16);
//
//  var v0 = v[0];
//  var v1 = v[1];
//  var v2 = v[2];
//
//  m/*out*/[ 0] = v0 * m[ 0]; //0 * 4 + 0];
//  m/*out*/[ 1] = v0 * m[ 1]; //0 * 4 + 1];
//  m/*out*/[ 2] = v0 * m[ 2]; //0 * 4 + 2];
//  m/*out*/[ 3] = v0 * m[ 3]; //0 * 4 + 3];
//  m/*out*/[ 4] = v1 * m[ 4]; //1 * 4 + 0];
//  m/*out*/[ 5] = v1 * m[ 5]; //1 * 4 + 1];
//  m/*out*/[ 6] = v1 * m[ 6]; //1 * 4 + 2];
//  m/*out*/[ 7] = v1 * m[ 7]; //1 * 4 + 3];
//  m/*out*/[ 8] = v2 * m[ 8]; //2 * 4 + 0];
//  m/*out*/[ 9] = v2 * m[ 9]; //2 * 4 + 1];
//  m/*out*/[10] = v2 * m[10]; //2 * 4 + 2];
//  m/*out*/[11] = v2 * m[11]; //2 * 4 + 3];
//
////  if (m !== dst) {
////    out[12] = m[12];
////    out[13] = m[13];
////    out[14] = m[14];
////    out[15] = m[15];
////  }
//
////  return out;
//  return m;
//};

m4.scale = function(m, v) {
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  m[0] = v0 * m[0*4+0];
  m[1] = v0 * m[0*4+1];
  m[2] = v0 * m[0*4+2];
  m[3] = v0 * m[0*4+3];
  m[4] = v1 * m[1*4+0];
  m[5] = v1 * m[1*4+1];
  m[6] = v1 * m[1*4+2];
  m[7] = v1 * m[1*4+3];
  m[8] = v2 * m[2*4+0];
  m[9] = v2 * m[2*4+1];
  m[10] = v2 * m[2*4+2];
  m[11] = v2 * m[2*4+3];

  return m;
};


/**
 * Takes a 4-by-4 matrix and a vector with 3 entries,
 * interprets the vector as a point, transforms that point by the matrix, and
 * returns the result as a vector with 3 entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {Vec3} v The point.
 * @param {Vec3} dst optional vec3 to store result
 * @return {Vec3} dst or new vec3 if not provided
 * @memberOf module:twgl/m4
 */
m4.transformPoint = function(m, v, dst) {
  var out = dst ? dst : v3.create();
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];
  var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

  out[0] = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
  out[1] = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
  out[2] = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;

  return out;
}

/**
 * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
 * direction, transforms that direction by the matrix, and returns the result;
 * assumes the transformation of 3-dimensional space represented by the matrix
 * is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion. Returns a vector with 3
 * entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {Vec3} v The direction.
 * @param {Vec3} dst optional Vec3 to store result
 * @return {Vec3} dst or new Vec3 if not provided
 * @memberOf module:twgl/m4
 */
m4.transformDirection = function(m, v, dst) {
  var out = dst ? dst : v3.create();

  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  out[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
  out[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
  out[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];

  return out;
}

/**
 * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
 * as a normal to a surface, and computes a vector which is normal upon
 * transforming that surface by the matrix. The effect of this function is the
 * same as transforming v (as a direction) by the inverse-transpose of m.  This
 * function assumes the transformation of 3-dimensional space represented by the
 * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
 * translation, but not a perspective distortion.  Returns a vector with 3
 * entries.
 * @param {module:twgl/m4.Mat4} m The matrix.
 * @param {Vec3} v The normal.
 * @param {Vec3} [dst] The direction.
 * @return {Vec3} The transformed direction.
 * @memberOf module:twgl/m4
 */
m4.transformNormal = function(m, v, dst) {
  var out = dst ? dst : v3.create();
  var mi = inverse(m);
  var v0 = v[0];
  var v1 = v[1];
  var v2 = v[2];

  out[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
  out[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
  out[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

  return out;
}


