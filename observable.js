// observable by Dominic Tarr
// https://www.npmjs.com/package/observable

;(function () {
"use strict";

//check if this call is a get.
function isGet(val) {
  return undefined === val
}

//check if this call is a set, else, it's a listen
function isSet(val) {
  return 'function' !== typeof val
}

function isFunction (fun) {
  return 'function' === typeof fun
}

function assertObservable (observable) {
  if(!isFunction(observable))
    throw new Error('transform expects an observable')
  return observable
}

//trigger all listeners
function all(ary, val) {
  for(var k in ary)
    ary[k](val)
}

//remove a listener
function remove(ary, item) {
  delete ary[ary.indexOf(item)]
}

//register a listener
function on(emitter, event, listener) {
  (emitter.on || emitter.addEventListener)
    .call(emitter, event, listener, false)
}

function off(emitter, event, listener) {
  (emitter.removeListener || emitter.removeEventListener || emitter.off)
    .call(emitter, event, listener, false)
}

//An observable that stores a value.

function value (initialValue) {
  var _val = initialValue, listeners = []
  function set(val) {
    if (val === _val) return;
    all(listeners, _val = val)
  }
  observable.set = set;
  return observable

  function observable(val) {
    return (
      isGet(val) ? _val
    : isSet(val) ? set(val)
    : (listeners.push(val), val(_val), function () {
        remove(listeners, val)
      })
  )}}
  //^ if written in this style, always ends )}}

if('object' === typeof module) module.exports = value
else                           window.observable = value
})()
