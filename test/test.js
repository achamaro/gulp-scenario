'use strict';

var gulp = require('gulp')
  , gs = require('../')
  , q = require('q');

require('should');
require('mocha');

function _defer(cb, delay) {
    var d = q.defer();
    setTimeout(function() {
        cb && cb();
        d.resolve();
    }, delay || 0);
    return d.promise;
}

describe('gulp scenario', function() {
    describe('task()', function() {
        it('set = get', function() {
            var fn = function() {};
            gs.task('a', fn);
            gs.task('a').should.equal( fn );
        });
    });

    describe('hasTask()', function() {
        it('has task', function() {
            gs.hasTask('a').should.be.true;
        });
    });

    describe('clearTask()', function() {
        it('clear task', function() {
            gs.clearTask();
            gs.hasTask('a').should.be.false;
        });
    });

    describe('register()', function() {
        it('a > b', function(done) {
            var a = false, b = false;
            gs.task('a', function() {
                return _defer(function() {
                    b.should.be.false;
                    a = true;
                }, 100);
            });
            gs.task('b', function() {
                return _defer(function() {
                    a.should.be.true;
                    b = true;
                });
            });
            gs.register('a > b', ['a', 'b'], function() {
                return _defer(function() {
                    a.should.be.true;
                    b.should.be.true;
                });
            });
            gulp.run('a > b', function() {
                gulp.isRunning.should.be.false;
                gulp.reset();
                done();
            });
        });

        it('a > [b, c] > d', function(done) {
            var a = false, b = false, c = false, d = false;
            
            gs.task('a', function() {
                return _defer(function() {
                    b.should.be.false;
                    c.should.be.false;
                    d.should.be.false;
                    a = true;
                }, 100);
            });
            gs.task('b', function() {
                return _defer(function() {
                    a.should.be.true;
                    d.should.be.false;
                    b = true;
                });
            });
            gs.task('c', function() {
                _defer(function() {
                    a.should.be.true;
                });

                return _defer(function() {
                    d.should.be.false;
                    c = true;
                }, 100);
            });
            gs.task('d', function() {
                return _defer(function() {
                    a.should.be.true;
                    b.should.be.true;
                    c.should.be.true;
                    d = true;
                });
            });
            gs.register('a > [b, c] > d', ['a', ['b', 'c'], 'd']);
            gulp.run('a > [b, c] > d', function() {
                a.should.be.true;
                b.should.be.true;
                c.should.be.true;
                d.should.be.true;
                gulp.isRunning.should.be.false;
                gulp.reset();
                done();
            });
        });

        it('scenario a > scenario b', function(done) {
            var a = false, b = false, c = false, d = false;
            
            gs.clearTask();

            gs.task('a', function() {
                return _defer(function(){
                    a = true;
                }, 100);
            });

            gs.task('b', function() {
                return _defer(function(){
                    b = true;
                });
            });

            gs.task('c', function() {
                return _defer(function(){
                    a.should.be.true;
                    b.should.be.true;
                    c = true;
                }, 100);
            });

            gs.task('d', function() {
                return _defer(function(){
                    d = true;
                });
            });

            gs.register('scenario a', ['a', 'b'], function() {
                return _defer(function() {
                    a.should.be.true;
                    b.should.be.true;
                    c.should.be.false;
                    d.should.be.false;
                });
            });
            gs.register('scenario b', ['c', 'd']);

            gs.register('scenario a > scenario b', ['scenario a', 'scenario b']);

            gulp.run('scenario a > scenario b', function() {
                gulp.isRunning.should.be.false;
                gulp.reset();
                done();
            });
        });
    });
});

