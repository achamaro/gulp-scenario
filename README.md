[![Build Status](https://travis-ci.org/achamaro/gulp-scenario.png?branch=master)](https://travis-ci.org/achamaro/gulp-scenario)

## Installation

```
$ npm install gulp-scenario --save-dev
```

## Usage

```javascript
var gulp = require('gulp'),
    gs = require('gulp-scenario');

gs.task('task a', function() {

});
gs.task('task b', function() {

});
gs.task('task c', function() {

});

// a -> callback
gs.register('a -> callback', ['a'], function() {

});

// a -> b
gs.register('a > b', ['a', 'b']);

// a ->
// b ->
gs.register('a , b', [['a', 'b']]);

// a ->
//      b ->
//      c ->
gs.register('a > b, c', ['a', ['b', 'c']]);

// a ->
// b ->
//      c ->
gs.register('task ab', ['a', 'b']);
gs.register('a , b > c', ['task ab', 'c']);

```

### task(name, fn)

### register(name, tasks, fn)
