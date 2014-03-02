'use strict';

function Scenario(gulp) {
  this._tasks = {};
  this._scenarios = {};
  this.gulp = gulp;
}

Scenario.prototype.task = function(name, fn) {
  if (!fn) return this._tasks[ name ];
  
  this._tasks[ name ] = fn;
  
  return this;
};

Scenario.prototype.hasTask = function(name) {
  return !!this._tasks[ name ];
};

Scenario.prototype.clearTask = function() {
  this._tasks = {};
};

Scenario.prototype.register = function(name, tasks, fn) {
  var parsed = this._scenarios[ name ] = this._parse( name, tasks, fn );
  parsed.forEach(function(task) {
    this.gulp.task(task.name, task.deps, task.fn);
  }.bind(this));
  return this;
};

Scenario.prototype._parse = function(name, tasks, fn) {
  var ret = []
    , deps = [];
  tasks.forEach(function(tg) {
    if (!Array.isArray(tg)) {
      tg = [tg];
    }

    var _deps = [];
    tg.forEach(function(t) {
      if (this._scenarios[ t ]) {
        this._scenarios[ t ].forEach(function(pt, i) {
          var _pt = {
            name: name + '-' + pt.name,
            deps: [],
            fn: pt.fn
          };
          deps.forEach(function(dep) {
            _pt.deps.push(dep);
          });
          pt.deps.forEach(function(ptdep) {
            _pt.deps.push(name + '-' + ptdep);
          });
          _deps.push( _pt.name );
          ret.push( _pt );
        });
      }
      else {
        var taskname = name + '-' + t;
        _deps.push( taskname );
        ret.push({
          name: taskname,
          deps: deps,
          fn: this.task( t )
        });
      }
    }.bind(this));

    deps = _deps;
  }.bind(this));

  ret.push({
    name: name,
    deps: deps,
    fn: fn
  })
  return ret;
};

module.exports = Scenario;