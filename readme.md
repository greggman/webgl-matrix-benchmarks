Simple benchmarks for testing the speed of JavaScript matrix libraries adapted from Brandon Jones benchmarks
in his glmatrix library: https://glmatrix.googlecode.com/hg/

You can run the benchmarks [here](https://greggman.github.io/webgl-matrix-benchmarks/matrix_benchmark.html).

You can select specific benchmarks by adding `?tests=name,name,name` for example

test glMatrix (float32) vs glMatrix-native vs glMatrix-float64

https://greggman.github.io/webgl-matrix-benchmarks/matrix_benchmark.html?tests=glMatrix,glMatrix-native,glMatrix-float64

test twgl (float32) vs twgl-native vs twgl-float64

https://greggman.github.io/webgl-matrix-benchmarks/matrix_benchmark.html?tests=twgl,twgl-native,twgl-float64

Note: an observation ... whether or not a particlar JavaScript engine optimizes something seems to be
context dependent. I've seen one library outperform another even when the code is **EXACTLY** the same.
In trying to track down why one was faster than another I copy the code (say matrix multiply) from
one library to the other and yet still found a difference in execution larger than noise. In general though
execution is consistant across runs

This work is based on Brandon's work as of this commit:

    e5ad8f6975eef038de668914a44ed36e2c611966
    Date:	October 10, 2010 12:49:00 PM EDT
    Upped version to 0.9.5

Comparing these matrix libraries:

* [glMatrix](http://code.google.com/p/glmatrix), [zlib license](http://www.opensource.org/licenses/Zlib)
* [mjs](http://code.google.com/p/webgl-mjs), [MIT license](http://www.opensource.org/licenses/mit-license.php)
* CanvasMatrix
* [EWGL_math](http://code.google.com/p/ewgl-matrices), [New BSD license](http://www.opensource.org/licenses/bsd-license.php)
* [tdl](http://github.com/greggman/tdl/), [New BSD license](http://www.opensource.org/licenses/bsd-license.php)
* [Three.js](http://threejs.org), [New BSD license](http://www.opensource.org/licenses/bsd-license.php)
* [twgl](http://twgljs.org), [New BSD license](http://www.opensource.org/licenses/bsd-license.php)
* [Closure](http://closure-library.googlecode.com/), [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
* [Sylvester](http://sylvester.jcoglan.com/), [MIT license](http://www.opensource.org/licenses/mit-license.php)

Changes from Brandon's original benchmark code include:

* Only including the benchmark code from glmatrix.
* Updated to the latest mjs as of Dec 15: 16:8e5b0944ef1e and included it in several more tests.
* Added a graph display of the results using flotr, see: http://solutoire.com/flotr/
* Added tdl library (thanks to Gregg Tavares)
* each library runs in an iframe so the code won't affect the other libraries (thanks to Gregg Tavares)
* Added Sylvester library (thanks to [Felix E. Klee](mailto:felix.klee@inka.de))

Brandon's original code was released under the [New BSD license](http://www.opensource.org/licenses/bsd-license.php).
My additions to the benchmarking code are released under the same license.


