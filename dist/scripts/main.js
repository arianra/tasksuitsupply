"format global";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  var getOwnPropertyDescriptor = true;
  try {
    Object.getOwnPropertyDescriptor({ a: 0 }, 'a');
  }
  catch(e) {
    getOwnPropertyDescriptor = false;
  }

  var defineProperty;
  (function () {
    try {
      if (!!Object.defineProperty({}, 'a', {}))
        defineProperty = Object.defineProperty;
    }
    catch (e) {
      defineProperty = function(obj, prop, opt) {
        try {
          obj[prop] = opt.value || opt.get.call(obj);
        }
        catch(e) {}
      }
    }
  })();

  function register(name, deps, declare) {
    if (arguments.length === 4)
      return registerDynamic.apply(this, arguments);
    doRegister(name, {
      declarative: true,
      deps: deps,
      declare: declare
    });
  }

  function registerDynamic(name, deps, executingRequire, execute) {
    doRegister(name, {
      declarative: false,
      deps: deps,
      executingRequire: executingRequire,
      execute: execute
    });
  }

  function doRegister(name, entry) {
    entry.name = name;

    // we never overwrite an existing define
    if (!(name in defined))
      defined[name] = entry;

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }


  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];

      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;

      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;

      if (typeof name == 'object') {
        for (var p in name)
          exports[p] = name[p];
      }
      else {
        exports[name] = value;
      }

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          for (var j = 0; j < importerModule.dependencies.length; ++j) {
            if (importerModule.dependencies[j] === module) {
              importerModule.setters[j](exports);
            }
          }
        }
      }

      module.locked = false;
      return value;
    });

    module.setters = declaration.setters;
    module.execute = declaration.execute;

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = depEntry.esModule;
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);

      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);

    if (output)
      module.exports = output;

    // create the esModule object, which allows ES6 named imports of dynamics
    exports = module.exports;
 
    if (exports && exports.__esModule) {
      entry.esModule = exports;
    }
    else {
      entry.esModule = {};
      
      // don't trigger getters/setters in environments that support them
      if (typeof exports == 'object' || typeof exports == 'function') {
        if (getOwnPropertyDescriptor) {
          var d;
          for (var p in exports)
            if (d = Object.getOwnPropertyDescriptor(exports, p))
              defineProperty(entry.esModule, p, d);
        }
        else {
          var hasOwnProperty = exports && exports.hasOwnProperty;
          for (var p in exports) {
            if (!hasOwnProperty || exports.hasOwnProperty(p))
              entry.esModule[p] = exports[p];
          }
         }
       }
      entry.esModule['default'] = exports;
      defineProperty(entry.esModule, '__useDefault', {
        value: true
      });
    }
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (!entry || entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    // node core modules
    if (name.substr(0, 6) == '@node/')
      return require(name.substr(6));

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    // exported modules get __esModule defined for interop
    if (entry.declarative)
      defineProperty(entry.module.exports, '__esModule', { value: true });

    // return the defined module object
    return modules[name] = entry.declarative ? entry.module.exports : entry.esModule;
  };

  return function(mains, depNames, declare) {
    return function(formatDetect) {
      formatDetect(function(deps) {
        var System = {
          _nodeRequire: typeof require != 'undefined' && require.resolve && typeof process != 'undefined' && require,
          register: register,
          registerDynamic: registerDynamic,
          get: load, 
          set: function(name, module) {
            modules[name] = module; 
          },
          newModule: function(module) {
            return module;
          }
        };
        System.set('@empty', {});

        // register external dependencies
        for (var i = 0; i < depNames.length; i++) (function(depName, dep) {
          if (dep && dep.__esModule)
            System.register(depName, [], function(_export) {
              return {
                setters: [],
                execute: function() {
                  for (var p in dep)
                    if (p != '__esModule' && !(typeof p == 'object' && p + '' == 'Module'))
                      _export(p, dep[p]);
                }
              };
            });
          else
            System.registerDynamic(depName, [], false, function() {
              return dep;
            });
        })(depNames[i], arguments[i]);

        // register modules in this bundle
        declare(System);

        // load mains
        var firstLoad = load(mains[0]);
        if (mains.length > 1)
          for (var i = 1; i < mains.length; i++)
            load(mains[i]);

        if (firstLoad.__useDefault)
          return firstLoad['default'];
        else
          return firstLoad;
      });
    };
  };

})(typeof self != 'undefined' ? self : global)
/* (['mainModule'], ['external-dep'], function($__System) {
  System.register(...);
})
(function(factory) {
  if (typeof define && define.amd)
    define(['external-dep'], factory);
  // etc UMD / module pattern
})*/

(['1'], [], function($__System) {

(function(__moduleName) {
  $__System.register("2", [], function(exports_1) {
    var assignBase,
        extend,
        defaults;
    return {
      setters: [],
      execute: function() {
        exports_1("assignBase", assignBase = function(assign) {
          var collections = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            collections[_i - 1] = arguments[_i];
          }
          return collections.reduceRight(function(source, destination) {
            Object.keys(source).forEach(function(key) {
              var value = assign(source, key, destination);
              if (value) {
                destination[key] = value;
              }
            });
            return destination;
          });
        });
        exports_1("extend", extend = function() {
          var collections = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            collections[_i - 0] = arguments[_i];
          }
          return assignBase(function(source, key, destination) {
            var value = source[key];
            return (value === void 0) ? null : value;
          }, collections);
        });
        exports_1("defaults", defaults = function() {
          var collections = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            collections[_i - 0] = arguments[_i];
          }
          return assignBase(function(source, key, destination) {
            if (destination[key] !== void 0) {
              return null;
            }
            return source[key];
          }, collections);
        });
      }
    };
  });
})("file:///D:/projects/task-suitsupply/src/core/primitives/collection.ts");

(function(__moduleName) {
  $__System.register("3", [], function(exports_1) {
    var compose,
        noop;
    return {
      setters: [],
      execute: function() {
        exports_1("compose", compose = function() {
          var functions = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            functions[_i - 0] = arguments[_i];
          }
          return noop();
        });
        exports_1("noop", noop = function() {
          return function() {};
        });
      }
    };
  });
})("file:///D:/projects/task-suitsupply/src/core/utils/functional.ts");

(function(__moduleName) {
  $__System.register("4", ["2", "3"], function(exports_1) {
    var collection_1,
        functional_1;
    var XHR;
    return {
      setters: [function(collection_1_1) {
        collection_1 = collection_1_1;
      }, function(functional_1_1) {
        functional_1 = functional_1_1;
      }],
      execute: function() {
        XHR = (function() {
          function XHR(xhrConfig, paused) {
            var _this = this;
            if (paused === void 0) {
              paused = false;
            }
            this.xhrConfig = xhrConfig;
            this.init = function() {
              var xhr = _this.XMLHttpRequest,
                  cfg = _this.xhrConfig;
              if (cfg.headers) {
                cfg.headers.forEach(function(header) {
                  xhr.setRequestHeader(header.header, header.value);
                });
              }
              ['responseType', 'timeout'].forEach(function(value) {
                if (cfg[value] && value in xhr) {
                  xhr[value] = cfg[value];
                }
              });
              xhr.onreadystatechange = _this.onReadyStateChange;
              xhr.onerror = _this.onError;
              xhr.open(cfg.method, cfg.url, cfg.async);
              xhr.send(cfg.data);
              return _this;
            };
            this.onReadyStateChange = function(event) {
              var xhr = _this.XMLHttpRequest,
                  readyState = xhr.readyState;
              switch (readyState) {
                case xhr.DONE:
                  if (xhr.status > 300 || xhr.status < 200) {
                    _this.onError(xhr.status);
                  } else {
                    _this.onSuccess(xhr.responseText);
                  }
                default:
                  _this.onProgress(readyState);
              }
            };
            this.fail = function(errorCallback) {
              _this.onError = errorCallback;
            };
            this.done = function(successCallback) {
              _this.onSuccess = successCallback;
            };
            this.notify = function(progressCallback) {
              _this.onProgress = progressCallback;
            };
            this.onSuccess = functional_1.noop();
            this.onError = functional_1.noop();
            this.onProgress = functional_1.noop();
            this.XMLHttpRequest = new XMLHttpRequest();
            collection_1.extend(xhrConfig, {async: true});
            if (!paused)
              this.init();
            return this;
          }
          return XHR;
        })();
        exports_1("default", XHR);
      }
    };
  });
})("file:///D:/projects/task-suitsupply/src/core/async/xhr.ts");

(function(__moduleName) {
  $__System.register("5", [], function(exports_1) {
    var log;
    return {
      setters: [],
      execute: function() {
        exports_1("log", log = function(message) {
          return console.log(message);
        });
      }
    };
  });
})("file:///D:/projects/task-suitsupply/src/core/utils/debug.ts");

(function(__moduleName) {
  $__System.register("1", ["4", "5"], function(exports_1) {
    var xhr_1,
        debug_1;
    return {
      setters: [function(xhr_1_1) {
        xhr_1 = xhr_1_1;
      }, function(debug_1_1) {
        debug_1 = debug_1_1;
      }],
      execute: function() {
        debug_1.log('hello from core.ts', xhr_1.default);
      }
    };
  });
})("file:///D:/projects/task-suitsupply/src/core/core.ts");

})
(function(factory) {
  factory();
});