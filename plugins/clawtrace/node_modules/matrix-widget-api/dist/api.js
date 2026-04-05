(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mxwidgets = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientWidgetApi = void 0;
var _events = require("events");
var _PostmessageTransport = require("./transport/PostmessageTransport");
var _WidgetApiDirection = require("./interfaces/WidgetApiDirection");
var _WidgetApiAction = require("./interfaces/WidgetApiAction");
var _Capabilities = require("./interfaces/Capabilities");
var _ApiVersion = require("./interfaces/ApiVersion");
var _WidgetEventCapability = require("./models/WidgetEventCapability");
var _GetOpenIDAction = require("./interfaces/GetOpenIDAction");
var _SimpleObservable = require("./util/SimpleObservable");
var _Symbols = require("./Symbols");
var _UpdateDelayedEventAction = require("./interfaces/UpdateDelayedEventAction");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(value) { var ret = this.s["return"]; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, "throw": function _throw(value) { var thr = this.s["return"]; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Copyright 2020 - 2024 The Matrix.org Foundation C.I.C.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             *         http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */
/**
 * API handler for the client side of widgets. This raises events
 * for each action received as `action:${action}` (eg: "action:screenshot").
 * Default handling can be prevented by using preventDefault() on the
 * raised event. The default handling varies for each action: ones
 * which the SDK can handle safely are acknowledged appropriately and
 * ones which are unhandled (custom or require the client to do something)
 * are rejected with an error.
 *
 * Events which are preventDefault()ed must reply using the transport.
 * The events raised will have a default of an IWidgetApiRequest
 * interface.
 *
 * When the ClientWidgetApi is ready to start sending requests, it will
 * raise a "ready" CustomEvent. After the ready event fires, actions can
 * be sent and the transport will be ready.
 *
 * When the widget has indicated it has loaded, this class raises a
 * "preparing" CustomEvent. The preparing event does not indicate that
 * the widget is ready to receive communications - that is signified by
 * the ready event exclusively.
 *
 * This class only handles one widget at a time.
 */
var ClientWidgetApi = /*#__PURE__*/function (_EventEmitter) {
  _inherits(ClientWidgetApi, _EventEmitter);
  var _super = _createSuper(ClientWidgetApi);
  /**
   * Creates a new client widget API. This will instantiate the transport
   * and start everything. When the iframe is loaded under the widget's
   * conditions, a "ready" event will be raised.
   * @param {Widget} widget The widget to communicate with.
   * @param {HTMLIFrameElement} iframe The iframe the widget is in.
   * @param {WidgetDriver} driver The driver for this widget/client.
   */
  function ClientWidgetApi(widget, iframe, driver) {
    var _this;
    _classCallCheck(this, ClientWidgetApi);
    _this = _super.call(this);
    _this.widget = widget;
    _this.driver = driver;
    _defineProperty(_assertThisInitialized(_this), "transport", void 0);
    _defineProperty(_assertThisInitialized(_this), "cachedWidgetVersions", null);
    // contentLoadedActionSent is used to check that only one ContentLoaded request is send.
    _defineProperty(_assertThisInitialized(_this), "contentLoadedActionSent", false);
    _defineProperty(_assertThisInitialized(_this), "allowedCapabilities", new Set());
    _defineProperty(_assertThisInitialized(_this), "allowedEvents", []);
    _defineProperty(_assertThisInitialized(_this), "isStopped", false);
    _defineProperty(_assertThisInitialized(_this), "turnServers", null);
    _defineProperty(_assertThisInitialized(_this), "contentLoadedWaitTimer", void 0);
    // Stores pending requests to push a room's state to the widget
    _defineProperty(_assertThisInitialized(_this), "pushRoomStateTasks", new Set());
    // Room ID → event type → state key → events to be pushed
    _defineProperty(_assertThisInitialized(_this), "pushRoomStateResult", new Map());
    _defineProperty(_assertThisInitialized(_this), "flushRoomStateTask", null);
    _defineProperty(_assertThisInitialized(_this), "viewedRoomId", null);
    if (!(iframe !== null && iframe !== void 0 && iframe.contentWindow)) {
      throw new Error("No iframe supplied");
    }
    if (!widget) {
      throw new Error("Invalid widget");
    }
    if (!driver) {
      throw new Error("Invalid driver");
    }
    _this.transport = new _PostmessageTransport.PostmessageTransport(_WidgetApiDirection.WidgetApiDirection.ToWidget, widget.id, iframe.contentWindow, globalThis);
    _this.transport.targetOrigin = widget.origin;
    _this.transport.on("message", _this.handleMessage.bind(_assertThisInitialized(_this)));
    iframe.addEventListener("load", _this.onIframeLoad.bind(_assertThisInitialized(_this)));
    _this.transport.start();
    return _this;
  }
  _createClass(ClientWidgetApi, [{
    key: "hasCapability",
    value: function hasCapability(capability) {
      return this.allowedCapabilities.has(capability);
    }
  }, {
    key: "canUseRoomTimeline",
    value: function canUseRoomTimeline(roomId) {
      return this.hasCapability("org.matrix.msc2762.timeline:".concat(_Symbols.Symbols.AnyRoom)) || this.hasCapability("org.matrix.msc2762.timeline:".concat(roomId));
    }
  }, {
    key: "canSendRoomEvent",
    value: function canSendRoomEvent(eventType) {
      var msgtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.allowedEvents.some(function (e) {
        return e.matchesAsRoomEvent(_WidgetEventCapability.EventDirection.Send, eventType, msgtype);
      });
    }
  }, {
    key: "canSendStateEvent",
    value: function canSendStateEvent(eventType, stateKey) {
      return this.allowedEvents.some(function (e) {
        return e.matchesAsStateEvent(_WidgetEventCapability.EventDirection.Send, eventType, stateKey);
      });
    }
  }, {
    key: "canSendToDeviceEvent",
    value: function canSendToDeviceEvent(eventType) {
      return this.allowedEvents.some(function (e) {
        return e.matchesAsToDeviceEvent(_WidgetEventCapability.EventDirection.Send, eventType);
      });
    }
  }, {
    key: "canReceiveRoomEvent",
    value: function canReceiveRoomEvent(eventType) {
      var msgtype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.allowedEvents.some(function (e) {
        return e.matchesAsRoomEvent(_WidgetEventCapability.EventDirection.Receive, eventType, msgtype);
      });
    }
  }, {
    key: "canReceiveStateEvent",
    value: function canReceiveStateEvent(eventType, stateKey) {
      return this.allowedEvents.some(function (e) {
        return e.matchesAsStateEvent(_WidgetEventCapability.EventDirection.Receive, eventType, stateKey);
      });
    }
  }, {
    key: "canReceiveToDeviceEvent",
    value: function canReceiveToDeviceEvent(eventType) {
      return this.allowedEvents.some(function (e) {
        return e.matchesAsToDeviceEvent(_WidgetEventCapability.EventDirection.Receive, eventType);
      });
    }
  }, {
    key: "canReceiveRoomAccountData",
    value: function canReceiveRoomAccountData(eventType) {
      return this.allowedEvents.some(function (e) {
        return e.matchesAsRoomAccountData(_WidgetEventCapability.EventDirection.Receive, eventType);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      this.isStopped = true;
      this.transport.stop();
    }
  }, {
    key: "getWidgetVersions",
    value: function () {
      var _getWidgetVersions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var r;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!Array.isArray(this.cachedWidgetVersions)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return", this.cachedWidgetVersions);
            case 2:
              _context.prev = 2;
              _context.next = 5;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.SupportedApiVersions, {});
            case 5:
              r = _context.sent;
              this.cachedWidgetVersions = r.supported_versions;
              return _context.abrupt("return", r.supported_versions);
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](2);
              console.warn("non-fatal error getting supported widget versions: ", _context.t0);
              return _context.abrupt("return", []);
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[2, 10]]);
      }));
      function getWidgetVersions() {
        return _getWidgetVersions.apply(this, arguments);
      }
      return getWidgetVersions;
    }()
  }, {
    key: "beginCapabilities",
    value: function beginCapabilities() {
      var _this2 = this;
      // widget has loaded - tell all the listeners that
      this.emit("preparing");
      var requestedCaps;
      this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.Capabilities, {}).then(function (caps) {
        requestedCaps = caps.capabilities;
        return _this2.driver.validateCapabilities(new Set(caps.capabilities));
      }).then(function (allowedCaps) {
        _this2.allowCapabilities(_toConsumableArray(allowedCaps), requestedCaps);
        _this2.emit("ready");
      })["catch"](function (e) {
        _this2.emit("error:preparing", e);
      });
    }
  }, {
    key: "allowCapabilities",
    value: function allowCapabilities(allowed, requested) {
      var _this$allowedEvents,
        _this3 = this;
      console.log("Widget ".concat(this.widget.id, " is allowed capabilities:"), allowed);
      var _iterator2 = _createForOfIteratorHelper(allowed),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var c = _step2.value;
          this.allowedCapabilities.add(c);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var allowedEvents = _WidgetEventCapability.WidgetEventCapability.findEventCapabilities(allowed);
      (_this$allowedEvents = this.allowedEvents).push.apply(_this$allowedEvents, _toConsumableArray(allowedEvents));
      this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.NotifyCapabilities, {
        requested: requested,
        approved: Array.from(this.allowedCapabilities)
      })["catch"](function (e) {
        console.warn("non-fatal error notifying widget of approved capabilities:", e);
      }).then(function () {
        _this3.emit("capabilitiesNotified");
      });

      // Push the initial room state for all rooms with a timeline capability
      var _iterator3 = _createForOfIteratorHelper(allowed),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _c = _step3.value;
          if ((0, _Capabilities.isTimelineCapability)(_c)) {
            var roomId = (0, _Capabilities.getTimelineRoomIDFromCapability)(_c);
            if (roomId === _Symbols.Symbols.AnyRoom) {
              var _iterator5 = _createForOfIteratorHelper(this.driver.getKnownRooms()),
                _step5;
              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  var _roomId = _step5.value;
                  this.pushRoomState(_roomId);
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
            } else {
              this.pushRoomState(roomId);
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (allowed.includes(_Capabilities.MatrixCapabilities.MSC4407ReceiveStickyEvent)) {
        console.debug("Widget ".concat(this.widget.id, " is allowed to receive sticky events, check current sticky state."));
        // If the widget can receive sticky events, push all sticky events in known rooms now.
        // Sticky events are like a state, and passed history is needed to get the full state.
        var roomIds = allowed.filter(function (capability) {
          return (0, _Capabilities.isTimelineCapability)(capability);
        }).map(function (timelineCapability) {
          return (0, _Capabilities.getTimelineRoomIDFromCapability)(timelineCapability);
        }).flatMap(function (roomIdOrWildcard) {
          if (roomIdOrWildcard === _Symbols.Symbols.AnyRoom) {
            // Do we support getting sticky state for any room?
            return _this3.driver.getKnownRooms();
          } else {
            return roomIdOrWildcard;
          }
        });
        console.debug("Widget ".concat(this.widget.id, " is allowed to receive sticky events in rooms:"), roomIds);
        var _iterator4 = _createForOfIteratorHelper(roomIds),
          _step4;
        try {
          var _loop = function _loop() {
            var roomId = _step4.value;
            _this3.pushStickyState(roomId)["catch"](function (err) {
              console.error("Failed to push sticky events to widget ".concat(_this3.widget.id, " for room ").concat(roomId, ":"), err);
            });
          };
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }

      // If new events are allowed and the currently viewed room isn't covered
      // by a timeline capability, then we know that there could be some state
      // in the viewed room that the widget hasn't learned about yet- push it.
      if (allowedEvents.length > 0 && this.viewedRoomId !== null && !this.canUseRoomTimeline(this.viewedRoomId)) {
        this.pushRoomState(this.viewedRoomId);
      }
    }
  }, {
    key: "onIframeLoad",
    value: function onIframeLoad(ev) {
      if (this.widget.waitForIframeLoad) {
        // If the widget is set to waitForIframeLoad the capabilities immediately get setup after load.
        // The client does not wait for the ContentLoaded action.
        this.beginCapabilities();
      } else {
        // Reaching this means, that the Iframe got reloaded/loaded and
        // the clientApi is awaiting the FIRST ContentLoaded action.
        console.log("waitForIframeLoad is false: waiting for widget to send contentLoaded");
        this.contentLoadedWaitTimer = setTimeout(function () {
          console.error("Widget specified waitForIframeLoad=false but timed out waiting for contentLoaded event!");
        }, 10000);
        this.contentLoadedActionSent = false;
      }
    }
  }, {
    key: "handleContentLoadedAction",
    value: function handleContentLoadedAction(action) {
      if (this.contentLoadedWaitTimer !== undefined) {
        clearTimeout(this.contentLoadedWaitTimer);
        this.contentLoadedWaitTimer = undefined;
      }
      if (this.contentLoadedActionSent) {
        throw new Error("Improper sequence: ContentLoaded Action can only be sent once after the widget loaded " + "and should only be used if waitForIframeLoad is false (default=true)");
      }
      if (this.widget.waitForIframeLoad) {
        this.transport.reply(action, {
          error: {
            message: "Improper sequence: not expecting ContentLoaded event if " + "waitForIframeLoad is true (default=true)"
          }
        });
      } else {
        this.transport.reply(action, {});
        this.beginCapabilities();
      }
      this.contentLoadedActionSent = true;
    }
  }, {
    key: "replyVersions",
    value: function replyVersions(request) {
      this.transport.reply(request, {
        supported_versions: _ApiVersion.CurrentApiVersions
      });
    }
  }, {
    key: "supportsUpdateState",
    value: function () {
      var _supportsUpdateState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getWidgetVersions();
            case 2:
              return _context2.abrupt("return", _context2.sent.includes(_ApiVersion.UnstableApiVersion.MSC2762_UPDATE_STATE));
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function supportsUpdateState() {
        return _supportsUpdateState.apply(this, arguments);
      }
      return supportsUpdateState;
    }()
  }, {
    key: "handleCapabilitiesRenegotiate",
    value: function handleCapabilitiesRenegotiate(request) {
      var _request$data,
        _this4 = this;
      // acknowledge first
      this.transport.reply(request, {});
      var requested = ((_request$data = request.data) === null || _request$data === void 0 ? void 0 : _request$data.capabilities) || [];
      var newlyRequested = new Set(requested.filter(function (r) {
        return !_this4.hasCapability(r);
      }));
      if (newlyRequested.size === 0) {
        // Nothing to do - skip validation
        this.allowCapabilities([], []);
      }
      this.driver.validateCapabilities(newlyRequested).then(function (allowed) {
        return _this4.allowCapabilities(_toConsumableArray(allowed), _toConsumableArray(newlyRequested));
      });
    }
  }, {
    key: "handleNavigate",
    value: function handleNavigate(request) {
      var _request$data2,
        _this5 = this;
      if (!this.hasCapability(_Capabilities.MatrixCapabilities.MSC2931Navigate)) {
        return this.transport.reply(request, {
          error: {
            message: "Missing capability"
          }
        });
      }
      if (!((_request$data2 = request.data) !== null && _request$data2 !== void 0 && _request$data2.uri.startsWith("https://matrix.to/#"))) {
        return this.transport.reply(request, {
          error: {
            message: "Invalid matrix.to URI"
          }
        });
      }
      var onErr = function onErr(e) {
        console.error("[ClientWidgetApi] Failed to handle navigation: ", e);
        _this5.handleDriverError(e, request, "Error handling navigation");
      };
      try {
        this.driver.navigate(request.data.uri.toString())["catch"](function (e) {
          return onErr(e);
        }).then(function () {
          return _this5.transport.reply(request, {});
        });
      } catch (e) {
        return onErr(e);
      }
    }
  }, {
    key: "handleOIDC",
    value: function handleOIDC(request) {
      var _this6 = this;
      var phase = 1; // 1 = initial request, 2 = after user manual confirmation

      var replyState = function replyState(state, credential) {
        credential = credential || {};
        if (phase > 1) {
          return _this6.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.OpenIDCredentials, _objectSpread({
            state: state,
            original_request_id: request.requestId
          }, credential));
        } else {
          return _this6.transport.reply(request, _objectSpread({
            state: state
          }, credential));
        }
      };
      var replyError = function replyError(msg) {
        console.error("[ClientWidgetApi] Failed to handle OIDC: ", msg);
        if (phase > 1) {
          // We don't have a way to indicate that a random error happened in this flow, so
          // just block the attempt.
          return replyState(_GetOpenIDAction.OpenIDRequestState.Blocked);
        } else {
          return _this6.transport.reply(request, {
            error: {
              message: msg
            }
          });
        }
      };
      var observer = new _SimpleObservable.SimpleObservable(function (update) {
        if (update.state === _GetOpenIDAction.OpenIDRequestState.PendingUserConfirmation && phase > 1) {
          observer.close();
          return replyError("client provided out-of-phase response to OIDC flow");
        }
        if (update.state === _GetOpenIDAction.OpenIDRequestState.PendingUserConfirmation) {
          replyState(update.state);
          phase++;
          return;
        }
        if (update.state === _GetOpenIDAction.OpenIDRequestState.Allowed && !update.token) {
          return replyError("client provided invalid OIDC token for an allowed request");
        }
        if (update.state === _GetOpenIDAction.OpenIDRequestState.Blocked) {
          update.token = undefined; // just in case the client did something weird
        }

        observer.close();
        return replyState(update.state, update.token);
      });
      this.driver.askOpenID(observer);
    }
  }, {
    key: "handleReadRoomAccountData",
    value: function handleReadRoomAccountData(request) {
      var _this7 = this;
      var events = this.driver.readRoomAccountData(request.data.type);
      if (!this.canReceiveRoomAccountData(request.data.type)) {
        return this.transport.reply(request, {
          error: {
            message: "Cannot read room account data of this type"
          }
        });
      }
      return events.then(function (evs) {
        _this7.transport.reply(request, {
          events: evs
        });
      });
    }
  }, {
    key: "handleReadEvents",
    value: function () {
      var _handleReadEvents = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(request) {
        var _this8 = this;
        var askRoomIds, _iterator6, _step6, roomId, limit, since, stateKey, msgtype, _stateKey, events;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (request.data.type) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Invalid request - missing event type"
                }
              }));
            case 2:
              if (!(request.data.limit !== undefined && (!request.data.limit || request.data.limit < 0))) {
                _context3.next = 4;
                break;
              }
              return _context3.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Invalid request - limit out of range"
                }
              }));
            case 4:
              if (!(request.data.room_ids === undefined)) {
                _context3.next = 8;
                break;
              }
              askRoomIds = this.viewedRoomId === null ? [] : [this.viewedRoomId];
              _context3.next = 30;
              break;
            case 8:
              if (!(request.data.room_ids === _Symbols.Symbols.AnyRoom)) {
                _context3.next = 12;
                break;
              }
              askRoomIds = this.driver.getKnownRooms().filter(function (roomId) {
                return _this8.canUseRoomTimeline(roomId);
              });
              _context3.next = 30;
              break;
            case 12:
              askRoomIds = request.data.room_ids;
              _iterator6 = _createForOfIteratorHelper(askRoomIds);
              _context3.prev = 14;
              _iterator6.s();
            case 16:
              if ((_step6 = _iterator6.n()).done) {
                _context3.next = 22;
                break;
              }
              roomId = _step6.value;
              if (this.canUseRoomTimeline(roomId)) {
                _context3.next = 20;
                break;
              }
              return _context3.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Unable to access room timeline: ".concat(roomId)
                }
              }));
            case 20:
              _context3.next = 16;
              break;
            case 22:
              _context3.next = 27;
              break;
            case 24:
              _context3.prev = 24;
              _context3.t0 = _context3["catch"](14);
              _iterator6.e(_context3.t0);
            case 27:
              _context3.prev = 27;
              _iterator6.f();
              return _context3.finish(27);
            case 30:
              limit = request.data.limit || 0;
              since = request.data.since;
              stateKey = undefined;
              msgtype = undefined;
              if (!(request.data.state_key !== undefined)) {
                _context3.next = 40;
                break;
              }
              stateKey = request.data.state_key === true ? undefined : request.data.state_key.toString();
              if (this.canReceiveStateEvent(request.data.type, (_stateKey = stateKey) !== null && _stateKey !== void 0 ? _stateKey : null)) {
                _context3.next = 38;
                break;
              }
              return _context3.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Cannot read state events of this type"
                }
              }));
            case 38:
              _context3.next = 43;
              break;
            case 40:
              msgtype = request.data.msgtype;
              if (this.canReceiveRoomEvent(request.data.type, msgtype)) {
                _context3.next = 43;
                break;
              }
              return _context3.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Cannot read room events of this type"
                }
              }));
            case 43:
              if (!(request.data.room_ids === undefined && askRoomIds.length === 0)) {
                _context3.next = 50;
                break;
              }
              // For backwards compatibility we still call the deprecated
              // readRoomEvents and readStateEvents methods in case the client isn't
              // letting us know the currently viewed room via setViewedRoomId
              //
              // This can be considered as a deprecated implementation.
              // A driver should call `setViewedRoomId` on the widget messaging and implement the new readRoomState and readRoomTimeline
              // Methods.
              // This block makes sure that it is also possible to not use setViewedRoomId.
              // readRoomTimeline and readRoomState are required however! Otherwise widget requests that include
              // `room_ids` will fail.
              console.warn("The widgetDriver uses deprecated behaviour:\n It does not set the viewedRoomId using `setViewedRoomId`");
              _context3.next = 47;
              return (
                // This returns [] with the current driver of Element Web.
                // Add default implementations of the `readRoomEvents` and `readStateEvents`
                // methods to use `readRoomTimeline` and `readRoomState` if they are not overwritten.
                request.data.state_key === undefined ? this.driver.readRoomEvents(request.data.type, msgtype, limit, null, since) : this.driver.readStateEvents(request.data.type, stateKey, limit, null)
              );
            case 47:
              events = _context3.sent;
              _context3.next = 68;
              break;
            case 50:
              _context3.next = 52;
              return this.supportsUpdateState();
            case 52:
              if (!_context3.sent) {
                _context3.next = 58;
                break;
              }
              _context3.next = 55;
              return Promise.all(askRoomIds.map(function (roomId) {
                return _this8.driver.readRoomTimeline(roomId, request.data.type, msgtype, stateKey, limit, since);
              }));
            case 55:
              events = _context3.sent.flat(1);
              _context3.next = 68;
              break;
            case 58:
              if (!(request.data.state_key === undefined)) {
                _context3.next = 64;
                break;
              }
              _context3.next = 61;
              return Promise.all(askRoomIds.map(function (roomId) {
                return _this8.driver.readRoomTimeline(roomId, request.data.type, msgtype, stateKey, limit, since);
              }));
            case 61:
              _context3.t1 = _context3.sent;
              _context3.next = 67;
              break;
            case 64:
              _context3.next = 66;
              return Promise.all(askRoomIds.map(function (roomId) {
                return _this8.driver.readRoomState(roomId, request.data.type, stateKey);
              }));
            case 66:
              _context3.t1 = _context3.sent;
            case 67:
              events = _context3.t1.flat(1);
            case 68:
              this.transport.reply(request, {
                events: events
              });
            case 69:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[14, 24, 27, 30]]);
      }));
      function handleReadEvents(_x) {
        return _handleReadEvents.apply(this, arguments);
      }
      return handleReadEvents;
    }()
  }, {
    key: "handleSendEvent",
    value: function handleSendEvent(request) {
      var _this9 = this;
      if (!request.data.type) {
        return this.transport.reply(request, {
          error: {
            message: "Invalid request - missing event type"
          }
        });
      }
      if (!!request.data.room_id && !this.canUseRoomTimeline(request.data.room_id)) {
        return this.transport.reply(request, {
          error: {
            message: "Unable to access room timeline: ".concat(request.data.room_id)
          }
        });
      }
      var isDelayedEvent = request.data.delay !== undefined || request.data.parent_delay_id !== undefined;
      if (isDelayedEvent && !this.hasCapability(_Capabilities.MatrixCapabilities.MSC4157SendDelayedEvent)) {
        return this.transport.reply(request, {
          error: {
            message: "Missing capability for ".concat(_Capabilities.MatrixCapabilities.MSC4157SendDelayedEvent)
          }
        });
      }
      var isStickyEvent = request.data.sticky_duration_ms !== undefined;
      if (isStickyEvent && !this.hasCapability(_Capabilities.MatrixCapabilities.MSC4407SendStickyEvent)) {
        return this.transport.reply(request, {
          error: {
            message: "Missing capability for ".concat(_Capabilities.MatrixCapabilities.MSC4407SendStickyEvent)
          }
        });
      }
      var sendEventPromise;
      if (request.data.state_key !== undefined) {
        if (!this.canSendStateEvent(request.data.type, request.data.state_key)) {
          return this.transport.reply(request, {
            error: {
              message: "Cannot send state events of this type"
            }
          });
        }
        if (isStickyEvent) {
          return this.transport.reply(request, {
            error: {
              message: "Cannot send a state event with a sticky duration"
            }
          });
        }
        if (isDelayedEvent) {
          var _request$data$delay, _request$data$parent_;
          sendEventPromise = this.driver.sendDelayedEvent((_request$data$delay = request.data.delay) !== null && _request$data$delay !== void 0 ? _request$data$delay : null, (_request$data$parent_ = request.data.parent_delay_id) !== null && _request$data$parent_ !== void 0 ? _request$data$parent_ : null, request.data.type, request.data.content || {}, request.data.state_key, request.data.room_id);
        } else {
          sendEventPromise = this.driver.sendEvent(request.data.type, request.data.content || {}, request.data.state_key, request.data.room_id);
        }
      } else {
        var content = request.data.content || {};
        var msgtype = content["msgtype"];
        if (!this.canSendRoomEvent(request.data.type, msgtype)) {
          return this.transport.reply(request, {
            error: {
              message: "Cannot send room events of this type"
            }
          });
        }

        // Events can be sticky, delayed, both, or neither. The following
        // section of code takes the common parameters and uses the correct
        // function depending on the request type.

        var params = [request.data.type, content, null,
        // not sending a state event
        request.data.room_id];
        if (isDelayedEvent && request.data.sticky_duration_ms) {
          var _request$data$delay2, _request$data$parent_2;
          sendEventPromise = this.driver.sendDelayedStickyEvent((_request$data$delay2 = request.data.delay) !== null && _request$data$delay2 !== void 0 ? _request$data$delay2 : null, (_request$data$parent_2 = request.data.parent_delay_id) !== null && _request$data$parent_2 !== void 0 ? _request$data$parent_2 : null, request.data.sticky_duration_ms, request.data.type, content, request.data.room_id);
        } else if (isDelayedEvent) {
          var _this$driver, _request$data$delay3, _request$data$parent_3;
          sendEventPromise = (_this$driver = this.driver).sendDelayedEvent.apply(_this$driver, [(_request$data$delay3 = request.data.delay) !== null && _request$data$delay3 !== void 0 ? _request$data$delay3 : null, (_request$data$parent_3 = request.data.parent_delay_id) !== null && _request$data$parent_3 !== void 0 ? _request$data$parent_3 : null].concat(params));
        } else if (request.data.sticky_duration_ms) {
          sendEventPromise = this.driver.sendStickyEvent(request.data.sticky_duration_ms, request.data.type, content, request.data.room_id);
        } else {
          var _this$driver2;
          sendEventPromise = (_this$driver2 = this.driver).sendEvent.apply(_this$driver2, params);
        }
      }
      sendEventPromise.then(function (sentEvent) {
        return _this9.transport.reply(request, _objectSpread({
          room_id: sentEvent.roomId
        }, "eventId" in sentEvent ? {
          event_id: sentEvent.eventId
        } : {
          delay_id: sentEvent.delayId
        }));
      })["catch"](function (e) {
        console.error("error sending event: ", e);
        _this9.handleDriverError(e, request, "Error sending event");
      });
    }
  }, {
    key: "handleUpdateDelayedEvent",
    value: function handleUpdateDelayedEvent(request) {
      var _this10 = this;
      if (!request.data.delay_id) {
        return this.transport.reply(request, {
          error: {
            message: "Invalid request - missing delay_id"
          }
        });
      }
      if (!this.hasCapability(_Capabilities.MatrixCapabilities.MSC4157UpdateDelayedEvent)) {
        return this.transport.reply(request, {
          error: {
            message: "Missing capability"
          }
        });
      }
      var updateDelayedEvent;
      switch (request.data.action) {
        case _UpdateDelayedEventAction.UpdateDelayedEventAction.Cancel:
          updateDelayedEvent = this.driver.cancelScheduledDelayedEvent;
          break;
        case _UpdateDelayedEventAction.UpdateDelayedEventAction.Restart:
          updateDelayedEvent = this.driver.restartScheduledDelayedEvent;
          break;
        case _UpdateDelayedEventAction.UpdateDelayedEventAction.Send:
          updateDelayedEvent = this.driver.sendScheduledDelayedEvent;
          break;
        default:
          return this.transport.reply(request, {
            error: {
              message: "Invalid request - unsupported action"
            }
          });
      }
      updateDelayedEvent.call(this.driver, request.data.delay_id).then(function () {
        return _this10.transport.reply(request, {});
      })["catch"](function (e) {
        console.error("error updating delayed event: ", e);
        _this10.handleDriverError(e, request, "Error updating delayed event");
      });
    }
  }, {
    key: "handleSendToDevice",
    value: function () {
      var _handleSendToDevice = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(request) {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (request.data.type) {
                _context4.next = 4;
                break;
              }
              this.transport.reply(request, {
                error: {
                  message: "Invalid request - missing event type"
                }
              });
              _context4.next = 26;
              break;
            case 4:
              if (request.data.messages) {
                _context4.next = 8;
                break;
              }
              this.transport.reply(request, {
                error: {
                  message: "Invalid request - missing event contents"
                }
              });
              _context4.next = 26;
              break;
            case 8:
              if (!(typeof request.data.encrypted !== "boolean")) {
                _context4.next = 12;
                break;
              }
              this.transport.reply(request, {
                error: {
                  message: "Invalid request - missing encryption flag"
                }
              });
              _context4.next = 26;
              break;
            case 12:
              if (this.canSendToDeviceEvent(request.data.type)) {
                _context4.next = 16;
                break;
              }
              this.transport.reply(request, {
                error: {
                  message: "Cannot send to-device events of this type"
                }
              });
              _context4.next = 26;
              break;
            case 16:
              _context4.prev = 16;
              _context4.next = 19;
              return this.driver.sendToDevice(request.data.type, request.data.encrypted, request.data.messages);
            case 19:
              this.transport.reply(request, {});
              _context4.next = 26;
              break;
            case 22:
              _context4.prev = 22;
              _context4.t0 = _context4["catch"](16);
              console.error("error sending to-device event", _context4.t0);
              this.handleDriverError(_context4.t0, request, "Error sending event");
            case 26:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[16, 22]]);
      }));
      function handleSendToDevice(_x2) {
        return _handleSendToDevice.apply(this, arguments);
      }
      return handleSendToDevice;
    }()
  }, {
    key: "pollTurnServers",
    value: function () {
      var _pollTurnServers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(turnServers, initialServer) {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, server;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.UpdateTurnServers, initialServer // it's compatible, but missing the index signature
              );
            case 3:
              // Pick the generator up where we left off
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context5.prev = 5;
              _iterator = _asyncIterator(turnServers);
            case 7:
              _context5.next = 9;
              return _iterator.next();
            case 9:
              if (!(_iteratorAbruptCompletion = !(_step = _context5.sent).done)) {
                _context5.next = 16;
                break;
              }
              server = _step.value;
              _context5.next = 13;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.UpdateTurnServers, server // it's compatible, but missing the index signature
              );
            case 13:
              _iteratorAbruptCompletion = false;
              _context5.next = 7;
              break;
            case 16:
              _context5.next = 22;
              break;
            case 18:
              _context5.prev = 18;
              _context5.t0 = _context5["catch"](5);
              _didIteratorError = true;
              _iteratorError = _context5.t0;
            case 22:
              _context5.prev = 22;
              _context5.prev = 23;
              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context5.next = 27;
                break;
              }
              _context5.next = 27;
              return _iterator["return"]();
            case 27:
              _context5.prev = 27;
              if (!_didIteratorError) {
                _context5.next = 30;
                break;
              }
              throw _iteratorError;
            case 30:
              return _context5.finish(27);
            case 31:
              return _context5.finish(22);
            case 32:
              _context5.next = 37;
              break;
            case 34:
              _context5.prev = 34;
              _context5.t1 = _context5["catch"](0);
              console.error("error polling for TURN servers", _context5.t1);
            case 37:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[0, 34], [5, 18, 22, 32], [23,, 27, 31]]);
      }));
      function pollTurnServers(_x3, _x4) {
        return _pollTurnServers.apply(this, arguments);
      }
      return pollTurnServers;
    }()
  }, {
    key: "handleWatchTurnServers",
    value: function () {
      var _handleWatchTurnServers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(request) {
        var turnServers, _yield$turnServers$ne, done, value;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (this.hasCapability(_Capabilities.MatrixCapabilities.MSC3846TurnServers)) {
                _context6.next = 4;
                break;
              }
              this.transport.reply(request, {
                error: {
                  message: "Missing capability"
                }
              });
              _context6.next = 26;
              break;
            case 4:
              if (!this.turnServers) {
                _context6.next = 8;
                break;
              }
              // We're already polling, so this is a no-op
              this.transport.reply(request, {});
              _context6.next = 26;
              break;
            case 8:
              _context6.prev = 8;
              turnServers = this.driver.getTurnServers(); // Peek at the first result, so we can at least verify that the
              // client isn't banned from getting TURN servers entirely
              _context6.next = 12;
              return turnServers.next();
            case 12:
              _yield$turnServers$ne = _context6.sent;
              done = _yield$turnServers$ne.done;
              value = _yield$turnServers$ne.value;
              if (!done) {
                _context6.next = 17;
                break;
              }
              throw new Error("Client refuses to provide any TURN servers");
            case 17:
              this.transport.reply(request, {});

              // Start the poll loop, sending the widget the initial result
              this.pollTurnServers(turnServers, value);
              this.turnServers = turnServers;
              _context6.next = 26;
              break;
            case 22:
              _context6.prev = 22;
              _context6.t0 = _context6["catch"](8);
              console.error("error getting first TURN server results", _context6.t0);
              this.transport.reply(request, {
                error: {
                  message: "TURN servers not available"
                }
              });
            case 26:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[8, 22]]);
      }));
      function handleWatchTurnServers(_x5) {
        return _handleWatchTurnServers.apply(this, arguments);
      }
      return handleWatchTurnServers;
    }()
  }, {
    key: "handleUnwatchTurnServers",
    value: function () {
      var _handleUnwatchTurnServers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(request) {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              if (this.hasCapability(_Capabilities.MatrixCapabilities.MSC3846TurnServers)) {
                _context7.next = 4;
                break;
              }
              this.transport.reply(request, {
                error: {
                  message: "Missing capability"
                }
              });
              _context7.next = 12;
              break;
            case 4:
              if (this.turnServers) {
                _context7.next = 8;
                break;
              }
              // We weren't polling anyways, so this is a no-op
              this.transport.reply(request, {});
              _context7.next = 12;
              break;
            case 8:
              _context7.next = 10;
              return this.turnServers["return"](undefined);
            case 10:
              this.turnServers = null;
              this.transport.reply(request, {});
            case 12:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function handleUnwatchTurnServers(_x6) {
        return _handleUnwatchTurnServers.apply(this, arguments);
      }
      return handleUnwatchTurnServers;
    }()
  }, {
    key: "handleReadRelations",
    value: function () {
      var _handleReadRelations = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(request) {
        var _this11 = this;
        var result, chunk;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (request.data.event_id) {
                _context8.next = 2;
                break;
              }
              return _context8.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Invalid request - missing event ID"
                }
              }));
            case 2:
              if (!(request.data.limit !== undefined && request.data.limit < 0)) {
                _context8.next = 4;
                break;
              }
              return _context8.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Invalid request - limit out of range"
                }
              }));
            case 4:
              if (!(request.data.room_id !== undefined && !this.canUseRoomTimeline(request.data.room_id))) {
                _context8.next = 6;
                break;
              }
              return _context8.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Unable to access room timeline: ".concat(request.data.room_id)
                }
              }));
            case 6:
              _context8.prev = 6;
              _context8.next = 9;
              return this.driver.readEventRelations(request.data.event_id, request.data.room_id, request.data.rel_type, request.data.event_type, request.data.from, request.data.to, request.data.limit, request.data.direction);
            case 9:
              result = _context8.sent;
              // only return events that the user has the permission to receive
              chunk = result.chunk.filter(function (e) {
                if (e.state_key !== undefined) {
                  return _this11.canReceiveStateEvent(e.type, e.state_key);
                } else {
                  return _this11.canReceiveRoomEvent(e.type, e.content["msgtype"]);
                }
              });
              return _context8.abrupt("return", this.transport.reply(request, {
                chunk: chunk,
                prev_batch: result.prevBatch,
                next_batch: result.nextBatch
              }));
            case 14:
              _context8.prev = 14;
              _context8.t0 = _context8["catch"](6);
              console.error("error getting the relations", _context8.t0);
              this.handleDriverError(_context8.t0, request, "Unexpected error while reading relations");
            case 18:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this, [[6, 14]]);
      }));
      function handleReadRelations(_x7) {
        return _handleReadRelations.apply(this, arguments);
      }
      return handleReadRelations;
    }()
  }, {
    key: "handleUserDirectorySearch",
    value: function () {
      var _handleUserDirectorySearch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(request) {
        var result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              if (this.hasCapability(_Capabilities.MatrixCapabilities.MSC3973UserDirectorySearch)) {
                _context9.next = 2;
                break;
              }
              return _context9.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Missing capability"
                }
              }));
            case 2:
              if (!(typeof request.data.search_term !== "string")) {
                _context9.next = 4;
                break;
              }
              return _context9.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Invalid request - missing search term"
                }
              }));
            case 4:
              if (!(request.data.limit !== undefined && request.data.limit < 0)) {
                _context9.next = 6;
                break;
              }
              return _context9.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Invalid request - limit out of range"
                }
              }));
            case 6:
              _context9.prev = 6;
              _context9.next = 9;
              return this.driver.searchUserDirectory(request.data.search_term, request.data.limit);
            case 9:
              result = _context9.sent;
              return _context9.abrupt("return", this.transport.reply(request, {
                limited: result.limited,
                results: result.results.map(function (r) {
                  return {
                    user_id: r.userId,
                    display_name: r.displayName,
                    avatar_url: r.avatarUrl
                  };
                })
              }));
            case 13:
              _context9.prev = 13;
              _context9.t0 = _context9["catch"](6);
              console.error("error searching in the user directory", _context9.t0);
              this.handleDriverError(_context9.t0, request, "Unexpected error while searching in the user directory");
            case 17:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this, [[6, 13]]);
      }));
      function handleUserDirectorySearch(_x8) {
        return _handleUserDirectorySearch.apply(this, arguments);
      }
      return handleUserDirectorySearch;
    }()
  }, {
    key: "handleGetMediaConfig",
    value: function () {
      var _handleGetMediaConfig = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(request) {
        var result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              if (this.hasCapability(_Capabilities.MatrixCapabilities.MSC4039UploadFile)) {
                _context10.next = 2;
                break;
              }
              return _context10.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Missing capability"
                }
              }));
            case 2:
              _context10.prev = 2;
              _context10.next = 5;
              return this.driver.getMediaConfig();
            case 5:
              result = _context10.sent;
              return _context10.abrupt("return", this.transport.reply(request, result));
            case 9:
              _context10.prev = 9;
              _context10.t0 = _context10["catch"](2);
              console.error("error while getting the media configuration", _context10.t0);
              this.handleDriverError(_context10.t0, request, "Unexpected error while getting the media configuration");
            case 13:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this, [[2, 9]]);
      }));
      function handleGetMediaConfig(_x9) {
        return _handleGetMediaConfig.apply(this, arguments);
      }
      return handleGetMediaConfig;
    }()
  }, {
    key: "handleUploadFile",
    value: function () {
      var _handleUploadFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(request) {
        var result;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              if (this.hasCapability(_Capabilities.MatrixCapabilities.MSC4039UploadFile)) {
                _context11.next = 2;
                break;
              }
              return _context11.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Missing capability"
                }
              }));
            case 2:
              _context11.prev = 2;
              _context11.next = 5;
              return this.driver.uploadFile(request.data.file);
            case 5:
              result = _context11.sent;
              return _context11.abrupt("return", this.transport.reply(request, {
                content_uri: result.contentUri
              }));
            case 9:
              _context11.prev = 9;
              _context11.t0 = _context11["catch"](2);
              console.error("error while uploading a file", _context11.t0);
              this.handleDriverError(_context11.t0, request, "Unexpected error while uploading a file");
            case 13:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this, [[2, 9]]);
      }));
      function handleUploadFile(_x10) {
        return _handleUploadFile.apply(this, arguments);
      }
      return handleUploadFile;
    }()
  }, {
    key: "handleDownloadFile",
    value: function () {
      var _handleDownloadFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(request) {
        var result;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              if (this.hasCapability(_Capabilities.MatrixCapabilities.MSC4039DownloadFile)) {
                _context12.next = 2;
                break;
              }
              return _context12.abrupt("return", this.transport.reply(request, {
                error: {
                  message: "Missing capability"
                }
              }));
            case 2:
              _context12.prev = 2;
              _context12.next = 5;
              return this.driver.downloadFile(request.data.content_uri);
            case 5:
              result = _context12.sent;
              return _context12.abrupt("return", this.transport.reply(request, {
                file: result.file
              }));
            case 9:
              _context12.prev = 9;
              _context12.t0 = _context12["catch"](2);
              console.error("error while downloading a file", _context12.t0);
              this.handleDriverError(_context12.t0, request, "Unexpected error while downloading a file");
            case 13:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this, [[2, 9]]);
      }));
      function handleDownloadFile(_x11) {
        return _handleDownloadFile.apply(this, arguments);
      }
      return handleDownloadFile;
    }()
  }, {
    key: "handleDriverError",
    value: function handleDriverError(e, request, message) {
      var data = this.driver.processError(e);
      this.transport.reply(request, {
        error: _objectSpread({
          message: message
        }, data)
      });
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(ev) {
      if (this.isStopped) return;
      var actionEv = new CustomEvent("action:".concat(ev.detail.action), {
        detail: ev.detail,
        cancelable: true
      });
      this.emit("action:".concat(ev.detail.action), actionEv);
      if (!actionEv.defaultPrevented) {
        switch (ev.detail.action) {
          case _WidgetApiAction.WidgetApiFromWidgetAction.ContentLoaded:
            return this.handleContentLoadedAction(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.SupportedApiVersions:
            return this.replyVersions(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.SendEvent:
            return this.handleSendEvent(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.SendToDevice:
            return this.handleSendToDevice(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.GetOpenIDCredentials:
            return this.handleOIDC(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC2931Navigate:
            return this.handleNavigate(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC2974RenegotiateCapabilities:
            return this.handleCapabilitiesRenegotiate(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC2876ReadEvents:
            return this.handleReadEvents(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.WatchTurnServers:
            return this.handleWatchTurnServers(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.UnwatchTurnServers:
            return this.handleUnwatchTurnServers(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC3869ReadRelations:
            return this.handleReadRelations(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC3973UserDirectorySearch:
            return this.handleUserDirectorySearch(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.BeeperReadRoomAccountData:
            return this.handleReadRoomAccountData(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC4039GetMediaConfigAction:
            return this.handleGetMediaConfig(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC4039UploadFileAction:
            return this.handleUploadFile(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC4039DownloadFileAction:
            return this.handleDownloadFile(ev.detail);
          case _WidgetApiAction.WidgetApiFromWidgetAction.MSC4157UpdateDelayedEvent:
            return this.handleUpdateDelayedEvent(ev.detail);
          default:
            return this.transport.reply(ev.detail, {
              error: {
                message: "Unknown or unsupported from-widget action: " + ev.detail.action
              }
            });
        }
      }
    }

    /**
     * Informs the widget that the client's theme has changed.
     * @param theme The theme data, as an object with arbitrary contents.
     */
  }, {
    key: "updateTheme",
    value: function updateTheme(theme) {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.ThemeChange, theme);
    }

    /**
     * Informs the widget that the client's language has changed.
     * @param lang The BCP 47 identifier representing the client's current language.
     */
  }, {
    key: "updateLanguage",
    value: function updateLanguage(lang) {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.LanguageChange, {
        lang: lang
      });
    }

    /**
     * Takes a screenshot of the widget.
     * @returns Resolves to the widget's screenshot.
     * @throws Throws if there is a problem.
     */
  }, {
    key: "takeScreenshot",
    value: function takeScreenshot() {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.TakeScreenshot, {});
    }

    /**
     * Alerts the widget to whether or not it is currently visible.
     * @param {boolean} isVisible Whether the widget is visible or not.
     * @returns {Promise<IWidgetApiResponseData>} Resolves when the widget acknowledges the update.
     */
  }, {
    key: "updateVisibility",
    value: function updateVisibility(isVisible) {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.UpdateVisibility, {
        visible: isVisible
      });
    }
  }, {
    key: "sendWidgetConfig",
    value: function sendWidgetConfig(data) {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.WidgetConfig, data).then();
    }
  }, {
    key: "notifyModalWidgetButtonClicked",
    value: function notifyModalWidgetButtonClicked(id) {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.ButtonClicked, {
        id: id
      }).then();
    }
  }, {
    key: "notifyModalWidgetClose",
    value: function notifyModalWidgetClose(data) {
      return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.CloseModalWidget, data).then();
    }

    /**
     * Feeds an event to the widget. As a client you are expected to call this
     * for every new event in every room to which you are joined or invited.
     * @param {IRoomEvent} rawEvent The event to (try to) send to the widget.
     * @param {string} currentViewedRoomId The room ID the user is currently
     *   interacting with. Not the room ID of the event.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to read the event due to permissions, rejects if the widget failed
     *   to handle the event.
     * @deprecated It is recommended to communicate the viewed room ID by calling
     *   {@link ClientWidgetApi.setViewedRoomId} rather than passing it to this
     *   method.
     */
  }, {
    key: "feedEvent",
    value: function () {
      var _feedEvent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(rawEvent, currentViewedRoomId) {
        var _rawEvent$content;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              if (currentViewedRoomId !== undefined) this.setViewedRoomId(currentViewedRoomId);
              if (!(rawEvent.room_id !== this.viewedRoomId && !this.canUseRoomTimeline(rawEvent.room_id))) {
                _context13.next = 3;
                break;
              }
              return _context13.abrupt("return");
            case 3:
              if (!(rawEvent.state_key !== undefined && rawEvent.state_key !== null)) {
                _context13.next = 8;
                break;
              }
              if (this.canReceiveStateEvent(rawEvent.type, rawEvent.state_key)) {
                _context13.next = 6;
                break;
              }
              return _context13.abrupt("return");
            case 6:
              _context13.next = 10;
              break;
            case 8:
              if (this.canReceiveRoomEvent(rawEvent.type, (_rawEvent$content = rawEvent.content) === null || _rawEvent$content === void 0 ? void 0 : _rawEvent$content["msgtype"])) {
                _context13.next = 10;
                break;
              }
              return _context13.abrupt("return");
            case 10:
              _context13.next = 12;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.SendEvent,
              // it's compatible, but missing the index signature
              rawEvent);
            case 12:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function feedEvent(_x12, _x13) {
        return _feedEvent.apply(this, arguments);
      }
      return feedEvent;
    }()
    /**
     * Feeds a to-device event to the widget. As a client you are expected to
     * call this for every to-device event you receive.
     * @param {IRoomEvent} rawEvent The event to (try to) send to the widget.
     * @param {boolean} encrypted Whether the event contents were encrypted.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to receive the event due to permissions, rejects if the widget
     *   failed to handle the event.
     */
  }, {
    key: "feedToDevice",
    value: function () {
      var _feedToDevice = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(message, encrypted) {
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              if (!this.canReceiveToDeviceEvent(message.type)) {
                _context14.next = 3;
                break;
              }
              _context14.next = 3;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.SendToDevice, _objectSpread(_objectSpread({}, message), {}, {
                encrypted: encrypted
              }));
            case 3:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function feedToDevice(_x14, _x15) {
        return _feedToDevice.apply(this, arguments);
      }
      return feedToDevice;
    }()
  }, {
    key: "setViewedRoomId",
    value:
    /**
     * Indicate that a room is being viewed (making it possible for the widget
     * to interact with it).
     */
    function setViewedRoomId(roomId) {
      this.viewedRoomId = roomId;
      // If the widget doesn't have timeline permissions for the room then
      // this is its opportunity to learn the room state. We push the entire
      // room state, which could be redundant if this room had been viewed
      // once before, but it's easier than selectively pushing just the bits
      // of state that changed while the room was in the background.
      if (roomId !== null && !this.canUseRoomTimeline(roomId)) this.pushRoomState(roomId);
    }
  }, {
    key: "flushRoomState",
    value: function () {
      var _flushRoomState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
        var events, _iterator7, _step7, eventTypeMap, _iterator8, _step8, stateKeyMap;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _context15.prev = 0;
            case 1:
              _context15.next = 3;
              return Promise.all(this.pushRoomStateTasks);
            case 3:
              if (this.pushRoomStateTasks.size > 0) {
                _context15.next = 1;
                break;
              }
            case 4:
              events = [];
              _iterator7 = _createForOfIteratorHelper(this.pushRoomStateResult.values());
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  eventTypeMap = _step7.value;
                  _iterator8 = _createForOfIteratorHelper(eventTypeMap.values());
                  try {
                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      stateKeyMap = _step8.value;
                      events.push.apply(events, _toConsumableArray(stateKeyMap.values()));
                    }
                  } catch (err) {
                    _iterator8.e(err);
                  } finally {
                    _iterator8.f();
                  }
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              _context15.next = 9;
              return this.getWidgetVersions();
            case 9:
              if (!_context15.sent.includes(_ApiVersion.UnstableApiVersion.MSC2762_UPDATE_STATE)) {
                _context15.next = 12;
                break;
              }
              _context15.next = 12;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.UpdateState, {
                state: events
              });
            case 12:
              _context15.prev = 12;
              this.flushRoomStateTask = null;
              return _context15.finish(12);
            case 15:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this, [[0,, 12, 15]]);
      }));
      function flushRoomState() {
        return _flushRoomState.apply(this, arguments);
      }
      return flushRoomState;
    }()
    /**
     * Reads the current sticky state of the room and pushes it to the widget.
     *
     * It will only push events that the widget is allowed to receive.
     * @param roomId
     * @private
     */
  }, {
    key: "pushStickyState",
    value: function () {
      var _pushStickyState = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(roomId) {
        var _this12 = this;
        return _regeneratorRuntime().wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              console.debug("Pushing sticky state to widget for room", roomId);
              return _context17.abrupt("return", this.driver.readStickyEvents(roomId).then(function (events) {
                // filter to the allowed sticky events
                var filtered = events.filter(function (e) {
                  var _e$content;
                  return _this12.canReceiveRoomEvent(e.type, typeof ((_e$content = e.content) === null || _e$content === void 0 ? void 0 : _e$content.msgtype) === "string" ? e.content.msgtype : null);
                });
                return {
                  roomId: roomId,
                  stickyEvents: filtered
                };
              }).then( /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(_ref) {
                  var roomId, stickyEvents, promises;
                  return _regeneratorRuntime().wrap(function _callee16$(_context16) {
                    while (1) switch (_context16.prev = _context16.next) {
                      case 0:
                        roomId = _ref.roomId, stickyEvents = _ref.stickyEvents;
                        console.debug("Pushing", stickyEvents.length, "sticky events to widget for room", roomId);
                        promises = stickyEvents.map(function (rawEvent) {
                          return _this12.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.SendEvent,
                          // copied from feedEvent; it's compatible, but missing the index signature
                          rawEvent);
                        });
                        _context16.next = 5;
                        return Promise.all(promises);
                      case 5:
                      case "end":
                        return _context16.stop();
                    }
                  }, _callee16);
                }));
                return function (_x17) {
                  return _ref2.apply(this, arguments);
                };
              }()));
            case 2:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this);
      }));
      function pushStickyState(_x16) {
        return _pushStickyState.apply(this, arguments);
      }
      return pushStickyState;
    }()
    /**
     * Read the room's state and push all entries that the widget is allowed to
     * read through to the widget.
     */
  }, {
    key: "pushRoomState",
    value: function pushRoomState(roomId) {
      var _this13 = this;
      var _iterator9 = _createForOfIteratorHelper(this.allowedEvents),
        _step9;
      try {
        var _loop2 = function _loop2() {
          var cap = _step9.value;
          if (cap.kind === _WidgetEventCapability.EventKind.State && cap.direction === _WidgetEventCapability.EventDirection.Receive) {
            var _cap$keyStr, _this13$flushRoomStat;
            // Initiate the task
            var events = _this13.driver.readRoomState(roomId, cap.eventType, (_cap$keyStr = cap.keyStr) !== null && _cap$keyStr !== void 0 ? _cap$keyStr : undefined);
            var task = events.then(function (events) {
              // When complete, queue the resulting events to be
              // pushed to the widget
              var _iterator10 = _createForOfIteratorHelper(events),
                _step10;
              try {
                for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                  var event = _step10.value;
                  var eventTypeMap = _this13.pushRoomStateResult.get(roomId);
                  if (eventTypeMap === undefined) {
                    eventTypeMap = new Map();
                    _this13.pushRoomStateResult.set(roomId, eventTypeMap);
                  }
                  var stateKeyMap = eventTypeMap.get(cap.eventType);
                  if (stateKeyMap === undefined) {
                    stateKeyMap = new Map();
                    eventTypeMap.set(cap.eventType, stateKeyMap);
                  }
                  if (!stateKeyMap.has(event.state_key)) stateKeyMap.set(event.state_key, event);
                }
              } catch (err) {
                _iterator10.e(err);
              } finally {
                _iterator10.f();
              }
            }, function (e) {
              return console.error("Failed to read room state for ".concat(roomId, " (").concat(cap.eventType, ", ").concat(cap.keyStr, ")"), e);
            }).then(function () {
              // Mark request as no longer pending
              _this13.pushRoomStateTasks["delete"](task);
            });

            // Mark task as pending
            _this13.pushRoomStateTasks.add(task);
            // Assuming no other tasks are already happening concurrently,
            // schedule the widget action that actually pushes the events
            (_this13$flushRoomStat = _this13.flushRoomStateTask) !== null && _this13$flushRoomStat !== void 0 ? _this13$flushRoomStat : _this13.flushRoomStateTask = _this13.flushRoomState();
            _this13.flushRoomStateTask["catch"](function (e) {
              return console.error("Failed to push room state", e);
            });
          }
        };
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }

    /**
     * Feeds a room state update to the widget. As a client you are expected to
     * call this for every state update in every room to which you are joined or
     * invited.
     * @param {IRoomEvent} rawEvent The state event corresponding to the updated
     *   room state entry.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to receive the room state due to permissions, rejects if the
     *   widget failed to handle the update.
     */
  }, {
    key: "feedStateUpdate",
    value: function () {
      var _feedStateUpdate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(rawEvent) {
        var eventTypeMap, stateKeyMap;
        return _regeneratorRuntime().wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              if (!(rawEvent.state_key === undefined)) {
                _context18.next = 2;
                break;
              }
              throw new Error("Not a state event");
            case 2:
              if (!((rawEvent.room_id === this.viewedRoomId || this.canUseRoomTimeline(rawEvent.room_id)) && this.canReceiveStateEvent(rawEvent.type, rawEvent.state_key))) {
                _context18.next = 21;
                break;
              }
              if (!(this.pushRoomStateTasks.size === 0)) {
                _context18.next = 11;
                break;
              }
              _context18.next = 6;
              return this.getWidgetVersions();
            case 6:
              if (!_context18.sent.includes(_ApiVersion.UnstableApiVersion.MSC2762_UPDATE_STATE)) {
                _context18.next = 9;
                break;
              }
              _context18.next = 9;
              return this.transport.send(_WidgetApiAction.WidgetApiToWidgetAction.UpdateState, {
                state: [rawEvent]
              });
            case 9:
              _context18.next = 21;
              break;
            case 11:
              // Lump the update in with whatever data will be sent in the
              // initial push later. Even if we set it to an "outdated" entry
              // here, we can count on any newer entries being passed to this
              // same method eventually; this won't cause stuck state.
              eventTypeMap = this.pushRoomStateResult.get(rawEvent.room_id);
              if (eventTypeMap === undefined) {
                eventTypeMap = new Map();
                this.pushRoomStateResult.set(rawEvent.room_id, eventTypeMap);
              }
              stateKeyMap = eventTypeMap.get(rawEvent.type);
              if (stateKeyMap === undefined) {
                stateKeyMap = new Map();
                eventTypeMap.set(rawEvent.type, stateKeyMap);
              }
              if (!stateKeyMap.has(rawEvent.type)) stateKeyMap.set(rawEvent.state_key, rawEvent);
            case 16:
              _context18.next = 18;
              return Promise.all(this.pushRoomStateTasks);
            case 18:
              if (this.pushRoomStateTasks.size > 0) {
                _context18.next = 16;
                break;
              }
            case 19:
              _context18.next = 21;
              return this.flushRoomStateTask;
            case 21:
            case "end":
              return _context18.stop();
          }
        }, _callee18, this);
      }));
      function feedStateUpdate(_x18) {
        return _feedStateUpdate.apply(this, arguments);
      }
      return feedStateUpdate;
    }()
  }]);
  return ClientWidgetApi;
}(_events.EventEmitter);
exports.ClientWidgetApi = ClientWidgetApi;

},{"./Symbols":2,"./interfaces/ApiVersion":6,"./interfaces/Capabilities":7,"./interfaces/GetOpenIDAction":8,"./interfaces/UpdateDelayedEventAction":12,"./interfaces/WidgetApiAction":13,"./interfaces/WidgetApiDirection":14,"./models/WidgetEventCapability":18,"./transport/PostmessageTransport":23,"./util/SimpleObservable":24,"events":25}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Symbols = void 0;
/*
 * Copyright 2021 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Symbols = /*#__PURE__*/function (Symbols) {
  Symbols["AnyRoom"] = "*";
  return Symbols;
}({});
exports.Symbols = Symbols;

},{}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetApiResponseError = exports.WidgetApi = void 0;
var _events = require("events");
var _WidgetApiDirection = require("./interfaces/WidgetApiDirection");
var _ApiVersion = require("./interfaces/ApiVersion");
var _PostmessageTransport = require("./transport/PostmessageTransport");
var _WidgetApiAction = require("./interfaces/WidgetApiAction");
var _GetOpenIDAction = require("./interfaces/GetOpenIDAction");
var _WidgetType = require("./interfaces/WidgetType");
var _ModalWidgetActions = require("./interfaces/ModalWidgetActions");
var _WidgetEventCapability = require("./models/WidgetEventCapability");
var _Symbols = require("./Symbols");
var _UpdateDelayedEventAction = require("./interfaces/UpdateDelayedEventAction");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _awaitAsyncGenerator(value) { return new _OverloadYield(value, 0); }
function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }
function _AsyncGenerator(gen) { var front, back; function resume(key, arg) { try { var result = gen[key](arg), value = result.value, overloaded = value instanceof _OverloadYield; Promise.resolve(overloaded ? value.v : value).then(function (arg) { if (overloaded) { var nextKey = "return" === key ? "return" : "next"; if (!value.k || arg.done) return resume(nextKey, arg); arg = gen[nextKey](arg).value; } settle(result.done ? "return" : "normal", arg); }, function (err) { resume("throw", err); }); } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: !0 }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: !1 }); } (front = front.next) ? resume(front.key, front.arg) : back = null; } this._invoke = function (key, arg) { return new Promise(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; back ? back = back.next = request : (front = back = request, resume(key, arg)); }); }, "function" != typeof gen["return"] && (this["return"] = void 0); }
_AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function () { return this; }, _AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); }, _AsyncGenerator.prototype["throw"] = function (arg) { return this._invoke("throw", arg); }, _AsyncGenerator.prototype["return"] = function (arg) { return this._invoke("return", arg); };
function _OverloadYield(value, kind) { this.v = value, this.k = kind; } /*
                                                                         * Copyright 2020 - 2024 The Matrix.org Foundation C.I.C.
                                                                         *
                                                                         * Licensed under the Apache License, Version 2.0 (the "License");
                                                                         * you may not use this file except in compliance with the License.
                                                                         * You may obtain a copy of the License at
                                                                         *
                                                                         *         http://www.apache.org/licenses/LICENSE-2.0
                                                                         *
                                                                         * Unless required by applicable law or agreed to in writing, software
                                                                         * distributed under the License is distributed on an "AS IS" BASIS,
                                                                         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                         * See the License for the specific language governing permissions and
                                                                         * limitations under the License.
                                                                         */
var WidgetApiResponseError = /*#__PURE__*/function (_Error) {
  _inherits(WidgetApiResponseError, _Error);
  var _super = _createSuper(WidgetApiResponseError);
  function WidgetApiResponseError(message, data) {
    var _this2;
    _classCallCheck(this, WidgetApiResponseError);
    _this2 = _super.call(this, message);
    _this2.data = data;
    return _this2;
  }
  return _createClass(WidgetApiResponseError);
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * API handler for widgets. This raises events for each action
 * received as `action:${action}` (eg: "action:screenshot").
 * Default handling can be prevented by using preventDefault()
 * on the raised event. The default handling varies for each
 * action: ones which the SDK can handle safely are acknowledged
 * appropriately and ones which are unhandled (custom or require
 * the widget to do something) are rejected with an error.
 *
 * Events which are preventDefault()ed must reply using the
 * transport. The events raised will have a detail of an
 * IWidgetApiRequest interface.
 *
 * When the WidgetApi is ready to start sending requests, it will
 * raise a "ready" CustomEvent. After the ready event fires, actions
 * can be sent and the transport will be ready.
 */
exports.WidgetApiResponseError = WidgetApiResponseError;
WidgetApiResponseError.prototype.name = WidgetApiResponseError.name;
var WidgetApi = /*#__PURE__*/function (_EventEmitter) {
  _inherits(WidgetApi, _EventEmitter);
  var _super2 = _createSuper(WidgetApi);
  /**
   * Creates a new API handler for the given widget.
   * @param {string} widgetId The widget ID to listen for. If not supplied then
   * the API will use the widget ID from the first valid request it receives.
   * @param {string} clientOrigin The origin of the client, or null if not known.
   */
  function WidgetApi() {
    var _this3;
    var widgetId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var clientOrigin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _classCallCheck(this, WidgetApi);
    _this3 = _super2.call(this);
    _defineProperty(_assertThisInitialized(_this3), "transport", void 0);
    _defineProperty(_assertThisInitialized(_this3), "capabilitiesFinished", false);
    _defineProperty(_assertThisInitialized(_this3), "supportsMSC2974Renegotiate", false);
    _defineProperty(_assertThisInitialized(_this3), "requestedCapabilities", []);
    _defineProperty(_assertThisInitialized(_this3), "approvedCapabilities", void 0);
    _defineProperty(_assertThisInitialized(_this3), "cachedClientVersions", void 0);
    _defineProperty(_assertThisInitialized(_this3), "turnServerWatchers", 0);
    if (!globalThis.parent) {
      throw new Error("No parent window. This widget doesn't appear to be embedded properly.");
    }
    _this3.transport = new _PostmessageTransport.PostmessageTransport(_WidgetApiDirection.WidgetApiDirection.FromWidget, widgetId, globalThis.parent, globalThis);
    _this3.transport.targetOrigin = clientOrigin;
    _this3.transport.on("message", _this3.handleMessage.bind(_assertThisInitialized(_this3)));
    return _this3;
  }

  /**
   * Determines if the widget was granted a particular capability. Note that on
   * clients where the capabilities are not fed back to the widget this function
   * will rely on requested capabilities instead.
   * @param {Capability} capability The capability to check for approval of.
   * @returns {boolean} True if the widget has approval for the given capability.
   */
  _createClass(WidgetApi, [{
    key: "hasCapability",
    value: function hasCapability(capability) {
      if (Array.isArray(this.approvedCapabilities)) {
        return this.approvedCapabilities.includes(capability);
      }
      return this.requestedCapabilities.includes(capability);
    }

    /**
     * Request a capability from the client. It is not guaranteed to be allowed,
     * but will be asked for.
     * @param {Capability} capability The capability to request.
     * @throws Throws if the capabilities negotiation has already started and the
     * widget is unable to request additional capabilities.
     */
  }, {
    key: "requestCapability",
    value: function requestCapability(capability) {
      if (this.capabilitiesFinished && !this.supportsMSC2974Renegotiate) {
        throw new Error("Capabilities have already been negotiated");
      }
      this.requestedCapabilities.push(capability);
    }

    /**
     * Request capabilities from the client. They are not guaranteed to be allowed,
     * but will be asked for if the negotiation has not already happened.
     * @param {Capability[]} capabilities The capabilities to request.
     * @throws Throws if the capabilities negotiation has already started.
     */
  }, {
    key: "requestCapabilities",
    value: function requestCapabilities(capabilities) {
      var _iterator = _createForOfIteratorHelper(capabilities),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cap = _step.value;
          this.requestCapability(cap);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Requests the capability to interact with rooms other than the user's currently
     * viewed room. Applies to event receiving and sending.
     * @param {string | Symbols.AnyRoom} roomId The room ID, or `Symbols.AnyRoom` to
     * denote all known rooms.
     */
  }, {
    key: "requestCapabilityForRoomTimeline",
    value: function requestCapabilityForRoomTimeline(roomId) {
      this.requestCapability("org.matrix.msc2762.timeline:".concat(roomId));
    }

    /**
     * Requests the capability to send a given state event with optional explicit
     * state key. It is not guaranteed to be allowed, but will be asked for if the
     * negotiation has not already happened.
     * @param {string} eventType The state event type to ask for.
     * @param {string} stateKey If specified, the specific state key to request.
     * Otherwise all state keys will be requested.
     */
  }, {
    key: "requestCapabilityToSendState",
    value: function requestCapabilityToSendState(eventType, stateKey) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forStateEvent(_WidgetEventCapability.EventDirection.Send, eventType, stateKey).raw);
    }

    /**
     * Requests the capability to receive a given state event with optional explicit
     * state key. It is not guaranteed to be allowed, but will be asked for if the
     * negotiation has not already happened.
     * @param {string} eventType The state event type to ask for.
     * @param {string} stateKey If specified, the specific state key to request.
     * Otherwise all state keys will be requested.
     */
  }, {
    key: "requestCapabilityToReceiveState",
    value: function requestCapabilityToReceiveState(eventType, stateKey) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forStateEvent(_WidgetEventCapability.EventDirection.Receive, eventType, stateKey).raw);
    }

    /**
     * Requests the capability to send a given to-device event. It is not
     * guaranteed to be allowed, but will be asked for if the negotiation has
     * not already happened.
     * @param {string} eventType The room event type to ask for.
     */
  }, {
    key: "requestCapabilityToSendToDevice",
    value: function requestCapabilityToSendToDevice(eventType) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forToDeviceEvent(_WidgetEventCapability.EventDirection.Send, eventType).raw);
    }

    /**
     * Requests the capability to receive a given to-device event. It is not
     * guaranteed to be allowed, but will be asked for if the negotiation has
     * not already happened.
     * @param {string} eventType The room event type to ask for.
     */
  }, {
    key: "requestCapabilityToReceiveToDevice",
    value: function requestCapabilityToReceiveToDevice(eventType) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forToDeviceEvent(_WidgetEventCapability.EventDirection.Receive, eventType).raw);
    }

    /**
     * Requests the capability to send a given room event. It is not guaranteed to be
     * allowed, but will be asked for if the negotiation has not already happened.
     * @param {string} eventType The room event type to ask for.
     */
  }, {
    key: "requestCapabilityToSendEvent",
    value: function requestCapabilityToSendEvent(eventType) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forRoomEvent(_WidgetEventCapability.EventDirection.Send, eventType).raw);
    }

    /**
     * Requests the capability to receive a given room event. It is not guaranteed to be
     * allowed, but will be asked for if the negotiation has not already happened.
     * @param {string} eventType The room event type to ask for.
     */
  }, {
    key: "requestCapabilityToReceiveEvent",
    value: function requestCapabilityToReceiveEvent(eventType) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forRoomEvent(_WidgetEventCapability.EventDirection.Receive, eventType).raw);
    }

    /**
     * Requests the capability to send a given message event with optional explicit
     * `msgtype`. It is not guaranteed to be allowed, but will be asked for if the
     * negotiation has not already happened.
     * @param {string} msgtype If specified, the specific msgtype to request.
     * Otherwise all message types will be requested.
     */
  }, {
    key: "requestCapabilityToSendMessage",
    value: function requestCapabilityToSendMessage(msgtype) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forRoomMessageEvent(_WidgetEventCapability.EventDirection.Send, msgtype).raw);
    }

    /**
     * Requests the capability to receive a given message event with optional explicit
     * `msgtype`. It is not guaranteed to be allowed, but will be asked for if the
     * negotiation has not already happened.
     * @param {string} msgtype If specified, the specific msgtype to request.
     * Otherwise all message types will be requested.
     */
  }, {
    key: "requestCapabilityToReceiveMessage",
    value: function requestCapabilityToReceiveMessage(msgtype) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forRoomMessageEvent(_WidgetEventCapability.EventDirection.Receive, msgtype).raw);
    }

    /**
     * Requests the capability to receive a given item in room account data. It is not guaranteed to be
     * allowed, but will be asked for if the negotiation has not already happened.
     * @param {string} eventType The state event type to ask for.
     */
  }, {
    key: "requestCapabilityToReceiveRoomAccountData",
    value: function requestCapabilityToReceiveRoomAccountData(eventType) {
      this.requestCapability(_WidgetEventCapability.WidgetEventCapability.forRoomAccountData(_WidgetEventCapability.EventDirection.Receive, eventType).raw);
    }

    /**
     * Requests an OpenID Connect token from the client for the currently logged in
     * user. This token can be validated server-side with the federation API. Note
     * that the widget is responsible for validating the token and caching any results
     * it needs.
     * @returns {Promise<IOpenIDCredentials>} Resolves to a token for verification.
     * @throws Throws if the user rejected the request or the request failed.
     */
  }, {
    key: "requestOpenIDConnectToken",
    value: function requestOpenIDConnectToken() {
      var _this4 = this;
      return new Promise(function (resolve, reject) {
        _this4.transport.sendComplete(_WidgetApiAction.WidgetApiFromWidgetAction.GetOpenIDCredentials, {}).then(function (response) {
          var rdata = response.response;
          if (rdata.state === _GetOpenIDAction.OpenIDRequestState.Allowed) {
            resolve(rdata);
          } else if (rdata.state === _GetOpenIDAction.OpenIDRequestState.Blocked) {
            reject(new Error("User declined to verify their identity"));
          } else if (rdata.state === _GetOpenIDAction.OpenIDRequestState.PendingUserConfirmation) {
            var handlerFn = function handlerFn(ev) {
              ev.preventDefault();
              var request = ev.detail;
              if (request.data.original_request_id !== response.requestId) return;
              if (request.data.state === _GetOpenIDAction.OpenIDRequestState.Allowed) {
                resolve(request.data);
                _this4.transport.reply(request, {}); // ack
              } else if (request.data.state === _GetOpenIDAction.OpenIDRequestState.Blocked) {
                reject(new Error("User declined to verify their identity"));
                _this4.transport.reply(request, {}); // ack
              } else {
                reject(new Error("Invalid state on reply: " + rdata.state));
                _this4.transport.reply(request, {
                  error: {
                    message: "Invalid state"
                  }
                });
              }
              _this4.off("action:".concat(_WidgetApiAction.WidgetApiToWidgetAction.OpenIDCredentials), handlerFn);
            };
            _this4.on("action:".concat(_WidgetApiAction.WidgetApiToWidgetAction.OpenIDCredentials), handlerFn);
          } else {
            reject(new Error("Invalid state: " + rdata.state));
          }
        })["catch"](reject);
      });
    }

    /**
     * Asks the client for additional capabilities. Capabilities can be queued for this
     * request with the requestCapability() functions.
     * @returns {Promise<void>} Resolves when complete. Note that the promise resolves when
     * the capabilities request has gone through, not when the capabilities are approved/denied.
     * Use the WidgetApiToWidgetAction.NotifyCapabilities action to detect changes.
     */
  }, {
    key: "updateRequestedCapabilities",
    value: function updateRequestedCapabilities() {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC2974RenegotiateCapabilities, {
        capabilities: this.requestedCapabilities
      }).then();
    }

    /**
     * Tell the client that the content has been loaded.
     * @returns {Promise} Resolves when the client acknowledges the request.
     */
  }, {
    key: "sendContentLoaded",
    value: function sendContentLoaded() {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.ContentLoaded, {}).then();
    }

    /**
     * Sends a sticker to the client.
     * @param {IStickerActionRequestData} sticker The sticker to send.
     * @returns {Promise} Resolves when the client acknowledges the request.
     */
  }, {
    key: "sendSticker",
    value: function sendSticker(sticker) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.SendSticker, sticker).then();
    }

    /**
     * Asks the client to set the always-on-screen status for this widget.
     * @param {boolean} value The new state to request.
     * @returns {Promise<boolean>} Resolve with true if the client was able to fulfill
     * the request, resolves to false otherwise. Rejects if an error occurred.
     */
  }, {
    key: "setAlwaysOnScreen",
    value: function setAlwaysOnScreen(value) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.UpdateAlwaysOnScreen, {
        value: value
      }).then(function (res) {
        return res.success;
      });
    }

    /**
     * Opens a modal widget.
     * @param {string} url The URL to the modal widget.
     * @param {string} name The name of the widget.
     * @param {IModalWidgetOpenRequestDataButton[]} buttons The buttons to have on the widget.
     * @param {IModalWidgetCreateData} data Data to supply to the modal widget.
     * @param {WidgetType} type The type of modal widget.
     * @returns {Promise<void>} Resolves when the modal widget has been opened.
     */
  }, {
    key: "openModalWidget",
    value: function openModalWidget(url, name) {
      var buttons = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _WidgetType.MatrixWidgetType.Custom;
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.OpenModalWidget, {
        type: type,
        url: url,
        name: name,
        buttons: buttons,
        data: data
      }).then();
    }

    /**
     * Closes the modal widget. The widget's session will be terminated shortly after.
     * @param {IModalWidgetReturnData} data Optional data to close the modal widget with.
     * @returns {Promise<void>} Resolves when complete.
     */
  }, {
    key: "closeModalWidget",
    value: function closeModalWidget() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.CloseModalWidget, data).then();
    }
  }, {
    key: "sendRoomEvent",
    value: function sendRoomEvent(eventType, content, roomId, delay, parentDelayId, stickyDurationMs) {
      return this.sendEvent(eventType, undefined, content, roomId, delay, parentDelayId, stickyDurationMs);
    }
  }, {
    key: "sendStateEvent",
    value: function sendStateEvent(eventType, stateKey, content, roomId, delay, parentDelayId) {
      return this.sendEvent(eventType, stateKey, content, roomId, delay, parentDelayId);
    }
  }, {
    key: "sendEvent",
    value: function sendEvent(eventType, stateKey, content, roomId, delay, parentDelayId, stickyDurationMs) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.SendEvent, _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
        type: eventType,
        content: content
      }, stateKey !== undefined && {
        state_key: stateKey
      }), roomId !== undefined && {
        room_id: roomId
      }), delay !== undefined && {
        delay: delay
      }), parentDelayId !== undefined && {
        parent_delay_id: parentDelayId
      }), stickyDurationMs !== undefined && {
        sticky_duration_ms: stickyDurationMs
      }));
    }

    /**
     * @experimental This currently relies on an unstable MSC (MSC4157).
     */
  }, {
    key: "cancelScheduledDelayedEvent",
    value: function cancelScheduledDelayedEvent(delayId) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC4157UpdateDelayedEvent, {
        delay_id: delayId,
        action: _UpdateDelayedEventAction.UpdateDelayedEventAction.Cancel
      });
    }

    /**
     * @experimental This currently relies on an unstable MSC (MSC4157).
     */
  }, {
    key: "restartScheduledDelayedEvent",
    value: function restartScheduledDelayedEvent(delayId) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC4157UpdateDelayedEvent, {
        delay_id: delayId,
        action: _UpdateDelayedEventAction.UpdateDelayedEventAction.Restart
      });
    }

    /**
     * @experimental This currently relies on an unstable MSC (MSC4157).
     */
  }, {
    key: "sendScheduledDelayedEvent",
    value: function sendScheduledDelayedEvent(delayId) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC4157UpdateDelayedEvent, {
        delay_id: delayId,
        action: _UpdateDelayedEventAction.UpdateDelayedEventAction.Send
      });
    }

    /**
     * Sends a to-device event.
     * @param {string} eventType The type of events being sent.
     * @param {boolean} encrypted Whether to encrypt the message contents.
     * @param {Object} contentMap A map from user IDs to device IDs to message contents.
     * @returns {Promise<ISendToDeviceFromWidgetResponseData>} Resolves when complete.
     */
  }, {
    key: "sendToDevice",
    value: function sendToDevice(eventType, encrypted, contentMap) {
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.SendToDevice, {
        type: eventType,
        encrypted: encrypted,
        messages: contentMap
      });
    }
  }, {
    key: "readRoomAccountData",
    value: function readRoomAccountData(eventType, roomIds) {
      var data = {
        type: eventType
      };
      if (roomIds) {
        if (roomIds.includes(_Symbols.Symbols.AnyRoom)) {
          data.room_ids = _Symbols.Symbols.AnyRoom;
        } else {
          data.room_ids = roomIds;
        }
      }
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.BeeperReadRoomAccountData, data).then(function (r) {
        return r.events;
      });
    }
  }, {
    key: "readRoomEvents",
    value: function readRoomEvents(eventType, limit, msgtype, roomIds, since) {
      var data = {
        type: eventType,
        msgtype: msgtype
      };
      if (limit !== undefined) {
        data.limit = limit;
      }
      if (roomIds) {
        if (roomIds.includes(_Symbols.Symbols.AnyRoom)) {
          data.room_ids = _Symbols.Symbols.AnyRoom;
        } else {
          data.room_ids = roomIds;
        }
      }
      if (since) {
        data.since = since;
      }
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC2876ReadEvents, data).then(function (r) {
        return r.events;
      });
    }

    /**
     * Reads all related events given a known eventId.
     * @param eventId The id of the parent event to be read.
     * @param roomId The room to look within. When undefined, the user's currently
     * viewed room.
     * @param relationType The relationship type of child events to search for.
     * When undefined, all relations are returned.
     * @param eventType The event type of child events to search for. When undefined,
     * all related events are returned.
     * @param limit The maximum number of events to retrieve per room. If not
     * supplied, the server will apply a default limit.
     * @param from The pagination token to start returning results from, as
     * received from a previous call. If not supplied, results start at the most
     * recent topological event known to the server.
     * @param to The pagination token to stop returning results at. If not
     * supplied, results continue up to limit or until there are no more events.
     * @param direction The direction to search for according to MSC3715.
     * @returns Resolves to the room relations.
     */
  }, {
    key: "readEventRelations",
    value: function () {
      var _readEventRelations = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(eventId, roomId, relationType, eventType, limit, from, to, direction) {
        var versions, data;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.getClientVersions();
            case 2:
              versions = _context.sent;
              if (versions.includes(_ApiVersion.UnstableApiVersion.MSC3869)) {
                _context.next = 5;
                break;
              }
              throw new Error("The read_relations action is not supported by the client.");
            case 5:
              data = {
                event_id: eventId,
                rel_type: relationType,
                event_type: eventType,
                room_id: roomId,
                to: to,
                from: from,
                limit: limit,
                direction: direction
              };
              return _context.abrupt("return", this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC3869ReadRelations, data));
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function readEventRelations(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8) {
        return _readEventRelations.apply(this, arguments);
      }
      return readEventRelations;
    }()
  }, {
    key: "readStateEvents",
    value: function readStateEvents(eventType, limit, stateKey, roomIds) {
      var data = {
        type: eventType,
        state_key: stateKey === undefined ? true : stateKey
      };
      if (limit !== undefined) {
        data.limit = limit;
      }
      if (roomIds) {
        if (roomIds.includes(_Symbols.Symbols.AnyRoom)) {
          data.room_ids = _Symbols.Symbols.AnyRoom;
        } else {
          data.room_ids = roomIds;
        }
      }
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC2876ReadEvents, data).then(function (r) {
        return r.events;
      });
    }

    /**
     * Sets a button as disabled or enabled on the modal widget. Buttons are enabled by default.
     * @param {ModalButtonID} buttonId The button ID to enable/disable.
     * @param {boolean} isEnabled Whether or not the button is enabled.
     * @returns {Promise<void>} Resolves when complete.
     * @throws Throws if the button cannot be disabled, or the client refuses to disable the button.
     */
  }, {
    key: "setModalButtonEnabled",
    value: function setModalButtonEnabled(buttonId, isEnabled) {
      if (buttonId === _ModalWidgetActions.BuiltInModalButtonID.Close) {
        throw new Error("The close button cannot be disabled");
      }
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.SetModalButtonEnabled, {
        button: buttonId,
        enabled: isEnabled
      }).then();
    }

    /**
     * Attempts to navigate the client to the given URI. This can only be called with Matrix URIs
     * (currently only matrix.to, but in future a Matrix URI scheme will be defined).
     * @param {string} uri The URI to navigate to.
     * @returns {Promise<void>} Resolves when complete.
     * @throws Throws if the URI is invalid or cannot be processed.
     * @experimental This currently relies on an unstable MSC (MSC2931).
     */
  }, {
    key: "navigateTo",
    value: function navigateTo(uri) {
      if (!uri || !uri.startsWith("https://matrix.to/#")) {
        throw new Error("Invalid matrix.to URI");
      }
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC2931Navigate, {
        uri: uri
      }).then();
    }

    /**
     * Starts watching for TURN servers, yielding an initial set of credentials as soon as possible,
     * and thereafter yielding new credentials whenever the previous ones expire.
     * @yields {ITurnServer} The TURN server URIs and credentials currently available to the widget.
     */
  }, {
    key: "getTurnServers",
    value: function getTurnServers() {
      var _this = this;
      return _wrapAsyncGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var setTurnServer, onUpdateTurnServers;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              onUpdateTurnServers = /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ev) {
                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        ev.preventDefault();
                        setTurnServer(ev.detail.data);
                        _this.transport.reply(ev.detail, {});
                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2);
                }));
                return function onUpdateTurnServers(_x9) {
                  return _ref.apply(this, arguments);
                };
              }(); // Start listening for updates before we even start watching, to catch
              // TURN data that is sent immediately
              _this.on("action:".concat(_WidgetApiAction.WidgetApiToWidgetAction.UpdateTurnServers), onUpdateTurnServers);

              // Only send the 'watch' action if we aren't already watching
              if (!(_this.turnServerWatchers === 0)) {
                _context3.next = 12;
                break;
              }
              _context3.prev = 3;
              _context3.next = 6;
              return _awaitAsyncGenerator(_this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.WatchTurnServers, {}));
            case 6:
              _context3.next = 12;
              break;
            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3["catch"](3);
              _this.off("action:".concat(_WidgetApiAction.WidgetApiToWidgetAction.UpdateTurnServers), onUpdateTurnServers);
              throw _context3.t0;
            case 12:
              _this.turnServerWatchers++;
              _context3.prev = 13;
            case 14:
              if (!true) {
                _context3.next = 21;
                break;
              }
              _context3.next = 17;
              return _awaitAsyncGenerator(new Promise(function (resolve) {
                return setTurnServer = resolve;
              }));
            case 17:
              _context3.next = 19;
              return _context3.sent;
            case 19:
              _context3.next = 14;
              break;
            case 21:
              _context3.prev = 21;
              // The loop was broken by the caller - clean up
              _this.off("action:".concat(_WidgetApiAction.WidgetApiToWidgetAction.UpdateTurnServers), onUpdateTurnServers);

              // Since sending the 'unwatch' action will end updates for all other
              // consumers, only send it if we're the only consumer remaining
              _this.turnServerWatchers--;
              if (!(_this.turnServerWatchers === 0)) {
                _context3.next = 27;
                break;
              }
              _context3.next = 27;
              return _awaitAsyncGenerator(_this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.UnwatchTurnServers, {}));
            case 27:
              return _context3.finish(21);
            case 28:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[3, 8], [13,, 21, 28]]);
      }))();
    }

    /**
     * Search for users in the user directory.
     * @param searchTerm The term to search for.
     * @param limit The maximum number of results to return. If not supplied, the
     * @returns Resolves to the search results.
     */
  }, {
    key: "searchUserDirectory",
    value: function () {
      var _searchUserDirectory = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(searchTerm, limit) {
        var versions, data;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.getClientVersions();
            case 2:
              versions = _context4.sent;
              if (versions.includes(_ApiVersion.UnstableApiVersion.MSC3973)) {
                _context4.next = 5;
                break;
              }
              throw new Error("The user_directory_search action is not supported by the client.");
            case 5:
              data = {
                search_term: searchTerm,
                limit: limit
              };
              return _context4.abrupt("return", this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC3973UserDirectorySearch, data));
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function searchUserDirectory(_x10, _x11) {
        return _searchUserDirectory.apply(this, arguments);
      }
      return searchUserDirectory;
    }()
    /**
     * Get the config for the media repository.
     * @returns Promise which resolves with an object containing the config.
     */
  }, {
    key: "getMediaConfig",
    value: function () {
      var _getMediaConfig = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var versions, data;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.getClientVersions();
            case 2:
              versions = _context5.sent;
              if (versions.includes(_ApiVersion.UnstableApiVersion.MSC4039)) {
                _context5.next = 5;
                break;
              }
              throw new Error("The get_media_config action is not supported by the client.");
            case 5:
              data = {};
              return _context5.abrupt("return", this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC4039GetMediaConfigAction, data));
            case 7:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function getMediaConfig() {
        return _getMediaConfig.apply(this, arguments);
      }
      return getMediaConfig;
    }()
    /**
     * Upload a file to the media repository on the homeserver.
     * @param file - The object to upload. Something that can be sent to
     *               XMLHttpRequest.send (typically a File).
     * @returns Resolves to the location of the uploaded file.
     */
  }, {
    key: "uploadFile",
    value: function () {
      var _uploadFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(file) {
        var versions, data;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.getClientVersions();
            case 2:
              versions = _context6.sent;
              if (versions.includes(_ApiVersion.UnstableApiVersion.MSC4039)) {
                _context6.next = 5;
                break;
              }
              throw new Error("The upload_file action is not supported by the client.");
            case 5:
              data = {
                file: file
              };
              return _context6.abrupt("return", this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC4039UploadFileAction, data));
            case 7:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function uploadFile(_x12) {
        return _uploadFile.apply(this, arguments);
      }
      return uploadFile;
    }()
    /**
     * Download a file from the media repository on the homeserver.
     * @param contentUri - MXC URI of the file to download.
     * @returns Resolves to the contents of the file.
     */
  }, {
    key: "downloadFile",
    value: function () {
      var _downloadFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(contentUri) {
        var versions, data;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.getClientVersions();
            case 2:
              versions = _context7.sent;
              if (versions.includes(_ApiVersion.UnstableApiVersion.MSC4039)) {
                _context7.next = 5;
                break;
              }
              throw new Error("The download_file action is not supported by the client.");
            case 5:
              data = {
                content_uri: contentUri
              };
              return _context7.abrupt("return", this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.MSC4039DownloadFileAction, data));
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function downloadFile(_x13) {
        return _downloadFile.apply(this, arguments);
      }
      return downloadFile;
    }()
    /**
     * Starts the communication channel. This should be done early to ensure
     * that messages are not missed. Communication can only be stopped by the client.
     */
  }, {
    key: "start",
    value: function start() {
      var _this5 = this;
      this.transport.start();
      this.getClientVersions().then(function (v) {
        if (v.includes(_ApiVersion.UnstableApiVersion.MSC2974)) {
          _this5.supportsMSC2974Renegotiate = true;
        }
      });
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(ev) {
      var actionEv = new CustomEvent("action:".concat(ev.detail.action), {
        detail: ev.detail,
        cancelable: true
      });
      this.emit("action:".concat(ev.detail.action), actionEv);
      if (!actionEv.defaultPrevented) {
        switch (ev.detail.action) {
          case _WidgetApiAction.WidgetApiToWidgetAction.SupportedApiVersions:
            return this.replyVersions(ev.detail);
          case _WidgetApiAction.WidgetApiToWidgetAction.Capabilities:
            return this.handleCapabilities(ev.detail);
          case _WidgetApiAction.WidgetApiToWidgetAction.UpdateVisibility:
            return this.transport.reply(ev.detail, {});
          // ack to avoid error spam
          case _WidgetApiAction.WidgetApiToWidgetAction.NotifyCapabilities:
            return this.transport.reply(ev.detail, {});
          // ack to avoid error spam
          default:
            return this.transport.reply(ev.detail, {
              error: {
                message: "Unknown or unsupported to-widget action: " + ev.detail.action
              }
            });
        }
      }
    }
  }, {
    key: "replyVersions",
    value: function replyVersions(request) {
      this.transport.reply(request, {
        supported_versions: _ApiVersion.CurrentApiVersions
      });
    }
  }, {
    key: "getClientVersions",
    value: function getClientVersions() {
      var _this6 = this;
      if (Array.isArray(this.cachedClientVersions)) {
        return Promise.resolve(this.cachedClientVersions);
      }
      return this.transport.send(_WidgetApiAction.WidgetApiFromWidgetAction.SupportedApiVersions, {}).then(function (r) {
        _this6.cachedClientVersions = r.supported_versions;
        return r.supported_versions;
      })["catch"](function (e) {
        console.warn("non-fatal error getting supported client versions: ", e);
        return [];
      });
    }
  }, {
    key: "handleCapabilities",
    value: function handleCapabilities(request) {
      var _this7 = this;
      if (this.capabilitiesFinished) {
        return this.transport.reply(request, {
          error: {
            message: "Capability negotiation already completed"
          }
        });
      }

      // See if we can expect a capabilities notification or not
      return this.getClientVersions().then(function (v) {
        if (v.includes(_ApiVersion.UnstableApiVersion.MSC2871)) {
          _this7.once("action:".concat(_WidgetApiAction.WidgetApiToWidgetAction.NotifyCapabilities), function (ev) {
            _this7.approvedCapabilities = ev.detail.data.approved;
            _this7.emit("ready");
          });
        } else {
          // if we can't expect notification, we're as done as we can be
          _this7.emit("ready");
        }

        // in either case, reply to that capabilities request
        _this7.capabilitiesFinished = true;
        return _this7.transport.reply(request, {
          capabilities: _this7.requestedCapabilities
        });
      });
    }
  }]);
  return WidgetApi;
}(_events.EventEmitter);
exports.WidgetApi = WidgetApi;

},{"./Symbols":2,"./interfaces/ApiVersion":6,"./interfaces/GetOpenIDAction":8,"./interfaces/ModalWidgetActions":11,"./interfaces/UpdateDelayedEventAction":12,"./interfaces/WidgetApiAction":13,"./interfaces/WidgetApiDirection":14,"./interfaces/WidgetType":16,"./models/WidgetEventCapability":18,"./transport/PostmessageTransport":23,"events":25}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetDriver = void 0;
var _ = require("..");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*
                                                                                                                                                                                                                                                                                                                                                                                               * Copyright 2020 - 2024 The Matrix.org Foundation C.I.C.
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                               * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                               * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               *         http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                               * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                               * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                               * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                               */
/**
 * Represents the functions and behaviour the widget-api is unable to
 * do, such as prompting the user for information or interacting with
 * the UI. Clients are expected to implement this class and override
 * any functions they need/want to support.
 *
 * This class assumes the client will have a context of a Widget
 * instance already.
 */
var WidgetDriver = /*#__PURE__*/function () {
  function WidgetDriver() {
    _classCallCheck(this, WidgetDriver);
  }
  _createClass(WidgetDriver, [{
    key: "validateCapabilities",
    value:
    /**
     * Verifies the widget's requested capabilities, returning the ones
     * it is approved to use. Mutating the requested capabilities will
     * have no effect.
     *
     * This SHOULD result in the user being prompted to approve/deny
     * capabilities.
     *
     * By default this rejects all capabilities (returns an empty set).
     * @param {Set<Capability>} requested The set of requested capabilities.
     * @returns {Promise<Set<Capability>>} Resolves to the allowed capabilities.
     */
    function validateCapabilities(requested) {
      return Promise.resolve(new Set());
    }

    /**
     * Sends an event into a room. If `roomId` is falsy, the client should send the event
     * into the room the user is currently looking at. The widget API will have already
     * verified that the widget is capable of sending the event to that room.
     * @param {string} eventType The event type to be sent.
     * @param {*} content The content for the event.
     * @param {string|null} stateKey The state key if this is a state event, otherwise null.
     * May be an empty string.
     * @param {string|null} roomId The room ID to send the event to. If falsy, the room the
     * user is currently looking at.
     * @returns {Promise<ISendEventDetails>} Resolves when the event has been sent with
     * details of that event.
     * @throws Rejected when the event could not be sent.
     */
  }, {
    key: "sendEvent",
    value: function sendEvent(eventType, content) {
      var stateKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var roomId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return Promise.reject(new Error("Failed to override function"));
    }

    /**
     * @experimental Part of MSC4407
     * Sends a sticky event into a room. If `roomId` is falsy, the client should send the event
     * into the room the user is currently looking at. The widget API will have already
     * verified that the widget is capable of sending the event to that room.
     * @param {number} stickyDurationMs The length of time a sticky event may remain sticky, in milliseconds.
     * @param {string} eventType The event type to be sent.
     * @param {*} content The content for the event.
     * @param {string|null} roomId The room ID to send the event to. If falsy, the room the
     * user is currently looking at.
     * @returns {Promise<ISendEventDetails>} Resolves when the event has been sent with
     * details of that event.
     * @throws Rejected when the event could not be sent.
     */
  }, {
    key: "sendStickyEvent",
    value: function sendStickyEvent(stickyDurationMs, eventType, content) {
      var roomId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      throw new Error("Method not implemented.");
    }

    /**
     * @experimental Part of MSC4140 & MSC4157
     * Sends a delayed event into a room. If `roomId` is falsy, the client should send it
     * into the room the user is currently looking at. The widget API will have already
     * verified that the widget is capable of sending the event to that room.
     * @param {number|null} delay How much later to send the event, or null to not send the
     * event automatically. May not be null if {@link parentDelayId} is null.
     * @param {string|null} parentDelayId The ID of the delayed event this one is grouped with,
     * or null if it will be put in a new group. May not be null if {@link delay} is null.
     * @param {string} eventType The event type of the event to be sent.
     * @param {*} content The content for the event to be sent.
     * @param {string|null} stateKey The state key if the event to be sent a state event,
     * otherwise null. May be an empty string.
     * @param {string|null} roomId The room ID to send the event to. If falsy, the room the
     * user is currently looking at.
     * @returns {Promise<ISendDelayedEventDetails>} Resolves when the delayed event has been
     * prepared with details of how to refer to it for updating/sending/canceling it later.
     * @throws Rejected when the delayed event could not be sent.
     */
  }, {
    key: "sendDelayedEvent",
    value: function sendDelayedEvent(delay, parentDelayId, eventType, content) {
      var stateKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var roomId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      return Promise.reject(new Error("Failed to override function"));
    }

    /**
     * @experimental Part of MSC4140, MSC4157 and MSC4407
     * Sends a delayed sticky event into a room. If `roomId` is falsy, the client should send the event
     * into the room the user is currently looking at. The widget API will have already
     * verified that the widget is capable of sending the event to that room.
     * @param {number} stickyDurationMs The length of time a sticky event may remain sticky, in milliseconds.
     * @param {number|null} delay How much later to send the event, or null to not send the
     * event automatically. May not be null if {@link parentDelayId} is null.
     * @param {string|null} parentDelayId The ID of the delayed event this one is grouped with,
     * or null if it will be put in a new group. May not be null if {@link delay} is null.
     * @param {string} eventType The event type to be sent.
     * @param {*} content The content for the event.
     * @param {string|null} roomId The room ID to send the event to. If falsy, the room the
     * user is currently looking at.
     * @returns {Promise<ISendDelayedEventDetails>} Resolves when the event has been sent with
     * details of that event.
     * @throws Rejected when the event could not be sent.
     */
  }, {
    key: "sendDelayedStickyEvent",
    value: function sendDelayedStickyEvent(delay, parentDelayId, stickyDurationMs, eventType, content) {
      var roomId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      throw new Error("Method not implemented.");
    }

    /**
     * @experimental Part of MSC4140 & MSC4157
     * Cancel the scheduled delivery of the delayed event matching the provided {@link delayId}.
     * @throws Rejected when there is no matching delayed event,
     * or when the delayed event failed to be cancelled.
     */
  }, {
    key: "cancelScheduledDelayedEvent",
    value: function cancelScheduledDelayedEvent(delayId) {
      return Promise.reject(new Error("Failed to override function"));
    }

    /**
     * @experimental Part of MSC4140 & MSC4157
     * Restart the scheduled delivery of the delayed event matching the provided {@link delayId}.
     * @throws Rejected when there is no matching delayed event,
     * or when the delayed event failed to be restarted.
     */
  }, {
    key: "restartScheduledDelayedEvent",
    value: function restartScheduledDelayedEvent(delayId) {
      return Promise.reject(new Error("Failed to override function"));
    }

    /**
     * @experimental Part of MSC4140 & MSC4157
     * Immediately send the delayed event matching the provided {@link delayId},
     * instead of waiting for its scheduled delivery.
     * @throws Rejected when there is no matching delayed event,
     * or when the delayed event failed to be sent.
     */
  }, {
    key: "sendScheduledDelayedEvent",
    value: function sendScheduledDelayedEvent(delayId) {
      return Promise.reject(new Error("Failed to override function"));
    }

    /**
     * Sends a to-device event. The widget API will have already verified that the widget
     * is capable of sending the event.
     * @param {string} eventType The event type to be sent.
     * @param {boolean} encrypted Whether to encrypt the message contents.
     * @param {Object} contentMap A map from user ID and device ID to event content.
     * @returns {Promise<void>} Resolves when the event has been sent.
     * @throws Rejected when the event could not be sent.
     */
  }, {
    key: "sendToDevice",
    value: function sendToDevice(eventType, encrypted, contentMap) {
      return Promise.reject(new Error("Failed to override function"));
    }

    /**
     * Reads an element of room account data. The widget API will have already verified that the widget is
     * capable of receiving the `eventType` of the requested information. If `roomIds` is supplied, it may
     * contain `Symbols.AnyRoom` to denote that the piece of room account data in each of the client's known
     * rooms should be returned. When `null`, only the room the user is currently looking at should be considered.
     * @param eventType The event type to be read.
     * @param roomIds When null, the user's currently viewed room. Otherwise, the list of room IDs
     * to look within, possibly containing Symbols.AnyRoom to denote all known rooms.
     * @returns {Promise<IRoomAccountData[]>} Resolves to the element of room account data, or an empty array.
     */
  }, {
    key: "readRoomAccountData",
    value: function readRoomAccountData(eventType) {
      var roomIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return Promise.resolve([]);
    }

    /**
     * Reads all events of the given type, and optionally `msgtype` (if applicable/defined),
     * the user has access to. The widget API will have already verified that the widget is
     * capable of receiving the events. Less events than the limit are allowed to be returned,
     * but not more. If `roomIds` is supplied, it may contain `Symbols.AnyRoom` to denote that
     * `limit` in each of the client's known rooms should be returned. When `null`, only the
     * room the user is currently looking at should be considered. If `since` is specified but
     * the event ID isn't present in the number of events fetched by the client due to `limit`,
     * the client will return all the events.
     * @param eventType The event type to be read.
     * @param msgtype The msgtype of the events to be read, if applicable/defined.
     * @param stateKey The state key of the events to be read, if applicable/defined.
     * @param limit The maximum number of events to retrieve per room. Will be zero to denote "as many
     * as possible".
     * @param roomIds When null, the user's currently viewed room. Otherwise, the list of room IDs
     * to look within, possibly containing Symbols.AnyRoom to denote all known rooms.
     * @param since When null, retrieves the number of events specified by the "limit" parameter.
     * Otherwise, the event ID at which only subsequent events will be returned, as many as specified
     * in "limit".
     * @returns {Promise<IRoomEvent[]>} Resolves to the room events, or an empty array.
     * @deprecated Clients are advised to implement {@link WidgetDriver.readRoomTimeline} instead.
     */
  }, {
    key: "readRoomEvents",
    value: function readRoomEvents(eventType, msgtype, limit) {
      var roomIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var since = arguments.length > 4 ? arguments[4] : undefined;
      return Promise.resolve([]);
    }

    /**
     * Reads all events of the given type, and optionally state key (if applicable/defined),
     * the user has access to. The widget API will have already verified that the widget is
     * capable of receiving the events. Less events than the limit are allowed to be returned,
     * but not more. If `roomIds` is supplied, it may contain `Symbols.AnyRoom` to denote that
     * `limit` in each of the client's known rooms should be returned. When `null`, only the
     * room the user is currently looking at should be considered.
     * @param eventType The event type to be read.
     * @param stateKey The state key of the events to be read, if applicable/defined.
     * @param limit The maximum number of events to retrieve. Will be zero to denote "as many
     * as possible".
     * @param roomIds When null, the user's currently viewed room. Otherwise, the list of room IDs
     * to look within, possibly containing Symbols.AnyRoom to denote all known rooms.
     * @returns {Promise<IRoomEvent[]>} Resolves to the state events, or an empty array.
     * @deprecated Clients are advised to implement {@link WidgetDriver.readRoomTimeline} instead.
     */
  }, {
    key: "readStateEvents",
    value: function readStateEvents(eventType, stateKey, limit) {
      var roomIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return Promise.resolve([]);
    }

    /**
     * Gets all sticky events of the given type the user has access to.
     * The widget API will have already verified that the widget is capable of receiving the events.
     *
     * This is needed because widgets will get only live messages as they appear in the timeline.
     * However, sticky events act like a state, and the current state is made by events that may have been
     * sent before the widget was loaded.
     * Events are sticky for 1h maximum, so the widget has access to the past hour of sticky events maximum.
     *
     * @experimental Part of MSC4407 - Sticky Events (Widget API)
     * @param roomId - The ID of the room.
     */
  }, {
    key: "readStickyEvents",
    value: function readStickyEvents(roomId) {
      throw new Error("readStickyEvents is not implemented");
    }

    /**
     * Reads all events of the given type, and optionally `msgtype` (if applicable/defined),
     * the user has access to. The widget API will have already verified that the widget is
     * capable of receiving the events. Less events than the limit are allowed to be returned,
     * but not more.
     * @param roomId The ID of the room to look within.
     * @param eventType The event type to be read.
     * @param msgtype The msgtype of the events to be read, if applicable/defined.
     * @param stateKey The state key of the events to be read, if applicable/defined.
     * @param limit The maximum number of events to retrieve. Will be zero to denote "as many as
     * possible".
     * @param since When null, retrieves the number of events specified by the "limit" parameter.
     * Otherwise, the event ID at which only subsequent events will be returned, as many as specified
     * in "limit".
     * @returns {Promise<IRoomEvent[]>} Resolves to the room events, or an empty array.
     */
  }, {
    key: "readRoomTimeline",
    value: function readRoomTimeline(roomId, eventType, msgtype, stateKey, limit, since) {
      // For backward compatibility we try the deprecated methods, in case
      // they're implemented
      if (stateKey === undefined) return this.readRoomEvents(eventType, msgtype, limit, [roomId], since);else return this.readStateEvents(eventType, stateKey, limit, [roomId]);
    }

    /**
     * Reads the current values of all matching room state entries.
     * @param roomId The ID of the room.
     * @param eventType The event type of the entries to be read.
     * @param stateKey The state key of the entry to be read. If undefined,
     * all room state entries with a matching event type should be returned.
     * @returns {Promise<IRoomEvent[]>} Resolves to the events representing the
     * current values of the room state entries.
     */
  }, {
    key: "readRoomState",
    value: function readRoomState(roomId, eventType, stateKey) {
      return this.readStateEvents(eventType, stateKey, Number.MAX_SAFE_INTEGER, [roomId]);
    }

    /**
     * Reads all events that are related to a given event. The widget API will
     * have already verified that the widget is capable of receiving the event,
     * or will make sure to reject access to events which are returned from this
     * function, but are not capable of receiving. If `relationType` or `eventType`
     * are set, the returned events should already be filtered. Less events than
     * the limit are allowed to be returned, but not more.
     * @param eventId The id of the parent event to be read.
     * @param roomId The room to look within. When undefined, the user's
     * currently viewed room.
     * @param relationType The relationship type of child events to search for.
     * When undefined, all relations are returned.
     * @param eventType The event type of child events to search for. When undefined,
     * all related events are returned.
     * @param from The pagination token to start returning results from, as
     * received from a previous call. If not supplied, results start at the most
     * recent topological event known to the server.
     * @param to The pagination token to stop returning results at. If not
     * supplied, results continue up to limit or until there are no more events.
     * @param limit The maximum number of events to retrieve per room. If not
     * supplied, the server will apply a default limit.
     * @param direction The direction to search for according to MSC3715
     * @returns Resolves to the room relations.
     */
  }, {
    key: "readEventRelations",
    value: function readEventRelations(eventId, roomId, relationType, eventType, from, to, limit, direction) {
      return Promise.resolve({
        chunk: []
      });
    }

    /**
     * Asks the user for permission to validate their identity through OpenID Connect. The
     * interface for this function is an observable which accepts the state machine of the
     * OIDC exchange flow. For example, if the client/user blocks the request then it would
     * feed back a `{state: Blocked}` into the observable. Similarly, if the user already
     * approved the widget then a `{state: Allowed}` would be fed into the observable alongside
     * the token itself. If the client is asking for permission, it should feed in a
     * `{state: PendingUserConfirmation}` followed by the relevant Allowed or Blocked state.
     *
     * The widget API will reject the widget's request with an error if this contract is not
     * met properly. By default, the widget driver will block all OIDC requests.
     * @param {SimpleObservable<IOpenIDUpdate>} observer The observable to feed updates into.
     */
  }, {
    key: "askOpenID",
    value: function askOpenID(observer) {
      observer.update({
        state: _.OpenIDRequestState.Blocked
      });
    }

    /**
     * Navigates the client with a matrix.to URI. In future this function will also be provided
     * with the Matrix URIs once matrix.to is replaced. The given URI will have already been
     * lightly checked to ensure it looks like a valid URI, though the implementation is recommended
     * to do further checks on the URI.
     * @param {string} uri The URI to navigate to.
     * @returns {Promise<void>} Resolves when complete.
     * @throws Throws if there's a problem with the navigation, such as invalid format.
     */
  }, {
    key: "navigate",
    value: function navigate(uri) {
      throw new Error("Navigation is not implemented");
    }

    /**
     * Polls for TURN server data, yielding an initial set of credentials as soon as possible, and
     * thereafter yielding new credentials whenever the previous ones expire. The widget API will
     * have already verified that the widget has permission to access TURN servers.
     * @yields {ITurnServer} The TURN server URIs and credentials currently available to the client.
     */
  }, {
    key: "getTurnServers",
    value: function getTurnServers() {
      throw new Error("TURN server support is not implemented");
    }

    /**
     * Search for users in the user directory.
     * @param searchTerm The term to search for.
     * @param limit The maximum number of results to return. If not supplied, the
     * @returns Resolves to the search results.
     */
  }, {
    key: "searchUserDirectory",
    value: function searchUserDirectory(searchTerm, limit) {
      return Promise.resolve({
        limited: false,
        results: []
      });
    }

    /**
     * Get the config for the media repository.
     * @returns Promise which resolves with an object containing the config.
     */
  }, {
    key: "getMediaConfig",
    value: function getMediaConfig() {
      throw new Error("Get media config is not implemented");
    }

    /**
     * Upload a file to the media repository on the homeserver.
     * @param file - The object to upload. Something that can be sent to
     *               XMLHttpRequest.send (typically a File).
     * @returns Resolves to the location of the uploaded file.
     */
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      throw new Error("Upload file is not implemented");
    }

    /**
     * Download a file from the media repository on the homeserver.
     * @param contentUri - MXC URI of the file to download.
     * @returns Resolves to the contents of the file.
     */
  }, {
    key: "downloadFile",
    value: function downloadFile(contentUri) {
      throw new Error("Download file is not implemented");
    }

    /**
     * Gets the IDs of all joined or invited rooms currently known to the
     * client.
     * @returns The room IDs.
     */
  }, {
    key: "getKnownRooms",
    value: function getKnownRooms() {
      throw new Error("Querying known rooms is not implemented");
    }

    /**
     * Expresses an error thrown by this driver in a format compatible with the Widget API.
     * @param error The error to handle.
     * @returns The error expressed as a {@link IWidgetApiErrorResponseDataDetails},
     * or undefined if it cannot be expressed as one.
     */
  }, {
    key: "processError",
    value: function processError(error) {
      return undefined;
    }
  }]);
  return WidgetDriver;
}();
exports.WidgetDriver = WidgetDriver;

},{"..":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _WidgetApi = require("./WidgetApi");
Object.keys(_WidgetApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetApi[key];
    }
  });
});
var _ClientWidgetApi = require("./ClientWidgetApi");
Object.keys(_ClientWidgetApi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ClientWidgetApi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ClientWidgetApi[key];
    }
  });
});
var _Symbols = require("./Symbols");
Object.keys(_Symbols).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Symbols[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Symbols[key];
    }
  });
});
var _PostmessageTransport = require("./transport/PostmessageTransport");
Object.keys(_PostmessageTransport).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PostmessageTransport[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _PostmessageTransport[key];
    }
  });
});
var _WidgetType = require("./interfaces/WidgetType");
Object.keys(_WidgetType).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetType[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetType[key];
    }
  });
});
var _IWidgetApiErrorResponse = require("./interfaces/IWidgetApiErrorResponse");
Object.keys(_IWidgetApiErrorResponse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _IWidgetApiErrorResponse[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _IWidgetApiErrorResponse[key];
    }
  });
});
var _WidgetApiAction = require("./interfaces/WidgetApiAction");
Object.keys(_WidgetApiAction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetApiAction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetApiAction[key];
    }
  });
});
var _WidgetApiDirection = require("./interfaces/WidgetApiDirection");
Object.keys(_WidgetApiDirection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetApiDirection[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetApiDirection[key];
    }
  });
});
var _ApiVersion = require("./interfaces/ApiVersion");
Object.keys(_ApiVersion).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ApiVersion[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ApiVersion[key];
    }
  });
});
var _Capabilities = require("./interfaces/Capabilities");
Object.keys(_Capabilities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Capabilities[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Capabilities[key];
    }
  });
});
var _GetOpenIDAction = require("./interfaces/GetOpenIDAction");
Object.keys(_GetOpenIDAction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _GetOpenIDAction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _GetOpenIDAction[key];
    }
  });
});
var _WidgetKind = require("./interfaces/WidgetKind");
Object.keys(_WidgetKind).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetKind[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetKind[key];
    }
  });
});
var _ModalButtonKind = require("./interfaces/ModalButtonKind");
Object.keys(_ModalButtonKind).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ModalButtonKind[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ModalButtonKind[key];
    }
  });
});
var _ModalWidgetActions = require("./interfaces/ModalWidgetActions");
Object.keys(_ModalWidgetActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ModalWidgetActions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ModalWidgetActions[key];
    }
  });
});
var _UpdateDelayedEventAction = require("./interfaces/UpdateDelayedEventAction");
Object.keys(_UpdateDelayedEventAction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _UpdateDelayedEventAction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _UpdateDelayedEventAction[key];
    }
  });
});
var _WidgetEventCapability = require("./models/WidgetEventCapability");
Object.keys(_WidgetEventCapability).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetEventCapability[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetEventCapability[key];
    }
  });
});
var _url = require("./models/validation/url");
Object.keys(_url).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _url[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _url[key];
    }
  });
});
var _utils = require("./models/validation/utils");
Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});
var _Widget = require("./models/Widget");
Object.keys(_Widget).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Widget[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Widget[key];
    }
  });
});
var _WidgetParser = require("./models/WidgetParser");
Object.keys(_WidgetParser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetParser[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetParser[key];
    }
  });
});
var _urlTemplate = require("./templating/url-template");
Object.keys(_urlTemplate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _urlTemplate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _urlTemplate[key];
    }
  });
});
var _SimpleObservable = require("./util/SimpleObservable");
Object.keys(_SimpleObservable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SimpleObservable[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SimpleObservable[key];
    }
  });
});
var _WidgetDriver = require("./driver/WidgetDriver");
Object.keys(_WidgetDriver).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _WidgetDriver[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WidgetDriver[key];
    }
  });
});

},{"./ClientWidgetApi":1,"./Symbols":2,"./WidgetApi":3,"./driver/WidgetDriver":4,"./interfaces/ApiVersion":6,"./interfaces/Capabilities":7,"./interfaces/GetOpenIDAction":8,"./interfaces/IWidgetApiErrorResponse":9,"./interfaces/ModalButtonKind":10,"./interfaces/ModalWidgetActions":11,"./interfaces/UpdateDelayedEventAction":12,"./interfaces/WidgetApiAction":13,"./interfaces/WidgetApiDirection":14,"./interfaces/WidgetKind":15,"./interfaces/WidgetType":16,"./models/Widget":17,"./models/WidgetEventCapability":18,"./models/WidgetParser":19,"./models/validation/url":20,"./models/validation/utils":21,"./templating/url-template":22,"./transport/PostmessageTransport":23,"./util/SimpleObservable":24}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnstableApiVersion = exports.MatrixApiVersion = exports.CurrentApiVersions = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MatrixApiVersion = /*#__PURE__*/function (MatrixApiVersion) {
  MatrixApiVersion["Prerelease1"] = "0.0.1";
  MatrixApiVersion["Prerelease2"] = "0.0.2";
  return MatrixApiVersion;
}({}); //V010 = "0.1.0", // first release
exports.MatrixApiVersion = MatrixApiVersion;
var UnstableApiVersion = /*#__PURE__*/function (UnstableApiVersion) {
  UnstableApiVersion["MSC2762"] = "org.matrix.msc2762";
  UnstableApiVersion["MSC2762_UPDATE_STATE"] = "org.matrix.msc2762_update_state";
  UnstableApiVersion["MSC2871"] = "org.matrix.msc2871";
  UnstableApiVersion["MSC2873"] = "org.matrix.msc2873";
  UnstableApiVersion["MSC2931"] = "org.matrix.msc2931";
  UnstableApiVersion["MSC2974"] = "org.matrix.msc2974";
  UnstableApiVersion["MSC2876"] = "org.matrix.msc2876";
  UnstableApiVersion["MSC3819"] = "org.matrix.msc3819";
  UnstableApiVersion["MSC3846"] = "town.robin.msc3846";
  UnstableApiVersion["MSC3869"] = "org.matrix.msc3869";
  UnstableApiVersion["MSC3973"] = "org.matrix.msc3973";
  UnstableApiVersion["MSC4039"] = "org.matrix.msc4039";
  return UnstableApiVersion;
}({});
exports.UnstableApiVersion = UnstableApiVersion;
var CurrentApiVersions = [MatrixApiVersion.Prerelease1, MatrixApiVersion.Prerelease2,
//MatrixApiVersion.V010,
UnstableApiVersion.MSC2762, UnstableApiVersion.MSC2762_UPDATE_STATE, UnstableApiVersion.MSC2871, UnstableApiVersion.MSC2873, UnstableApiVersion.MSC2931, UnstableApiVersion.MSC2974, UnstableApiVersion.MSC2876, UnstableApiVersion.MSC3819, UnstableApiVersion.MSC3846, UnstableApiVersion.MSC3869, UnstableApiVersion.MSC3973, UnstableApiVersion.MSC4039];
exports.CurrentApiVersions = CurrentApiVersions;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoConferenceCapabilities = exports.StickerpickerCapabilities = exports.MatrixCapabilities = void 0;
exports.getTimelineRoomIDFromCapability = getTimelineRoomIDFromCapability;
exports.isTimelineCapability = isTimelineCapability;
exports.isTimelineCapabilityFor = isTimelineCapabilityFor;
/*
 * Copyright 2020 - 2021 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MatrixCapabilities = /*#__PURE__*/function (MatrixCapabilities) {
  MatrixCapabilities["Screenshots"] = "m.capability.screenshot";
  MatrixCapabilities["StickerSending"] = "m.sticker";
  MatrixCapabilities["AlwaysOnScreen"] = "m.always_on_screen";
  MatrixCapabilities["RequiresClient"] = "io.element.requires_client";
  MatrixCapabilities["MSC2931Navigate"] = "org.matrix.msc2931.navigate";
  MatrixCapabilities["MSC3846TurnServers"] = "town.robin.msc3846.turn_servers";
  MatrixCapabilities["MSC3973UserDirectorySearch"] = "org.matrix.msc3973.user_directory_search";
  MatrixCapabilities["MSC4039UploadFile"] = "org.matrix.msc4039.upload_file";
  MatrixCapabilities["MSC4039DownloadFile"] = "org.matrix.msc4039.download_file";
  MatrixCapabilities["MSC4157SendDelayedEvent"] = "org.matrix.msc4157.send.delayed_event";
  MatrixCapabilities["MSC4157UpdateDelayedEvent"] = "org.matrix.msc4157.update_delayed_event";
  MatrixCapabilities["MSC4407SendStickyEvent"] = "org.matrix.msc4407.send.sticky_event";
  MatrixCapabilities["MSC4407ReceiveStickyEvent"] = "org.matrix.msc4407.receive.sticky_event";
  return MatrixCapabilities;
}({});
exports.MatrixCapabilities = MatrixCapabilities;
var StickerpickerCapabilities = [MatrixCapabilities.StickerSending];
exports.StickerpickerCapabilities = StickerpickerCapabilities;
var VideoConferenceCapabilities = [MatrixCapabilities.AlwaysOnScreen];

/**
 * Determines if a capability is a capability for a timeline.
 * @param {Capability} capability The capability to test.
 * @returns {boolean} True if a timeline capability, false otherwise.
 */
exports.VideoConferenceCapabilities = VideoConferenceCapabilities;
function isTimelineCapability(capability) {
  // TODO: Change when MSC2762 becomes stable.
  return capability === null || capability === void 0 ? void 0 : capability.startsWith("org.matrix.msc2762.timeline:");
}

/**
 * Determines if a capability is a timeline capability for the given room.
 * @param {Capability} capability The capability to test.
 * @param {string | Symbols.AnyRoom} roomId The room ID, or `Symbols.AnyRoom` for that designation.
 * @returns {boolean} True if a matching capability, false otherwise.
 */
function isTimelineCapabilityFor(capability, roomId) {
  return capability === "org.matrix.msc2762.timeline:".concat(roomId);
}

/**
 * Gets the room ID described by a timeline capability.
 * @param {string} capability The capability to parse.
 * @returns {string} The room ID.
 */
function getTimelineRoomIDFromCapability(capability) {
  return capability.substring(capability.indexOf(":") + 1);
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenIDRequestState = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var OpenIDRequestState = /*#__PURE__*/function (OpenIDRequestState) {
  OpenIDRequestState["Allowed"] = "allowed";
  OpenIDRequestState["Blocked"] = "blocked";
  OpenIDRequestState["PendingUserConfirmation"] = "request";
  return OpenIDRequestState;
}({});
exports.OpenIDRequestState = OpenIDRequestState;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isErrorResponse = isErrorResponse;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
/*
 * Copyright 2020 - 2024 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The format of errors returned by Matrix API requests
 * made by a WidgetDriver.
 */

function isErrorResponse(responseData) {
  var error = responseData.error;
  return _typeof(error) === "object" && error !== null && "message" in error && typeof error.message === "string";
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModalButtonKind = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ModalButtonKind = /*#__PURE__*/function (ModalButtonKind) {
  ModalButtonKind["Primary"] = "m.primary";
  ModalButtonKind["Secondary"] = "m.secondary";
  ModalButtonKind["Warning"] = "m.warning";
  ModalButtonKind["Danger"] = "m.danger";
  ModalButtonKind["Link"] = "m.link";
  return ModalButtonKind;
}({});
exports.ModalButtonKind = ModalButtonKind;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuiltInModalButtonID = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var BuiltInModalButtonID = /*#__PURE__*/function (BuiltInModalButtonID) {
  BuiltInModalButtonID["Close"] = "m.close";
  return BuiltInModalButtonID;
}({}); // Types for a normal modal requesting the opening a modal widget
// Types for a modal widget receiving notifications that its buttons have been pressed
// Types for a modal widget requesting close
// Types for a normal widget being notified that the modal widget it opened has been closed
exports.BuiltInModalButtonID = BuiltInModalButtonID;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateDelayedEventAction = void 0;
/*
 * Copyright 2020 - 2024 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var UpdateDelayedEventAction = /*#__PURE__*/function (UpdateDelayedEventAction) {
  UpdateDelayedEventAction["Cancel"] = "cancel";
  UpdateDelayedEventAction["Restart"] = "restart";
  UpdateDelayedEventAction["Send"] = "send";
  return UpdateDelayedEventAction;
}({});
exports.UpdateDelayedEventAction = UpdateDelayedEventAction;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetApiToWidgetAction = exports.WidgetApiFromWidgetAction = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var WidgetApiToWidgetAction = /*#__PURE__*/function (WidgetApiToWidgetAction) {
  WidgetApiToWidgetAction["SupportedApiVersions"] = "supported_api_versions";
  WidgetApiToWidgetAction["Capabilities"] = "capabilities";
  WidgetApiToWidgetAction["NotifyCapabilities"] = "notify_capabilities";
  WidgetApiToWidgetAction["ThemeChange"] = "theme_change";
  WidgetApiToWidgetAction["LanguageChange"] = "language_change";
  WidgetApiToWidgetAction["TakeScreenshot"] = "screenshot";
  WidgetApiToWidgetAction["UpdateVisibility"] = "visibility";
  WidgetApiToWidgetAction["OpenIDCredentials"] = "openid_credentials";
  WidgetApiToWidgetAction["WidgetConfig"] = "widget_config";
  WidgetApiToWidgetAction["CloseModalWidget"] = "close_modal";
  WidgetApiToWidgetAction["ButtonClicked"] = "button_clicked";
  WidgetApiToWidgetAction["SendEvent"] = "send_event";
  WidgetApiToWidgetAction["SendToDevice"] = "send_to_device";
  WidgetApiToWidgetAction["UpdateState"] = "update_state";
  WidgetApiToWidgetAction["UpdateTurnServers"] = "update_turn_servers";
  return WidgetApiToWidgetAction;
}({});
exports.WidgetApiToWidgetAction = WidgetApiToWidgetAction;
var WidgetApiFromWidgetAction = /*#__PURE__*/function (WidgetApiFromWidgetAction) {
  WidgetApiFromWidgetAction["SupportedApiVersions"] = "supported_api_versions";
  WidgetApiFromWidgetAction["ContentLoaded"] = "content_loaded";
  WidgetApiFromWidgetAction["SendSticker"] = "m.sticker";
  WidgetApiFromWidgetAction["UpdateAlwaysOnScreen"] = "set_always_on_screen";
  WidgetApiFromWidgetAction["GetOpenIDCredentials"] = "get_openid";
  WidgetApiFromWidgetAction["CloseModalWidget"] = "close_modal";
  WidgetApiFromWidgetAction["OpenModalWidget"] = "open_modal";
  WidgetApiFromWidgetAction["SetModalButtonEnabled"] = "set_button_enabled";
  WidgetApiFromWidgetAction["SendEvent"] = "send_event";
  WidgetApiFromWidgetAction["SendToDevice"] = "send_to_device";
  WidgetApiFromWidgetAction["WatchTurnServers"] = "watch_turn_servers";
  WidgetApiFromWidgetAction["UnwatchTurnServers"] = "unwatch_turn_servers";
  WidgetApiFromWidgetAction["BeeperReadRoomAccountData"] = "com.beeper.read_room_account_data";
  WidgetApiFromWidgetAction["MSC2876ReadEvents"] = "org.matrix.msc2876.read_events";
  WidgetApiFromWidgetAction["MSC2931Navigate"] = "org.matrix.msc2931.navigate";
  WidgetApiFromWidgetAction["MSC2974RenegotiateCapabilities"] = "org.matrix.msc2974.request_capabilities";
  WidgetApiFromWidgetAction["MSC3869ReadRelations"] = "org.matrix.msc3869.read_relations";
  WidgetApiFromWidgetAction["MSC3973UserDirectorySearch"] = "org.matrix.msc3973.user_directory_search";
  WidgetApiFromWidgetAction["MSC4039GetMediaConfigAction"] = "org.matrix.msc4039.get_media_config";
  WidgetApiFromWidgetAction["MSC4039UploadFileAction"] = "org.matrix.msc4039.upload_file";
  WidgetApiFromWidgetAction["MSC4039DownloadFileAction"] = "org.matrix.msc4039.download_file";
  WidgetApiFromWidgetAction["MSC4157UpdateDelayedEvent"] = "org.matrix.msc4157.update_delayed_event";
  return WidgetApiFromWidgetAction;
}({});
exports.WidgetApiFromWidgetAction = WidgetApiFromWidgetAction;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetApiDirection = void 0;
exports.invertedDirection = invertedDirection;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var WidgetApiDirection = /*#__PURE__*/function (WidgetApiDirection) {
  WidgetApiDirection["ToWidget"] = "toWidget";
  WidgetApiDirection["FromWidget"] = "fromWidget";
  return WidgetApiDirection;
}({});
exports.WidgetApiDirection = WidgetApiDirection;
function invertedDirection(dir) {
  if (dir === WidgetApiDirection.ToWidget) {
    return WidgetApiDirection.FromWidget;
  } else if (dir === WidgetApiDirection.FromWidget) {
    return WidgetApiDirection.ToWidget;
  } else {
    throw new Error("Invalid direction");
  }
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetKind = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var WidgetKind = /*#__PURE__*/function (WidgetKind) {
  WidgetKind["Room"] = "room";
  WidgetKind["Account"] = "account";
  WidgetKind["Modal"] = "modal";
  return WidgetKind;
}({});
exports.WidgetKind = WidgetKind;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MatrixWidgetType = void 0;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MatrixWidgetType = /*#__PURE__*/function (MatrixWidgetType) {
  MatrixWidgetType["Custom"] = "m.custom";
  MatrixWidgetType["JitsiMeet"] = "m.jitsi";
  MatrixWidgetType["Stickerpicker"] = "m.stickerpicker";
  return MatrixWidgetType;
}({});
exports.MatrixWidgetType = MatrixWidgetType;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Widget = void 0;
var _ = require("..");
var _utils = require("./validation/utils");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*
                                                                                                                                                                                                                                                                                                                                                                                               * Copyright 2020 The Matrix.org Foundation C.I.C.
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                               * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                               * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               *         http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                               * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                               * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                               * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                               */
/**
 * Represents the barest form of widget.
 */
var Widget = /*#__PURE__*/function () {
  function Widget(definition) {
    _classCallCheck(this, Widget);
    this.definition = definition;
    if (!this.definition) throw new Error("Definition is required");
    (0, _utils.assertPresent)(definition, "id");
    (0, _utils.assertPresent)(definition, "creatorUserId");
    (0, _utils.assertPresent)(definition, "type");
    (0, _utils.assertPresent)(definition, "url");
  }

  /**
   * The user ID who created the widget.
   */
  _createClass(Widget, [{
    key: "creatorUserId",
    get: function get() {
      return this.definition.creatorUserId;
    }

    /**
     * The type of widget.
     */
  }, {
    key: "type",
    get: function get() {
      return this.definition.type;
    }

    /**
     * The ID of the widget.
     */
  }, {
    key: "id",
    get: function get() {
      return this.definition.id;
    }

    /**
     * The name of the widget, or null if not set.
     */
  }, {
    key: "name",
    get: function get() {
      return this.definition.name || null;
    }

    /**
     * The title for the widget, or null if not set.
     */
  }, {
    key: "title",
    get: function get() {
      return this.rawData.title || null;
    }

    /**
     * The templated URL for the widget.
     */
  }, {
    key: "templateUrl",
    get: function get() {
      return this.definition.url;
    }

    /**
     * The origin for this widget.
     */
  }, {
    key: "origin",
    get: function get() {
      return new URL(this.templateUrl).origin;
    }

    /**
     * Whether or not the client should wait for the iframe to load. Defaults
     * to true.
     */
  }, {
    key: "waitForIframeLoad",
    get: function get() {
      if (this.definition.waitForIframeLoad === false) return false;
      if (this.definition.waitForIframeLoad === true) return true;
      return true; // default true
    }

    /**
     * The raw data for the widget. This will always be defined, though
     * may be empty.
     */
  }, {
    key: "rawData",
    get: function get() {
      return this.definition.data || {};
    }

    /**
     * Gets a complete widget URL for the client to render.
     * @param {ITemplateParams} params The template parameters.
     * @returns {string} A templated URL.
     */
  }, {
    key: "getCompleteUrl",
    value: function getCompleteUrl(params) {
      return (0, _.runTemplate)(this.templateUrl, this.definition, params);
    }
  }]);
  return Widget;
}();
exports.Widget = Widget;

},{"..":5,"./validation/utils":21}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetEventCapability = exports.EventKind = exports.EventDirection = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var EventKind = /*#__PURE__*/function (EventKind) {
  EventKind["Event"] = "event";
  EventKind["State"] = "state_event";
  EventKind["ToDevice"] = "to_device";
  EventKind["RoomAccount"] = "room_account";
  return EventKind;
}({});
exports.EventKind = EventKind;
var EventDirection = /*#__PURE__*/function (EventDirection) {
  EventDirection["Send"] = "send";
  EventDirection["Receive"] = "receive";
  return EventDirection;
}({});
exports.EventDirection = EventDirection;
var WidgetEventCapability = /*#__PURE__*/function () {
  function WidgetEventCapability(direction, eventType, kind, keyStr, raw) {
    _classCallCheck(this, WidgetEventCapability);
    this.direction = direction;
    this.eventType = eventType;
    this.kind = kind;
    this.keyStr = keyStr;
    this.raw = raw;
  }
  _createClass(WidgetEventCapability, [{
    key: "matchesAsStateEvent",
    value: function matchesAsStateEvent(direction, eventType, stateKey) {
      if (this.kind !== EventKind.State) return false; // not a state event
      if (this.direction !== direction) return false; // direction mismatch
      if (this.eventType !== eventType) return false; // event type mismatch
      if (this.keyStr === null) return true; // all state keys are allowed
      if (this.keyStr === stateKey) return true; // this state key is allowed

      // Default not allowed
      return false;
    }
  }, {
    key: "matchesAsToDeviceEvent",
    value: function matchesAsToDeviceEvent(direction, eventType) {
      if (this.kind !== EventKind.ToDevice) return false; // not a to-device event
      if (this.direction !== direction) return false; // direction mismatch
      if (this.eventType !== eventType) return false; // event type mismatch

      // Checks passed, the event is allowed
      return true;
    }
  }, {
    key: "matchesAsRoomEvent",
    value: function matchesAsRoomEvent(direction, eventType) {
      var msgtype = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (this.kind !== EventKind.Event) return false; // not a room event
      if (this.direction !== direction) return false; // direction mismatch
      if (this.eventType !== eventType) return false; // event type mismatch

      if (this.eventType === "m.room.message") {
        if (this.keyStr === null) return true; // all message types are allowed
        if (this.keyStr === msgtype) return true; // this message type is allowed
      } else {
        return true; // already passed the check for if the event is allowed
      }

      // Default not allowed
      return false;
    }
  }, {
    key: "matchesAsRoomAccountData",
    value: function matchesAsRoomAccountData(direction, eventType) {
      if (this.kind !== EventKind.RoomAccount) return false; // not room account data
      if (this.direction !== direction) return false; // direction mismatch
      if (this.eventType !== eventType) return false; // event type mismatch

      // Checks passed, the event is allowed
      return true;
    }
  }], [{
    key: "forStateEvent",
    value: function forStateEvent(direction, eventType, stateKey) {
      // TODO: Enable support for m.* namespace once the MSC lands.
      // https://github.com/matrix-org/matrix-widget-api/issues/22
      eventType = eventType.replace(/#/g, "\\#");
      stateKey = stateKey !== null && stateKey !== undefined ? "#".concat(stateKey) : "";
      var str = "org.matrix.msc2762.".concat(direction, ".state_event:").concat(eventType).concat(stateKey);

      // cheat by sending it through the processor
      return WidgetEventCapability.findEventCapabilities([str])[0];
    }
  }, {
    key: "forToDeviceEvent",
    value: function forToDeviceEvent(direction, eventType) {
      // TODO: Enable support for m.* namespace once the MSC lands.
      // https://github.com/matrix-org/matrix-widget-api/issues/56
      var str = "org.matrix.msc3819.".concat(direction, ".to_device:").concat(eventType);

      // cheat by sending it through the processor
      return WidgetEventCapability.findEventCapabilities([str])[0];
    }
  }, {
    key: "forRoomEvent",
    value: function forRoomEvent(direction, eventType) {
      // TODO: Enable support for m.* namespace once the MSC lands.
      // https://github.com/matrix-org/matrix-widget-api/issues/22
      var str = "org.matrix.msc2762.".concat(direction, ".event:").concat(eventType);

      // cheat by sending it through the processor
      return WidgetEventCapability.findEventCapabilities([str])[0];
    }
  }, {
    key: "forRoomMessageEvent",
    value: function forRoomMessageEvent(direction, msgtype) {
      // TODO: Enable support for m.* namespace once the MSC lands.
      // https://github.com/matrix-org/matrix-widget-api/issues/22
      msgtype = msgtype === null || msgtype === undefined ? "" : msgtype;
      var str = "org.matrix.msc2762.".concat(direction, ".event:m.room.message#").concat(msgtype);

      // cheat by sending it through the processor
      return WidgetEventCapability.findEventCapabilities([str])[0];
    }
  }, {
    key: "forRoomAccountData",
    value: function forRoomAccountData(direction, eventType) {
      var str = "com.beeper.capabilities.".concat(direction, ".room_account_data:").concat(eventType);
      return WidgetEventCapability.findEventCapabilities([str])[0];
    }

    /**
     * Parses a capabilities request to find all the event capability requests.
     * @param {Iterable<Capability>} capabilities The capabilities requested/to parse.
     * @returns {WidgetEventCapability[]} An array of event capability requests. May be empty, but never null.
     */
  }, {
    key: "findEventCapabilities",
    value: function findEventCapabilities(capabilities) {
      var parsed = [];
      var _iterator = _createForOfIteratorHelper(capabilities),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cap = _step.value;
          var _direction = null;
          var eventSegment = void 0;
          var _kind = null;

          // TODO: Enable support for m.* namespace once the MSCs land.
          // https://github.com/matrix-org/matrix-widget-api/issues/22
          // https://github.com/matrix-org/matrix-widget-api/issues/56

          if (cap.startsWith("org.matrix.msc2762.send.event:")) {
            _direction = EventDirection.Send;
            _kind = EventKind.Event;
            eventSegment = cap.substring("org.matrix.msc2762.send.event:".length);
          } else if (cap.startsWith("org.matrix.msc2762.send.state_event:")) {
            _direction = EventDirection.Send;
            _kind = EventKind.State;
            eventSegment = cap.substring("org.matrix.msc2762.send.state_event:".length);
          } else if (cap.startsWith("org.matrix.msc3819.send.to_device:")) {
            _direction = EventDirection.Send;
            _kind = EventKind.ToDevice;
            eventSegment = cap.substring("org.matrix.msc3819.send.to_device:".length);
          } else if (cap.startsWith("org.matrix.msc2762.receive.event:")) {
            _direction = EventDirection.Receive;
            _kind = EventKind.Event;
            eventSegment = cap.substring("org.matrix.msc2762.receive.event:".length);
          } else if (cap.startsWith("org.matrix.msc2762.receive.state_event:")) {
            _direction = EventDirection.Receive;
            _kind = EventKind.State;
            eventSegment = cap.substring("org.matrix.msc2762.receive.state_event:".length);
          } else if (cap.startsWith("org.matrix.msc3819.receive.to_device:")) {
            _direction = EventDirection.Receive;
            _kind = EventKind.ToDevice;
            eventSegment = cap.substring("org.matrix.msc3819.receive.to_device:".length);
          } else if (cap.startsWith("com.beeper.capabilities.receive.room_account_data:")) {
            _direction = EventDirection.Receive;
            _kind = EventKind.RoomAccount;
            eventSegment = cap.substring("com.beeper.capabilities.receive.room_account_data:".length);
          }
          if (_direction === null || _kind === null || eventSegment === undefined) continue;

          // The capability uses `#` as a separator between event type and state key/msgtype,
          // so we split on that. However, a # is also valid in either one of those so we
          // join accordingly.
          // Eg: `m.room.message##m.text` is "m.room.message" event with msgtype "#m.text".
          var expectingKeyStr = eventSegment.startsWith("m.room.message#") || _kind === EventKind.State;
          var _keyStr = null;
          if (eventSegment.includes("#") && expectingKeyStr) {
            // Dev note: regex is difficult to write, so instead the rules are manually written
            // out. This is probably just as understandable as a boring regex though, so win-win?

            // Test cases:
            // str                      eventSegment        keyStr
            // -------------------------------------------------------------
            // m.room.message#          m.room.message      <empty string>
            // m.room.message#test      m.room.message      test
            // m.room.message\#         m.room.message#     test
            // m.room.message##test     m.room.message      #test
            // m.room.message\##test    m.room.message#     test
            // m.room.message\\##test   m.room.message\#    test
            // m.room.message\\###test  m.room.message\#    #test

            // First step: explode the string
            var parts = eventSegment.split("#");

            // To form the eventSegment, we'll keep finding parts of the exploded string until
            // there's one that doesn't end with the escape character (\). We'll then join those
            // segments together with the exploding character. We have to remember to consume the
            // escape character as well.
            var idx = parts.findIndex(function (p) {
              return !p.endsWith("\\");
            });
            eventSegment = parts.slice(0, idx + 1).map(function (p) {
              return p.endsWith("\\") ? p.substring(0, p.length - 1) : p;
            }).join("#");

            // The keyStr is whatever is left over.
            _keyStr = parts.slice(idx + 1).join("#");
          }
          parsed.push(new WidgetEventCapability(_direction, eventSegment, _kind, _keyStr, cap));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return parsed;
    }
  }]);
  return WidgetEventCapability;
}();
exports.WidgetEventCapability = WidgetEventCapability;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetParser = void 0;
var _Widget = require("./Widget");
var _url = require("./validation/url");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*
                                                                                                                                                                                                                                                                                                                                                                                               * Copyright 2020 The Matrix.org Foundation C.I.C.
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                               * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                               * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               *         http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                               * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                               * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                               * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                               */
var WidgetParser = /*#__PURE__*/function () {
  function WidgetParser() {
    _classCallCheck(this, WidgetParser);
  } // private constructor because this is a util class

  /**
   * Parses widgets from the "m.widgets" account data event. This will always
   * return an array, though may be empty if no valid widgets were found.
   * @param {IAccountDataWidgets} content The content of the "m.widgets" account data.
   * @returns {Widget[]} The widgets in account data, or an empty array.
   */
  _createClass(WidgetParser, null, [{
    key: "parseAccountData",
    value: function parseAccountData(content) {
      if (!content) return [];
      var result = [];
      for (var _i = 0, _Object$keys = Object.keys(content); _i < _Object$keys.length; _i++) {
        var _widgetId = _Object$keys[_i];
        var roughWidget = content[_widgetId];
        if (!roughWidget) continue;
        if (roughWidget.type !== "m.widget" && roughWidget.type !== "im.vector.modular.widgets") continue;
        if (!roughWidget.sender) continue;
        var probableWidgetId = roughWidget.state_key || roughWidget.id;
        if (probableWidgetId !== _widgetId) continue;
        var asStateEvent = {
          content: roughWidget.content,
          sender: roughWidget.sender,
          type: "m.widget",
          state_key: _widgetId,
          event_id: "$example",
          room_id: "!example",
          origin_server_ts: 1
        };
        var widget = WidgetParser.parseRoomWidget(asStateEvent);
        if (widget) result.push(widget);
      }
      return result;
    }

    /**
     * Parses all the widgets possible in the given array. This will always return
     * an array, though may be empty if no widgets could be parsed.
     * @param {IStateEvent[]} currentState The room state to parse.
     * @returns {Widget[]} The widgets in the state, or an empty array.
     */
  }, {
    key: "parseWidgetsFromRoomState",
    value: function parseWidgetsFromRoomState(currentState) {
      if (!currentState) return [];
      var result = [];
      var _iterator = _createForOfIteratorHelper(currentState),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var state = _step.value;
          var widget = WidgetParser.parseRoomWidget(state);
          if (widget) result.push(widget);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return result;
    }

    /**
     * Parses a state event into a widget. If the state event does not represent
     * a widget (wrong event type, invalid widget, etc) then null is returned.
     * @param {IStateEvent} stateEvent The state event.
     * @returns {Widget|null} The widget, or null if invalid
     */
  }, {
    key: "parseRoomWidget",
    value: function parseRoomWidget(stateEvent) {
      if (!stateEvent) return null;

      // TODO: [Legacy] Remove legacy support
      if (stateEvent.type !== "m.widget" && stateEvent.type !== "im.vector.modular.widgets") {
        return null;
      }

      // Dev note: Throughout this function we have null safety to ensure that
      // if the caller did not supply something useful that we don't error. This
      // is done against the requirements of the interface because not everyone
      // will have an interface to validate against.

      var content = stateEvent.content || {};

      // Form our best approximation of a widget with the information we have
      var estimatedWidget = {
        id: stateEvent.state_key,
        creatorUserId: content["creatorUserId"] || stateEvent.sender,
        name: content["name"],
        type: content["type"],
        url: content["url"],
        waitForIframeLoad: content["waitForIframeLoad"],
        data: content["data"]
      };

      // Finally, process that widget
      return WidgetParser.processEstimatedWidget(estimatedWidget);
    }
  }, {
    key: "processEstimatedWidget",
    value: function processEstimatedWidget(widget) {
      // Validate that the widget has the best chance of passing as a widget
      if (!widget.id || !widget.creatorUserId || !widget.type) {
        return null;
      }
      if (!(0, _url.isValidUrl)(widget.url)) {
        return null;
      }
      // TODO: Validate data for known widget types
      return new _Widget.Widget(widget);
    }
  }]);
  return WidgetParser;
}();
exports.WidgetParser = WidgetParser;

},{"./Widget":17,"./validation/url":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidUrl = isValidUrl;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function isValidUrl(val) {
  if (!val) return false; // easy: not valid if not present

  try {
    var parsed = new URL(val);
    if (parsed.protocol !== "http" && parsed.protocol !== "https") {
      return false;
    }
    return true;
  } catch (e) {
    if (e instanceof TypeError) {
      return false;
    }
    throw e;
  }
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertPresent = assertPresent;
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertPresent(obj, key) {
  if (!obj[key]) {
    throw new Error("".concat(String(key), " is required"));
  }
}

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTemplate = runTemplate;
exports.toString = toString;
/*
 * Copyright 2020, 2021 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function runTemplate(url, widget, params) {
  // Always apply the supplied params over top of data to ensure the data can't lie about them.
  var variables = Object.assign({}, widget.data, {
    "matrix_room_id": params.widgetRoomId || "",
    "matrix_user_id": params.currentUserId,
    "matrix_display_name": params.userDisplayName || params.currentUserId,
    "matrix_avatar_url": params.userHttpAvatarUrl || "",
    "matrix_widget_id": widget.id,
    // TODO: Convert to stable (https://github.com/matrix-org/matrix-doc/pull/2873)
    "org.matrix.msc2873.client_id": params.clientId || "",
    "org.matrix.msc2873.client_theme": params.clientTheme || "",
    "org.matrix.msc2873.client_language": params.clientLanguage || "",
    // TODO: Convert to stable (https://github.com/matrix-org/matrix-spec-proposals/pull/3819)
    "org.matrix.msc3819.matrix_device_id": params.deviceId || "",
    // TODO: Convert to stable (https://github.com/matrix-org/matrix-spec-proposals/pull/4039)
    "org.matrix.msc4039.matrix_base_url": params.baseUrl || ""
  });
  var result = url;
  for (var _i = 0, _Object$keys = Object.keys(variables); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    // Regex escape from https://stackoverflow.com/a/6969486/7037379
    var pattern = "$".concat(key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    var rexp = new RegExp(pattern, "g");

    // This is technically not what we're supposed to do for a couple of reasons:
    // 1. We are assuming that there won't later be a $key match after we replace a variable.
    // 2. We are assuming that the variable is in a place where it can be escaped (eg: path or query string).
    result = result.replace(rexp, encodeURIComponent(toString(variables[key])));
  }
  return result;
}
function toString(a) {
  if (a === null || a === undefined) {
    return "".concat(a);
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(a);
}

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostmessageTransport = void 0;
var _events = require("events");
var _ = require("..");
var _excluded = ["message"];
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /*
                                                                                                                                                                                                                                                                                                                                                                                               * Copyright 2020 - 2024 The Matrix.org Foundation C.I.C.
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                               * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                               * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               *         http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                               * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                               * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                               * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                               * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                               * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                               */
/**
 * Transport for the Widget API over postMessage.
 */
var PostmessageTransport = /*#__PURE__*/function (_EventEmitter) {
  _inherits(PostmessageTransport, _EventEmitter);
  var _super = _createSuper(PostmessageTransport);
  function PostmessageTransport(sendDirection, initialWidgetId, transportWindow, inboundWindow) {
    var _this;
    _classCallCheck(this, PostmessageTransport);
    _this = _super.call(this);
    _this.sendDirection = sendDirection;
    _this.transportWindow = transportWindow;
    _this.inboundWindow = inboundWindow;
    _defineProperty(_assertThisInitialized(_this), "strictOriginCheck", false);
    _defineProperty(_assertThisInitialized(_this), "targetOrigin", "*");
    _defineProperty(_assertThisInitialized(_this), "timeoutSeconds", 10);
    _defineProperty(_assertThisInitialized(_this), "_ready", false);
    _defineProperty(_assertThisInitialized(_this), "_widgetId", void 0);
    _defineProperty(_assertThisInitialized(_this), "outboundRequests", new Map());
    _defineProperty(_assertThisInitialized(_this), "stopController", new AbortController());
    _defineProperty(_assertThisInitialized(_this), "handleMessage", function (ev) {
      if (_this.stopController.signal.aborted) return;
      if (!ev.data) return; // invalid event

      if (_this.strictOriginCheck && ev.origin !== globalThis.origin) return; // bad origin

      // treat the message as a response first, then downgrade to a request
      var response = ev.data;
      if (!response.action || !response.requestId || !response.widgetId) return; // invalid request/response

      if (response.response) {
        if (response.api !== _this.sendDirection) return; // wrong direction
        _this.handleResponse(response);
      } else {
        var request = response;
        if (request.api !== (0, _.invertedDirection)(_this.sendDirection)) return; // wrong direction
        _this.handleRequest(request);
      }
    });
    _this._widgetId = initialWidgetId;
    return _this;
  }
  _createClass(PostmessageTransport, [{
    key: "ready",
    get: function get() {
      return this._ready;
    }
  }, {
    key: "widgetId",
    get: function get() {
      return this._widgetId || null;
    }
  }, {
    key: "nextRequestId",
    get: function get() {
      var idBase = "widgetapi-".concat(Date.now());
      var index = 0;
      var id = idBase;
      while (this.outboundRequests.has(id)) {
        id = "".concat(idBase, "-").concat(index++);
      }

      // reserve the ID
      this.outboundRequests.set(id, null);
      return id;
    }
  }, {
    key: "sendInternal",
    value: function sendInternal(message) {
      console.log("[PostmessageTransport] Sending object to ".concat(this.targetOrigin, ": "), message);
      this.transportWindow.postMessage(message, this.targetOrigin);
    }
  }, {
    key: "reply",
    value: function reply(request, responseData) {
      return this.sendInternal(_objectSpread(_objectSpread({}, request), {}, {
        response: responseData
      }));
    }
  }, {
    key: "send",
    value: function send(action, data) {
      return this.sendComplete(action, data).then(function (r) {
        return r.response;
      });
    }
  }, {
    key: "sendComplete",
    value: function sendComplete(action, data) {
      var _this2 = this;
      if (!this.ready || !this.widgetId) {
        return Promise.reject(new Error("Not ready or unknown widget ID"));
      }
      var request = {
        api: this.sendDirection,
        widgetId: this.widgetId,
        requestId: this.nextRequestId,
        action: action,
        data: data
      };
      if (action === _.WidgetApiToWidgetAction.UpdateVisibility) {
        request["visible"] = data["visible"];
      }
      return new Promise(function (prResolve, prReject) {
        var resolve = function resolve(response) {
          cleanUp();
          prResolve(response);
        };
        var reject = function reject(err) {
          cleanUp();
          prReject(err);
        };
        var timerId = setTimeout(function () {
          return reject(new Error("Request timed out"));
        }, (_this2.timeoutSeconds || 1) * 1000);
        var onStop = function onStop() {
          return reject(new Error("Transport stopped"));
        };
        _this2.stopController.signal.addEventListener("abort", onStop);
        var cleanUp = function cleanUp() {
          _this2.outboundRequests["delete"](request.requestId);
          clearTimeout(timerId);
          _this2.stopController.signal.removeEventListener("abort", onStop);
        };
        _this2.outboundRequests.set(request.requestId, {
          request: request,
          resolve: resolve,
          reject: reject
        });
        _this2.sendInternal(request);
      });
    }
  }, {
    key: "start",
    value: function start() {
      this.inboundWindow.addEventListener("message", this.handleMessage);
      this._ready = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      this._ready = false;
      this.stopController.abort();
      this.inboundWindow.removeEventListener("message", this.handleMessage);
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(request) {
      if (this.widgetId) {
        if (this.widgetId !== request.widgetId) return; // wrong widget
      } else {
        this._widgetId = request.widgetId;
      }
      this.emit("message", new CustomEvent("message", {
        detail: request
      }));
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(response) {
      if (response.widgetId !== this.widgetId) return; // wrong widget

      var req = this.outboundRequests.get(response.requestId);
      if (!req) return; // response to an unknown request

      if ((0, _.isErrorResponse)(response.response)) {
        var _response$response$er = response.response.error,
          message = _response$response$er.message,
          data = _objectWithoutProperties(_response$response$er, _excluded);
        req.reject(new _.WidgetApiResponseError(message, data));
      } else {
        req.resolve(response);
      }
    }
  }]);
  return PostmessageTransport;
}(_events.EventEmitter);
exports.PostmessageTransport = PostmessageTransport;

},{"..":5,"events":25}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleObservable = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
 * Copyright 2020 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var SimpleObservable = /*#__PURE__*/function () {
  function SimpleObservable(initialFn) {
    _classCallCheck(this, SimpleObservable);
    _defineProperty(this, "listeners", []);
    if (initialFn) this.listeners.push(initialFn);
  }
  _createClass(SimpleObservable, [{
    key: "onUpdate",
    value: function onUpdate(fn) {
      this.listeners.push(fn);
    }
  }, {
    key: "update",
    value: function update(val) {
      var _iterator = _createForOfIteratorHelper(this.listeners),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var listener = _step.value;
          listener(val);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "close",
    value: function close() {
      this.listeners = []; // reset
    }
  }]);
  return SimpleObservable;
}();
exports.SimpleObservable = SimpleObservable;

},{}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}]},{},[5])(5)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvQ2xpZW50V2lkZ2V0QXBpLmpzIiwibGliL1N5bWJvbHMuanMiLCJsaWIvV2lkZ2V0QXBpLmpzIiwibGliL2RyaXZlci9XaWRnZXREcml2ZXIuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvaW50ZXJmYWNlcy9BcGlWZXJzaW9uLmpzIiwibGliL2ludGVyZmFjZXMvQ2FwYWJpbGl0aWVzLmpzIiwibGliL2ludGVyZmFjZXMvR2V0T3BlbklEQWN0aW9uLmpzIiwibGliL2ludGVyZmFjZXMvSVdpZGdldEFwaUVycm9yUmVzcG9uc2UuanMiLCJsaWIvaW50ZXJmYWNlcy9Nb2RhbEJ1dHRvbktpbmQuanMiLCJsaWIvaW50ZXJmYWNlcy9Nb2RhbFdpZGdldEFjdGlvbnMuanMiLCJsaWIvaW50ZXJmYWNlcy9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uanMiLCJsaWIvaW50ZXJmYWNlcy9XaWRnZXRBcGlBY3Rpb24uanMiLCJsaWIvaW50ZXJmYWNlcy9XaWRnZXRBcGlEaXJlY3Rpb24uanMiLCJsaWIvaW50ZXJmYWNlcy9XaWRnZXRLaW5kLmpzIiwibGliL2ludGVyZmFjZXMvV2lkZ2V0VHlwZS5qcyIsImxpYi9tb2RlbHMvV2lkZ2V0LmpzIiwibGliL21vZGVscy9XaWRnZXRFdmVudENhcGFiaWxpdHkuanMiLCJsaWIvbW9kZWxzL1dpZGdldFBhcnNlci5qcyIsImxpYi9tb2RlbHMvdmFsaWRhdGlvbi91cmwuanMiLCJsaWIvbW9kZWxzL3ZhbGlkYXRpb24vdXRpbHMuanMiLCJsaWIvdGVtcGxhdGluZy91cmwtdGVtcGxhdGUuanMiLCJsaWIvdHJhbnNwb3J0L1Bvc3RtZXNzYWdlVHJhbnNwb3J0LmpzIiwibGliL3V0aWwvU2ltcGxlT2JzZXJ2YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzc1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuQ2xpZW50V2lkZ2V0QXBpID0gdm9pZCAwO1xudmFyIF9ldmVudHMgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xudmFyIF9Qb3N0bWVzc2FnZVRyYW5zcG9ydCA9IHJlcXVpcmUoXCIuL3RyYW5zcG9ydC9Qb3N0bWVzc2FnZVRyYW5zcG9ydFwiKTtcbnZhciBfV2lkZ2V0QXBpRGlyZWN0aW9uID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9XaWRnZXRBcGlEaXJlY3Rpb25cIik7XG52YXIgX1dpZGdldEFwaUFjdGlvbiA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZXMvV2lkZ2V0QXBpQWN0aW9uXCIpO1xudmFyIF9DYXBhYmlsaXRpZXMgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL0NhcGFiaWxpdGllc1wiKTtcbnZhciBfQXBpVmVyc2lvbiA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZXMvQXBpVmVyc2lvblwiKTtcbnZhciBfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5ID0gcmVxdWlyZShcIi4vbW9kZWxzL1dpZGdldEV2ZW50Q2FwYWJpbGl0eVwiKTtcbnZhciBfR2V0T3BlbklEQWN0aW9uID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9HZXRPcGVuSURBY3Rpb25cIik7XG52YXIgX1NpbXBsZU9ic2VydmFibGUgPSByZXF1aXJlKFwiLi91dGlsL1NpbXBsZU9ic2VydmFibGVcIik7XG52YXIgX1N5bWJvbHMgPSByZXF1aXJlKFwiLi9TeW1ib2xzXCIpO1xudmFyIF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24gPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL1VwZGF0ZURlbGF5ZWRFdmVudEFjdGlvblwiKTtcbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgcmV0dXJuIF90eXBlb2YgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9LCBfdHlwZW9mKG9iaik7IH1cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBlbnVtZXJhYmxlT25seSAmJiAoc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pKSwga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gbnVsbCAhPSBhcmd1bWVudHNbaV0gPyBhcmd1bWVudHNbaV0gOiB7fTsgaSAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSA6IG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gcmV0dXJuIHRhcmdldDsgfVxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZSkgeyB0aHJvdyBfZTsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTI7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdFtcInJldHVyblwiXSAhPSBudWxsKSBpdFtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoZGlkRXJyKSB0aHJvdyBlcnI7IH0gfSB9OyB9XG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpOyB9XG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOyByZXR1cm4gYXJyMjsgfVxuZnVuY3Rpb24gX3JlZ2VuZXJhdG9yUnVudGltZSgpIHsgXCJ1c2Ugc3RyaWN0XCI7IC8qISByZWdlbmVyYXRvci1ydW50aW1lIC0tIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLiAtLSBsaWNlbnNlIChNSVQpOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvYmxvYi9tYWluL0xJQ0VOU0UgKi8gX3JlZ2VuZXJhdG9yUnVudGltZSA9IGZ1bmN0aW9uIF9yZWdlbmVyYXRvclJ1bnRpbWUoKSB7IHJldHVybiBleHBvcnRzOyB9OyB2YXIgZXhwb3J0cyA9IHt9LCBPcCA9IE9iamVjdC5wcm90b3R5cGUsIGhhc093biA9IE9wLmhhc093blByb3BlcnR5LCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBmdW5jdGlvbiAob2JqLCBrZXksIGRlc2MpIHsgb2JqW2tleV0gPSBkZXNjLnZhbHVlOyB9LCAkU3ltYm9sID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgPyBTeW1ib2wgOiB7fSwgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiLCBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCIsIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjsgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkgeyByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogITAsIGNvbmZpZ3VyYWJsZTogITAsIHdyaXRhYmxlOiAhMCB9KSwgb2JqW2tleV07IH0gdHJ5IHsgZGVmaW5lKHt9LCBcIlwiKTsgfSBjYXRjaCAoZXJyKSB7IGRlZmluZSA9IGZ1bmN0aW9uIGRlZmluZShvYmosIGtleSwgdmFsdWUpIHsgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7IH07IH0gZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkgeyB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvciwgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpLCBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pOyByZXR1cm4gZGVmaW5lUHJvcGVydHkoZ2VuZXJhdG9yLCBcIl9pbnZva2VcIiwgeyB2YWx1ZTogbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB9KSwgZ2VuZXJhdG9yOyB9IGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykgeyB0cnkgeyByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07IH0gY2F0Y2ggKGVycikgeyByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07IH0gfSBleHBvcnRzLndyYXAgPSB3cmFwOyB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9OyBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fSBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9IGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge30gdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307IGRlZmluZShJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pOyB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YsIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpOyBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJiBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiYgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSAmJiAoSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSk7IHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTsgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkgeyBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7IGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24gKGFyZykgeyByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTsgfSk7IH0pOyB9IGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkgeyBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkgeyB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTsgaWYgKFwidGhyb3dcIiAhPT0gcmVjb3JkLnR5cGUpIHsgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmcsIHZhbHVlID0gcmVzdWx0LnZhbHVlOyByZXR1cm4gdmFsdWUgJiYgXCJvYmplY3RcIiA9PSBfdHlwZW9mKHZhbHVlKSAmJiBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpID8gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkgeyBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpOyB9LCBmdW5jdGlvbiAoZXJyKSB7IGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTsgfSkgOiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh1bndyYXBwZWQpIHsgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkLCByZXNvbHZlKHJlc3VsdCk7IH0sIGZ1bmN0aW9uIChlcnJvcikgeyByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7IH0pOyB9IHJlamVjdChyZWNvcmQuYXJnKTsgfSB2YXIgcHJldmlvdXNQcm9taXNlOyBkZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIl9pbnZva2VcIiwgeyB2YWx1ZTogZnVuY3Rpb24gdmFsdWUobWV0aG9kLCBhcmcpIHsgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7IHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7IH0pOyB9IHJldHVybiBwcmV2aW91c1Byb21pc2UgPSBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZywgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcpIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTsgfSB9KTsgfSBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHsgdmFyIHN0YXRlID0gXCJzdXNwZW5kZWRTdGFydFwiOyByZXR1cm4gZnVuY3Rpb24gKG1ldGhvZCwgYXJnKSB7IGlmIChcImV4ZWN1dGluZ1wiID09PSBzdGF0ZSkgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTsgaWYgKFwiY29tcGxldGVkXCIgPT09IHN0YXRlKSB7IGlmIChcInRocm93XCIgPT09IG1ldGhvZCkgdGhyb3cgYXJnOyByZXR1cm4gZG9uZVJlc3VsdCgpOyB9IGZvciAoY29udGV4dC5tZXRob2QgPSBtZXRob2QsIGNvbnRleHQuYXJnID0gYXJnOzspIHsgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTsgaWYgKGRlbGVnYXRlKSB7IHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpOyBpZiAoZGVsZWdhdGVSZXN1bHQpIHsgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTsgcmV0dXJuIGRlbGVnYXRlUmVzdWx0OyB9IH0gaWYgKFwibmV4dFwiID09PSBjb250ZXh0Lm1ldGhvZCkgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO2Vsc2UgaWYgKFwidGhyb3dcIiA9PT0gY29udGV4dC5tZXRob2QpIHsgaWYgKFwic3VzcGVuZGVkU3RhcnRcIiA9PT0gc3RhdGUpIHRocm93IHN0YXRlID0gXCJjb21wbGV0ZWRcIiwgY29udGV4dC5hcmc7IGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpOyB9IGVsc2UgXCJyZXR1cm5cIiA9PT0gY29udGV4dC5tZXRob2QgJiYgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpOyBzdGF0ZSA9IFwiZXhlY3V0aW5nXCI7IHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTsgaWYgKFwibm9ybWFsXCIgPT09IHJlY29yZC50eXBlKSB7IGlmIChzdGF0ZSA9IGNvbnRleHQuZG9uZSA/IFwiY29tcGxldGVkXCIgOiBcInN1c3BlbmRlZFlpZWxkXCIsIHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlOyByZXR1cm4geyB2YWx1ZTogcmVjb3JkLmFyZywgZG9uZTogY29udGV4dC5kb25lIH07IH0gXCJ0aHJvd1wiID09PSByZWNvcmQudHlwZSAmJiAoc3RhdGUgPSBcImNvbXBsZXRlZFwiLCBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIiwgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnKTsgfSB9OyB9IGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHsgdmFyIG1ldGhvZE5hbWUgPSBjb250ZXh0Lm1ldGhvZCwgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kTmFtZV07IGlmICh1bmRlZmluZWQgPT09IG1ldGhvZCkgcmV0dXJuIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsLCBcInRocm93XCIgPT09IG1ldGhvZE5hbWUgJiYgZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0gJiYgKGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIiwgY29udGV4dC5hcmcgPSB1bmRlZmluZWQsIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpLCBcInRocm93XCIgPT09IGNvbnRleHQubWV0aG9kKSB8fCBcInJldHVyblwiICE9PSBtZXRob2ROYW1lICYmIChjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIiwgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAnXCIgKyBtZXRob2ROYW1lICsgXCInIG1ldGhvZFwiKSksIENvbnRpbnVlU2VudGluZWw7IHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7IGlmIChcInRocm93XCIgPT09IHJlY29yZC50eXBlKSByZXR1cm4gY29udGV4dC5tZXRob2QgPSBcInRocm93XCIsIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZywgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGwsIENvbnRpbnVlU2VudGluZWw7IHZhciBpbmZvID0gcmVjb3JkLmFyZzsgcmV0dXJuIGluZm8gPyBpbmZvLmRvbmUgPyAoY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWUsIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2MsIFwicmV0dXJuXCIgIT09IGNvbnRleHQubWV0aG9kICYmIChjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiLCBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZCksIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsLCBDb250aW51ZVNlbnRpbmVsKSA6IGluZm8gOiAoY29udGV4dC5tZXRob2QgPSBcInRocm93XCIsIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpLCBjb250ZXh0LmRlbGVnYXRlID0gbnVsbCwgQ29udGludWVTZW50aW5lbCk7IH0gZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHsgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTsgMSBpbiBsb2NzICYmIChlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV0pLCAyIGluIGxvY3MgJiYgKGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdLCBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM10pLCB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7IH0gZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkgeyB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTsgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiLCBkZWxldGUgcmVjb3JkLmFyZywgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDsgfSBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7IHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV0sIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKSwgdGhpcy5yZXNldCghMCk7IH0gZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7IGlmIChpdGVyYWJsZSkgeyB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07IGlmIChpdGVyYXRvck1ldGhvZCkgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpOyBpZiAoXCJmdW5jdGlvblwiID09IHR5cGVvZiBpdGVyYWJsZS5uZXh0KSByZXR1cm4gaXRlcmFibGU7IGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkgeyB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHsgZm9yICg7ICsraSA8IGl0ZXJhYmxlLmxlbmd0aDspIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHJldHVybiBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV0sIG5leHQuZG9uZSA9ICExLCBuZXh0OyByZXR1cm4gbmV4dC52YWx1ZSA9IHVuZGVmaW5lZCwgbmV4dC5kb25lID0gITAsIG5leHQ7IH07IHJldHVybiBuZXh0Lm5leHQgPSBuZXh0OyB9IH0gcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9OyB9IGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7IHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6ICEwIH07IH0gcmV0dXJuIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBkZWZpbmVQcm9wZXJ0eShHcCwgXCJjb25zdHJ1Y3RvclwiLCB7IHZhbHVlOiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgY29uZmlndXJhYmxlOiAhMCB9KSwgZGVmaW5lUHJvcGVydHkoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgeyB2YWx1ZTogR2VuZXJhdG9yRnVuY3Rpb24sIGNvbmZpZ3VyYWJsZTogITAgfSksIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JGdW5jdGlvblwiKSwgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikgeyB2YXIgY3RvciA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgZ2VuRnVuICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjsgcmV0dXJuICEhY3RvciAmJiAoY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHwgXCJHZW5lcmF0b3JGdW5jdGlvblwiID09PSAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpKTsgfSwgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24gKGdlbkZ1bikgeyByZXR1cm4gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpIDogKGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIikpLCBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCksIGdlbkZ1bjsgfSwgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07IH0sIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSksIGRlZmluZShBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSwgYXN5bmNJdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSksIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3IsIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbiAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7IHZvaWQgMCA9PT0gUHJvbWlzZUltcGwgJiYgKFByb21pc2VJbXBsID0gUHJvbWlzZSk7IHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3Iod3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksIFByb21pc2VJbXBsKTsgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKSA/IGl0ZXIgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHsgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7IH0pOyB9LCBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApLCBkZWZpbmUoR3AsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvclwiKSwgZGVmaW5lKEdwLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSksIGRlZmluZShHcCwgXCJ0b1N0cmluZ1wiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiOyB9KSwgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24gKHZhbCkgeyB2YXIgb2JqZWN0ID0gT2JqZWN0KHZhbCksIGtleXMgPSBbXTsgZm9yICh2YXIga2V5IGluIG9iamVjdCkga2V5cy5wdXNoKGtleSk7IHJldHVybiBrZXlzLnJldmVyc2UoKSwgZnVuY3Rpb24gbmV4dCgpIHsgZm9yICg7IGtleXMubGVuZ3RoOykgeyB2YXIga2V5ID0ga2V5cy5wb3AoKTsgaWYgKGtleSBpbiBvYmplY3QpIHJldHVybiBuZXh0LnZhbHVlID0ga2V5LCBuZXh0LmRvbmUgPSAhMSwgbmV4dDsgfSByZXR1cm4gbmV4dC5kb25lID0gITAsIG5leHQ7IH07IH0sIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzLCBDb250ZXh0LnByb3RvdHlwZSA9IHsgY29uc3RydWN0b3I6IENvbnRleHQsIHJlc2V0OiBmdW5jdGlvbiByZXNldChza2lwVGVtcFJlc2V0KSB7IGlmICh0aGlzLnByZXYgPSAwLCB0aGlzLm5leHQgPSAwLCB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkLCB0aGlzLmRvbmUgPSAhMSwgdGhpcy5kZWxlZ2F0ZSA9IG51bGwsIHRoaXMubWV0aG9kID0gXCJuZXh0XCIsIHRoaXMuYXJnID0gdW5kZWZpbmVkLCB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KSwgIXNraXBUZW1wUmVzZXQpIGZvciAodmFyIG5hbWUgaW4gdGhpcykgXCJ0XCIgPT09IG5hbWUuY2hhckF0KDApICYmIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmICFpc05hTigrbmFtZS5zbGljZSgxKSkgJiYgKHRoaXNbbmFtZV0gPSB1bmRlZmluZWQpOyB9LCBzdG9wOiBmdW5jdGlvbiBzdG9wKCkgeyB0aGlzLmRvbmUgPSAhMDsgdmFyIHJvb3RSZWNvcmQgPSB0aGlzLnRyeUVudHJpZXNbMF0uY29tcGxldGlvbjsgaWYgKFwidGhyb3dcIiA9PT0gcm9vdFJlY29yZC50eXBlKSB0aHJvdyByb290UmVjb3JkLmFyZzsgcmV0dXJuIHRoaXMucnZhbDsgfSwgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikgeyBpZiAodGhpcy5kb25lKSB0aHJvdyBleGNlcHRpb247IHZhciBjb250ZXh0ID0gdGhpczsgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7IHJldHVybiByZWNvcmQudHlwZSA9IFwidGhyb3dcIiwgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbiwgY29udGV4dC5uZXh0ID0gbG9jLCBjYXVnaHQgJiYgKGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCIsIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkKSwgISFjYXVnaHQ7IH0gZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkgeyB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV0sIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247IGlmIChcInJvb3RcIiA9PT0gZW50cnkudHJ5TG9jKSByZXR1cm4gaGFuZGxlKFwiZW5kXCIpOyBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikgeyB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKSwgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7IGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7IGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgITApOyBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTsgfSBlbHNlIGlmIChoYXNDYXRjaCkgeyBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsICEwKTsgfSBlbHNlIHsgaWYgKCFoYXNGaW5hbGx5KSB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTsgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7IH0gfSB9IH0sIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykgeyBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7IHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTsgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiYgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJiB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7IHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTsgYnJlYWs7IH0gfSBmaW5hbGx5RW50cnkgJiYgKFwiYnJlYWtcIiA9PT0gdHlwZSB8fCBcImNvbnRpbnVlXCIgPT09IHR5cGUpICYmIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYyAmJiAoZmluYWxseUVudHJ5ID0gbnVsbCk7IHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9OyByZXR1cm4gcmVjb3JkLnR5cGUgPSB0eXBlLCByZWNvcmQuYXJnID0gYXJnLCBmaW5hbGx5RW50cnkgPyAodGhpcy5tZXRob2QgPSBcIm5leHRcIiwgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MsIENvbnRpbnVlU2VudGluZWwpIDogdGhpcy5jb21wbGV0ZShyZWNvcmQpOyB9LCBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUocmVjb3JkLCBhZnRlckxvYykgeyBpZiAoXCJ0aHJvd1wiID09PSByZWNvcmQudHlwZSkgdGhyb3cgcmVjb3JkLmFyZzsgcmV0dXJuIFwiYnJlYWtcIiA9PT0gcmVjb3JkLnR5cGUgfHwgXCJjb250aW51ZVwiID09PSByZWNvcmQudHlwZSA/IHRoaXMubmV4dCA9IHJlY29yZC5hcmcgOiBcInJldHVyblwiID09PSByZWNvcmQudHlwZSA/ICh0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmcsIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIiwgdGhpcy5uZXh0ID0gXCJlbmRcIikgOiBcIm5vcm1hbFwiID09PSByZWNvcmQudHlwZSAmJiBhZnRlckxvYyAmJiAodGhpcy5uZXh0ID0gYWZ0ZXJMb2MpLCBDb250aW51ZVNlbnRpbmVsOyB9LCBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7IGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHsgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldOyBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykgcmV0dXJuIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpLCByZXNldFRyeUVudHJ5KGVudHJ5KSwgQ29udGludWVTZW50aW5lbDsgfSB9LCBcImNhdGNoXCI6IGZ1bmN0aW9uIF9jYXRjaCh0cnlMb2MpIHsgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkgeyB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07IGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykgeyB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjsgaWYgKFwidGhyb3dcIiA9PT0gcmVjb3JkLnR5cGUpIHsgdmFyIHRocm93biA9IHJlY29yZC5hcmc7IHJlc2V0VHJ5RW50cnkoZW50cnkpOyB9IHJldHVybiB0aHJvd247IH0gfSB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7IH0sIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uIGRlbGVnYXRlWWllbGQoaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHsgcmV0dXJuIHRoaXMuZGVsZWdhdGUgPSB7IGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLCByZXN1bHROYW1lOiByZXN1bHROYW1lLCBuZXh0TG9jOiBuZXh0TG9jIH0sIFwibmV4dFwiID09PSB0aGlzLm1ldGhvZCAmJiAodGhpcy5hcmcgPSB1bmRlZmluZWQpLCBDb250aW51ZVNlbnRpbmVsOyB9IH0sIGV4cG9ydHM7IH1cbmZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHsgdHJ5IHsgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpOyB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlOyB9IGNhdGNoIChlcnJvcikgeyByZWplY3QoZXJyb3IpOyByZXR1cm47IH0gaWYgKGluZm8uZG9uZSkgeyByZXNvbHZlKHZhbHVlKTsgfSBlbHNlIHsgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpOyB9IH1cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7IHZhciBzZWxmID0gdGhpcywgYXJncyA9IGFyZ3VtZW50czsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpOyBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkgeyBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7IH0gZnVuY3Rpb24gX3Rocm93KGVycikgeyBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTsgfSBfbmV4dCh1bmRlZmluZWQpOyB9KTsgfTsgfVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgX3RvUHJvcGVydHlLZXkoZGVzY3JpcHRvci5rZXkpLCBkZXNjcmlwdG9yKTsgfSB9XG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwgeyB3cml0YWJsZTogZmFsc2UgfSk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN1YkNsYXNzLCBcInByb3RvdHlwZVwiLCB7IHdyaXRhYmxlOiBmYWxzZSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZi5iaW5kKCkgOiBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkgeyByZXR1cm4gY2FsbDsgfSBlbHNlIGlmIChjYWxsICE9PSB2b2lkIDApIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkRlcml2ZWQgY29uc3RydWN0b3JzIG1heSBvbmx5IHJldHVybiBvYmplY3Qgb3IgdW5kZWZpbmVkXCIpOyB9IHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpOyB9XG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mLmJpbmQoKSA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsga2V5ID0gX3RvUHJvcGVydHlLZXkoa2V5KTsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleShhcmcpIHsgdmFyIGtleSA9IF90b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpOyByZXR1cm4gX3R5cGVvZihrZXkpID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZShpbnB1dCwgaGludCkgeyBpZiAoX3R5cGVvZihpbnB1dCkgIT09IFwib2JqZWN0XCIgfHwgaW5wdXQgPT09IG51bGwpIHJldHVybiBpbnB1dDsgdmFyIHByaW0gPSBpbnB1dFtTeW1ib2wudG9QcmltaXRpdmVdOyBpZiAocHJpbSAhPT0gdW5kZWZpbmVkKSB7IHZhciByZXMgPSBwcmltLmNhbGwoaW5wdXQsIGhpbnQgfHwgXCJkZWZhdWx0XCIpOyBpZiAoX3R5cGVvZihyZXMpICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7IH0gcmV0dXJuIChoaW50ID09PSBcInN0cmluZ1wiID8gU3RyaW5nIDogTnVtYmVyKShpbnB1dCk7IH1cbmZ1bmN0aW9uIF9hc3luY0l0ZXJhdG9yKGl0ZXJhYmxlKSB7IHZhciBtZXRob2QsIGFzeW5jLCBzeW5jLCByZXRyeSA9IDI7IGZvciAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgU3ltYm9sICYmIChhc3luYyA9IFN5bWJvbC5hc3luY0l0ZXJhdG9yLCBzeW5jID0gU3ltYm9sLml0ZXJhdG9yKTsgcmV0cnktLTspIHsgaWYgKGFzeW5jICYmIG51bGwgIT0gKG1ldGhvZCA9IGl0ZXJhYmxlW2FzeW5jXSkpIHJldHVybiBtZXRob2QuY2FsbChpdGVyYWJsZSk7IGlmIChzeW5jICYmIG51bGwgIT0gKG1ldGhvZCA9IGl0ZXJhYmxlW3N5bmNdKSkgcmV0dXJuIG5ldyBBc3luY0Zyb21TeW5jSXRlcmF0b3IobWV0aG9kLmNhbGwoaXRlcmFibGUpKTsgYXN5bmMgPSBcIkBAYXN5bmNJdGVyYXRvclwiLCBzeW5jID0gXCJAQGl0ZXJhdG9yXCI7IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBpcyBub3QgYXN5bmMgaXRlcmFibGVcIik7IH1cbmZ1bmN0aW9uIEFzeW5jRnJvbVN5bmNJdGVyYXRvcihzKSB7IGZ1bmN0aW9uIEFzeW5jRnJvbVN5bmNJdGVyYXRvckNvbnRpbnVhdGlvbihyKSB7IGlmIChPYmplY3QocikgIT09IHIpIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKHIgKyBcIiBpcyBub3QgYW4gb2JqZWN0LlwiKSk7IHZhciBkb25lID0gci5kb25lOyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogZG9uZSB9OyB9KTsgfSByZXR1cm4gQXN5bmNGcm9tU3luY0l0ZXJhdG9yID0gZnVuY3Rpb24gQXN5bmNGcm9tU3luY0l0ZXJhdG9yKHMpIHsgdGhpcy5zID0gcywgdGhpcy5uID0gcy5uZXh0OyB9LCBBc3luY0Zyb21TeW5jSXRlcmF0b3IucHJvdG90eXBlID0geyBzOiBudWxsLCBuOiBudWxsLCBuZXh0OiBmdW5jdGlvbiBuZXh0KCkgeyByZXR1cm4gQXN5bmNGcm9tU3luY0l0ZXJhdG9yQ29udGludWF0aW9uKHRoaXMubi5hcHBseSh0aGlzLnMsIGFyZ3VtZW50cykpOyB9LCBcInJldHVyblwiOiBmdW5jdGlvbiBfcmV0dXJuKHZhbHVlKSB7IHZhciByZXQgPSB0aGlzLnNbXCJyZXR1cm5cIl07IHJldHVybiB2b2lkIDAgPT09IHJldCA/IFByb21pc2UucmVzb2x2ZSh7IHZhbHVlOiB2YWx1ZSwgZG9uZTogITAgfSkgOiBBc3luY0Zyb21TeW5jSXRlcmF0b3JDb250aW51YXRpb24ocmV0LmFwcGx5KHRoaXMucywgYXJndW1lbnRzKSk7IH0sIFwidGhyb3dcIjogZnVuY3Rpb24gX3Rocm93KHZhbHVlKSB7IHZhciB0aHIgPSB0aGlzLnNbXCJyZXR1cm5cIl07IHJldHVybiB2b2lkIDAgPT09IHRociA/IFByb21pc2UucmVqZWN0KHZhbHVlKSA6IEFzeW5jRnJvbVN5bmNJdGVyYXRvckNvbnRpbnVhdGlvbih0aHIuYXBwbHkodGhpcy5zLCBhcmd1bWVudHMpKTsgfSB9LCBuZXcgQXN5bmNGcm9tU3luY0l0ZXJhdG9yKHMpOyB9IC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIENvcHlyaWdodCAyMDIwIC0gMjAyNCBUaGUgTWF0cml4Lm9yZyBGb3VuZGF0aW9uIEMuSS5DLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyoqXG4gKiBBUEkgaGFuZGxlciBmb3IgdGhlIGNsaWVudCBzaWRlIG9mIHdpZGdldHMuIFRoaXMgcmFpc2VzIGV2ZW50c1xuICogZm9yIGVhY2ggYWN0aW9uIHJlY2VpdmVkIGFzIGBhY3Rpb246JHthY3Rpb259YCAoZWc6IFwiYWN0aW9uOnNjcmVlbnNob3RcIikuXG4gKiBEZWZhdWx0IGhhbmRsaW5nIGNhbiBiZSBwcmV2ZW50ZWQgYnkgdXNpbmcgcHJldmVudERlZmF1bHQoKSBvbiB0aGVcbiAqIHJhaXNlZCBldmVudC4gVGhlIGRlZmF1bHQgaGFuZGxpbmcgdmFyaWVzIGZvciBlYWNoIGFjdGlvbjogb25lc1xuICogd2hpY2ggdGhlIFNESyBjYW4gaGFuZGxlIHNhZmVseSBhcmUgYWNrbm93bGVkZ2VkIGFwcHJvcHJpYXRlbHkgYW5kXG4gKiBvbmVzIHdoaWNoIGFyZSB1bmhhbmRsZWQgKGN1c3RvbSBvciByZXF1aXJlIHRoZSBjbGllbnQgdG8gZG8gc29tZXRoaW5nKVxuICogYXJlIHJlamVjdGVkIHdpdGggYW4gZXJyb3IuXG4gKlxuICogRXZlbnRzIHdoaWNoIGFyZSBwcmV2ZW50RGVmYXVsdCgpZWQgbXVzdCByZXBseSB1c2luZyB0aGUgdHJhbnNwb3J0LlxuICogVGhlIGV2ZW50cyByYWlzZWQgd2lsbCBoYXZlIGEgZGVmYXVsdCBvZiBhbiBJV2lkZ2V0QXBpUmVxdWVzdFxuICogaW50ZXJmYWNlLlxuICpcbiAqIFdoZW4gdGhlIENsaWVudFdpZGdldEFwaSBpcyByZWFkeSB0byBzdGFydCBzZW5kaW5nIHJlcXVlc3RzLCBpdCB3aWxsXG4gKiByYWlzZSBhIFwicmVhZHlcIiBDdXN0b21FdmVudC4gQWZ0ZXIgdGhlIHJlYWR5IGV2ZW50IGZpcmVzLCBhY3Rpb25zIGNhblxuICogYmUgc2VudCBhbmQgdGhlIHRyYW5zcG9ydCB3aWxsIGJlIHJlYWR5LlxuICpcbiAqIFdoZW4gdGhlIHdpZGdldCBoYXMgaW5kaWNhdGVkIGl0IGhhcyBsb2FkZWQsIHRoaXMgY2xhc3MgcmFpc2VzIGFcbiAqIFwicHJlcGFyaW5nXCIgQ3VzdG9tRXZlbnQuIFRoZSBwcmVwYXJpbmcgZXZlbnQgZG9lcyBub3QgaW5kaWNhdGUgdGhhdFxuICogdGhlIHdpZGdldCBpcyByZWFkeSB0byByZWNlaXZlIGNvbW11bmljYXRpb25zIC0gdGhhdCBpcyBzaWduaWZpZWQgYnlcbiAqIHRoZSByZWFkeSBldmVudCBleGNsdXNpdmVseS5cbiAqXG4gKiBUaGlzIGNsYXNzIG9ubHkgaGFuZGxlcyBvbmUgd2lkZ2V0IGF0IGEgdGltZS5cbiAqL1xudmFyIENsaWVudFdpZGdldEFwaSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0V2ZW50RW1pdHRlcikge1xuICBfaW5oZXJpdHMoQ2xpZW50V2lkZ2V0QXBpLCBfRXZlbnRFbWl0dGVyKTtcbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihDbGllbnRXaWRnZXRBcGkpO1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjbGllbnQgd2lkZ2V0IEFQSS4gVGhpcyB3aWxsIGluc3RhbnRpYXRlIHRoZSB0cmFuc3BvcnRcbiAgICogYW5kIHN0YXJ0IGV2ZXJ5dGhpbmcuIFdoZW4gdGhlIGlmcmFtZSBpcyBsb2FkZWQgdW5kZXIgdGhlIHdpZGdldCdzXG4gICAqIGNvbmRpdGlvbnMsIGEgXCJyZWFkeVwiIGV2ZW50IHdpbGwgYmUgcmFpc2VkLlxuICAgKiBAcGFyYW0ge1dpZGdldH0gd2lkZ2V0IFRoZSB3aWRnZXQgdG8gY29tbXVuaWNhdGUgd2l0aC5cbiAgICogQHBhcmFtIHtIVE1MSUZyYW1lRWxlbWVudH0gaWZyYW1lIFRoZSBpZnJhbWUgdGhlIHdpZGdldCBpcyBpbi5cbiAgICogQHBhcmFtIHtXaWRnZXREcml2ZXJ9IGRyaXZlciBUaGUgZHJpdmVyIGZvciB0aGlzIHdpZGdldC9jbGllbnQuXG4gICAqL1xuICBmdW5jdGlvbiBDbGllbnRXaWRnZXRBcGkod2lkZ2V0LCBpZnJhbWUsIGRyaXZlcikge1xuICAgIHZhciBfdGhpcztcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2xpZW50V2lkZ2V0QXBpKTtcbiAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpO1xuICAgIF90aGlzLndpZGdldCA9IHdpZGdldDtcbiAgICBfdGhpcy5kcml2ZXIgPSBkcml2ZXI7XG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInRyYW5zcG9ydFwiLCB2b2lkIDApO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJjYWNoZWRXaWRnZXRWZXJzaW9uc1wiLCBudWxsKTtcbiAgICAvLyBjb250ZW50TG9hZGVkQWN0aW9uU2VudCBpcyB1c2VkIHRvIGNoZWNrIHRoYXQgb25seSBvbmUgQ29udGVudExvYWRlZCByZXF1ZXN0IGlzIHNlbmQuXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImNvbnRlbnRMb2FkZWRBY3Rpb25TZW50XCIsIGZhbHNlKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiYWxsb3dlZENhcGFiaWxpdGllc1wiLCBuZXcgU2V0KCkpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJhbGxvd2VkRXZlbnRzXCIsIFtdKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiaXNTdG9wcGVkXCIsIGZhbHNlKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwidHVyblNlcnZlcnNcIiwgbnVsbCk7XG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImNvbnRlbnRMb2FkZWRXYWl0VGltZXJcIiwgdm9pZCAwKTtcbiAgICAvLyBTdG9yZXMgcGVuZGluZyByZXF1ZXN0cyB0byBwdXNoIGEgcm9vbSdzIHN0YXRlIHRvIHRoZSB3aWRnZXRcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwicHVzaFJvb21TdGF0ZVRhc2tzXCIsIG5ldyBTZXQoKSk7XG4gICAgLy8gUm9vbSBJRCDihpIgZXZlbnQgdHlwZSDihpIgc3RhdGUga2V5IOKGkiBldmVudHMgdG8gYmUgcHVzaGVkXG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInB1c2hSb29tU3RhdGVSZXN1bHRcIiwgbmV3IE1hcCgpKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiZmx1c2hSb29tU3RhdGVUYXNrXCIsIG51bGwpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJ2aWV3ZWRSb29tSWRcIiwgbnVsbCk7XG4gICAgaWYgKCEoaWZyYW1lICE9PSBudWxsICYmIGlmcmFtZSAhPT0gdm9pZCAwICYmIGlmcmFtZS5jb250ZW50V2luZG93KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gaWZyYW1lIHN1cHBsaWVkXCIpO1xuICAgIH1cbiAgICBpZiAoIXdpZGdldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB3aWRnZXRcIik7XG4gICAgfVxuICAgIGlmICghZHJpdmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRyaXZlclwiKTtcbiAgICB9XG4gICAgX3RoaXMudHJhbnNwb3J0ID0gbmV3IF9Qb3N0bWVzc2FnZVRyYW5zcG9ydC5Qb3N0bWVzc2FnZVRyYW5zcG9ydChfV2lkZ2V0QXBpRGlyZWN0aW9uLldpZGdldEFwaURpcmVjdGlvbi5Ub1dpZGdldCwgd2lkZ2V0LmlkLCBpZnJhbWUuY29udGVudFdpbmRvdywgZ2xvYmFsVGhpcyk7XG4gICAgX3RoaXMudHJhbnNwb3J0LnRhcmdldE9yaWdpbiA9IHdpZGdldC5vcmlnaW47XG4gICAgX3RoaXMudHJhbnNwb3J0Lm9uKFwibWVzc2FnZVwiLCBfdGhpcy5oYW5kbGVNZXNzYWdlLmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpKTtcbiAgICBpZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgX3RoaXMub25JZnJhbWVMb2FkLmJpbmQoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcykpKTtcbiAgICBfdGhpcy50cmFuc3BvcnQuc3RhcnQoKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cbiAgX2NyZWF0ZUNsYXNzKENsaWVudFdpZGdldEFwaSwgW3tcbiAgICBrZXk6IFwiaGFzQ2FwYWJpbGl0eVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYXNDYXBhYmlsaXR5KGNhcGFiaWxpdHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFsbG93ZWRDYXBhYmlsaXRpZXMuaGFzKGNhcGFiaWxpdHkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5Vc2VSb29tVGltZWxpbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuVXNlUm9vbVRpbWVsaW5lKHJvb21JZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQ2FwYWJpbGl0eShcIm9yZy5tYXRyaXgubXNjMjc2Mi50aW1lbGluZTpcIi5jb25jYXQoX1N5bWJvbHMuU3ltYm9scy5BbnlSb29tKSkgfHwgdGhpcy5oYXNDYXBhYmlsaXR5KFwib3JnLm1hdHJpeC5tc2MyNzYyLnRpbWVsaW5lOlwiLmNvbmNhdChyb29tSWQpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2FuU2VuZFJvb21FdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5TZW5kUm9vbUV2ZW50KGV2ZW50VHlwZSkge1xuICAgICAgdmFyIG1zZ3R5cGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5hbGxvd2VkRXZlbnRzLnNvbWUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUubWF0Y2hlc0FzUm9vbUV2ZW50KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uU2VuZCwgZXZlbnRUeXBlLCBtc2d0eXBlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5TZW5kU3RhdGVFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5TZW5kU3RhdGVFdmVudChldmVudFR5cGUsIHN0YXRlS2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5hbGxvd2VkRXZlbnRzLnNvbWUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUubWF0Y2hlc0FzU3RhdGVFdmVudChfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LkV2ZW50RGlyZWN0aW9uLlNlbmQsIGV2ZW50VHlwZSwgc3RhdGVLZXkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhblNlbmRUb0RldmljZUV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhblNlbmRUb0RldmljZUV2ZW50KGV2ZW50VHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEV2ZW50cy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBlLm1hdGNoZXNBc1RvRGV2aWNlRXZlbnQoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5FdmVudERpcmVjdGlvbi5TZW5kLCBldmVudFR5cGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhblJlY2VpdmVSb29tRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuUmVjZWl2ZVJvb21FdmVudChldmVudFR5cGUpIHtcbiAgICAgIHZhciBtc2d0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEV2ZW50cy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBlLm1hdGNoZXNBc1Jvb21FdmVudChfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LkV2ZW50RGlyZWN0aW9uLlJlY2VpdmUsIGV2ZW50VHlwZSwgbXNndHlwZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2FuUmVjZWl2ZVN0YXRlRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuUmVjZWl2ZVN0YXRlRXZlbnQoZXZlbnRUeXBlLCBzdGF0ZUtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuYWxsb3dlZEV2ZW50cy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHJldHVybiBlLm1hdGNoZXNBc1N0YXRlRXZlbnQoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5FdmVudERpcmVjdGlvbi5SZWNlaXZlLCBldmVudFR5cGUsIHN0YXRlS2V5KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5SZWNlaXZlVG9EZXZpY2VFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5SZWNlaXZlVG9EZXZpY2VFdmVudChldmVudFR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmFsbG93ZWRFdmVudHMuc29tZShmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gZS5tYXRjaGVzQXNUb0RldmljZUV2ZW50KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uUmVjZWl2ZSwgZXZlbnRUeXBlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5SZWNlaXZlUm9vbUFjY291bnREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhblJlY2VpdmVSb29tQWNjb3VudERhdGEoZXZlbnRUeXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5hbGxvd2VkRXZlbnRzLnNvbWUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGUubWF0Y2hlc0FzUm9vbUFjY291bnREYXRhKF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uUmVjZWl2ZSwgZXZlbnRUeXBlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdG9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLnRyYW5zcG9ydC5zdG9wKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFdpZGdldFZlcnNpb25zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfZ2V0V2lkZ2V0VmVyc2lvbnMgPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL19yZWdlbmVyYXRvclJ1bnRpbWUoKS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWUoKSB7XG4gICAgICAgIHZhciByO1xuICAgICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yUnVudGltZSgpLndyYXAoZnVuY3Rpb24gX2NhbGxlZSQoX2NvbnRleHQpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5jYWNoZWRXaWRnZXRWZXJzaW9ucykpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMuY2FjaGVkV2lkZ2V0VmVyc2lvbnMpO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICBfY29udGV4dC5wcmV2ID0gMjtcbiAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDU7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24uU3VwcG9ydGVkQXBpVmVyc2lvbnMsIHt9KTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgciA9IF9jb250ZXh0LnNlbnQ7XG4gICAgICAgICAgICAgIHRoaXMuY2FjaGVkV2lkZ2V0VmVyc2lvbnMgPSByLnN1cHBvcnRlZF92ZXJzaW9ucztcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LmFicnVwdChcInJldHVyblwiLCByLnN1cHBvcnRlZF92ZXJzaW9ucyk7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICBfY29udGV4dC5wcmV2ID0gMTA7XG4gICAgICAgICAgICAgIF9jb250ZXh0LnQwID0gX2NvbnRleHRbXCJjYXRjaFwiXSgyKTtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwibm9uLWZhdGFsIGVycm9yIGdldHRpbmcgc3VwcG9ydGVkIHdpZGdldCB2ZXJzaW9uczogXCIsIF9jb250ZXh0LnQwKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LmFicnVwdChcInJldHVyblwiLCBbXSk7XG4gICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX2NhbGxlZSwgdGhpcywgW1syLCAxMF1dKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGdldFdpZGdldFZlcnNpb25zKCkge1xuICAgICAgICByZXR1cm4gX2dldFdpZGdldFZlcnNpb25zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0V2lkZ2V0VmVyc2lvbnM7XG4gICAgfSgpXG4gIH0sIHtcbiAgICBrZXk6IFwiYmVnaW5DYXBhYmlsaXRpZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYmVnaW5DYXBhYmlsaXRpZXMoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcbiAgICAgIC8vIHdpZGdldCBoYXMgbG9hZGVkIC0gdGVsbCBhbGwgdGhlIGxpc3RlbmVycyB0aGF0XG4gICAgICB0aGlzLmVtaXQoXCJwcmVwYXJpbmdcIik7XG4gICAgICB2YXIgcmVxdWVzdGVkQ2FwcztcbiAgICAgIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5DYXBhYmlsaXRpZXMsIHt9KS50aGVuKGZ1bmN0aW9uIChjYXBzKSB7XG4gICAgICAgIHJlcXVlc3RlZENhcHMgPSBjYXBzLmNhcGFiaWxpdGllcztcbiAgICAgICAgcmV0dXJuIF90aGlzMi5kcml2ZXIudmFsaWRhdGVDYXBhYmlsaXRpZXMobmV3IFNldChjYXBzLmNhcGFiaWxpdGllcykpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoYWxsb3dlZENhcHMpIHtcbiAgICAgICAgX3RoaXMyLmFsbG93Q2FwYWJpbGl0aWVzKF90b0NvbnN1bWFibGVBcnJheShhbGxvd2VkQ2FwcyksIHJlcXVlc3RlZENhcHMpO1xuICAgICAgICBfdGhpczIuZW1pdChcInJlYWR5XCIpO1xuICAgICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZSkge1xuICAgICAgICBfdGhpczIuZW1pdChcImVycm9yOnByZXBhcmluZ1wiLCBlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhbGxvd0NhcGFiaWxpdGllc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhbGxvd0NhcGFiaWxpdGllcyhhbGxvd2VkLCByZXF1ZXN0ZWQpIHtcbiAgICAgIHZhciBfdGhpcyRhbGxvd2VkRXZlbnRzLFxuICAgICAgICBfdGhpczMgPSB0aGlzO1xuICAgICAgY29uc29sZS5sb2coXCJXaWRnZXQgXCIuY29uY2F0KHRoaXMud2lkZ2V0LmlkLCBcIiBpcyBhbGxvd2VkIGNhcGFiaWxpdGllczpcIiksIGFsbG93ZWQpO1xuICAgICAgdmFyIF9pdGVyYXRvcjIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihhbGxvd2VkKSxcbiAgICAgICAgX3N0ZXAyO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IyLnMoKTsgIShfc3RlcDIgPSBfaXRlcmF0b3IyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgYyA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICB0aGlzLmFsbG93ZWRDYXBhYmlsaXRpZXMuYWRkKGMpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMi5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgIH1cbiAgICAgIHZhciBhbGxvd2VkRXZlbnRzID0gX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5XaWRnZXRFdmVudENhcGFiaWxpdHkuZmluZEV2ZW50Q2FwYWJpbGl0aWVzKGFsbG93ZWQpO1xuICAgICAgKF90aGlzJGFsbG93ZWRFdmVudHMgPSB0aGlzLmFsbG93ZWRFdmVudHMpLnB1c2guYXBwbHkoX3RoaXMkYWxsb3dlZEV2ZW50cywgX3RvQ29uc3VtYWJsZUFycmF5KGFsbG93ZWRFdmVudHMpKTtcbiAgICAgIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5Ob3RpZnlDYXBhYmlsaXRpZXMsIHtcbiAgICAgICAgcmVxdWVzdGVkOiByZXF1ZXN0ZWQsXG4gICAgICAgIGFwcHJvdmVkOiBBcnJheS5mcm9tKHRoaXMuYWxsb3dlZENhcGFiaWxpdGllcylcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwibm9uLWZhdGFsIGVycm9yIG5vdGlmeWluZyB3aWRnZXQgb2YgYXBwcm92ZWQgY2FwYWJpbGl0aWVzOlwiLCBlKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczMuZW1pdChcImNhcGFiaWxpdGllc05vdGlmaWVkXCIpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFB1c2ggdGhlIGluaXRpYWwgcm9vbSBzdGF0ZSBmb3IgYWxsIHJvb21zIHdpdGggYSB0aW1lbGluZSBjYXBhYmlsaXR5XG4gICAgICB2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGFsbG93ZWQpLFxuICAgICAgICBfc3RlcDM7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjMucygpOyAhKF9zdGVwMyA9IF9pdGVyYXRvcjMubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBfYyA9IF9zdGVwMy52YWx1ZTtcbiAgICAgICAgICBpZiAoKDAsIF9DYXBhYmlsaXRpZXMuaXNUaW1lbGluZUNhcGFiaWxpdHkpKF9jKSkge1xuICAgICAgICAgICAgdmFyIHJvb21JZCA9ICgwLCBfQ2FwYWJpbGl0aWVzLmdldFRpbWVsaW5lUm9vbUlERnJvbUNhcGFiaWxpdHkpKF9jKTtcbiAgICAgICAgICAgIGlmIChyb29tSWQgPT09IF9TeW1ib2xzLlN5bWJvbHMuQW55Um9vbSkge1xuICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yNSA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMuZHJpdmVyLmdldEtub3duUm9vbXMoKSksXG4gICAgICAgICAgICAgICAgX3N0ZXA1O1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yNS5zKCk7ICEoX3N0ZXA1ID0gX2l0ZXJhdG9yNS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgICAgICB2YXIgX3Jvb21JZCA9IF9zdGVwNS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgIHRoaXMucHVzaFJvb21TdGF0ZShfcm9vbUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvcjUuZShlcnIpO1xuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvcjUuZigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnB1c2hSb29tU3RhdGUocm9vbUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IzLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjMuZigpO1xuICAgICAgfVxuICAgICAgaWYgKGFsbG93ZWQuaW5jbHVkZXMoX0NhcGFiaWxpdGllcy5NYXRyaXhDYXBhYmlsaXRpZXMuTVNDNDQwN1JlY2VpdmVTdGlja3lFdmVudCkpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIldpZGdldCBcIi5jb25jYXQodGhpcy53aWRnZXQuaWQsIFwiIGlzIGFsbG93ZWQgdG8gcmVjZWl2ZSBzdGlja3kgZXZlbnRzLCBjaGVjayBjdXJyZW50IHN0aWNreSBzdGF0ZS5cIikpO1xuICAgICAgICAvLyBJZiB0aGUgd2lkZ2V0IGNhbiByZWNlaXZlIHN0aWNreSBldmVudHMsIHB1c2ggYWxsIHN0aWNreSBldmVudHMgaW4ga25vd24gcm9vbXMgbm93LlxuICAgICAgICAvLyBTdGlja3kgZXZlbnRzIGFyZSBsaWtlIGEgc3RhdGUsIGFuZCBwYXNzZWQgaGlzdG9yeSBpcyBuZWVkZWQgdG8gZ2V0IHRoZSBmdWxsIHN0YXRlLlxuICAgICAgICB2YXIgcm9vbUlkcyA9IGFsbG93ZWQuZmlsdGVyKGZ1bmN0aW9uIChjYXBhYmlsaXR5KSB7XG4gICAgICAgICAgcmV0dXJuICgwLCBfQ2FwYWJpbGl0aWVzLmlzVGltZWxpbmVDYXBhYmlsaXR5KShjYXBhYmlsaXR5KTtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uICh0aW1lbGluZUNhcGFiaWxpdHkpIHtcbiAgICAgICAgICByZXR1cm4gKDAsIF9DYXBhYmlsaXRpZXMuZ2V0VGltZWxpbmVSb29tSURGcm9tQ2FwYWJpbGl0eSkodGltZWxpbmVDYXBhYmlsaXR5KTtcbiAgICAgICAgfSkuZmxhdE1hcChmdW5jdGlvbiAocm9vbUlkT3JXaWxkY2FyZCkge1xuICAgICAgICAgIGlmIChyb29tSWRPcldpbGRjYXJkID09PSBfU3ltYm9scy5TeW1ib2xzLkFueVJvb20pIHtcbiAgICAgICAgICAgIC8vIERvIHdlIHN1cHBvcnQgZ2V0dGluZyBzdGlja3kgc3RhdGUgZm9yIGFueSByb29tP1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzMy5kcml2ZXIuZ2V0S25vd25Sb29tcygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vbUlkT3JXaWxkY2FyZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiV2lkZ2V0IFwiLmNvbmNhdCh0aGlzLndpZGdldC5pZCwgXCIgaXMgYWxsb3dlZCB0byByZWNlaXZlIHN0aWNreSBldmVudHMgaW4gcm9vbXM6XCIpLCByb29tSWRzKTtcbiAgICAgICAgdmFyIF9pdGVyYXRvcjQgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihyb29tSWRzKSxcbiAgICAgICAgICBfc3RlcDQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoKSB7XG4gICAgICAgICAgICB2YXIgcm9vbUlkID0gX3N0ZXA0LnZhbHVlO1xuICAgICAgICAgICAgX3RoaXMzLnB1c2hTdGlja3lTdGF0ZShyb29tSWQpW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHB1c2ggc3RpY2t5IGV2ZW50cyB0byB3aWRnZXQgXCIuY29uY2F0KF90aGlzMy53aWRnZXQuaWQsIFwiIGZvciByb29tIFwiKS5jb25jYXQocm9vbUlkLCBcIjpcIiksIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGZvciAoX2l0ZXJhdG9yNC5zKCk7ICEoX3N0ZXA0ID0gX2l0ZXJhdG9yNC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICBfbG9vcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgX2l0ZXJhdG9yNC5lKGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgX2l0ZXJhdG9yNC5mKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgbmV3IGV2ZW50cyBhcmUgYWxsb3dlZCBhbmQgdGhlIGN1cnJlbnRseSB2aWV3ZWQgcm9vbSBpc24ndCBjb3ZlcmVkXG4gICAgICAvLyBieSBhIHRpbWVsaW5lIGNhcGFiaWxpdHksIHRoZW4gd2Uga25vdyB0aGF0IHRoZXJlIGNvdWxkIGJlIHNvbWUgc3RhdGVcbiAgICAgIC8vIGluIHRoZSB2aWV3ZWQgcm9vbSB0aGF0IHRoZSB3aWRnZXQgaGFzbid0IGxlYXJuZWQgYWJvdXQgeWV0LSBwdXNoIGl0LlxuICAgICAgaWYgKGFsbG93ZWRFdmVudHMubGVuZ3RoID4gMCAmJiB0aGlzLnZpZXdlZFJvb21JZCAhPT0gbnVsbCAmJiAhdGhpcy5jYW5Vc2VSb29tVGltZWxpbmUodGhpcy52aWV3ZWRSb29tSWQpKSB7XG4gICAgICAgIHRoaXMucHVzaFJvb21TdGF0ZSh0aGlzLnZpZXdlZFJvb21JZCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9uSWZyYW1lTG9hZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbklmcmFtZUxvYWQoZXYpIHtcbiAgICAgIGlmICh0aGlzLndpZGdldC53YWl0Rm9ySWZyYW1lTG9hZCkge1xuICAgICAgICAvLyBJZiB0aGUgd2lkZ2V0IGlzIHNldCB0byB3YWl0Rm9ySWZyYW1lTG9hZCB0aGUgY2FwYWJpbGl0aWVzIGltbWVkaWF0ZWx5IGdldCBzZXR1cCBhZnRlciBsb2FkLlxuICAgICAgICAvLyBUaGUgY2xpZW50IGRvZXMgbm90IHdhaXQgZm9yIHRoZSBDb250ZW50TG9hZGVkIGFjdGlvbi5cbiAgICAgICAgdGhpcy5iZWdpbkNhcGFiaWxpdGllcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmVhY2hpbmcgdGhpcyBtZWFucywgdGhhdCB0aGUgSWZyYW1lIGdvdCByZWxvYWRlZC9sb2FkZWQgYW5kXG4gICAgICAgIC8vIHRoZSBjbGllbnRBcGkgaXMgYXdhaXRpbmcgdGhlIEZJUlNUIENvbnRlbnRMb2FkZWQgYWN0aW9uLlxuICAgICAgICBjb25zb2xlLmxvZyhcIndhaXRGb3JJZnJhbWVMb2FkIGlzIGZhbHNlOiB3YWl0aW5nIGZvciB3aWRnZXQgdG8gc2VuZCBjb250ZW50TG9hZGVkXCIpO1xuICAgICAgICB0aGlzLmNvbnRlbnRMb2FkZWRXYWl0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiV2lkZ2V0IHNwZWNpZmllZCB3YWl0Rm9ySWZyYW1lTG9hZD1mYWxzZSBidXQgdGltZWQgb3V0IHdhaXRpbmcgZm9yIGNvbnRlbnRMb2FkZWQgZXZlbnQhXCIpO1xuICAgICAgICB9LCAxMDAwMCk7XG4gICAgICAgIHRoaXMuY29udGVudExvYWRlZEFjdGlvblNlbnQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlQ29udGVudExvYWRlZEFjdGlvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVDb250ZW50TG9hZGVkQWN0aW9uKGFjdGlvbikge1xuICAgICAgaWYgKHRoaXMuY29udGVudExvYWRlZFdhaXRUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNvbnRlbnRMb2FkZWRXYWl0VGltZXIpO1xuICAgICAgICB0aGlzLmNvbnRlbnRMb2FkZWRXYWl0VGltZXIgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5jb250ZW50TG9hZGVkQWN0aW9uU2VudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbXByb3BlciBzZXF1ZW5jZTogQ29udGVudExvYWRlZCBBY3Rpb24gY2FuIG9ubHkgYmUgc2VudCBvbmNlIGFmdGVyIHRoZSB3aWRnZXQgbG9hZGVkIFwiICsgXCJhbmQgc2hvdWxkIG9ubHkgYmUgdXNlZCBpZiB3YWl0Rm9ySWZyYW1lTG9hZCBpcyBmYWxzZSAoZGVmYXVsdD10cnVlKVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLndpZGdldC53YWl0Rm9ySWZyYW1lTG9hZCkge1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5yZXBseShhY3Rpb24sIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgbWVzc2FnZTogXCJJbXByb3BlciBzZXF1ZW5jZTogbm90IGV4cGVjdGluZyBDb250ZW50TG9hZGVkIGV2ZW50IGlmIFwiICsgXCJ3YWl0Rm9ySWZyYW1lTG9hZCBpcyB0cnVlIChkZWZhdWx0PXRydWUpXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkoYWN0aW9uLCB7fSk7XG4gICAgICAgIHRoaXMuYmVnaW5DYXBhYmlsaXRpZXMoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY29udGVudExvYWRlZEFjdGlvblNlbnQgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXBseVZlcnNpb25zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcGx5VmVyc2lvbnMocmVxdWVzdCkge1xuICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICBzdXBwb3J0ZWRfdmVyc2lvbnM6IF9BcGlWZXJzaW9uLkN1cnJlbnRBcGlWZXJzaW9uc1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN1cHBvcnRzVXBkYXRlU3RhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9zdXBwb3J0c1VwZGF0ZVN0YXRlID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMigpIHtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUyJChfY29udGV4dDIpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0V2lkZ2V0VmVyc2lvbnMoKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5hYnJ1cHQoXCJyZXR1cm5cIiwgX2NvbnRleHQyLnNlbnQuaW5jbHVkZXMoX0FwaVZlcnNpb24uVW5zdGFibGVBcGlWZXJzaW9uLk1TQzI3NjJfVVBEQVRFX1NUQVRFKSk7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX2NhbGxlZTIsIHRoaXMpO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gc3VwcG9ydHNVcGRhdGVTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBwb3J0c1VwZGF0ZVN0YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwcG9ydHNVcGRhdGVTdGF0ZTtcbiAgICB9KClcbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVDYXBhYmlsaXRpZXNSZW5lZ290aWF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVDYXBhYmlsaXRpZXNSZW5lZ290aWF0ZShyZXF1ZXN0KSB7XG4gICAgICB2YXIgX3JlcXVlc3QkZGF0YSxcbiAgICAgICAgX3RoaXM0ID0gdGhpcztcbiAgICAgIC8vIGFja25vd2xlZGdlIGZpcnN0XG4gICAgICB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7fSk7XG4gICAgICB2YXIgcmVxdWVzdGVkID0gKChfcmVxdWVzdCRkYXRhID0gcmVxdWVzdC5kYXRhKSA9PT0gbnVsbCB8fCBfcmVxdWVzdCRkYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfcmVxdWVzdCRkYXRhLmNhcGFiaWxpdGllcykgfHwgW107XG4gICAgICB2YXIgbmV3bHlSZXF1ZXN0ZWQgPSBuZXcgU2V0KHJlcXVlc3RlZC5maWx0ZXIoZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgcmV0dXJuICFfdGhpczQuaGFzQ2FwYWJpbGl0eShyKTtcbiAgICAgIH0pKTtcbiAgICAgIGlmIChuZXdseVJlcXVlc3RlZC5zaXplID09PSAwKSB7XG4gICAgICAgIC8vIE5vdGhpbmcgdG8gZG8gLSBza2lwIHZhbGlkYXRpb25cbiAgICAgICAgdGhpcy5hbGxvd0NhcGFiaWxpdGllcyhbXSwgW10pO1xuICAgICAgfVxuICAgICAgdGhpcy5kcml2ZXIudmFsaWRhdGVDYXBhYmlsaXRpZXMobmV3bHlSZXF1ZXN0ZWQpLnRoZW4oZnVuY3Rpb24gKGFsbG93ZWQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzNC5hbGxvd0NhcGFiaWxpdGllcyhfdG9Db25zdW1hYmxlQXJyYXkoYWxsb3dlZCksIF90b0NvbnN1bWFibGVBcnJheShuZXdseVJlcXVlc3RlZCkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZU5hdmlnYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZU5hdmlnYXRlKHJlcXVlc3QpIHtcbiAgICAgIHZhciBfcmVxdWVzdCRkYXRhMixcbiAgICAgICAgX3RoaXM1ID0gdGhpcztcbiAgICAgIGlmICghdGhpcy5oYXNDYXBhYmlsaXR5KF9DYXBhYmlsaXRpZXMuTWF0cml4Q2FwYWJpbGl0aWVzLk1TQzI5MzFOYXZpZ2F0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIGNhcGFiaWxpdHlcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoISgoX3JlcXVlc3QkZGF0YTIgPSByZXF1ZXN0LmRhdGEpICE9PSBudWxsICYmIF9yZXF1ZXN0JGRhdGEyICE9PSB2b2lkIDAgJiYgX3JlcXVlc3QkZGF0YTIudXJpLnN0YXJ0c1dpdGgoXCJodHRwczovL21hdHJpeC50by8jXCIpKSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgbWF0cml4LnRvIFVSSVwiXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHZhciBvbkVyciA9IGZ1bmN0aW9uIG9uRXJyKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltDbGllbnRXaWRnZXRBcGldIEZhaWxlZCB0byBoYW5kbGUgbmF2aWdhdGlvbjogXCIsIGUpO1xuICAgICAgICBfdGhpczUuaGFuZGxlRHJpdmVyRXJyb3IoZSwgcmVxdWVzdCwgXCJFcnJvciBoYW5kbGluZyBuYXZpZ2F0aW9uXCIpO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZHJpdmVyLm5hdmlnYXRlKHJlcXVlc3QuZGF0YS51cmkudG9TdHJpbmcoKSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHJldHVybiBvbkVycihlKTtcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzNS50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge30pO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIG9uRXJyKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVPSURDXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZU9JREMocmVxdWVzdCkge1xuICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG4gICAgICB2YXIgcGhhc2UgPSAxOyAvLyAxID0gaW5pdGlhbCByZXF1ZXN0LCAyID0gYWZ0ZXIgdXNlciBtYW51YWwgY29uZmlybWF0aW9uXG5cbiAgICAgIHZhciByZXBseVN0YXRlID0gZnVuY3Rpb24gcmVwbHlTdGF0ZShzdGF0ZSwgY3JlZGVudGlhbCkge1xuICAgICAgICBjcmVkZW50aWFsID0gY3JlZGVudGlhbCB8fCB7fTtcbiAgICAgICAgaWYgKHBoYXNlID4gMSkge1xuICAgICAgICAgIHJldHVybiBfdGhpczYudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5PcGVuSURDcmVkZW50aWFscywgX29iamVjdFNwcmVhZCh7XG4gICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICBvcmlnaW5hbF9yZXF1ZXN0X2lkOiByZXF1ZXN0LnJlcXVlc3RJZFxuICAgICAgICAgIH0sIGNyZWRlbnRpYWwpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM2LnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCBfb2JqZWN0U3ByZWFkKHtcbiAgICAgICAgICAgIHN0YXRlOiBzdGF0ZVxuICAgICAgICAgIH0sIGNyZWRlbnRpYWwpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciByZXBseUVycm9yID0gZnVuY3Rpb24gcmVwbHlFcnJvcihtc2cpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltDbGllbnRXaWRnZXRBcGldIEZhaWxlZCB0byBoYW5kbGUgT0lEQzogXCIsIG1zZyk7XG4gICAgICAgIGlmIChwaGFzZSA+IDEpIHtcbiAgICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgd2F5IHRvIGluZGljYXRlIHRoYXQgYSByYW5kb20gZXJyb3IgaGFwcGVuZWQgaW4gdGhpcyBmbG93LCBzb1xuICAgICAgICAgIC8vIGp1c3QgYmxvY2sgdGhlIGF0dGVtcHQuXG4gICAgICAgICAgcmV0dXJuIHJlcGx5U3RhdGUoX0dldE9wZW5JREFjdGlvbi5PcGVuSURSZXF1ZXN0U3RhdGUuQmxvY2tlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzNi50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogbXNnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgX1NpbXBsZU9ic2VydmFibGUuU2ltcGxlT2JzZXJ2YWJsZShmdW5jdGlvbiAodXBkYXRlKSB7XG4gICAgICAgIGlmICh1cGRhdGUuc3RhdGUgPT09IF9HZXRPcGVuSURBY3Rpb24uT3BlbklEUmVxdWVzdFN0YXRlLlBlbmRpbmdVc2VyQ29uZmlybWF0aW9uICYmIHBoYXNlID4gMSkge1xuICAgICAgICAgIG9ic2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuIHJlcGx5RXJyb3IoXCJjbGllbnQgcHJvdmlkZWQgb3V0LW9mLXBoYXNlIHJlc3BvbnNlIHRvIE9JREMgZmxvd1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlLnN0YXRlID09PSBfR2V0T3BlbklEQWN0aW9uLk9wZW5JRFJlcXVlc3RTdGF0ZS5QZW5kaW5nVXNlckNvbmZpcm1hdGlvbikge1xuICAgICAgICAgIHJlcGx5U3RhdGUodXBkYXRlLnN0YXRlKTtcbiAgICAgICAgICBwaGFzZSsrO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlLnN0YXRlID09PSBfR2V0T3BlbklEQWN0aW9uLk9wZW5JRFJlcXVlc3RTdGF0ZS5BbGxvd2VkICYmICF1cGRhdGUudG9rZW4pIHtcbiAgICAgICAgICByZXR1cm4gcmVwbHlFcnJvcihcImNsaWVudCBwcm92aWRlZCBpbnZhbGlkIE9JREMgdG9rZW4gZm9yIGFuIGFsbG93ZWQgcmVxdWVzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlLnN0YXRlID09PSBfR2V0T3BlbklEQWN0aW9uLk9wZW5JRFJlcXVlc3RTdGF0ZS5CbG9ja2VkKSB7XG4gICAgICAgICAgdXBkYXRlLnRva2VuID0gdW5kZWZpbmVkOyAvLyBqdXN0IGluIGNhc2UgdGhlIGNsaWVudCBkaWQgc29tZXRoaW5nIHdlaXJkXG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlci5jbG9zZSgpO1xuICAgICAgICByZXR1cm4gcmVwbHlTdGF0ZSh1cGRhdGUuc3RhdGUsIHVwZGF0ZS50b2tlbik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZHJpdmVyLmFza09wZW5JRChvYnNlcnZlcik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVJlYWRSb29tQWNjb3VudERhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlUmVhZFJvb21BY2NvdW50RGF0YShyZXF1ZXN0KSB7XG4gICAgICB2YXIgX3RoaXM3ID0gdGhpcztcbiAgICAgIHZhciBldmVudHMgPSB0aGlzLmRyaXZlci5yZWFkUm9vbUFjY291bnREYXRhKHJlcXVlc3QuZGF0YS50eXBlKTtcbiAgICAgIGlmICghdGhpcy5jYW5SZWNlaXZlUm9vbUFjY291bnREYXRhKHJlcXVlc3QuZGF0YS50eXBlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIkNhbm5vdCByZWFkIHJvb20gYWNjb3VudCBkYXRhIG9mIHRoaXMgdHlwZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldmVudHMudGhlbihmdW5jdGlvbiAoZXZzKSB7XG4gICAgICAgIF90aGlzNy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgIGV2ZW50czogZXZzXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVJlYWRFdmVudHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9oYW5kbGVSZWFkRXZlbnRzID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMyhyZXF1ZXN0KSB7XG4gICAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuICAgICAgICB2YXIgYXNrUm9vbUlkcywgX2l0ZXJhdG9yNiwgX3N0ZXA2LCByb29tSWQsIGxpbWl0LCBzaW5jZSwgc3RhdGVLZXksIG1zZ3R5cGUsIF9zdGF0ZUtleSwgZXZlbnRzO1xuICAgICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yUnVudGltZSgpLndyYXAoZnVuY3Rpb24gX2NhbGxlZTMkKF9jb250ZXh0Mykge1xuICAgICAgICAgIHdoaWxlICgxKSBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuZGF0YS50eXBlKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDMuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QgLSBtaXNzaW5nIGV2ZW50IHR5cGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICBpZiAoIShyZXF1ZXN0LmRhdGEubGltaXQgIT09IHVuZGVmaW5lZCAmJiAoIXJlcXVlc3QuZGF0YS5saW1pdCB8fCByZXF1ZXN0LmRhdGEubGltaXQgPCAwKSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0My5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgcmVxdWVzdCAtIGxpbWl0IG91dCBvZiByYW5nZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGlmICghKHJlcXVlc3QuZGF0YS5yb29tX2lkcyA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhc2tSb29tSWRzID0gdGhpcy52aWV3ZWRSb29tSWQgPT09IG51bGwgPyBbXSA6IFt0aGlzLnZpZXdlZFJvb21JZF07XG4gICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMzA7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICBpZiAoIShyZXF1ZXN0LmRhdGEucm9vbV9pZHMgPT09IF9TeW1ib2xzLlN5bWJvbHMuQW55Um9vbSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDEyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFza1Jvb21JZHMgPSB0aGlzLmRyaXZlci5nZXRLbm93blJvb21zKCkuZmlsdGVyKGZ1bmN0aW9uIChyb29tSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM4LmNhblVzZVJvb21UaW1lbGluZShyb29tSWQpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAzMDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICBhc2tSb29tSWRzID0gcmVxdWVzdC5kYXRhLnJvb21faWRzO1xuICAgICAgICAgICAgICBfaXRlcmF0b3I2ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoYXNrUm9vbUlkcyk7XG4gICAgICAgICAgICAgIF9jb250ZXh0My5wcmV2ID0gMTQ7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjYucygpO1xuICAgICAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICAgICAgaWYgKChfc3RlcDYgPSBfaXRlcmF0b3I2Lm4oKSkuZG9uZSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcm9vbUlkID0gX3N0ZXA2LnZhbHVlO1xuICAgICAgICAgICAgICBpZiAodGhpcy5jYW5Vc2VSb29tVGltZWxpbmUocm9vbUlkKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0My5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVuYWJsZSB0byBhY2Nlc3Mgcm9vbSB0aW1lbGluZTogXCIuY29uY2F0KHJvb21JZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNhc2UgMjA6XG4gICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMTY7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAyNztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI0OlxuICAgICAgICAgICAgICBfY29udGV4dDMucHJldiA9IDI0O1xuICAgICAgICAgICAgICBfY29udGV4dDMudDAgPSBfY29udGV4dDNbXCJjYXRjaFwiXSgxNCk7XG4gICAgICAgICAgICAgIF9pdGVyYXRvcjYuZShfY29udGV4dDMudDApO1xuICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgX2NvbnRleHQzLnByZXYgPSAyNztcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yNi5mKCk7XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDMuZmluaXNoKDI3KTtcbiAgICAgICAgICAgIGNhc2UgMzA6XG4gICAgICAgICAgICAgIGxpbWl0ID0gcmVxdWVzdC5kYXRhLmxpbWl0IHx8IDA7XG4gICAgICAgICAgICAgIHNpbmNlID0gcmVxdWVzdC5kYXRhLnNpbmNlO1xuICAgICAgICAgICAgICBzdGF0ZUtleSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgbXNndHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgaWYgKCEocmVxdWVzdC5kYXRhLnN0YXRlX2tleSAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNDA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhdGVLZXkgPSByZXF1ZXN0LmRhdGEuc3RhdGVfa2V5ID09PSB0cnVlID8gdW5kZWZpbmVkIDogcmVxdWVzdC5kYXRhLnN0YXRlX2tleS50b1N0cmluZygpO1xuICAgICAgICAgICAgICBpZiAodGhpcy5jYW5SZWNlaXZlU3RhdGVFdmVudChyZXF1ZXN0LmRhdGEudHlwZSwgKF9zdGF0ZUtleSA9IHN0YXRlS2V5KSAhPT0gbnVsbCAmJiBfc3RhdGVLZXkgIT09IHZvaWQgMCA/IF9zdGF0ZUtleSA6IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAzODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ2Fubm90IHJlYWQgc3RhdGUgZXZlbnRzIG9mIHRoaXMgdHlwZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDQzO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgIG1zZ3R5cGUgPSByZXF1ZXN0LmRhdGEubXNndHlwZTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuUmVjZWl2ZVJvb21FdmVudChyZXF1ZXN0LmRhdGEudHlwZSwgbXNndHlwZSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDQzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDMuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJDYW5ub3QgcmVhZCByb29tIGV2ZW50cyBvZiB0aGlzIHR5cGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSA0MzpcbiAgICAgICAgICAgICAgaWYgKCEocmVxdWVzdC5kYXRhLnJvb21faWRzID09PSB1bmRlZmluZWQgJiYgYXNrUm9vbUlkcy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA1MDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2Ugc3RpbGwgY2FsbCB0aGUgZGVwcmVjYXRlZFxuICAgICAgICAgICAgICAvLyByZWFkUm9vbUV2ZW50cyBhbmQgcmVhZFN0YXRlRXZlbnRzIG1ldGhvZHMgaW4gY2FzZSB0aGUgY2xpZW50IGlzbid0XG4gICAgICAgICAgICAgIC8vIGxldHRpbmcgdXMga25vdyB0aGUgY3VycmVudGx5IHZpZXdlZCByb29tIHZpYSBzZXRWaWV3ZWRSb29tSWRcbiAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgLy8gVGhpcyBjYW4gYmUgY29uc2lkZXJlZCBhcyBhIGRlcHJlY2F0ZWQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgICAgIC8vIEEgZHJpdmVyIHNob3VsZCBjYWxsIGBzZXRWaWV3ZWRSb29tSWRgIG9uIHRoZSB3aWRnZXQgbWVzc2FnaW5nIGFuZCBpbXBsZW1lbnQgdGhlIG5ldyByZWFkUm9vbVN0YXRlIGFuZCByZWFkUm9vbVRpbWVsaW5lXG4gICAgICAgICAgICAgIC8vIE1ldGhvZHMuXG4gICAgICAgICAgICAgIC8vIFRoaXMgYmxvY2sgbWFrZXMgc3VyZSB0aGF0IGl0IGlzIGFsc28gcG9zc2libGUgdG8gbm90IHVzZSBzZXRWaWV3ZWRSb29tSWQuXG4gICAgICAgICAgICAgIC8vIHJlYWRSb29tVGltZWxpbmUgYW5kIHJlYWRSb29tU3RhdGUgYXJlIHJlcXVpcmVkIGhvd2V2ZXIhIE90aGVyd2lzZSB3aWRnZXQgcmVxdWVzdHMgdGhhdCBpbmNsdWRlXG4gICAgICAgICAgICAgIC8vIGByb29tX2lkc2Agd2lsbCBmYWlsLlxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJUaGUgd2lkZ2V0RHJpdmVyIHVzZXMgZGVwcmVjYXRlZCBiZWhhdmlvdXI6XFxuIEl0IGRvZXMgbm90IHNldCB0aGUgdmlld2VkUm9vbUlkIHVzaW5nIGBzZXRWaWV3ZWRSb29tSWRgXCIpO1xuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDQ3O1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIC8vIFRoaXMgcmV0dXJucyBbXSB3aXRoIHRoZSBjdXJyZW50IGRyaXZlciBvZiBFbGVtZW50IFdlYi5cbiAgICAgICAgICAgICAgICAvLyBBZGQgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIGByZWFkUm9vbUV2ZW50c2AgYW5kIGByZWFkU3RhdGVFdmVudHNgXG4gICAgICAgICAgICAgICAgLy8gbWV0aG9kcyB0byB1c2UgYHJlYWRSb29tVGltZWxpbmVgIGFuZCBgcmVhZFJvb21TdGF0ZWAgaWYgdGhleSBhcmUgbm90IG92ZXJ3cml0dGVuLlxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZGF0YS5zdGF0ZV9rZXkgPT09IHVuZGVmaW5lZCA/IHRoaXMuZHJpdmVyLnJlYWRSb29tRXZlbnRzKHJlcXVlc3QuZGF0YS50eXBlLCBtc2d0eXBlLCBsaW1pdCwgbnVsbCwgc2luY2UpIDogdGhpcy5kcml2ZXIucmVhZFN0YXRlRXZlbnRzKHJlcXVlc3QuZGF0YS50eXBlLCBzdGF0ZUtleSwgbGltaXQsIG51bGwpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIDQ3OlxuICAgICAgICAgICAgICBldmVudHMgPSBfY29udGV4dDMuc2VudDtcbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA2ODtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDUwOlxuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDUyO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdXBwb3J0c1VwZGF0ZVN0YXRlKCk7XG4gICAgICAgICAgICBjYXNlIDUyOlxuICAgICAgICAgICAgICBpZiAoIV9jb250ZXh0My5zZW50KSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA1ODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDU1O1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXNrUm9vbUlkcy5tYXAoZnVuY3Rpb24gKHJvb21JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczguZHJpdmVyLnJlYWRSb29tVGltZWxpbmUocm9vbUlkLCByZXF1ZXN0LmRhdGEudHlwZSwgbXNndHlwZSwgc3RhdGVLZXksIGxpbWl0LCBzaW5jZSk7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNhc2UgNTU6XG4gICAgICAgICAgICAgIGV2ZW50cyA9IF9jb250ZXh0My5zZW50LmZsYXQoMSk7XG4gICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNjg7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA1ODpcbiAgICAgICAgICAgICAgaWYgKCEocmVxdWVzdC5kYXRhLnN0YXRlX2tleSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gNjQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA2MTtcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGFza1Jvb21JZHMubWFwKGZ1bmN0aW9uIChyb29tSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM4LmRyaXZlci5yZWFkUm9vbVRpbWVsaW5lKHJvb21JZCwgcmVxdWVzdC5kYXRhLnR5cGUsIG1zZ3R5cGUsIHN0YXRlS2V5LCBsaW1pdCwgc2luY2UpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDYxOlxuICAgICAgICAgICAgICBfY29udGV4dDMudDEgPSBfY29udGV4dDMuc2VudDtcbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSA2NztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY0OlxuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDY2O1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXNrUm9vbUlkcy5tYXAoZnVuY3Rpb24gKHJvb21JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczguZHJpdmVyLnJlYWRSb29tU3RhdGUocm9vbUlkLCByZXF1ZXN0LmRhdGEudHlwZSwgc3RhdGVLZXkpO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDY2OlxuICAgICAgICAgICAgICBfY29udGV4dDMudDEgPSBfY29udGV4dDMuc2VudDtcbiAgICAgICAgICAgIGNhc2UgNjc6XG4gICAgICAgICAgICAgIGV2ZW50cyA9IF9jb250ZXh0My50MS5mbGF0KDEpO1xuICAgICAgICAgICAgY2FzZSA2ODpcbiAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGV2ZW50czogZXZlbnRzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2FzZSA2OTpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0My5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlMywgdGhpcywgW1sxNCwgMjQsIDI3LCAzMF1dKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlYWRFdmVudHMoX3gpIHtcbiAgICAgICAgcmV0dXJuIF9oYW5kbGVSZWFkRXZlbnRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFuZGxlUmVhZEV2ZW50cztcbiAgICB9KClcbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVTZW5kRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlU2VuZEV2ZW50KHJlcXVlc3QpIHtcbiAgICAgIHZhciBfdGhpczkgPSB0aGlzO1xuICAgICAgaWYgKCFyZXF1ZXN0LmRhdGEudHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgcmVxdWVzdCAtIG1pc3NpbmcgZXZlbnQgdHlwZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghIXJlcXVlc3QuZGF0YS5yb29tX2lkICYmICF0aGlzLmNhblVzZVJvb21UaW1lbGluZShyZXF1ZXN0LmRhdGEucm9vbV9pZCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgbWVzc2FnZTogXCJVbmFibGUgdG8gYWNjZXNzIHJvb20gdGltZWxpbmU6IFwiLmNvbmNhdChyZXF1ZXN0LmRhdGEucm9vbV9pZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdmFyIGlzRGVsYXllZEV2ZW50ID0gcmVxdWVzdC5kYXRhLmRlbGF5ICE9PSB1bmRlZmluZWQgfHwgcmVxdWVzdC5kYXRhLnBhcmVudF9kZWxheV9pZCAhPT0gdW5kZWZpbmVkO1xuICAgICAgaWYgKGlzRGVsYXllZEV2ZW50ICYmICF0aGlzLmhhc0NhcGFiaWxpdHkoX0NhcGFiaWxpdGllcy5NYXRyaXhDYXBhYmlsaXRpZXMuTVNDNDE1N1NlbmREZWxheWVkRXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBjYXBhYmlsaXR5IGZvciBcIi5jb25jYXQoX0NhcGFiaWxpdGllcy5NYXRyaXhDYXBhYmlsaXRpZXMuTVNDNDE1N1NlbmREZWxheWVkRXZlbnQpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHZhciBpc1N0aWNreUV2ZW50ID0gcmVxdWVzdC5kYXRhLnN0aWNreV9kdXJhdGlvbl9tcyAhPT0gdW5kZWZpbmVkO1xuICAgICAgaWYgKGlzU3RpY2t5RXZlbnQgJiYgIXRoaXMuaGFzQ2FwYWJpbGl0eShfQ2FwYWJpbGl0aWVzLk1hdHJpeENhcGFiaWxpdGllcy5NU0M0NDA3U2VuZFN0aWNreUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgY2FwYWJpbGl0eSBmb3IgXCIuY29uY2F0KF9DYXBhYmlsaXRpZXMuTWF0cml4Q2FwYWJpbGl0aWVzLk1TQzQ0MDdTZW5kU3RpY2t5RXZlbnQpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHZhciBzZW5kRXZlbnRQcm9taXNlO1xuICAgICAgaWYgKHJlcXVlc3QuZGF0YS5zdGF0ZV9rZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FuU2VuZFN0YXRlRXZlbnQocmVxdWVzdC5kYXRhLnR5cGUsIHJlcXVlc3QuZGF0YS5zdGF0ZV9rZXkpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ2Fubm90IHNlbmQgc3RhdGUgZXZlbnRzIG9mIHRoaXMgdHlwZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RpY2t5RXZlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCJDYW5ub3Qgc2VuZCBhIHN0YXRlIGV2ZW50IHdpdGggYSBzdGlja3kgZHVyYXRpb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RlbGF5ZWRFdmVudCkge1xuICAgICAgICAgIHZhciBfcmVxdWVzdCRkYXRhJGRlbGF5LCBfcmVxdWVzdCRkYXRhJHBhcmVudF87XG4gICAgICAgICAgc2VuZEV2ZW50UHJvbWlzZSA9IHRoaXMuZHJpdmVyLnNlbmREZWxheWVkRXZlbnQoKF9yZXF1ZXN0JGRhdGEkZGVsYXkgPSByZXF1ZXN0LmRhdGEuZGVsYXkpICE9PSBudWxsICYmIF9yZXF1ZXN0JGRhdGEkZGVsYXkgIT09IHZvaWQgMCA/IF9yZXF1ZXN0JGRhdGEkZGVsYXkgOiBudWxsLCAoX3JlcXVlc3QkZGF0YSRwYXJlbnRfID0gcmVxdWVzdC5kYXRhLnBhcmVudF9kZWxheV9pZCkgIT09IG51bGwgJiYgX3JlcXVlc3QkZGF0YSRwYXJlbnRfICE9PSB2b2lkIDAgPyBfcmVxdWVzdCRkYXRhJHBhcmVudF8gOiBudWxsLCByZXF1ZXN0LmRhdGEudHlwZSwgcmVxdWVzdC5kYXRhLmNvbnRlbnQgfHwge30sIHJlcXVlc3QuZGF0YS5zdGF0ZV9rZXksIHJlcXVlc3QuZGF0YS5yb29tX2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZW5kRXZlbnRQcm9taXNlID0gdGhpcy5kcml2ZXIuc2VuZEV2ZW50KHJlcXVlc3QuZGF0YS50eXBlLCByZXF1ZXN0LmRhdGEuY29udGVudCB8fCB7fSwgcmVxdWVzdC5kYXRhLnN0YXRlX2tleSwgcmVxdWVzdC5kYXRhLnJvb21faWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY29udGVudCA9IHJlcXVlc3QuZGF0YS5jb250ZW50IHx8IHt9O1xuICAgICAgICB2YXIgbXNndHlwZSA9IGNvbnRlbnRbXCJtc2d0eXBlXCJdO1xuICAgICAgICBpZiAoIXRoaXMuY2FuU2VuZFJvb21FdmVudChyZXF1ZXN0LmRhdGEudHlwZSwgbXNndHlwZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCJDYW5ub3Qgc2VuZCByb29tIGV2ZW50cyBvZiB0aGlzIHR5cGVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXZlbnRzIGNhbiBiZSBzdGlja3ksIGRlbGF5ZWQsIGJvdGgsIG9yIG5laXRoZXIuIFRoZSBmb2xsb3dpbmdcbiAgICAgICAgLy8gc2VjdGlvbiBvZiBjb2RlIHRha2VzIHRoZSBjb21tb24gcGFyYW1ldGVycyBhbmQgdXNlcyB0aGUgY29ycmVjdFxuICAgICAgICAvLyBmdW5jdGlvbiBkZXBlbmRpbmcgb24gdGhlIHJlcXVlc3QgdHlwZS5cblxuICAgICAgICB2YXIgcGFyYW1zID0gW3JlcXVlc3QuZGF0YS50eXBlLCBjb250ZW50LCBudWxsLFxuICAgICAgICAvLyBub3Qgc2VuZGluZyBhIHN0YXRlIGV2ZW50XG4gICAgICAgIHJlcXVlc3QuZGF0YS5yb29tX2lkXTtcbiAgICAgICAgaWYgKGlzRGVsYXllZEV2ZW50ICYmIHJlcXVlc3QuZGF0YS5zdGlja3lfZHVyYXRpb25fbXMpIHtcbiAgICAgICAgICB2YXIgX3JlcXVlc3QkZGF0YSRkZWxheTIsIF9yZXF1ZXN0JGRhdGEkcGFyZW50XzI7XG4gICAgICAgICAgc2VuZEV2ZW50UHJvbWlzZSA9IHRoaXMuZHJpdmVyLnNlbmREZWxheWVkU3RpY2t5RXZlbnQoKF9yZXF1ZXN0JGRhdGEkZGVsYXkyID0gcmVxdWVzdC5kYXRhLmRlbGF5KSAhPT0gbnVsbCAmJiBfcmVxdWVzdCRkYXRhJGRlbGF5MiAhPT0gdm9pZCAwID8gX3JlcXVlc3QkZGF0YSRkZWxheTIgOiBudWxsLCAoX3JlcXVlc3QkZGF0YSRwYXJlbnRfMiA9IHJlcXVlc3QuZGF0YS5wYXJlbnRfZGVsYXlfaWQpICE9PSBudWxsICYmIF9yZXF1ZXN0JGRhdGEkcGFyZW50XzIgIT09IHZvaWQgMCA/IF9yZXF1ZXN0JGRhdGEkcGFyZW50XzIgOiBudWxsLCByZXF1ZXN0LmRhdGEuc3RpY2t5X2R1cmF0aW9uX21zLCByZXF1ZXN0LmRhdGEudHlwZSwgY29udGVudCwgcmVxdWVzdC5kYXRhLnJvb21faWQpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGVsYXllZEV2ZW50KSB7XG4gICAgICAgICAgdmFyIF90aGlzJGRyaXZlciwgX3JlcXVlc3QkZGF0YSRkZWxheTMsIF9yZXF1ZXN0JGRhdGEkcGFyZW50XzM7XG4gICAgICAgICAgc2VuZEV2ZW50UHJvbWlzZSA9IChfdGhpcyRkcml2ZXIgPSB0aGlzLmRyaXZlcikuc2VuZERlbGF5ZWRFdmVudC5hcHBseShfdGhpcyRkcml2ZXIsIFsoX3JlcXVlc3QkZGF0YSRkZWxheTMgPSByZXF1ZXN0LmRhdGEuZGVsYXkpICE9PSBudWxsICYmIF9yZXF1ZXN0JGRhdGEkZGVsYXkzICE9PSB2b2lkIDAgPyBfcmVxdWVzdCRkYXRhJGRlbGF5MyA6IG51bGwsIChfcmVxdWVzdCRkYXRhJHBhcmVudF8zID0gcmVxdWVzdC5kYXRhLnBhcmVudF9kZWxheV9pZCkgIT09IG51bGwgJiYgX3JlcXVlc3QkZGF0YSRwYXJlbnRfMyAhPT0gdm9pZCAwID8gX3JlcXVlc3QkZGF0YSRwYXJlbnRfMyA6IG51bGxdLmNvbmNhdChwYXJhbXMpKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LmRhdGEuc3RpY2t5X2R1cmF0aW9uX21zKSB7XG4gICAgICAgICAgc2VuZEV2ZW50UHJvbWlzZSA9IHRoaXMuZHJpdmVyLnNlbmRTdGlja3lFdmVudChyZXF1ZXN0LmRhdGEuc3RpY2t5X2R1cmF0aW9uX21zLCByZXF1ZXN0LmRhdGEudHlwZSwgY29udGVudCwgcmVxdWVzdC5kYXRhLnJvb21faWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfdGhpcyRkcml2ZXIyO1xuICAgICAgICAgIHNlbmRFdmVudFByb21pc2UgPSAoX3RoaXMkZHJpdmVyMiA9IHRoaXMuZHJpdmVyKS5zZW5kRXZlbnQuYXBwbHkoX3RoaXMkZHJpdmVyMiwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VuZEV2ZW50UHJvbWlzZS50aGVuKGZ1bmN0aW9uIChzZW50RXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzOS50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwgX29iamVjdFNwcmVhZCh7XG4gICAgICAgICAgcm9vbV9pZDogc2VudEV2ZW50LnJvb21JZFxuICAgICAgICB9LCBcImV2ZW50SWRcIiBpbiBzZW50RXZlbnQgPyB7XG4gICAgICAgICAgZXZlbnRfaWQ6IHNlbnRFdmVudC5ldmVudElkXG4gICAgICAgIH0gOiB7XG4gICAgICAgICAgZGVsYXlfaWQ6IHNlbnRFdmVudC5kZWxheUlkXG4gICAgICAgIH0pKTtcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHNlbmRpbmcgZXZlbnQ6IFwiLCBlKTtcbiAgICAgICAgX3RoaXM5LmhhbmRsZURyaXZlckVycm9yKGUsIHJlcXVlc3QsIFwiRXJyb3Igc2VuZGluZyBldmVudFwiKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVVcGRhdGVEZWxheWVkRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlVXBkYXRlRGVsYXllZEV2ZW50KHJlcXVlc3QpIHtcbiAgICAgIHZhciBfdGhpczEwID0gdGhpcztcbiAgICAgIGlmICghcmVxdWVzdC5kYXRhLmRlbGF5X2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0IC0gbWlzc2luZyBkZWxheV9pZFwiXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5oYXNDYXBhYmlsaXR5KF9DYXBhYmlsaXRpZXMuTWF0cml4Q2FwYWJpbGl0aWVzLk1TQzQxNTdVcGRhdGVEZWxheWVkRXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBjYXBhYmlsaXR5XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdmFyIHVwZGF0ZURlbGF5ZWRFdmVudDtcbiAgICAgIHN3aXRjaCAocmVxdWVzdC5kYXRhLmFjdGlvbikge1xuICAgICAgICBjYXNlIF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uLkNhbmNlbDpcbiAgICAgICAgICB1cGRhdGVEZWxheWVkRXZlbnQgPSB0aGlzLmRyaXZlci5jYW5jZWxTY2hlZHVsZWREZWxheWVkRXZlbnQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgX1VwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbi5VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uUmVzdGFydDpcbiAgICAgICAgICB1cGRhdGVEZWxheWVkRXZlbnQgPSB0aGlzLmRyaXZlci5yZXN0YXJ0U2NoZWR1bGVkRGVsYXllZEV2ZW50O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uLlNlbmQ6XG4gICAgICAgICAgdXBkYXRlRGVsYXllZEV2ZW50ID0gdGhpcy5kcml2ZXIuc2VuZFNjaGVkdWxlZERlbGF5ZWRFdmVudDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QgLSB1bnN1cHBvcnRlZCBhY3Rpb25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdXBkYXRlRGVsYXllZEV2ZW50LmNhbGwodGhpcy5kcml2ZXIsIHJlcXVlc3QuZGF0YS5kZWxheV9pZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczEwLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7fSk7XG4gICAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciB1cGRhdGluZyBkZWxheWVkIGV2ZW50OiBcIiwgZSk7XG4gICAgICAgIF90aGlzMTAuaGFuZGxlRHJpdmVyRXJyb3IoZSwgcmVxdWVzdCwgXCJFcnJvciB1cGRhdGluZyBkZWxheWVkIGV2ZW50XCIpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVNlbmRUb0RldmljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2hhbmRsZVNlbmRUb0RldmljZSA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTQocmVxdWVzdCkge1xuICAgICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yUnVudGltZSgpLndyYXAoZnVuY3Rpb24gX2NhbGxlZTQkKF9jb250ZXh0NCkge1xuICAgICAgICAgIHdoaWxlICgxKSBzd2l0Y2ggKF9jb250ZXh0NC5wcmV2ID0gX2NvbnRleHQ0Lm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaWYgKHJlcXVlc3QuZGF0YS50eXBlKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ0Lm5leHQgPSA0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QgLSBtaXNzaW5nIGV2ZW50IHR5cGVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIF9jb250ZXh0NC5uZXh0ID0gMjY7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICBpZiAocmVxdWVzdC5kYXRhLm1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ0Lm5leHQgPSA4O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QgLSBtaXNzaW5nIGV2ZW50IGNvbnRlbnRzXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBfY29udGV4dDQubmV4dCA9IDI2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgaWYgKCEodHlwZW9mIHJlcXVlc3QuZGF0YS5lbmNyeXB0ZWQgIT09IFwiYm9vbGVhblwiKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0NC5uZXh0ID0gMTI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgcmVxdWVzdCAtIG1pc3NpbmcgZW5jcnlwdGlvbiBmbGFnXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBfY29udGV4dDQubmV4dCA9IDI2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgIGlmICh0aGlzLmNhblNlbmRUb0RldmljZUV2ZW50KHJlcXVlc3QuZGF0YS50eXBlKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0NC5uZXh0ID0gMTY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkNhbm5vdCBzZW5kIHRvLWRldmljZSBldmVudHMgb2YgdGhpcyB0eXBlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBfY29udGV4dDQubmV4dCA9IDI2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgICAgIF9jb250ZXh0NC5wcmV2ID0gMTY7XG4gICAgICAgICAgICAgIF9jb250ZXh0NC5uZXh0ID0gMTk7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmRyaXZlci5zZW5kVG9EZXZpY2UocmVxdWVzdC5kYXRhLnR5cGUsIHJlcXVlc3QuZGF0YS5lbmNyeXB0ZWQsIHJlcXVlc3QuZGF0YS5tZXNzYWdlcyk7XG4gICAgICAgICAgICBjYXNlIDE5OlxuICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7fSk7XG4gICAgICAgICAgICAgIF9jb250ZXh0NC5uZXh0ID0gMjY7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQ0LnByZXYgPSAyMjtcbiAgICAgICAgICAgICAgX2NvbnRleHQ0LnQwID0gX2NvbnRleHQ0W1wiY2F0Y2hcIl0oMTYpO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igc2VuZGluZyB0by1kZXZpY2UgZXZlbnRcIiwgX2NvbnRleHQ0LnQwKTtcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVEcml2ZXJFcnJvcihfY29udGV4dDQudDAsIHJlcXVlc3QsIFwiRXJyb3Igc2VuZGluZyBldmVudFwiKTtcbiAgICAgICAgICAgIGNhc2UgMjY6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDQuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX2NhbGxlZTQsIHRoaXMsIFtbMTYsIDIyXV0pO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlU2VuZFRvRGV2aWNlKF94Mikge1xuICAgICAgICByZXR1cm4gX2hhbmRsZVNlbmRUb0RldmljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhbmRsZVNlbmRUb0RldmljZTtcbiAgICB9KClcbiAgfSwge1xuICAgIGtleTogXCJwb2xsVHVyblNlcnZlcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9wb2xsVHVyblNlcnZlcnMgPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL19yZWdlbmVyYXRvclJ1bnRpbWUoKS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWU1KHR1cm5TZXJ2ZXJzLCBpbml0aWFsU2VydmVyKSB7XG4gICAgICAgIHZhciBfaXRlcmF0b3JBYnJ1cHRDb21wbGV0aW9uLCBfZGlkSXRlcmF0b3JFcnJvciwgX2l0ZXJhdG9yRXJyb3IsIF9pdGVyYXRvciwgX3N0ZXAsIHNlcnZlcjtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWU1JChfY29udGV4dDUpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDUucHJldiA9IF9jb250ZXh0NS5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIF9jb250ZXh0NS5wcmV2ID0gMDtcbiAgICAgICAgICAgICAgX2NvbnRleHQ1Lm5leHQgPSAzO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlVwZGF0ZVR1cm5TZXJ2ZXJzLCBpbml0aWFsU2VydmVyIC8vIGl0J3MgY29tcGF0aWJsZSwgYnV0IG1pc3NpbmcgdGhlIGluZGV4IHNpZ25hdHVyZVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAvLyBQaWNrIHRoZSBnZW5lcmF0b3IgdXAgd2hlcmUgd2UgbGVmdCBvZmZcbiAgICAgICAgICAgICAgX2l0ZXJhdG9yQWJydXB0Q29tcGxldGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICBfY29udGV4dDUucHJldiA9IDU7XG4gICAgICAgICAgICAgIF9pdGVyYXRvciA9IF9hc3luY0l0ZXJhdG9yKHR1cm5TZXJ2ZXJzKTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgX2NvbnRleHQ1Lm5leHQgPSA5O1xuICAgICAgICAgICAgICByZXR1cm4gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgaWYgKCEoX2l0ZXJhdG9yQWJydXB0Q29tcGxldGlvbiA9ICEoX3N0ZXAgPSBfY29udGV4dDUuc2VudCkuZG9uZSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDUubmV4dCA9IDE2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlcnZlciA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgICAgICBfY29udGV4dDUubmV4dCA9IDEzO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlVwZGF0ZVR1cm5TZXJ2ZXJzLCBzZXJ2ZXIgLy8gaXQncyBjb21wYXRpYmxlLCBidXQgbWlzc2luZyB0aGUgaW5kZXggc2lnbmF0dXJlXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICBfaXRlcmF0b3JBYnJ1cHRDb21wbGV0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgIF9jb250ZXh0NS5uZXh0ID0gNztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE2OlxuICAgICAgICAgICAgICBfY29udGV4dDUubmV4dCA9IDIyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTg6XG4gICAgICAgICAgICAgIF9jb250ZXh0NS5wcmV2ID0gMTg7XG4gICAgICAgICAgICAgIF9jb250ZXh0NS50MCA9IF9jb250ZXh0NVtcImNhdGNoXCJdKDUpO1xuICAgICAgICAgICAgICBfZGlkSXRlcmF0b3JFcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgIF9pdGVyYXRvckVycm9yID0gX2NvbnRleHQ1LnQwO1xuICAgICAgICAgICAgY2FzZSAyMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQ1LnByZXYgPSAyMjtcbiAgICAgICAgICAgICAgX2NvbnRleHQ1LnByZXYgPSAyMztcbiAgICAgICAgICAgICAgaWYgKCEoX2l0ZXJhdG9yQWJydXB0Q29tcGxldGlvbiAmJiBfaXRlcmF0b3JbXCJyZXR1cm5cIl0gIT0gbnVsbCkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDUubmV4dCA9IDI3O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF9jb250ZXh0NS5uZXh0ID0gMjc7XG4gICAgICAgICAgICAgIHJldHVybiBfaXRlcmF0b3JbXCJyZXR1cm5cIl0oKTtcbiAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgIF9jb250ZXh0NS5wcmV2ID0gMjc7XG4gICAgICAgICAgICAgIGlmICghX2RpZEl0ZXJhdG9yRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDUubmV4dCA9IDMwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yO1xuICAgICAgICAgICAgY2FzZSAzMDpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0NS5maW5pc2goMjcpO1xuICAgICAgICAgICAgY2FzZSAzMTpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0NS5maW5pc2goMjIpO1xuICAgICAgICAgICAgY2FzZSAzMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQ1Lm5leHQgPSAzNztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM0OlxuICAgICAgICAgICAgICBfY29udGV4dDUucHJldiA9IDM0O1xuICAgICAgICAgICAgICBfY29udGV4dDUudDEgPSBfY29udGV4dDVbXCJjYXRjaFwiXSgwKTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIHBvbGxpbmcgZm9yIFRVUk4gc2VydmVyc1wiLCBfY29udGV4dDUudDEpO1xuICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0NS5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlNSwgdGhpcywgW1swLCAzNF0sIFs1LCAxOCwgMjIsIDMyXSwgWzIzLCwgMjcsIDMxXV0pO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gcG9sbFR1cm5TZXJ2ZXJzKF94MywgX3g0KSB7XG4gICAgICAgIHJldHVybiBfcG9sbFR1cm5TZXJ2ZXJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9sbFR1cm5TZXJ2ZXJzO1xuICAgIH0oKVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVdhdGNoVHVyblNlcnZlcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9oYW5kbGVXYXRjaFR1cm5TZXJ2ZXJzID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlNihyZXF1ZXN0KSB7XG4gICAgICAgIHZhciB0dXJuU2VydmVycywgX3lpZWxkJHR1cm5TZXJ2ZXJzJG5lLCBkb25lLCB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWU2JChfY29udGV4dDYpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDYucHJldiA9IF9jb250ZXh0Ni5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGlmICh0aGlzLmhhc0NhcGFiaWxpdHkoX0NhcGFiaWxpdGllcy5NYXRyaXhDYXBhYmlsaXRpZXMuTVNDMzg0NlR1cm5TZXJ2ZXJzKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0Ni5uZXh0ID0gNDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBjYXBhYmlsaXR5XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBfY29udGV4dDYubmV4dCA9IDI2O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLnR1cm5TZXJ2ZXJzKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ2Lm5leHQgPSA4O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFdlJ3JlIGFscmVhZHkgcG9sbGluZywgc28gdGhpcyBpcyBhIG5vLW9wXG4gICAgICAgICAgICAgIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHt9KTtcbiAgICAgICAgICAgICAgX2NvbnRleHQ2Lm5leHQgPSAyNjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIF9jb250ZXh0Ni5wcmV2ID0gODtcbiAgICAgICAgICAgICAgdHVyblNlcnZlcnMgPSB0aGlzLmRyaXZlci5nZXRUdXJuU2VydmVycygpOyAvLyBQZWVrIGF0IHRoZSBmaXJzdCByZXN1bHQsIHNvIHdlIGNhbiBhdCBsZWFzdCB2ZXJpZnkgdGhhdCB0aGVcbiAgICAgICAgICAgICAgLy8gY2xpZW50IGlzbid0IGJhbm5lZCBmcm9tIGdldHRpbmcgVFVSTiBzZXJ2ZXJzIGVudGlyZWx5XG4gICAgICAgICAgICAgIF9jb250ZXh0Ni5uZXh0ID0gMTI7XG4gICAgICAgICAgICAgIHJldHVybiB0dXJuU2VydmVycy5uZXh0KCk7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICBfeWllbGQkdHVyblNlcnZlcnMkbmUgPSBfY29udGV4dDYuc2VudDtcbiAgICAgICAgICAgICAgZG9uZSA9IF95aWVsZCR0dXJuU2VydmVycyRuZS5kb25lO1xuICAgICAgICAgICAgICB2YWx1ZSA9IF95aWVsZCR0dXJuU2VydmVycyRuZS52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ2Lm5leHQgPSAxNztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDbGllbnQgcmVmdXNlcyB0byBwcm92aWRlIGFueSBUVVJOIHNlcnZlcnNcIik7XG4gICAgICAgICAgICBjYXNlIDE3OlxuICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7fSk7XG5cbiAgICAgICAgICAgICAgLy8gU3RhcnQgdGhlIHBvbGwgbG9vcCwgc2VuZGluZyB0aGUgd2lkZ2V0IHRoZSBpbml0aWFsIHJlc3VsdFxuICAgICAgICAgICAgICB0aGlzLnBvbGxUdXJuU2VydmVycyh0dXJuU2VydmVycywgdmFsdWUpO1xuICAgICAgICAgICAgICB0aGlzLnR1cm5TZXJ2ZXJzID0gdHVyblNlcnZlcnM7XG4gICAgICAgICAgICAgIF9jb250ZXh0Ni5uZXh0ID0gMjY7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQ2LnByZXYgPSAyMjtcbiAgICAgICAgICAgICAgX2NvbnRleHQ2LnQwID0gX2NvbnRleHQ2W1wiY2F0Y2hcIl0oOCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBnZXR0aW5nIGZpcnN0IFRVUk4gc2VydmVyIHJlc3VsdHNcIiwgX2NvbnRleHQ2LnQwKTtcbiAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRVUk4gc2VydmVycyBub3QgYXZhaWxhYmxlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2FzZSAyNjpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Ni5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlNiwgdGhpcywgW1s4LCAyMl1dKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVdhdGNoVHVyblNlcnZlcnMoX3g1KSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlV2F0Y2hUdXJuU2VydmVycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhbmRsZVdhdGNoVHVyblNlcnZlcnM7XG4gICAgfSgpXG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlVW53YXRjaFR1cm5TZXJ2ZXJzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfaGFuZGxlVW53YXRjaFR1cm5TZXJ2ZXJzID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlNyhyZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlNyQoX2NvbnRleHQ3KSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQ3LnByZXYgPSBfY29udGV4dDcubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpZiAodGhpcy5oYXNDYXBhYmlsaXR5KF9DYXBhYmlsaXRpZXMuTWF0cml4Q2FwYWJpbGl0aWVzLk1TQzM4NDZUdXJuU2VydmVycykpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDcubmV4dCA9IDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIk1pc3NpbmcgY2FwYWJpbGl0eVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgX2NvbnRleHQ3Lm5leHQgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGlmICh0aGlzLnR1cm5TZXJ2ZXJzKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ3Lm5leHQgPSA4O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIFdlIHdlcmVuJ3QgcG9sbGluZyBhbnl3YXlzLCBzbyB0aGlzIGlzIGEgbm8tb3BcbiAgICAgICAgICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge30pO1xuICAgICAgICAgICAgICBfY29udGV4dDcubmV4dCA9IDEyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgX2NvbnRleHQ3Lm5leHQgPSAxMDtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHVyblNlcnZlcnNbXCJyZXR1cm5cIl0odW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgIHRoaXMudHVyblNlcnZlcnMgPSBudWxsO1xuICAgICAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7fSk7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ3LnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWU3LCB0aGlzKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVVud2F0Y2hUdXJuU2VydmVycyhfeDYpIHtcbiAgICAgICAgcmV0dXJuIF9oYW5kbGVVbndhdGNoVHVyblNlcnZlcnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYW5kbGVVbndhdGNoVHVyblNlcnZlcnM7XG4gICAgfSgpXG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlUmVhZFJlbGF0aW9uc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2hhbmRsZVJlYWRSZWxhdGlvbnMgPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL19yZWdlbmVyYXRvclJ1bnRpbWUoKS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWU4KHJlcXVlc3QpIHtcbiAgICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuICAgICAgICB2YXIgcmVzdWx0LCBjaHVuaztcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWU4JChfY29udGV4dDgpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDgucHJldiA9IF9jb250ZXh0OC5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGlmIChyZXF1ZXN0LmRhdGEuZXZlbnRfaWQpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDgubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0OC5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgcmVxdWVzdCAtIG1pc3NpbmcgZXZlbnQgSURcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICBpZiAoIShyZXF1ZXN0LmRhdGEubGltaXQgIT09IHVuZGVmaW5lZCAmJiByZXF1ZXN0LmRhdGEubGltaXQgPCAwKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0OC5uZXh0ID0gNDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ4LmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0IC0gbGltaXQgb3V0IG9mIHJhbmdlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgaWYgKCEocmVxdWVzdC5kYXRhLnJvb21faWQgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jYW5Vc2VSb29tVGltZWxpbmUocmVxdWVzdC5kYXRhLnJvb21faWQpKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0OC5uZXh0ID0gNjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ4LmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5hYmxlIHRvIGFjY2VzcyByb29tIHRpbWVsaW5lOiBcIi5jb25jYXQocmVxdWVzdC5kYXRhLnJvb21faWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgIF9jb250ZXh0OC5wcmV2ID0gNjtcbiAgICAgICAgICAgICAgX2NvbnRleHQ4Lm5leHQgPSA5O1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kcml2ZXIucmVhZEV2ZW50UmVsYXRpb25zKHJlcXVlc3QuZGF0YS5ldmVudF9pZCwgcmVxdWVzdC5kYXRhLnJvb21faWQsIHJlcXVlc3QuZGF0YS5yZWxfdHlwZSwgcmVxdWVzdC5kYXRhLmV2ZW50X3R5cGUsIHJlcXVlc3QuZGF0YS5mcm9tLCByZXF1ZXN0LmRhdGEudG8sIHJlcXVlc3QuZGF0YS5saW1pdCwgcmVxdWVzdC5kYXRhLmRpcmVjdGlvbik7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgIHJlc3VsdCA9IF9jb250ZXh0OC5zZW50O1xuICAgICAgICAgICAgICAvLyBvbmx5IHJldHVybiBldmVudHMgdGhhdCB0aGUgdXNlciBoYXMgdGhlIHBlcm1pc3Npb24gdG8gcmVjZWl2ZVxuICAgICAgICAgICAgICBjaHVuayA9IHJlc3VsdC5jaHVuay5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5zdGF0ZV9rZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMTEuY2FuUmVjZWl2ZVN0YXRlRXZlbnQoZS50eXBlLCBlLnN0YXRlX2tleSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpczExLmNhblJlY2VpdmVSb29tRXZlbnQoZS50eXBlLCBlLmNvbnRlbnRbXCJtc2d0eXBlXCJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ4LmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgY2h1bms6IGNodW5rLFxuICAgICAgICAgICAgICAgIHByZXZfYmF0Y2g6IHJlc3VsdC5wcmV2QmF0Y2gsXG4gICAgICAgICAgICAgICAgbmV4dF9iYXRjaDogcmVzdWx0Lm5leHRCYXRjaFxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICBfY29udGV4dDgucHJldiA9IDE0O1xuICAgICAgICAgICAgICBfY29udGV4dDgudDAgPSBfY29udGV4dDhbXCJjYXRjaFwiXSg2KTtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yIGdldHRpbmcgdGhlIHJlbGF0aW9uc1wiLCBfY29udGV4dDgudDApO1xuICAgICAgICAgICAgICB0aGlzLmhhbmRsZURyaXZlckVycm9yKF9jb250ZXh0OC50MCwgcmVxdWVzdCwgXCJVbmV4cGVjdGVkIGVycm9yIHdoaWxlIHJlYWRpbmcgcmVsYXRpb25zXCIpO1xuICAgICAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0OC5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlOCwgdGhpcywgW1s2LCAxNF1dKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlYWRSZWxhdGlvbnMoX3g3KSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlUmVhZFJlbGF0aW9ucy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhbmRsZVJlYWRSZWxhdGlvbnM7XG4gICAgfSgpXG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlVXNlckRpcmVjdG9yeVNlYXJjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2hhbmRsZVVzZXJEaXJlY3RvcnlTZWFyY2ggPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL19yZWdlbmVyYXRvclJ1bnRpbWUoKS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWU5KHJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWU5JChfY29udGV4dDkpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDkucHJldiA9IF9jb250ZXh0OS5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGlmICh0aGlzLmhhc0NhcGFiaWxpdHkoX0NhcGFiaWxpdGllcy5NYXRyaXhDYXBhYmlsaXRpZXMuTVNDMzk3M1VzZXJEaXJlY3RvcnlTZWFyY2gpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ5Lm5leHQgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDkuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIGNhcGFiaWxpdHlcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICBpZiAoISh0eXBlb2YgcmVxdWVzdC5kYXRhLnNlYXJjaF90ZXJtICE9PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0OS5uZXh0ID0gNDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ5LmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0IC0gbWlzc2luZyBzZWFyY2ggdGVybVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGlmICghKHJlcXVlc3QuZGF0YS5saW1pdCAhPT0gdW5kZWZpbmVkICYmIHJlcXVlc3QuZGF0YS5saW1pdCA8IDApKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQ5Lm5leHQgPSA2O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDkuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QgLSBsaW1pdCBvdXQgb2YgcmFuZ2VcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICBfY29udGV4dDkucHJldiA9IDY7XG4gICAgICAgICAgICAgIF9jb250ZXh0OS5uZXh0ID0gOTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJpdmVyLnNlYXJjaFVzZXJEaXJlY3RvcnkocmVxdWVzdC5kYXRhLnNlYXJjaF90ZXJtLCByZXF1ZXN0LmRhdGEubGltaXQpO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICByZXN1bHQgPSBfY29udGV4dDkuc2VudDtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0OS5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIGxpbWl0ZWQ6IHJlc3VsdC5saW1pdGVkLFxuICAgICAgICAgICAgICAgIHJlc3VsdHM6IHJlc3VsdC5yZXN1bHRzLm1hcChmdW5jdGlvbiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogci51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfbmFtZTogci5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgYXZhdGFyX3VybDogci5hdmF0YXJVcmxcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgX2NvbnRleHQ5LnByZXYgPSAxMztcbiAgICAgICAgICAgICAgX2NvbnRleHQ5LnQwID0gX2NvbnRleHQ5W1wiY2F0Y2hcIl0oNik7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBzZWFyY2hpbmcgaW4gdGhlIHVzZXIgZGlyZWN0b3J5XCIsIF9jb250ZXh0OS50MCk7XG4gICAgICAgICAgICAgIHRoaXMuaGFuZGxlRHJpdmVyRXJyb3IoX2NvbnRleHQ5LnQwLCByZXF1ZXN0LCBcIlVuZXhwZWN0ZWQgZXJyb3Igd2hpbGUgc2VhcmNoaW5nIGluIHRoZSB1c2VyIGRpcmVjdG9yeVwiKTtcbiAgICAgICAgICAgIGNhc2UgMTc6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDkuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX2NhbGxlZTksIHRoaXMsIFtbNiwgMTNdXSk7XG4gICAgICB9KSk7XG4gICAgICBmdW5jdGlvbiBoYW5kbGVVc2VyRGlyZWN0b3J5U2VhcmNoKF94OCkge1xuICAgICAgICByZXR1cm4gX2hhbmRsZVVzZXJEaXJlY3RvcnlTZWFyY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYW5kbGVVc2VyRGlyZWN0b3J5U2VhcmNoO1xuICAgIH0oKVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZUdldE1lZGlhQ29uZmlnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfaGFuZGxlR2V0TWVkaWFDb25maWcgPSBfYXN5bmNUb0dlbmVyYXRvciggLyojX19QVVJFX18qL19yZWdlbmVyYXRvclJ1bnRpbWUoKS5tYXJrKGZ1bmN0aW9uIF9jYWxsZWUxMChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMTAkKF9jb250ZXh0MTApIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDEwLnByZXYgPSBfY29udGV4dDEwLm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ2FwYWJpbGl0eShfQ2FwYWJpbGl0aWVzLk1hdHJpeENhcGFiaWxpdGllcy5NU0M0MDM5VXBsb2FkRmlsZSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDEwLm5leHQgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDEwLmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBjYXBhYmlsaXR5XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQxMC5wcmV2ID0gMjtcbiAgICAgICAgICAgICAgX2NvbnRleHQxMC5uZXh0ID0gNTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJpdmVyLmdldE1lZGlhQ29uZmlnKCk7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgIHJlc3VsdCA9IF9jb250ZXh0MTAuc2VudDtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0MTAuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHJlc3VsdCkpO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICBfY29udGV4dDEwLnByZXYgPSA5O1xuICAgICAgICAgICAgICBfY29udGV4dDEwLnQwID0gX2NvbnRleHQxMFtcImNhdGNoXCJdKDIpO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igd2hpbGUgZ2V0dGluZyB0aGUgbWVkaWEgY29uZmlndXJhdGlvblwiLCBfY29udGV4dDEwLnQwKTtcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVEcml2ZXJFcnJvcihfY29udGV4dDEwLnQwLCByZXF1ZXN0LCBcIlVuZXhwZWN0ZWQgZXJyb3Igd2hpbGUgZ2V0dGluZyB0aGUgbWVkaWEgY29uZmlndXJhdGlvblwiKTtcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDEwLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUxMCwgdGhpcywgW1syLCA5XV0pO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlR2V0TWVkaWFDb25maWcoX3g5KSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlR2V0TWVkaWFDb25maWcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoYW5kbGVHZXRNZWRpYUNvbmZpZztcbiAgICB9KClcbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVVcGxvYWRGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfaGFuZGxlVXBsb2FkRmlsZSA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTExKHJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUxMSQoX2NvbnRleHQxMSkge1xuICAgICAgICAgIHdoaWxlICgxKSBzd2l0Y2ggKF9jb250ZXh0MTEucHJldiA9IF9jb250ZXh0MTEubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpZiAodGhpcy5oYXNDYXBhYmlsaXR5KF9DYXBhYmlsaXRpZXMuTWF0cml4Q2FwYWJpbGl0aWVzLk1TQzQwMzlVcGxvYWRGaWxlKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0MTEubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0MTEuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJNaXNzaW5nIGNhcGFiaWxpdHlcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICBfY29udGV4dDExLnByZXYgPSAyO1xuICAgICAgICAgICAgICBfY29udGV4dDExLm5leHQgPSA1O1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kcml2ZXIudXBsb2FkRmlsZShyZXF1ZXN0LmRhdGEuZmlsZSk7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgIHJlc3VsdCA9IF9jb250ZXh0MTEuc2VudDtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0MTEuYWJydXB0KFwicmV0dXJuXCIsIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBjb250ZW50X3VyaTogcmVzdWx0LmNvbnRlbnRVcmlcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICBfY29udGV4dDExLnByZXYgPSA5O1xuICAgICAgICAgICAgICBfY29udGV4dDExLnQwID0gX2NvbnRleHQxMVtcImNhdGNoXCJdKDIpO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igd2hpbGUgdXBsb2FkaW5nIGEgZmlsZVwiLCBfY29udGV4dDExLnQwKTtcbiAgICAgICAgICAgICAgdGhpcy5oYW5kbGVEcml2ZXJFcnJvcihfY29udGV4dDExLnQwLCByZXF1ZXN0LCBcIlVuZXhwZWN0ZWQgZXJyb3Igd2hpbGUgdXBsb2FkaW5nIGEgZmlsZVwiKTtcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDExLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUxMSwgdGhpcywgW1syLCA5XV0pO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlVXBsb2FkRmlsZShfeDEwKSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlVXBsb2FkRmlsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhbmRsZVVwbG9hZEZpbGU7XG4gICAgfSgpXG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlRG93bmxvYWRGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfaGFuZGxlRG93bmxvYWRGaWxlID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMTIocmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yUnVudGltZSgpLndyYXAoZnVuY3Rpb24gX2NhbGxlZTEyJChfY29udGV4dDEyKSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQxMi5wcmV2ID0gX2NvbnRleHQxMi5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIGlmICh0aGlzLmhhc0NhcGFiaWxpdHkoX0NhcGFiaWxpdGllcy5NYXRyaXhDYXBhYmlsaXRpZXMuTVNDNDAzOURvd25sb2FkRmlsZSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDEyLm5leHQgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDEyLmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTWlzc2luZyBjYXBhYmlsaXR5XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgX2NvbnRleHQxMi5wcmV2ID0gMjtcbiAgICAgICAgICAgICAgX2NvbnRleHQxMi5uZXh0ID0gNTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJpdmVyLmRvd25sb2FkRmlsZShyZXF1ZXN0LmRhdGEuY29udGVudF91cmkpO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICByZXN1bHQgPSBfY29udGV4dDEyLnNlbnQ7XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDEyLmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgZmlsZTogcmVzdWx0LmZpbGVcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICBfY29udGV4dDEyLnByZXYgPSA5O1xuICAgICAgICAgICAgICBfY29udGV4dDEyLnQwID0gX2NvbnRleHQxMltcImNhdGNoXCJdKDIpO1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3Igd2hpbGUgZG93bmxvYWRpbmcgYSBmaWxlXCIsIF9jb250ZXh0MTIudDApO1xuICAgICAgICAgICAgICB0aGlzLmhhbmRsZURyaXZlckVycm9yKF9jb250ZXh0MTIudDAsIHJlcXVlc3QsIFwiVW5leHBlY3RlZCBlcnJvciB3aGlsZSBkb3dubG9hZGluZyBhIGZpbGVcIik7XG4gICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQxMi5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlMTIsIHRoaXMsIFtbMiwgOV1dKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZURvd25sb2FkRmlsZShfeDExKSB7XG4gICAgICAgIHJldHVybiBfaGFuZGxlRG93bmxvYWRGaWxlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFuZGxlRG93bmxvYWRGaWxlO1xuICAgIH0oKVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZURyaXZlckVycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZURyaXZlckVycm9yKGUsIHJlcXVlc3QsIG1lc3NhZ2UpIHtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5kcml2ZXIucHJvY2Vzc0Vycm9yKGUpO1xuICAgICAgdGhpcy50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICBlcnJvcjogX29iamVjdFNwcmVhZCh7XG4gICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9LCBkYXRhKVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZU1lc3NhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldikge1xuICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSByZXR1cm47XG4gICAgICB2YXIgYWN0aW9uRXYgPSBuZXcgQ3VzdG9tRXZlbnQoXCJhY3Rpb246XCIuY29uY2F0KGV2LmRldGFpbC5hY3Rpb24pLCB7XG4gICAgICAgIGRldGFpbDogZXYuZGV0YWlsLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZW1pdChcImFjdGlvbjpcIi5jb25jYXQoZXYuZGV0YWlsLmFjdGlvbiksIGFjdGlvbkV2KTtcbiAgICAgIGlmICghYWN0aW9uRXYuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICBzd2l0Y2ggKGV2LmRldGFpbC5hY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5Db250ZW50TG9hZGVkOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ29udGVudExvYWRlZEFjdGlvbihldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLlN1cHBvcnRlZEFwaVZlcnNpb25zOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbHlWZXJzaW9ucyhldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLlNlbmRFdmVudDpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNlbmRFdmVudChldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLlNlbmRUb0RldmljZTpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVNlbmRUb0RldmljZShldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLkdldE9wZW5JRENyZWRlbnRpYWxzOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlT0lEQyhldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzI5MzFOYXZpZ2F0ZTpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZU5hdmlnYXRlKGV2LmRldGFpbCk7XG4gICAgICAgICAgY2FzZSBfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDMjk3NFJlbmVnb3RpYXRlQ2FwYWJpbGl0aWVzOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ2FwYWJpbGl0aWVzUmVuZWdvdGlhdGUoZXYuZGV0YWlsKTtcbiAgICAgICAgICBjYXNlIF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5NU0MyODc2UmVhZEV2ZW50czpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVJlYWRFdmVudHMoZXYuZGV0YWlsKTtcbiAgICAgICAgICBjYXNlIF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5XYXRjaFR1cm5TZXJ2ZXJzOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlV2F0Y2hUdXJuU2VydmVycyhldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLlVud2F0Y2hUdXJuU2VydmVyczpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVVud2F0Y2hUdXJuU2VydmVycyhldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzM4NjlSZWFkUmVsYXRpb25zOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVhZFJlbGF0aW9ucyhldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzM5NzNVc2VyRGlyZWN0b3J5U2VhcmNoOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVXNlckRpcmVjdG9yeVNlYXJjaChldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLkJlZXBlclJlYWRSb29tQWNjb3VudERhdGE6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSZWFkUm9vbUFjY291bnREYXRhKGV2LmRldGFpbCk7XG4gICAgICAgICAgY2FzZSBfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDNDAzOUdldE1lZGlhQ29uZmlnQWN0aW9uOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlR2V0TWVkaWFDb25maWcoZXYuZGV0YWlsKTtcbiAgICAgICAgICBjYXNlIF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5NU0M0MDM5VXBsb2FkRmlsZUFjdGlvbjpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVVwbG9hZEZpbGUoZXYuZGV0YWlsKTtcbiAgICAgICAgICBjYXNlIF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5NU0M0MDM5RG93bmxvYWRGaWxlQWN0aW9uOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRG93bmxvYWRGaWxlKGV2LmRldGFpbCk7XG4gICAgICAgICAgY2FzZSBfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDNDE1N1VwZGF0ZURlbGF5ZWRFdmVudDpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVVwZGF0ZURlbGF5ZWRFdmVudChldi5kZXRhaWwpO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkoZXYuZGV0YWlsLCB7XG4gICAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmtub3duIG9yIHVuc3VwcG9ydGVkIGZyb20td2lkZ2V0IGFjdGlvbjogXCIgKyBldi5kZXRhaWwuYWN0aW9uXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5mb3JtcyB0aGUgd2lkZ2V0IHRoYXQgdGhlIGNsaWVudCdzIHRoZW1lIGhhcyBjaGFuZ2VkLlxuICAgICAqIEBwYXJhbSB0aGVtZSBUaGUgdGhlbWUgZGF0YSwgYXMgYW4gb2JqZWN0IHdpdGggYXJiaXRyYXJ5IGNvbnRlbnRzLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVRoZW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVRoZW1lKHRoZW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlRoZW1lQ2hhbmdlLCB0aGVtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5mb3JtcyB0aGUgd2lkZ2V0IHRoYXQgdGhlIGNsaWVudCdzIGxhbmd1YWdlIGhhcyBjaGFuZ2VkLlxuICAgICAqIEBwYXJhbSBsYW5nIFRoZSBCQ1AgNDcgaWRlbnRpZmllciByZXByZXNlbnRpbmcgdGhlIGNsaWVudCdzIGN1cnJlbnQgbGFuZ3VhZ2UuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlTGFuZ3VhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlTGFuZ3VhZ2UobGFuZykge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5MYW5ndWFnZUNoYW5nZSwge1xuICAgICAgICBsYW5nOiBsYW5nXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIHNjcmVlbnNob3Qgb2YgdGhlIHdpZGdldC5cbiAgICAgKiBAcmV0dXJucyBSZXNvbHZlcyB0byB0aGUgd2lkZ2V0J3Mgc2NyZWVuc2hvdC5cbiAgICAgKiBAdGhyb3dzIFRocm93cyBpZiB0aGVyZSBpcyBhIHByb2JsZW0uXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwidGFrZVNjcmVlbnNob3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGFrZVNjcmVlbnNob3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlRha2VTY3JlZW5zaG90LCB7fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxlcnRzIHRoZSB3aWRnZXQgdG8gd2hldGhlciBvciBub3QgaXQgaXMgY3VycmVudGx5IHZpc2libGUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc1Zpc2libGUgV2hldGhlciB0aGUgd2lkZ2V0IGlzIHZpc2libGUgb3Igbm90LlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPElXaWRnZXRBcGlSZXNwb25zZURhdGE+fSBSZXNvbHZlcyB3aGVuIHRoZSB3aWRnZXQgYWNrbm93bGVkZ2VzIHRoZSB1cGRhdGUuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwidXBkYXRlVmlzaWJpbGl0eVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVWaXNpYmlsaXR5KGlzVmlzaWJsZSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5VcGRhdGVWaXNpYmlsaXR5LCB7XG4gICAgICAgIHZpc2libGU6IGlzVmlzaWJsZVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNlbmRXaWRnZXRDb25maWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2VuZFdpZGdldENvbmZpZyhkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLldpZGdldENvbmZpZywgZGF0YSkudGhlbigpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJub3RpZnlNb2RhbFdpZGdldEJ1dHRvbkNsaWNrZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbm90aWZ5TW9kYWxXaWRnZXRCdXR0b25DbGlja2VkKGlkKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLkJ1dHRvbkNsaWNrZWQsIHtcbiAgICAgICAgaWQ6IGlkXG4gICAgICB9KS50aGVuKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm5vdGlmeU1vZGFsV2lkZ2V0Q2xvc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbm90aWZ5TW9kYWxXaWRnZXRDbG9zZShkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLkNsb3NlTW9kYWxXaWRnZXQsIGRhdGEpLnRoZW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZWVkcyBhbiBldmVudCB0byB0aGUgd2lkZ2V0LiBBcyBhIGNsaWVudCB5b3UgYXJlIGV4cGVjdGVkIHRvIGNhbGwgdGhpc1xuICAgICAqIGZvciBldmVyeSBuZXcgZXZlbnQgaW4gZXZlcnkgcm9vbSB0byB3aGljaCB5b3UgYXJlIGpvaW5lZCBvciBpbnZpdGVkLlxuICAgICAqIEBwYXJhbSB7SVJvb21FdmVudH0gcmF3RXZlbnQgVGhlIGV2ZW50IHRvICh0cnkgdG8pIHNlbmQgdG8gdGhlIHdpZGdldC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY3VycmVudFZpZXdlZFJvb21JZCBUaGUgcm9vbSBJRCB0aGUgdXNlciBpcyBjdXJyZW50bHlcbiAgICAgKiAgIGludGVyYWN0aW5nIHdpdGguIE5vdCB0aGUgcm9vbSBJRCBvZiB0aGUgZXZlbnQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFJlc29sdmVzIHdoZW4gZGVsaXZlcmVkIG9yIGlmIHRoZSB3aWRnZXQgaXMgbm90XG4gICAgICogICBhYmxlIHRvIHJlYWQgdGhlIGV2ZW50IGR1ZSB0byBwZXJtaXNzaW9ucywgcmVqZWN0cyBpZiB0aGUgd2lkZ2V0IGZhaWxlZFxuICAgICAqICAgdG8gaGFuZGxlIHRoZSBldmVudC5cbiAgICAgKiBAZGVwcmVjYXRlZCBJdCBpcyByZWNvbW1lbmRlZCB0byBjb21tdW5pY2F0ZSB0aGUgdmlld2VkIHJvb20gSUQgYnkgY2FsbGluZ1xuICAgICAqICAge0BsaW5rIENsaWVudFdpZGdldEFwaS5zZXRWaWV3ZWRSb29tSWR9IHJhdGhlciB0aGFuIHBhc3NpbmcgaXQgdG8gdGhpc1xuICAgICAqICAgbWV0aG9kLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcImZlZWRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2ZlZWRFdmVudCA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTEzKHJhd0V2ZW50LCBjdXJyZW50Vmlld2VkUm9vbUlkKSB7XG4gICAgICAgIHZhciBfcmF3RXZlbnQkY29udGVudDtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUxMyQoX2NvbnRleHQxMykge1xuICAgICAgICAgIHdoaWxlICgxKSBzd2l0Y2ggKF9jb250ZXh0MTMucHJldiA9IF9jb250ZXh0MTMubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBpZiAoY3VycmVudFZpZXdlZFJvb21JZCAhPT0gdW5kZWZpbmVkKSB0aGlzLnNldFZpZXdlZFJvb21JZChjdXJyZW50Vmlld2VkUm9vbUlkKTtcbiAgICAgICAgICAgICAgaWYgKCEocmF3RXZlbnQucm9vbV9pZCAhPT0gdGhpcy52aWV3ZWRSb29tSWQgJiYgIXRoaXMuY2FuVXNlUm9vbVRpbWVsaW5lKHJhd0V2ZW50LnJvb21faWQpKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0MTMubmV4dCA9IDM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0MTMuYWJydXB0KFwicmV0dXJuXCIpO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICBpZiAoIShyYXdFdmVudC5zdGF0ZV9rZXkgIT09IHVuZGVmaW5lZCAmJiByYXdFdmVudC5zdGF0ZV9rZXkgIT09IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQxMy5uZXh0ID0gODtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5jYW5SZWNlaXZlU3RhdGVFdmVudChyYXdFdmVudC50eXBlLCByYXdFdmVudC5zdGF0ZV9rZXkpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQxMy5uZXh0ID0gNjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQxMy5hYnJ1cHQoXCJyZXR1cm5cIik7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgIF9jb250ZXh0MTMubmV4dCA9IDEwO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY2FuUmVjZWl2ZVJvb21FdmVudChyYXdFdmVudC50eXBlLCAoX3Jhd0V2ZW50JGNvbnRlbnQgPSByYXdFdmVudC5jb250ZW50KSA9PT0gbnVsbCB8fCBfcmF3RXZlbnQkY29udGVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3Jhd0V2ZW50JGNvbnRlbnRbXCJtc2d0eXBlXCJdKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0MTMubmV4dCA9IDEwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDEzLmFicnVwdChcInJldHVyblwiKTtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgIF9jb250ZXh0MTMubmV4dCA9IDEyO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlNlbmRFdmVudCxcbiAgICAgICAgICAgICAgLy8gaXQncyBjb21wYXRpYmxlLCBidXQgbWlzc2luZyB0aGUgaW5kZXggc2lnbmF0dXJlXG4gICAgICAgICAgICAgIHJhd0V2ZW50KTtcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICBjYXNlIFwiZW5kXCI6XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDEzLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUxMywgdGhpcyk7XG4gICAgICB9KSk7XG4gICAgICBmdW5jdGlvbiBmZWVkRXZlbnQoX3gxMiwgX3gxMykge1xuICAgICAgICByZXR1cm4gX2ZlZWRFdmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZlZWRFdmVudDtcbiAgICB9KClcbiAgICAvKipcbiAgICAgKiBGZWVkcyBhIHRvLWRldmljZSBldmVudCB0byB0aGUgd2lkZ2V0LiBBcyBhIGNsaWVudCB5b3UgYXJlIGV4cGVjdGVkIHRvXG4gICAgICogY2FsbCB0aGlzIGZvciBldmVyeSB0by1kZXZpY2UgZXZlbnQgeW91IHJlY2VpdmUuXG4gICAgICogQHBhcmFtIHtJUm9vbUV2ZW50fSByYXdFdmVudCBUaGUgZXZlbnQgdG8gKHRyeSB0bykgc2VuZCB0byB0aGUgd2lkZ2V0LlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5jcnlwdGVkIFdoZXRoZXIgdGhlIGV2ZW50IGNvbnRlbnRzIHdlcmUgZW5jcnlwdGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBSZXNvbHZlcyB3aGVuIGRlbGl2ZXJlZCBvciBpZiB0aGUgd2lkZ2V0IGlzIG5vdFxuICAgICAqICAgYWJsZSB0byByZWNlaXZlIHRoZSBldmVudCBkdWUgdG8gcGVybWlzc2lvbnMsIHJlamVjdHMgaWYgdGhlIHdpZGdldFxuICAgICAqICAgZmFpbGVkIHRvIGhhbmRsZSB0aGUgZXZlbnQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwiZmVlZFRvRGV2aWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfZmVlZFRvRGV2aWNlID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMTQobWVzc2FnZSwgZW5jcnlwdGVkKSB7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMTQkKF9jb250ZXh0MTQpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDE0LnByZXYgPSBfY29udGV4dDE0Lm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhblJlY2VpdmVUb0RldmljZUV2ZW50KG1lc3NhZ2UudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDE0Lm5leHQgPSAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF9jb250ZXh0MTQubmV4dCA9IDM7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24uU2VuZFRvRGV2aWNlLCBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIG1lc3NhZ2UpLCB7fSwge1xuICAgICAgICAgICAgICAgIGVuY3J5cHRlZDogZW5jcnlwdGVkXG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0MTQuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX2NhbGxlZTE0LCB0aGlzKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGZlZWRUb0RldmljZShfeDE0LCBfeDE1KSB7XG4gICAgICAgIHJldHVybiBfZmVlZFRvRGV2aWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmVlZFRvRGV2aWNlO1xuICAgIH0oKVxuICB9LCB7XG4gICAga2V5OiBcInNldFZpZXdlZFJvb21JZFwiLFxuICAgIHZhbHVlOlxuICAgIC8qKlxuICAgICAqIEluZGljYXRlIHRoYXQgYSByb29tIGlzIGJlaW5nIHZpZXdlZCAobWFraW5nIGl0IHBvc3NpYmxlIGZvciB0aGUgd2lkZ2V0XG4gICAgICogdG8gaW50ZXJhY3Qgd2l0aCBpdCkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0Vmlld2VkUm9vbUlkKHJvb21JZCkge1xuICAgICAgdGhpcy52aWV3ZWRSb29tSWQgPSByb29tSWQ7XG4gICAgICAvLyBJZiB0aGUgd2lkZ2V0IGRvZXNuJ3QgaGF2ZSB0aW1lbGluZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHJvb20gdGhlblxuICAgICAgLy8gdGhpcyBpcyBpdHMgb3Bwb3J0dW5pdHkgdG8gbGVhcm4gdGhlIHJvb20gc3RhdGUuIFdlIHB1c2ggdGhlIGVudGlyZVxuICAgICAgLy8gcm9vbSBzdGF0ZSwgd2hpY2ggY291bGQgYmUgcmVkdW5kYW50IGlmIHRoaXMgcm9vbSBoYWQgYmVlbiB2aWV3ZWRcbiAgICAgIC8vIG9uY2UgYmVmb3JlLCBidXQgaXQncyBlYXNpZXIgdGhhbiBzZWxlY3RpdmVseSBwdXNoaW5nIGp1c3QgdGhlIGJpdHNcbiAgICAgIC8vIG9mIHN0YXRlIHRoYXQgY2hhbmdlZCB3aGlsZSB0aGUgcm9vbSB3YXMgaW4gdGhlIGJhY2tncm91bmQuXG4gICAgICBpZiAocm9vbUlkICE9PSBudWxsICYmICF0aGlzLmNhblVzZVJvb21UaW1lbGluZShyb29tSWQpKSB0aGlzLnB1c2hSb29tU3RhdGUocm9vbUlkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmx1c2hSb29tU3RhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9mbHVzaFJvb21TdGF0ZSA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTE1KCkge1xuICAgICAgICB2YXIgZXZlbnRzLCBfaXRlcmF0b3I3LCBfc3RlcDcsIGV2ZW50VHlwZU1hcCwgX2l0ZXJhdG9yOCwgX3N0ZXA4LCBzdGF0ZUtleU1hcDtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUxNSQoX2NvbnRleHQxNSkge1xuICAgICAgICAgIHdoaWxlICgxKSBzd2l0Y2ggKF9jb250ZXh0MTUucHJldiA9IF9jb250ZXh0MTUubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBfY29udGV4dDE1LnByZXYgPSAwO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICBfY29udGV4dDE1Lm5leHQgPSAzO1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5wdXNoUm9vbVN0YXRlVGFza3MpO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICBpZiAodGhpcy5wdXNoUm9vbVN0YXRlVGFza3Muc2l6ZSA+IDApIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDE1Lm5leHQgPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgIGV2ZW50cyA9IFtdO1xuICAgICAgICAgICAgICBfaXRlcmF0b3I3ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5wdXNoUm9vbVN0YXRlUmVzdWx0LnZhbHVlcygpKTtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjcucygpOyAhKF9zdGVwNyA9IF9pdGVyYXRvcjcubigpKS5kb25lOykge1xuICAgICAgICAgICAgICAgICAgZXZlbnRUeXBlTWFwID0gX3N0ZXA3LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgX2l0ZXJhdG9yOCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGV2ZW50VHlwZU1hcC52YWx1ZXMoKSk7XG4gICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjgucygpOyAhKF9zdGVwOCA9IF9pdGVyYXRvcjgubigpKS5kb25lOykge1xuICAgICAgICAgICAgICAgICAgICAgIHN0YXRlS2V5TWFwID0gX3N0ZXA4LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgIGV2ZW50cy5wdXNoLmFwcGx5KGV2ZW50cywgX3RvQ29uc3VtYWJsZUFycmF5KHN0YXRlS2V5TWFwLnZhbHVlcygpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBfaXRlcmF0b3I4LmUoZXJyKTtcbiAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIF9pdGVyYXRvcjguZigpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yNy5lKGVycik7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yNy5mKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX2NvbnRleHQxNS5uZXh0ID0gOTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0V2lkZ2V0VmVyc2lvbnMoKTtcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgaWYgKCFfY29udGV4dDE1LnNlbnQuaW5jbHVkZXMoX0FwaVZlcnNpb24uVW5zdGFibGVBcGlWZXJzaW9uLk1TQzI3NjJfVVBEQVRFX1NUQVRFKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0MTUubmV4dCA9IDEyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF9jb250ZXh0MTUubmV4dCA9IDEyO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlVwZGF0ZVN0YXRlLCB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IGV2ZW50c1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNhc2UgMTI6XG4gICAgICAgICAgICAgIF9jb250ZXh0MTUucHJldiA9IDEyO1xuICAgICAgICAgICAgICB0aGlzLmZsdXNoUm9vbVN0YXRlVGFzayA9IG51bGw7XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDE1LmZpbmlzaCgxMik7XG4gICAgICAgICAgICBjYXNlIDE1OlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQxNS5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlMTUsIHRoaXMsIFtbMCwsIDEyLCAxNV1dKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGZsdXNoUm9vbVN0YXRlKCkge1xuICAgICAgICByZXR1cm4gX2ZsdXNoUm9vbVN0YXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmx1c2hSb29tU3RhdGU7XG4gICAgfSgpXG4gICAgLyoqXG4gICAgICogUmVhZHMgdGhlIGN1cnJlbnQgc3RpY2t5IHN0YXRlIG9mIHRoZSByb29tIGFuZCBwdXNoZXMgaXQgdG8gdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEl0IHdpbGwgb25seSBwdXNoIGV2ZW50cyB0aGF0IHRoZSB3aWRnZXQgaXMgYWxsb3dlZCB0byByZWNlaXZlLlxuICAgICAqIEBwYXJhbSByb29tSWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInB1c2hTdGlja3lTdGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3B1c2hTdGlja3lTdGF0ZSA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTE3KHJvb21JZCkge1xuICAgICAgICB2YXIgX3RoaXMxMiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMTckKF9jb250ZXh0MTcpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDE3LnByZXYgPSBfY29udGV4dDE3Lm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlB1c2hpbmcgc3RpY2t5IHN0YXRlIHRvIHdpZGdldCBmb3Igcm9vbVwiLCByb29tSWQpO1xuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQxNy5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy5kcml2ZXIucmVhZFN0aWNreUV2ZW50cyhyb29tSWQpLnRoZW4oZnVuY3Rpb24gKGV2ZW50cykge1xuICAgICAgICAgICAgICAgIC8vIGZpbHRlciB0byB0aGUgYWxsb3dlZCBzdGlja3kgZXZlbnRzXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXZlbnRzLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgdmFyIF9lJGNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMxMi5jYW5SZWNlaXZlUm9vbUV2ZW50KGUudHlwZSwgdHlwZW9mICgoX2UkY29udGVudCA9IGUuY29udGVudCkgPT09IG51bGwgfHwgX2UkY29udGVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UkY29udGVudC5tc2d0eXBlKSA9PT0gXCJzdHJpbmdcIiA/IGUuY29udGVudC5tc2d0eXBlIDogbnVsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIHJvb21JZDogcm9vbUlkLFxuICAgICAgICAgICAgICAgICAgc3RpY2t5RXZlbnRzOiBmaWx0ZXJlZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pLnRoZW4oIC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9yZWYyID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMTYoX3JlZikge1xuICAgICAgICAgICAgICAgICAgdmFyIHJvb21JZCwgc3RpY2t5RXZlbnRzLCBwcm9taXNlcztcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMTYkKF9jb250ZXh0MTYpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQxNi5wcmV2ID0gX2NvbnRleHQxNi5uZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbUlkID0gX3JlZi5yb29tSWQsIHN0aWNreUV2ZW50cyA9IF9yZWYuc3RpY2t5RXZlbnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlB1c2hpbmdcIiwgc3RpY2t5RXZlbnRzLmxlbmd0aCwgXCJzdGlja3kgZXZlbnRzIHRvIHdpZGdldCBmb3Igcm9vbVwiLCByb29tSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZXMgPSBzdGlja3lFdmVudHMubWFwKGZ1bmN0aW9uIChyYXdFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMxMi50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlNlbmRFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29waWVkIGZyb20gZmVlZEV2ZW50OyBpdCdzIGNvbXBhdGlibGUsIGJ1dCBtaXNzaW5nIHRoZSBpbmRleCBzaWduYXR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dDE2Lm5leHQgPSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0MTYuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LCBfY2FsbGVlMTYpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKF94MTcpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0oKSkpO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQxNy5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlMTcsIHRoaXMpO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gcHVzaFN0aWNreVN0YXRlKF94MTYpIHtcbiAgICAgICAgcmV0dXJuIF9wdXNoU3RpY2t5U3RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwdXNoU3RpY2t5U3RhdGU7XG4gICAgfSgpXG4gICAgLyoqXG4gICAgICogUmVhZCB0aGUgcm9vbSdzIHN0YXRlIGFuZCBwdXNoIGFsbCBlbnRyaWVzIHRoYXQgdGhlIHdpZGdldCBpcyBhbGxvd2VkIHRvXG4gICAgICogcmVhZCB0aHJvdWdoIHRvIHRoZSB3aWRnZXQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicHVzaFJvb21TdGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwdXNoUm9vbVN0YXRlKHJvb21JZCkge1xuICAgICAgdmFyIF90aGlzMTMgPSB0aGlzO1xuICAgICAgdmFyIF9pdGVyYXRvcjkgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcih0aGlzLmFsbG93ZWRFdmVudHMpLFxuICAgICAgICBfc3RlcDk7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgX2xvb3AyID0gZnVuY3Rpb24gX2xvb3AyKCkge1xuICAgICAgICAgIHZhciBjYXAgPSBfc3RlcDkudmFsdWU7XG4gICAgICAgICAgaWYgKGNhcC5raW5kID09PSBfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LkV2ZW50S2luZC5TdGF0ZSAmJiBjYXAuZGlyZWN0aW9uID09PSBfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LkV2ZW50RGlyZWN0aW9uLlJlY2VpdmUpIHtcbiAgICAgICAgICAgIHZhciBfY2FwJGtleVN0ciwgX3RoaXMxMyRmbHVzaFJvb21TdGF0O1xuICAgICAgICAgICAgLy8gSW5pdGlhdGUgdGhlIHRhc2tcbiAgICAgICAgICAgIHZhciBldmVudHMgPSBfdGhpczEzLmRyaXZlci5yZWFkUm9vbVN0YXRlKHJvb21JZCwgY2FwLmV2ZW50VHlwZSwgKF9jYXAka2V5U3RyID0gY2FwLmtleVN0cikgIT09IG51bGwgJiYgX2NhcCRrZXlTdHIgIT09IHZvaWQgMCA/IF9jYXAka2V5U3RyIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHZhciB0YXNrID0gZXZlbnRzLnRoZW4oZnVuY3Rpb24gKGV2ZW50cykge1xuICAgICAgICAgICAgICAvLyBXaGVuIGNvbXBsZXRlLCBxdWV1ZSB0aGUgcmVzdWx0aW5nIGV2ZW50cyB0byBiZVxuICAgICAgICAgICAgICAvLyBwdXNoZWQgdG8gdGhlIHdpZGdldFxuICAgICAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTAgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihldmVudHMpLFxuICAgICAgICAgICAgICAgIF9zdGVwMTA7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IxMC5zKCk7ICEoX3N0ZXAxMCA9IF9pdGVyYXRvcjEwLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMTAudmFsdWU7XG4gICAgICAgICAgICAgICAgICB2YXIgZXZlbnRUeXBlTWFwID0gX3RoaXMxMy5wdXNoUm9vbVN0YXRlUmVzdWx0LmdldChyb29tSWQpO1xuICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50VHlwZU1hcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZU1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMxMy5wdXNoUm9vbVN0YXRlUmVzdWx0LnNldChyb29tSWQsIGV2ZW50VHlwZU1hcCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB2YXIgc3RhdGVLZXlNYXAgPSBldmVudFR5cGVNYXAuZ2V0KGNhcC5ldmVudFR5cGUpO1xuICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlS2V5TWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVLZXlNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50VHlwZU1hcC5zZXQoY2FwLmV2ZW50VHlwZSwgc3RhdGVLZXlNYXApO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKCFzdGF0ZUtleU1hcC5oYXMoZXZlbnQuc3RhdGVfa2V5KSkgc3RhdGVLZXlNYXAuc2V0KGV2ZW50LnN0YXRlX2tleSwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgX2l0ZXJhdG9yMTAuZShlcnIpO1xuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIF9pdGVyYXRvcjEwLmYoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcmVhZCByb29tIHN0YXRlIGZvciBcIi5jb25jYXQocm9vbUlkLCBcIiAoXCIpLmNvbmNhdChjYXAuZXZlbnRUeXBlLCBcIiwgXCIpLmNvbmNhdChjYXAua2V5U3RyLCBcIilcIiksIGUpO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIE1hcmsgcmVxdWVzdCBhcyBubyBsb25nZXIgcGVuZGluZ1xuICAgICAgICAgICAgICBfdGhpczEzLnB1c2hSb29tU3RhdGVUYXNrc1tcImRlbGV0ZVwiXSh0YXNrKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBNYXJrIHRhc2sgYXMgcGVuZGluZ1xuICAgICAgICAgICAgX3RoaXMxMy5wdXNoUm9vbVN0YXRlVGFza3MuYWRkKHRhc2spO1xuICAgICAgICAgICAgLy8gQXNzdW1pbmcgbm8gb3RoZXIgdGFza3MgYXJlIGFscmVhZHkgaGFwcGVuaW5nIGNvbmN1cnJlbnRseSxcbiAgICAgICAgICAgIC8vIHNjaGVkdWxlIHRoZSB3aWRnZXQgYWN0aW9uIHRoYXQgYWN0dWFsbHkgcHVzaGVzIHRoZSBldmVudHNcbiAgICAgICAgICAgIChfdGhpczEzJGZsdXNoUm9vbVN0YXQgPSBfdGhpczEzLmZsdXNoUm9vbVN0YXRlVGFzaykgIT09IG51bGwgJiYgX3RoaXMxMyRmbHVzaFJvb21TdGF0ICE9PSB2b2lkIDAgPyBfdGhpczEzJGZsdXNoUm9vbVN0YXQgOiBfdGhpczEzLmZsdXNoUm9vbVN0YXRlVGFzayA9IF90aGlzMTMuZmx1c2hSb29tU3RhdGUoKTtcbiAgICAgICAgICAgIF90aGlzMTMuZmx1c2hSb29tU3RhdGVUYXNrW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gcHVzaCByb29tIHN0YXRlXCIsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKF9pdGVyYXRvcjkucygpOyAhKF9zdGVwOSA9IF9pdGVyYXRvcjkubigpKS5kb25lOykge1xuICAgICAgICAgIF9sb29wMigpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yOS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I5LmYoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZWVkcyBhIHJvb20gc3RhdGUgdXBkYXRlIHRvIHRoZSB3aWRnZXQuIEFzIGEgY2xpZW50IHlvdSBhcmUgZXhwZWN0ZWQgdG9cbiAgICAgKiBjYWxsIHRoaXMgZm9yIGV2ZXJ5IHN0YXRlIHVwZGF0ZSBpbiBldmVyeSByb29tIHRvIHdoaWNoIHlvdSBhcmUgam9pbmVkIG9yXG4gICAgICogaW52aXRlZC5cbiAgICAgKiBAcGFyYW0ge0lSb29tRXZlbnR9IHJhd0V2ZW50IFRoZSBzdGF0ZSBldmVudCBjb3JyZXNwb25kaW5nIHRvIHRoZSB1cGRhdGVkXG4gICAgICogICByb29tIHN0YXRlIGVudHJ5LlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBSZXNvbHZlcyB3aGVuIGRlbGl2ZXJlZCBvciBpZiB0aGUgd2lkZ2V0IGlzIG5vdFxuICAgICAqICAgYWJsZSB0byByZWNlaXZlIHRoZSByb29tIHN0YXRlIGR1ZSB0byBwZXJtaXNzaW9ucywgcmVqZWN0cyBpZiB0aGVcbiAgICAgKiAgIHdpZGdldCBmYWlsZWQgdG8gaGFuZGxlIHRoZSB1cGRhdGUuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwiZmVlZFN0YXRlVXBkYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfZmVlZFN0YXRlVXBkYXRlID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMTgocmF3RXZlbnQpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZU1hcCwgc3RhdGVLZXlNYXA7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMTgkKF9jb250ZXh0MTgpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDE4LnByZXYgPSBfY29udGV4dDE4Lm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgaWYgKCEocmF3RXZlbnQuc3RhdGVfa2V5ID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQxOC5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYSBzdGF0ZSBldmVudFwiKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgaWYgKCEoKHJhd0V2ZW50LnJvb21faWQgPT09IHRoaXMudmlld2VkUm9vbUlkIHx8IHRoaXMuY2FuVXNlUm9vbVRpbWVsaW5lKHJhd0V2ZW50LnJvb21faWQpKSAmJiB0aGlzLmNhblJlY2VpdmVTdGF0ZUV2ZW50KHJhd0V2ZW50LnR5cGUsIHJhd0V2ZW50LnN0YXRlX2tleSkpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQxOC5uZXh0ID0gMjE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCEodGhpcy5wdXNoUm9vbVN0YXRlVGFza3Muc2l6ZSA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDE4Lm5leHQgPSAxMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBfY29udGV4dDE4Lm5leHQgPSA2O1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRXaWRnZXRWZXJzaW9ucygpO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICBpZiAoIV9jb250ZXh0MTguc2VudC5pbmNsdWRlcyhfQXBpVmVyc2lvbi5VbnN0YWJsZUFwaVZlcnNpb24uTVNDMjc2Ml9VUERBVEVfU1RBVEUpKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQxOC5uZXh0ID0gOTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBfY29udGV4dDE4Lm5leHQgPSA5O1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlVwZGF0ZVN0YXRlLCB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFtyYXdFdmVudF1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgIF9jb250ZXh0MTgubmV4dCA9IDIxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTE6XG4gICAgICAgICAgICAgIC8vIEx1bXAgdGhlIHVwZGF0ZSBpbiB3aXRoIHdoYXRldmVyIGRhdGEgd2lsbCBiZSBzZW50IGluIHRoZVxuICAgICAgICAgICAgICAvLyBpbml0aWFsIHB1c2ggbGF0ZXIuIEV2ZW4gaWYgd2Ugc2V0IGl0IHRvIGFuIFwib3V0ZGF0ZWRcIiBlbnRyeVxuICAgICAgICAgICAgICAvLyBoZXJlLCB3ZSBjYW4gY291bnQgb24gYW55IG5ld2VyIGVudHJpZXMgYmVpbmcgcGFzc2VkIHRvIHRoaXNcbiAgICAgICAgICAgICAgLy8gc2FtZSBtZXRob2QgZXZlbnR1YWxseTsgdGhpcyB3b24ndCBjYXVzZSBzdHVjayBzdGF0ZS5cbiAgICAgICAgICAgICAgZXZlbnRUeXBlTWFwID0gdGhpcy5wdXNoUm9vbVN0YXRlUmVzdWx0LmdldChyYXdFdmVudC5yb29tX2lkKTtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50VHlwZU1hcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRUeXBlTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaFJvb21TdGF0ZVJlc3VsdC5zZXQocmF3RXZlbnQucm9vbV9pZCwgZXZlbnRUeXBlTWFwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdGF0ZUtleU1hcCA9IGV2ZW50VHlwZU1hcC5nZXQocmF3RXZlbnQudHlwZSk7XG4gICAgICAgICAgICAgIGlmIChzdGF0ZUtleU1hcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVLZXlNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICAgICAgZXZlbnRUeXBlTWFwLnNldChyYXdFdmVudC50eXBlLCBzdGF0ZUtleU1hcCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFzdGF0ZUtleU1hcC5oYXMocmF3RXZlbnQudHlwZSkpIHN0YXRlS2V5TWFwLnNldChyYXdFdmVudC5zdGF0ZV9rZXksIHJhd0V2ZW50KTtcbiAgICAgICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgICAgIF9jb250ZXh0MTgubmV4dCA9IDE4O1xuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwodGhpcy5wdXNoUm9vbVN0YXRlVGFza3MpO1xuICAgICAgICAgICAgY2FzZSAxODpcbiAgICAgICAgICAgICAgaWYgKHRoaXMucHVzaFJvb21TdGF0ZVRhc2tzLnNpemUgPiAwKSB7XG4gICAgICAgICAgICAgICAgX2NvbnRleHQxOC5uZXh0ID0gMTY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgMTk6XG4gICAgICAgICAgICAgIF9jb250ZXh0MTgubmV4dCA9IDIxO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mbHVzaFJvb21TdGF0ZVRhc2s7XG4gICAgICAgICAgICBjYXNlIDIxOlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQxOC5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlMTgsIHRoaXMpO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gZmVlZFN0YXRlVXBkYXRlKF94MTgpIHtcbiAgICAgICAgcmV0dXJuIF9mZWVkU3RhdGVVcGRhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmZWVkU3RhdGVVcGRhdGU7XG4gICAgfSgpXG4gIH1dKTtcbiAgcmV0dXJuIENsaWVudFdpZGdldEFwaTtcbn0oX2V2ZW50cy5FdmVudEVtaXR0ZXIpO1xuZXhwb3J0cy5DbGllbnRXaWRnZXRBcGkgPSBDbGllbnRXaWRnZXRBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1DbGllbnRXaWRnZXRBcGkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlN5bWJvbHMgPSB2b2lkIDA7XG4vKlxuICogQ29weXJpZ2h0IDIwMjEgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG52YXIgU3ltYm9scyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoU3ltYm9scykge1xuICBTeW1ib2xzW1wiQW55Um9vbVwiXSA9IFwiKlwiO1xuICByZXR1cm4gU3ltYm9scztcbn0oe30pO1xuZXhwb3J0cy5TeW1ib2xzID0gU3ltYm9scztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN5bWJvbHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgcmV0dXJuIF90eXBlb2YgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9LCBfdHlwZW9mKG9iaik7IH1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLldpZGdldEFwaVJlc3BvbnNlRXJyb3IgPSBleHBvcnRzLldpZGdldEFwaSA9IHZvaWQgMDtcbnZhciBfZXZlbnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTtcbnZhciBfV2lkZ2V0QXBpRGlyZWN0aW9uID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9XaWRnZXRBcGlEaXJlY3Rpb25cIik7XG52YXIgX0FwaVZlcnNpb24gPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL0FwaVZlcnNpb25cIik7XG52YXIgX1Bvc3RtZXNzYWdlVHJhbnNwb3J0ID0gcmVxdWlyZShcIi4vdHJhbnNwb3J0L1Bvc3RtZXNzYWdlVHJhbnNwb3J0XCIpO1xudmFyIF9XaWRnZXRBcGlBY3Rpb24gPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL1dpZGdldEFwaUFjdGlvblwiKTtcbnZhciBfR2V0T3BlbklEQWN0aW9uID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9HZXRPcGVuSURBY3Rpb25cIik7XG52YXIgX1dpZGdldFR5cGUgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL1dpZGdldFR5cGVcIik7XG52YXIgX01vZGFsV2lkZ2V0QWN0aW9ucyA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZXMvTW9kYWxXaWRnZXRBY3Rpb25zXCIpO1xudmFyIF9XaWRnZXRFdmVudENhcGFiaWxpdHkgPSByZXF1aXJlKFwiLi9tb2RlbHMvV2lkZ2V0RXZlbnRDYXBhYmlsaXR5XCIpO1xudmFyIF9TeW1ib2xzID0gcmVxdWlyZShcIi4vU3ltYm9sc1wiKTtcbnZhciBfVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb25cIik7XG5mdW5jdGlvbiBfcmVnZW5lcmF0b3JSdW50aW1lKCkgeyBcInVzZSBzdHJpY3RcIjsgLyohIHJlZ2VuZXJhdG9yLXJ1bnRpbWUgLS0gQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuIC0tIGxpY2Vuc2UgKE1JVCk6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9ibG9iL21haW4vTElDRU5TRSAqLyBfcmVnZW5lcmF0b3JSdW50aW1lID0gZnVuY3Rpb24gX3JlZ2VuZXJhdG9yUnVudGltZSgpIHsgcmV0dXJuIGV4cG9ydHM7IH07IHZhciBleHBvcnRzID0ge30sIE9wID0gT2JqZWN0LnByb3RvdHlwZSwgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHksIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5IHx8IGZ1bmN0aW9uIChvYmosIGtleSwgZGVzYykgeyBvYmpba2V5XSA9IGRlc2MudmFsdWU7IH0sICRTeW1ib2wgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCA/IFN5bWJvbCA6IHt9LCBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCIsIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIiwgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiOyBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7IHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiAhMCwgY29uZmlndXJhYmxlOiAhMCwgd3JpdGFibGU6ICEwIH0pLCBvYmpba2V5XTsgfSB0cnkgeyBkZWZpbmUoe30sIFwiXCIpOyB9IGNhdGNoIChlcnIpIHsgZGVmaW5lID0gZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkgeyByZXR1cm4gb2JqW2tleV0gPSB2YWx1ZTsgfTsgfSBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7IHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yLCBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSksIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7IHJldHVybiBkZWZpbmVQcm9wZXJ0eShnZW5lcmF0b3IsIFwiX2ludm9rZVwiLCB7IHZhbHVlOiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIH0pLCBnZW5lcmF0b3I7IH0gZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7IHRyeSB7IHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTsgfSBjYXRjaCAoZXJyKSB7IHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTsgfSB9IGV4cG9ydHMud3JhcCA9IHdyYXA7IHZhciBDb250aW51ZVNlbnRpbmVsID0ge307IGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9IGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge30gZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fSB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTsgZGVmaW5lKEl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7IHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiwgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJiBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpICYmIChJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlKTsgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpOyBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7IFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHsgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbiAoYXJnKSB7IHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpOyB9KTsgfSk7IH0gZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7IGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7IHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpOyBpZiAoXCJ0aHJvd1wiICE9PSByZWNvcmQudHlwZSkgeyB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZywgdmFsdWUgPSByZXN1bHQudmFsdWU7IHJldHVybiB2YWx1ZSAmJiBcIm9iamVjdFwiID09IF90eXBlb2YodmFsdWUpICYmIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikgPyBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7IGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7IH0sIGZ1bmN0aW9uIChlcnIpIHsgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpOyB9KSA6IFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24gKHVud3JhcHBlZCkgeyByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQsIHJlc29sdmUocmVzdWx0KTsgfSwgZnVuY3Rpb24gKGVycm9yKSB7IHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTsgfSk7IH0gcmVqZWN0KHJlY29yZC5hcmcpOyB9IHZhciBwcmV2aW91c1Byb21pc2U7IGRlZmluZVByb3BlcnR5KHRoaXMsIFwiX2ludm9rZVwiLCB7IHZhbHVlOiBmdW5jdGlvbiB2YWx1ZShtZXRob2QsIGFyZykgeyBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHsgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTsgfSk7IH0gcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9IHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLCBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZykgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpOyB9IH0pOyB9IGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkgeyB2YXIgc3RhdGUgPSBcInN1c3BlbmRlZFN0YXJ0XCI7IHJldHVybiBmdW5jdGlvbiAobWV0aG9kLCBhcmcpIHsgaWYgKFwiZXhlY3V0aW5nXCIgPT09IHN0YXRlKSB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpOyBpZiAoXCJjb21wbGV0ZWRcIiA9PT0gc3RhdGUpIHsgaWYgKFwidGhyb3dcIiA9PT0gbWV0aG9kKSB0aHJvdyBhcmc7IHJldHVybiBkb25lUmVzdWx0KCk7IH0gZm9yIChjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZCwgY29udGV4dC5hcmcgPSBhcmc7OykgeyB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlOyBpZiAoZGVsZWdhdGUpIHsgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7IGlmIChkZWxlZ2F0ZVJlc3VsdCkgeyBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlOyByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7IH0gfSBpZiAoXCJuZXh0XCIgPT09IGNvbnRleHQubWV0aG9kKSBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7ZWxzZSBpZiAoXCJ0aHJvd1wiID09PSBjb250ZXh0Lm1ldGhvZCkgeyBpZiAoXCJzdXNwZW5kZWRTdGFydFwiID09PSBzdGF0ZSkgdGhyb3cgc3RhdGUgPSBcImNvbXBsZXRlZFwiLCBjb250ZXh0LmFyZzsgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7IH0gZWxzZSBcInJldHVyblwiID09PSBjb250ZXh0Lm1ldGhvZCAmJiBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7IHN0YXRlID0gXCJleGVjdXRpbmdcIjsgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpOyBpZiAoXCJub3JtYWxcIiA9PT0gcmVjb3JkLnR5cGUpIHsgaWYgKHN0YXRlID0gY29udGV4dC5kb25lID8gXCJjb21wbGV0ZWRcIiA6IFwic3VzcGVuZGVkWWllbGRcIiwgcmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7IHJldHVybiB7IHZhbHVlOiByZWNvcmQuYXJnLCBkb25lOiBjb250ZXh0LmRvbmUgfTsgfSBcInRocm93XCIgPT09IHJlY29yZC50eXBlICYmIChzdGF0ZSA9IFwiY29tcGxldGVkXCIsIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiLCBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmcpOyB9IH07IH0gZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkgeyB2YXIgbWV0aG9kTmFtZSA9IGNvbnRleHQubWV0aG9kLCBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2ROYW1lXTsgaWYgKHVuZGVmaW5lZCA9PT0gbWV0aG9kKSByZXR1cm4gY29udGV4dC5kZWxlZ2F0ZSA9IG51bGwsIFwidGhyb3dcIiA9PT0gbWV0aG9kTmFtZSAmJiBkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSAmJiAoY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiLCBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZCwgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCksIFwidGhyb3dcIiA9PT0gY29udGV4dC5tZXRob2QpIHx8IFwicmV0dXJuXCIgIT09IG1ldGhvZE5hbWUgJiYgKGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiLCBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICdcIiArIG1ldGhvZE5hbWUgKyBcIicgbWV0aG9kXCIpKSwgQ29udGludWVTZW50aW5lbDsgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTsgaWYgKFwidGhyb3dcIiA9PT0gcmVjb3JkLnR5cGUpIHJldHVybiBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIiwgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnLCBjb250ZXh0LmRlbGVnYXRlID0gbnVsbCwgQ29udGludWVTZW50aW5lbDsgdmFyIGluZm8gPSByZWNvcmQuYXJnOyByZXR1cm4gaW5mbyA/IGluZm8uZG9uZSA/IChjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZSwgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYywgXCJyZXR1cm5cIiAhPT0gY29udGV4dC5tZXRob2QgJiYgKGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCIsIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkKSwgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGwsIENvbnRpbnVlU2VudGluZWwpIDogaW5mbyA6IChjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIiwgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIiksIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsLCBDb250aW51ZVNlbnRpbmVsKTsgfSBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykgeyB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9OyAxIGluIGxvY3MgJiYgKGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXSksIDIgaW4gbG9jcyAmJiAoZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl0sIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXSksIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTsgfSBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7IHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9OyByZWNvcmQudHlwZSA9IFwibm9ybWFsXCIsIGRlbGV0ZSByZWNvcmQuYXJnLCBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkOyB9IGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHsgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XSwgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpLCB0aGlzLnJlc2V0KCEwKTsgfSBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHsgaWYgKGl0ZXJhYmxlKSB7IHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTsgaWYgKGl0ZXJhdG9yTWV0aG9kKSByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7IGlmIChcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIGl0ZXJhYmxlLm5leHQpIHJldHVybiBpdGVyYWJsZTsgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7IHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkgeyBmb3IgKDsgKytpIDwgaXRlcmFibGUubGVuZ3RoOykgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkgcmV0dXJuIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXSwgbmV4dC5kb25lID0gITEsIG5leHQ7IHJldHVybiBuZXh0LnZhbHVlID0gdW5kZWZpbmVkLCBuZXh0LmRvbmUgPSAhMCwgbmV4dDsgfTsgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7IH0gfSByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07IH0gZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHsgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogITAgfTsgfSByZXR1cm4gR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsIGRlZmluZVByb3BlcnR5KEdwLCBcImNvbnN0cnVjdG9yXCIsIHsgdmFsdWU6IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBjb25maWd1cmFibGU6ICEwIH0pLCBkZWZpbmVQcm9wZXJ0eShHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCB7IHZhbHVlOiBHZW5lcmF0b3JGdW5jdGlvbiwgY29uZmlndXJhYmxlOiAhMCB9KSwgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpLCBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbiAoZ2VuRnVuKSB7IHZhciBjdG9yID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBnZW5GdW4gJiYgZ2VuRnVuLmNvbnN0cnVjdG9yOyByZXR1cm4gISFjdG9yICYmIChjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIgPT09IChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkpOyB9LCBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbiAoZ2VuRnVuKSB7IHJldHVybiBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSkgOiAoZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBkZWZpbmUoZ2VuRnVuLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JGdW5jdGlvblwiKSksIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKSwgZ2VuRnVuOyB9LCBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24gKGFyZykgeyByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTsgfSwgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKSwgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KSwgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvciwgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uIChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHsgdm9pZCAwID09PSBQcm9taXNlSW1wbCAmJiAoUHJvbWlzZUltcGwgPSBQcm9taXNlKTsgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcih3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSwgUHJvbWlzZUltcGwpOyByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pID8gaXRlciA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkgeyByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTsgfSk7IH0sIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCksIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpLCBkZWZpbmUoR3AsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KSwgZGVmaW5lKEdwLCBcInRvU3RyaW5nXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7IH0pLCBleHBvcnRzLmtleXMgPSBmdW5jdGlvbiAodmFsKSB7IHZhciBvYmplY3QgPSBPYmplY3QodmFsKSwga2V5cyA9IFtdOyBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSBrZXlzLnB1c2goa2V5KTsgcmV0dXJuIGtleXMucmV2ZXJzZSgpLCBmdW5jdGlvbiBuZXh0KCkgeyBmb3IgKDsga2V5cy5sZW5ndGg7KSB7IHZhciBrZXkgPSBrZXlzLnBvcCgpOyBpZiAoa2V5IGluIG9iamVjdCkgcmV0dXJuIG5leHQudmFsdWUgPSBrZXksIG5leHQuZG9uZSA9ICExLCBuZXh0OyB9IHJldHVybiBuZXh0LmRvbmUgPSAhMCwgbmV4dDsgfTsgfSwgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXMsIENvbnRleHQucHJvdG90eXBlID0geyBjb25zdHJ1Y3RvcjogQ29udGV4dCwgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KHNraXBUZW1wUmVzZXQpIHsgaWYgKHRoaXMucHJldiA9IDAsIHRoaXMubmV4dCA9IDAsIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQsIHRoaXMuZG9uZSA9ICExLCB0aGlzLmRlbGVnYXRlID0gbnVsbCwgdGhpcy5tZXRob2QgPSBcIm5leHRcIiwgdGhpcy5hcmcgPSB1bmRlZmluZWQsIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpLCAhc2tpcFRlbXBSZXNldCkgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSBcInRcIiA9PT0gbmFtZS5jaGFyQXQoMCkgJiYgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiYgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSAmJiAodGhpc1tuYW1lXSA9IHVuZGVmaW5lZCk7IH0sIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7IHRoaXMuZG9uZSA9ICEwOyB2YXIgcm9vdFJlY29yZCA9IHRoaXMudHJ5RW50cmllc1swXS5jb21wbGV0aW9uOyBpZiAoXCJ0aHJvd1wiID09PSByb290UmVjb3JkLnR5cGUpIHRocm93IHJvb3RSZWNvcmQuYXJnOyByZXR1cm4gdGhpcy5ydmFsOyB9LCBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gZGlzcGF0Y2hFeGNlcHRpb24oZXhjZXB0aW9uKSB7IGlmICh0aGlzLmRvbmUpIHRocm93IGV4Y2VwdGlvbjsgdmFyIGNvbnRleHQgPSB0aGlzOyBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHsgcmV0dXJuIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiLCByZWNvcmQuYXJnID0gZXhjZXB0aW9uLCBjb250ZXh0Lm5leHQgPSBsb2MsIGNhdWdodCAmJiAoY29udGV4dC5tZXRob2QgPSBcIm5leHRcIiwgY29udGV4dC5hcmcgPSB1bmRlZmluZWQpLCAhIWNhdWdodDsgfSBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7IHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXSwgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjsgaWYgKFwicm9vdFwiID09PSBlbnRyeS50cnlMb2MpIHJldHVybiBoYW5kbGUoXCJlbmRcIik7IGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7IHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpLCBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTsgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHsgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCAhMCk7IGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpOyB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7IGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgITApOyB9IGVsc2UgeyBpZiAoIWhhc0ZpbmFsbHkpIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpOyBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTsgfSB9IH0gfSwgYWJydXB0OiBmdW5jdGlvbiBhYnJ1cHQodHlwZSwgYXJnKSB7IGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHsgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldOyBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJiBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHsgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5OyBicmVhazsgfSB9IGZpbmFsbHlFbnRyeSAmJiAoXCJicmVha1wiID09PSB0eXBlIHx8IFwiY29udGludWVcIiA9PT0gdHlwZSkgJiYgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiYgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jICYmIChmaW5hbGx5RW50cnkgPSBudWxsKTsgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307IHJldHVybiByZWNvcmQudHlwZSA9IHR5cGUsIHJlY29yZC5hcmcgPSBhcmcsIGZpbmFsbHlFbnRyeSA/ICh0aGlzLm1ldGhvZCA9IFwibmV4dFwiLCB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYywgQ29udGludWVTZW50aW5lbCkgOiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7IH0sIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7IGlmIChcInRocm93XCIgPT09IHJlY29yZC50eXBlKSB0aHJvdyByZWNvcmQuYXJnOyByZXR1cm4gXCJicmVha1wiID09PSByZWNvcmQudHlwZSB8fCBcImNvbnRpbnVlXCIgPT09IHJlY29yZC50eXBlID8gdGhpcy5uZXh0ID0gcmVjb3JkLmFyZyA6IFwicmV0dXJuXCIgPT09IHJlY29yZC50eXBlID8gKHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZywgdGhpcy5tZXRob2QgPSBcInJldHVyblwiLCB0aGlzLm5leHQgPSBcImVuZFwiKSA6IFwibm9ybWFsXCIgPT09IHJlY29yZC50eXBlICYmIGFmdGVyTG9jICYmICh0aGlzLm5leHQgPSBhZnRlckxvYyksIENvbnRpbnVlU2VudGluZWw7IH0sIGZpbmlzaDogZnVuY3Rpb24gZmluaXNoKGZpbmFsbHlMb2MpIHsgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkgeyB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07IGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSByZXR1cm4gdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyksIHJlc2V0VHJ5RW50cnkoZW50cnkpLCBDb250aW51ZVNlbnRpbmVsOyB9IH0sIFwiY2F0Y2hcIjogZnVuY3Rpb24gX2NhdGNoKHRyeUxvYykgeyBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7IHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTsgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7IHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uOyBpZiAoXCJ0aHJvd1wiID09PSByZWNvcmQudHlwZSkgeyB2YXIgdGhyb3duID0gcmVjb3JkLmFyZzsgcmVzZXRUcnlFbnRyeShlbnRyeSk7IH0gcmV0dXJuIHRocm93bjsgfSB9IHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTsgfSwgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24gZGVsZWdhdGVZaWVsZChpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykgeyByZXR1cm4gdGhpcy5kZWxlZ2F0ZSA9IHsgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsIG5leHRMb2M6IG5leHRMb2MgfSwgXCJuZXh0XCIgPT09IHRoaXMubWV0aG9kICYmICh0aGlzLmFyZyA9IHVuZGVmaW5lZCksIENvbnRpbnVlU2VudGluZWw7IH0gfSwgZXhwb3J0czsgfVxuZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykgeyB0cnkgeyB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7IHZhciB2YWx1ZSA9IGluZm8udmFsdWU7IH0gY2F0Y2ggKGVycm9yKSB7IHJlamVjdChlcnJvcik7IHJldHVybjsgfSBpZiAoaW5mby5kb25lKSB7IHJlc29sdmUodmFsdWUpOyB9IGVsc2UgeyBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7IH0gfVxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgdmFyIHNlbGYgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzOyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7IGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7IGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTsgfSBmdW5jdGlvbiBfdGhyb3coZXJyKSB7IGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpOyB9IF9uZXh0KHVuZGVmaW5lZCk7IH0pOyB9OyB9XG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307IGkgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgITApLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IHJldHVybiB0YXJnZXQ7IH1cbmZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKG8sIGFsbG93QXJyYXlMaWtlKSB7IHZhciBpdCA9IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdIHx8IG9bXCJAQGl0ZXJhdG9yXCJdOyBpZiAoIWl0KSB7IGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHsgaWYgKGl0KSBvID0gaXQ7IHZhciBpID0gMDsgdmFyIEYgPSBmdW5jdGlvbiBGKCkge307IHJldHVybiB7IHM6IEYsIG46IGZ1bmN0aW9uIG4oKSB7IGlmIChpID49IG8ubGVuZ3RoKSByZXR1cm4geyBkb25lOiB0cnVlIH07IHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb1tpKytdIH07IH0sIGU6IGZ1bmN0aW9uIGUoX2UpIHsgdGhyb3cgX2U7IH0sIGY6IEYgfTsgfSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH0gdmFyIG5vcm1hbENvbXBsZXRpb24gPSB0cnVlLCBkaWRFcnIgPSBmYWxzZSwgZXJyOyByZXR1cm4geyBzOiBmdW5jdGlvbiBzKCkgeyBpdCA9IGl0LmNhbGwobyk7IH0sIG46IGZ1bmN0aW9uIG4oKSB7IHZhciBzdGVwID0gaXQubmV4dCgpOyBub3JtYWxDb21wbGV0aW9uID0gc3RlcC5kb25lOyByZXR1cm4gc3RlcDsgfSwgZTogZnVuY3Rpb24gZShfZTIpIHsgZGlkRXJyID0gdHJ1ZTsgZXJyID0gX2UyOyB9LCBmOiBmdW5jdGlvbiBmKCkgeyB0cnkgeyBpZiAoIW5vcm1hbENvbXBsZXRpb24gJiYgaXRbXCJyZXR1cm5cIl0gIT0gbnVsbCkgaXRbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOyByZXR1cm4gYXJyMjsgfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBrZXkgPSBfdG9Qcm9wZXJ0eUtleShrZXkpOyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgX3RvUHJvcGVydHlLZXkoZGVzY3JpcHRvci5rZXkpLCBkZXNjcmlwdG9yKTsgfSB9XG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwgeyB3cml0YWJsZTogZmFsc2UgfSk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7IHZhciBrZXkgPSBfdG9QcmltaXRpdmUoYXJnLCBcInN0cmluZ1wiKTsgcmV0dXJuIF90eXBlb2Yoa2V5KSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKF90eXBlb2YoaW5wdXQpICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKF90eXBlb2YocmVzKSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJlczsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkBAdG9QcmltaXRpdmUgbXVzdCByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUuXCIpOyB9IHJldHVybiAoaGludCA9PT0gXCJzdHJpbmdcIiA/IFN0cmluZyA6IE51bWJlcikoaW5wdXQpOyB9XG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHN1YkNsYXNzLCBcInByb3RvdHlwZVwiLCB7IHdyaXRhYmxlOiBmYWxzZSB9KTsgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7IH1cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IGVsc2UgaWYgKGNhbGwgIT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRGVyaXZlZCBjb25zdHJ1Y3RvcnMgbWF5IG9ubHkgcmV0dXJuIG9iamVjdCBvciB1bmRlZmluZWRcIik7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cbmZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikgeyBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyB2YXIgX2NhY2hlID0gdHlwZW9mIE1hcCA9PT0gXCJmdW5jdGlvblwiID8gbmV3IE1hcCgpIDogdW5kZWZpbmVkOyBfd3JhcE5hdGl2ZVN1cGVyID0gZnVuY3Rpb24gX3dyYXBOYXRpdmVTdXBlcihDbGFzcykgeyBpZiAoQ2xhc3MgPT09IG51bGwgfHwgIV9pc05hdGl2ZUZ1bmN0aW9uKENsYXNzKSkgcmV0dXJuIENsYXNzOyBpZiAodHlwZW9mIENsYXNzICE9PSBcImZ1bmN0aW9uXCIpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IGlmICh0eXBlb2YgX2NhY2hlICE9PSBcInVuZGVmaW5lZFwiKSB7IGlmIChfY2FjaGUuaGFzKENsYXNzKSkgcmV0dXJuIF9jYWNoZS5nZXQoQ2xhc3MpOyBfY2FjaGUuc2V0KENsYXNzLCBXcmFwcGVyKTsgfSBmdW5jdGlvbiBXcmFwcGVyKCkgeyByZXR1cm4gX2NvbnN0cnVjdChDbGFzcywgYXJndW1lbnRzLCBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3IpOyB9IFdyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IFdyYXBwZXIsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IHJldHVybiBfc2V0UHJvdG90eXBlT2YoV3JhcHBlciwgQ2xhc3MpOyB9OyByZXR1cm4gX3dyYXBOYXRpdmVTdXBlcihDbGFzcyk7IH1cbmZ1bmN0aW9uIF9jb25zdHJ1Y3QoUGFyZW50LCBhcmdzLCBDbGFzcykgeyBpZiAoX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpKSB7IF9jb25zdHJ1Y3QgPSBSZWZsZWN0LmNvbnN0cnVjdC5iaW5kKCk7IH0gZWxzZSB7IF9jb25zdHJ1Y3QgPSBmdW5jdGlvbiBfY29uc3RydWN0KFBhcmVudCwgYXJncywgQ2xhc3MpIHsgdmFyIGEgPSBbbnVsbF07IGEucHVzaC5hcHBseShhLCBhcmdzKTsgdmFyIENvbnN0cnVjdG9yID0gRnVuY3Rpb24uYmluZC5hcHBseShQYXJlbnQsIGEpOyB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTsgaWYgKENsYXNzKSBfc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIENsYXNzLnByb3RvdHlwZSk7IHJldHVybiBpbnN0YW5jZTsgfTsgfSByZXR1cm4gX2NvbnN0cnVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpOyB9XG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IEJvb2xlYW4ucHJvdG90eXBlLnZhbHVlT2YuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChCb29sZWFuLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cbmZ1bmN0aW9uIF9pc05hdGl2ZUZ1bmN0aW9uKGZuKSB7IHJldHVybiBGdW5jdGlvbi50b1N0cmluZy5jYWxsKGZuKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTE7IH1cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZi5iaW5kKCkgOiBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YuYmluZCgpIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHsgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTsgfTsgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTsgfVxuZnVuY3Rpb24gX2F3YWl0QXN5bmNHZW5lcmF0b3IodmFsdWUpIHsgcmV0dXJuIG5ldyBfT3ZlcmxvYWRZaWVsZCh2YWx1ZSwgMCk7IH1cbmZ1bmN0aW9uIF93cmFwQXN5bmNHZW5lcmF0b3IoZm4pIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBfQXN5bmNHZW5lcmF0b3IoZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSk7IH07IH1cbmZ1bmN0aW9uIF9Bc3luY0dlbmVyYXRvcihnZW4pIHsgdmFyIGZyb250LCBiYWNrOyBmdW5jdGlvbiByZXN1bWUoa2V5LCBhcmcpIHsgdHJ5IHsgdmFyIHJlc3VsdCA9IGdlbltrZXldKGFyZyksIHZhbHVlID0gcmVzdWx0LnZhbHVlLCBvdmVybG9hZGVkID0gdmFsdWUgaW5zdGFuY2VvZiBfT3ZlcmxvYWRZaWVsZDsgUHJvbWlzZS5yZXNvbHZlKG92ZXJsb2FkZWQgPyB2YWx1ZS52IDogdmFsdWUpLnRoZW4oZnVuY3Rpb24gKGFyZykgeyBpZiAob3ZlcmxvYWRlZCkgeyB2YXIgbmV4dEtleSA9IFwicmV0dXJuXCIgPT09IGtleSA/IFwicmV0dXJuXCIgOiBcIm5leHRcIjsgaWYgKCF2YWx1ZS5rIHx8IGFyZy5kb25lKSByZXR1cm4gcmVzdW1lKG5leHRLZXksIGFyZyk7IGFyZyA9IGdlbltuZXh0S2V5XShhcmcpLnZhbHVlOyB9IHNldHRsZShyZXN1bHQuZG9uZSA/IFwicmV0dXJuXCIgOiBcIm5vcm1hbFwiLCBhcmcpOyB9LCBmdW5jdGlvbiAoZXJyKSB7IHJlc3VtZShcInRocm93XCIsIGVycik7IH0pOyB9IGNhdGNoIChlcnIpIHsgc2V0dGxlKFwidGhyb3dcIiwgZXJyKTsgfSB9IGZ1bmN0aW9uIHNldHRsZSh0eXBlLCB2YWx1ZSkgeyBzd2l0Y2ggKHR5cGUpIHsgY2FzZSBcInJldHVyblwiOiBmcm9udC5yZXNvbHZlKHsgdmFsdWU6IHZhbHVlLCBkb25lOiAhMCB9KTsgYnJlYWs7IGNhc2UgXCJ0aHJvd1wiOiBmcm9udC5yZWplY3QodmFsdWUpOyBicmVhazsgZGVmYXVsdDogZnJvbnQucmVzb2x2ZSh7IHZhbHVlOiB2YWx1ZSwgZG9uZTogITEgfSk7IH0gKGZyb250ID0gZnJvbnQubmV4dCkgPyByZXN1bWUoZnJvbnQua2V5LCBmcm9udC5hcmcpIDogYmFjayA9IG51bGw7IH0gdGhpcy5faW52b2tlID0gZnVuY3Rpb24gKGtleSwgYXJnKSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHZhciByZXF1ZXN0ID0geyBrZXk6IGtleSwgYXJnOiBhcmcsIHJlc29sdmU6IHJlc29sdmUsIHJlamVjdDogcmVqZWN0LCBuZXh0OiBudWxsIH07IGJhY2sgPyBiYWNrID0gYmFjay5uZXh0ID0gcmVxdWVzdCA6IChmcm9udCA9IGJhY2sgPSByZXF1ZXN0LCByZXN1bWUoa2V5LCBhcmcpKTsgfSk7IH0sIFwiZnVuY3Rpb25cIiAhPSB0eXBlb2YgZ2VuW1wicmV0dXJuXCJdICYmICh0aGlzW1wicmV0dXJuXCJdID0gdm9pZCAwKTsgfVxuX0FzeW5jR2VuZXJhdG9yLnByb3RvdHlwZVtcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIF9Bc3luY0dlbmVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIHRoaXMuX2ludm9rZShcIm5leHRcIiwgYXJnKTsgfSwgX0FzeW5jR2VuZXJhdG9yLnByb3RvdHlwZVtcInRocm93XCJdID0gZnVuY3Rpb24gKGFyZykgeyByZXR1cm4gdGhpcy5faW52b2tlKFwidGhyb3dcIiwgYXJnKTsgfSwgX0FzeW5jR2VuZXJhdG9yLnByb3RvdHlwZVtcInJldHVyblwiXSA9IGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIHRoaXMuX2ludm9rZShcInJldHVyblwiLCBhcmcpOyB9O1xuZnVuY3Rpb24gX092ZXJsb2FkWWllbGQodmFsdWUsIGtpbmQpIHsgdGhpcy52ID0gdmFsdWUsIHRoaXMuayA9IGtpbmQ7IH0gLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIENvcHlyaWdodCAyMDIwIC0gMjAyNCBUaGUgTWF0cml4Lm9yZyBGb3VuZGF0aW9uIEMuSS5DLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbnZhciBXaWRnZXRBcGlSZXNwb25zZUVycm9yID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXJyb3IpIHtcbiAgX2luaGVyaXRzKFdpZGdldEFwaVJlc3BvbnNlRXJyb3IsIF9FcnJvcik7XG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoV2lkZ2V0QXBpUmVzcG9uc2VFcnJvcik7XG4gIGZ1bmN0aW9uIFdpZGdldEFwaVJlc3BvbnNlRXJyb3IobWVzc2FnZSwgZGF0YSkge1xuICAgIHZhciBfdGhpczI7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdpZGdldEFwaVJlc3BvbnNlRXJyb3IpO1xuICAgIF90aGlzMiA9IF9zdXBlci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuICAgIF90aGlzMi5kYXRhID0gZGF0YTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIHJldHVybiBfY3JlYXRlQ2xhc3MoV2lkZ2V0QXBpUmVzcG9uc2VFcnJvcik7XG59KCAvKiNfX1BVUkVfXyovX3dyYXBOYXRpdmVTdXBlcihFcnJvcikpO1xuLyoqXG4gKiBBUEkgaGFuZGxlciBmb3Igd2lkZ2V0cy4gVGhpcyByYWlzZXMgZXZlbnRzIGZvciBlYWNoIGFjdGlvblxuICogcmVjZWl2ZWQgYXMgYGFjdGlvbjoke2FjdGlvbn1gIChlZzogXCJhY3Rpb246c2NyZWVuc2hvdFwiKS5cbiAqIERlZmF1bHQgaGFuZGxpbmcgY2FuIGJlIHByZXZlbnRlZCBieSB1c2luZyBwcmV2ZW50RGVmYXVsdCgpXG4gKiBvbiB0aGUgcmFpc2VkIGV2ZW50LiBUaGUgZGVmYXVsdCBoYW5kbGluZyB2YXJpZXMgZm9yIGVhY2hcbiAqIGFjdGlvbjogb25lcyB3aGljaCB0aGUgU0RLIGNhbiBoYW5kbGUgc2FmZWx5IGFyZSBhY2tub3dsZWRnZWRcbiAqIGFwcHJvcHJpYXRlbHkgYW5kIG9uZXMgd2hpY2ggYXJlIHVuaGFuZGxlZCAoY3VzdG9tIG9yIHJlcXVpcmVcbiAqIHRoZSB3aWRnZXQgdG8gZG8gc29tZXRoaW5nKSBhcmUgcmVqZWN0ZWQgd2l0aCBhbiBlcnJvci5cbiAqXG4gKiBFdmVudHMgd2hpY2ggYXJlIHByZXZlbnREZWZhdWx0KCllZCBtdXN0IHJlcGx5IHVzaW5nIHRoZVxuICogdHJhbnNwb3J0LiBUaGUgZXZlbnRzIHJhaXNlZCB3aWxsIGhhdmUgYSBkZXRhaWwgb2YgYW5cbiAqIElXaWRnZXRBcGlSZXF1ZXN0IGludGVyZmFjZS5cbiAqXG4gKiBXaGVuIHRoZSBXaWRnZXRBcGkgaXMgcmVhZHkgdG8gc3RhcnQgc2VuZGluZyByZXF1ZXN0cywgaXQgd2lsbFxuICogcmFpc2UgYSBcInJlYWR5XCIgQ3VzdG9tRXZlbnQuIEFmdGVyIHRoZSByZWFkeSBldmVudCBmaXJlcywgYWN0aW9uc1xuICogY2FuIGJlIHNlbnQgYW5kIHRoZSB0cmFuc3BvcnQgd2lsbCBiZSByZWFkeS5cbiAqL1xuZXhwb3J0cy5XaWRnZXRBcGlSZXNwb25zZUVycm9yID0gV2lkZ2V0QXBpUmVzcG9uc2VFcnJvcjtcbldpZGdldEFwaVJlc3BvbnNlRXJyb3IucHJvdG90eXBlLm5hbWUgPSBXaWRnZXRBcGlSZXNwb25zZUVycm9yLm5hbWU7XG52YXIgV2lkZ2V0QXBpID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfRXZlbnRFbWl0dGVyKSB7XG4gIF9pbmhlcml0cyhXaWRnZXRBcGksIF9FdmVudEVtaXR0ZXIpO1xuICB2YXIgX3N1cGVyMiA9IF9jcmVhdGVTdXBlcihXaWRnZXRBcGkpO1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBBUEkgaGFuZGxlciBmb3IgdGhlIGdpdmVuIHdpZGdldC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHdpZGdldElkIFRoZSB3aWRnZXQgSUQgdG8gbGlzdGVuIGZvci4gSWYgbm90IHN1cHBsaWVkIHRoZW5cbiAgICogdGhlIEFQSSB3aWxsIHVzZSB0aGUgd2lkZ2V0IElEIGZyb20gdGhlIGZpcnN0IHZhbGlkIHJlcXVlc3QgaXQgcmVjZWl2ZXMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGllbnRPcmlnaW4gVGhlIG9yaWdpbiBvZiB0aGUgY2xpZW50LCBvciBudWxsIGlmIG5vdCBrbm93bi5cbiAgICovXG4gIGZ1bmN0aW9uIFdpZGdldEFwaSgpIHtcbiAgICB2YXIgX3RoaXMzO1xuICAgIHZhciB3aWRnZXRJZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICB2YXIgY2xpZW50T3JpZ2luID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBudWxsO1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBXaWRnZXRBcGkpO1xuICAgIF90aGlzMyA9IF9zdXBlcjIuY2FsbCh0aGlzKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczMpLCBcInRyYW5zcG9ydFwiLCB2b2lkIDApO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMyksIFwiY2FwYWJpbGl0aWVzRmluaXNoZWRcIiwgZmFsc2UpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMyksIFwic3VwcG9ydHNNU0MyOTc0UmVuZWdvdGlhdGVcIiwgZmFsc2UpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMyksIFwicmVxdWVzdGVkQ2FwYWJpbGl0aWVzXCIsIFtdKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpczMpLCBcImFwcHJvdmVkQ2FwYWJpbGl0aWVzXCIsIHZvaWQgMCk7XG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMzKSwgXCJjYWNoZWRDbGllbnRWZXJzaW9uc1wiLCB2b2lkIDApO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzMyksIFwidHVyblNlcnZlcldhdGNoZXJzXCIsIDApO1xuICAgIGlmICghZ2xvYmFsVGhpcy5wYXJlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHBhcmVudCB3aW5kb3cuIFRoaXMgd2lkZ2V0IGRvZXNuJ3QgYXBwZWFyIHRvIGJlIGVtYmVkZGVkIHByb3Blcmx5LlwiKTtcbiAgICB9XG4gICAgX3RoaXMzLnRyYW5zcG9ydCA9IG5ldyBfUG9zdG1lc3NhZ2VUcmFuc3BvcnQuUG9zdG1lc3NhZ2VUcmFuc3BvcnQoX1dpZGdldEFwaURpcmVjdGlvbi5XaWRnZXRBcGlEaXJlY3Rpb24uRnJvbVdpZGdldCwgd2lkZ2V0SWQsIGdsb2JhbFRoaXMucGFyZW50LCBnbG9iYWxUaGlzKTtcbiAgICBfdGhpczMudHJhbnNwb3J0LnRhcmdldE9yaWdpbiA9IGNsaWVudE9yaWdpbjtcbiAgICBfdGhpczMudHJhbnNwb3J0Lm9uKFwibWVzc2FnZVwiLCBfdGhpczMuaGFuZGxlTWVzc2FnZS5iaW5kKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMzKSkpO1xuICAgIHJldHVybiBfdGhpczM7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgd2lkZ2V0IHdhcyBncmFudGVkIGEgcGFydGljdWxhciBjYXBhYmlsaXR5LiBOb3RlIHRoYXQgb25cbiAgICogY2xpZW50cyB3aGVyZSB0aGUgY2FwYWJpbGl0aWVzIGFyZSBub3QgZmVkIGJhY2sgdG8gdGhlIHdpZGdldCB0aGlzIGZ1bmN0aW9uXG4gICAqIHdpbGwgcmVseSBvbiByZXF1ZXN0ZWQgY2FwYWJpbGl0aWVzIGluc3RlYWQuXG4gICAqIEBwYXJhbSB7Q2FwYWJpbGl0eX0gY2FwYWJpbGl0eSBUaGUgY2FwYWJpbGl0eSB0byBjaGVjayBmb3IgYXBwcm92YWwgb2YuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB3aWRnZXQgaGFzIGFwcHJvdmFsIGZvciB0aGUgZ2l2ZW4gY2FwYWJpbGl0eS5cbiAgICovXG4gIF9jcmVhdGVDbGFzcyhXaWRnZXRBcGksIFt7XG4gICAga2V5OiBcImhhc0NhcGFiaWxpdHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzQ2FwYWJpbGl0eShjYXBhYmlsaXR5KSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmFwcHJvdmVkQ2FwYWJpbGl0aWVzKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHByb3ZlZENhcGFiaWxpdGllcy5pbmNsdWRlcyhjYXBhYmlsaXR5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlcXVlc3RlZENhcGFiaWxpdGllcy5pbmNsdWRlcyhjYXBhYmlsaXR5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IGEgY2FwYWJpbGl0eSBmcm9tIHRoZSBjbGllbnQuIEl0IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIGFsbG93ZWQsXG4gICAgICogYnV0IHdpbGwgYmUgYXNrZWQgZm9yLlxuICAgICAqIEBwYXJhbSB7Q2FwYWJpbGl0eX0gY2FwYWJpbGl0eSBUaGUgY2FwYWJpbGl0eSB0byByZXF1ZXN0LlxuICAgICAqIEB0aHJvd3MgVGhyb3dzIGlmIHRoZSBjYXBhYmlsaXRpZXMgbmVnb3RpYXRpb24gaGFzIGFscmVhZHkgc3RhcnRlZCBhbmQgdGhlXG4gICAgICogd2lkZ2V0IGlzIHVuYWJsZSB0byByZXF1ZXN0IGFkZGl0aW9uYWwgY2FwYWJpbGl0aWVzLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJlcXVlc3RDYXBhYmlsaXR5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RDYXBhYmlsaXR5KGNhcGFiaWxpdHkpIHtcbiAgICAgIGlmICh0aGlzLmNhcGFiaWxpdGllc0ZpbmlzaGVkICYmICF0aGlzLnN1cHBvcnRzTVNDMjk3NFJlbmVnb3RpYXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhcGFiaWxpdGllcyBoYXZlIGFscmVhZHkgYmVlbiBuZWdvdGlhdGVkXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZXF1ZXN0ZWRDYXBhYmlsaXRpZXMucHVzaChjYXBhYmlsaXR5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IGNhcGFiaWxpdGllcyBmcm9tIHRoZSBjbGllbnQuIFRoZXkgYXJlIG5vdCBndWFyYW50ZWVkIHRvIGJlIGFsbG93ZWQsXG4gICAgICogYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZSBuZWdvdGlhdGlvbiBoYXMgbm90IGFscmVhZHkgaGFwcGVuZWQuXG4gICAgICogQHBhcmFtIHtDYXBhYmlsaXR5W119IGNhcGFiaWxpdGllcyBUaGUgY2FwYWJpbGl0aWVzIHRvIHJlcXVlc3QuXG4gICAgICogQHRocm93cyBUaHJvd3MgaWYgdGhlIGNhcGFiaWxpdGllcyBuZWdvdGlhdGlvbiBoYXMgYWxyZWFkeSBzdGFydGVkLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJlcXVlc3RDYXBhYmlsaXRpZXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVxdWVzdENhcGFiaWxpdGllcyhjYXBhYmlsaXRpZXMpIHtcbiAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihjYXBhYmlsaXRpZXMpLFxuICAgICAgICBfc3RlcDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGNhcCA9IF9zdGVwLnZhbHVlO1xuICAgICAgICAgIHRoaXMucmVxdWVzdENhcGFiaWxpdHkoY2FwKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIHRoZSBjYXBhYmlsaXR5IHRvIGludGVyYWN0IHdpdGggcm9vbXMgb3RoZXIgdGhhbiB0aGUgdXNlcidzIGN1cnJlbnRseVxuICAgICAqIHZpZXdlZCByb29tLiBBcHBsaWVzIHRvIGV2ZW50IHJlY2VpdmluZyBhbmQgc2VuZGluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZyB8IFN5bWJvbHMuQW55Um9vbX0gcm9vbUlkIFRoZSByb29tIElELCBvciBgU3ltYm9scy5BbnlSb29tYCB0b1xuICAgICAqIGRlbm90ZSBhbGwga25vd24gcm9vbXMuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVxdWVzdENhcGFiaWxpdHlGb3JSb29tVGltZWxpbmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVxdWVzdENhcGFiaWxpdHlGb3JSb29tVGltZWxpbmUocm9vbUlkKSB7XG4gICAgICB0aGlzLnJlcXVlc3RDYXBhYmlsaXR5KFwib3JnLm1hdHJpeC5tc2MyNzYyLnRpbWVsaW5lOlwiLmNvbmNhdChyb29tSWQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyB0aGUgY2FwYWJpbGl0eSB0byBzZW5kIGEgZ2l2ZW4gc3RhdGUgZXZlbnQgd2l0aCBvcHRpb25hbCBleHBsaWNpdFxuICAgICAqIHN0YXRlIGtleS4gSXQgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgYWxsb3dlZCwgYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZVxuICAgICAqIG5lZ290aWF0aW9uIGhhcyBub3QgYWxyZWFkeSBoYXBwZW5lZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFRoZSBzdGF0ZSBldmVudCB0eXBlIHRvIGFzayBmb3IuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlS2V5IElmIHNwZWNpZmllZCwgdGhlIHNwZWNpZmljIHN0YXRlIGtleSB0byByZXF1ZXN0LlxuICAgICAqIE90aGVyd2lzZSBhbGwgc3RhdGUga2V5cyB3aWxsIGJlIHJlcXVlc3RlZC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0Q2FwYWJpbGl0eVRvU2VuZFN0YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RDYXBhYmlsaXR5VG9TZW5kU3RhdGUoZXZlbnRUeXBlLCBzdGF0ZUtleSkge1xuICAgICAgdGhpcy5yZXF1ZXN0Q2FwYWJpbGl0eShfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LldpZGdldEV2ZW50Q2FwYWJpbGl0eS5mb3JTdGF0ZUV2ZW50KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uU2VuZCwgZXZlbnRUeXBlLCBzdGF0ZUtleSkucmF3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyB0aGUgY2FwYWJpbGl0eSB0byByZWNlaXZlIGEgZ2l2ZW4gc3RhdGUgZXZlbnQgd2l0aCBvcHRpb25hbCBleHBsaWNpdFxuICAgICAqIHN0YXRlIGtleS4gSXQgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgYWxsb3dlZCwgYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZVxuICAgICAqIG5lZ290aWF0aW9uIGhhcyBub3QgYWxyZWFkeSBoYXBwZW5lZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFRoZSBzdGF0ZSBldmVudCB0eXBlIHRvIGFzayBmb3IuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlS2V5IElmIHNwZWNpZmllZCwgdGhlIHNwZWNpZmljIHN0YXRlIGtleSB0byByZXF1ZXN0LlxuICAgICAqIE90aGVyd2lzZSBhbGwgc3RhdGUga2V5cyB3aWxsIGJlIHJlcXVlc3RlZC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0Q2FwYWJpbGl0eVRvUmVjZWl2ZVN0YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RDYXBhYmlsaXR5VG9SZWNlaXZlU3RhdGUoZXZlbnRUeXBlLCBzdGF0ZUtleSkge1xuICAgICAgdGhpcy5yZXF1ZXN0Q2FwYWJpbGl0eShfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LldpZGdldEV2ZW50Q2FwYWJpbGl0eS5mb3JTdGF0ZUV2ZW50KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uUmVjZWl2ZSwgZXZlbnRUeXBlLCBzdGF0ZUtleSkucmF3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyB0aGUgY2FwYWJpbGl0eSB0byBzZW5kIGEgZ2l2ZW4gdG8tZGV2aWNlIGV2ZW50LiBJdCBpcyBub3RcbiAgICAgKiBndWFyYW50ZWVkIHRvIGJlIGFsbG93ZWQsIGJ1dCB3aWxsIGJlIGFza2VkIGZvciBpZiB0aGUgbmVnb3RpYXRpb24gaGFzXG4gICAgICogbm90IGFscmVhZHkgaGFwcGVuZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBUaGUgcm9vbSBldmVudCB0eXBlIHRvIGFzayBmb3IuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVxdWVzdENhcGFiaWxpdHlUb1NlbmRUb0RldmljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0Q2FwYWJpbGl0eVRvU2VuZFRvRGV2aWNlKGV2ZW50VHlwZSkge1xuICAgICAgdGhpcy5yZXF1ZXN0Q2FwYWJpbGl0eShfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LldpZGdldEV2ZW50Q2FwYWJpbGl0eS5mb3JUb0RldmljZUV2ZW50KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uU2VuZCwgZXZlbnRUeXBlKS5yYXcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIHRoZSBjYXBhYmlsaXR5IHRvIHJlY2VpdmUgYSBnaXZlbiB0by1kZXZpY2UgZXZlbnQuIEl0IGlzIG5vdFxuICAgICAqIGd1YXJhbnRlZWQgdG8gYmUgYWxsb3dlZCwgYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZSBuZWdvdGlhdGlvbiBoYXNcbiAgICAgKiBub3QgYWxyZWFkeSBoYXBwZW5lZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFRoZSByb29tIGV2ZW50IHR5cGUgdG8gYXNrIGZvci5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0Q2FwYWJpbGl0eVRvUmVjZWl2ZVRvRGV2aWNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RDYXBhYmlsaXR5VG9SZWNlaXZlVG9EZXZpY2UoZXZlbnRUeXBlKSB7XG4gICAgICB0aGlzLnJlcXVlc3RDYXBhYmlsaXR5KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LmZvclRvRGV2aWNlRXZlbnQoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5FdmVudERpcmVjdGlvbi5SZWNlaXZlLCBldmVudFR5cGUpLnJhdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdHMgdGhlIGNhcGFiaWxpdHkgdG8gc2VuZCBhIGdpdmVuIHJvb20gZXZlbnQuIEl0IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlXG4gICAgICogYWxsb3dlZCwgYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZSBuZWdvdGlhdGlvbiBoYXMgbm90IGFscmVhZHkgaGFwcGVuZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBUaGUgcm9vbSBldmVudCB0eXBlIHRvIGFzayBmb3IuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVxdWVzdENhcGFiaWxpdHlUb1NlbmRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0Q2FwYWJpbGl0eVRvU2VuZEV2ZW50KGV2ZW50VHlwZSkge1xuICAgICAgdGhpcy5yZXF1ZXN0Q2FwYWJpbGl0eShfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LldpZGdldEV2ZW50Q2FwYWJpbGl0eS5mb3JSb29tRXZlbnQoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5FdmVudERpcmVjdGlvbi5TZW5kLCBldmVudFR5cGUpLnJhdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdHMgdGhlIGNhcGFiaWxpdHkgdG8gcmVjZWl2ZSBhIGdpdmVuIHJvb20gZXZlbnQuIEl0IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlXG4gICAgICogYWxsb3dlZCwgYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZSBuZWdvdGlhdGlvbiBoYXMgbm90IGFscmVhZHkgaGFwcGVuZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBUaGUgcm9vbSBldmVudCB0eXBlIHRvIGFzayBmb3IuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVxdWVzdENhcGFiaWxpdHlUb1JlY2VpdmVFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0Q2FwYWJpbGl0eVRvUmVjZWl2ZUV2ZW50KGV2ZW50VHlwZSkge1xuICAgICAgdGhpcy5yZXF1ZXN0Q2FwYWJpbGl0eShfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LldpZGdldEV2ZW50Q2FwYWJpbGl0eS5mb3JSb29tRXZlbnQoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5FdmVudERpcmVjdGlvbi5SZWNlaXZlLCBldmVudFR5cGUpLnJhdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdHMgdGhlIGNhcGFiaWxpdHkgdG8gc2VuZCBhIGdpdmVuIG1lc3NhZ2UgZXZlbnQgd2l0aCBvcHRpb25hbCBleHBsaWNpdFxuICAgICAqIGBtc2d0eXBlYC4gSXQgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgYWxsb3dlZCwgYnV0IHdpbGwgYmUgYXNrZWQgZm9yIGlmIHRoZVxuICAgICAqIG5lZ290aWF0aW9uIGhhcyBub3QgYWxyZWFkeSBoYXBwZW5lZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbXNndHlwZSBJZiBzcGVjaWZpZWQsIHRoZSBzcGVjaWZpYyBtc2d0eXBlIHRvIHJlcXVlc3QuXG4gICAgICogT3RoZXJ3aXNlIGFsbCBtZXNzYWdlIHR5cGVzIHdpbGwgYmUgcmVxdWVzdGVkLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJlcXVlc3RDYXBhYmlsaXR5VG9TZW5kTWVzc2FnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0Q2FwYWJpbGl0eVRvU2VuZE1lc3NhZ2UobXNndHlwZSkge1xuICAgICAgdGhpcy5yZXF1ZXN0Q2FwYWJpbGl0eShfV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LldpZGdldEV2ZW50Q2FwYWJpbGl0eS5mb3JSb29tTWVzc2FnZUV2ZW50KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uU2VuZCwgbXNndHlwZSkucmF3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0cyB0aGUgY2FwYWJpbGl0eSB0byByZWNlaXZlIGEgZ2l2ZW4gbWVzc2FnZSBldmVudCB3aXRoIG9wdGlvbmFsIGV4cGxpY2l0XG4gICAgICogYG1zZ3R5cGVgLiBJdCBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBhbGxvd2VkLCBidXQgd2lsbCBiZSBhc2tlZCBmb3IgaWYgdGhlXG4gICAgICogbmVnb3RpYXRpb24gaGFzIG5vdCBhbHJlYWR5IGhhcHBlbmVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtc2d0eXBlIElmIHNwZWNpZmllZCwgdGhlIHNwZWNpZmljIG1zZ3R5cGUgdG8gcmVxdWVzdC5cbiAgICAgKiBPdGhlcndpc2UgYWxsIG1lc3NhZ2UgdHlwZXMgd2lsbCBiZSByZXF1ZXN0ZWQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVxdWVzdENhcGFiaWxpdHlUb1JlY2VpdmVNZXNzYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RDYXBhYmlsaXR5VG9SZWNlaXZlTWVzc2FnZShtc2d0eXBlKSB7XG4gICAgICB0aGlzLnJlcXVlc3RDYXBhYmlsaXR5KF9XaWRnZXRFdmVudENhcGFiaWxpdHkuV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LmZvclJvb21NZXNzYWdlRXZlbnQoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5FdmVudERpcmVjdGlvbi5SZWNlaXZlLCBtc2d0eXBlKS5yYXcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIHRoZSBjYXBhYmlsaXR5IHRvIHJlY2VpdmUgYSBnaXZlbiBpdGVtIGluIHJvb20gYWNjb3VudCBkYXRhLiBJdCBpcyBub3QgZ3VhcmFudGVlZCB0byBiZVxuICAgICAqIGFsbG93ZWQsIGJ1dCB3aWxsIGJlIGFza2VkIGZvciBpZiB0aGUgbmVnb3RpYXRpb24gaGFzIG5vdCBhbHJlYWR5IGhhcHBlbmVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgVGhlIHN0YXRlIGV2ZW50IHR5cGUgdG8gYXNrIGZvci5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0Q2FwYWJpbGl0eVRvUmVjZWl2ZVJvb21BY2NvdW50RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXF1ZXN0Q2FwYWJpbGl0eVRvUmVjZWl2ZVJvb21BY2NvdW50RGF0YShldmVudFR5cGUpIHtcbiAgICAgIHRoaXMucmVxdWVzdENhcGFiaWxpdHkoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eS5XaWRnZXRFdmVudENhcGFiaWxpdHkuZm9yUm9vbUFjY291bnREYXRhKF9XaWRnZXRFdmVudENhcGFiaWxpdHkuRXZlbnREaXJlY3Rpb24uUmVjZWl2ZSwgZXZlbnRUeXBlKS5yYXcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3RzIGFuIE9wZW5JRCBDb25uZWN0IHRva2VuIGZyb20gdGhlIGNsaWVudCBmb3IgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW5cbiAgICAgKiB1c2VyLiBUaGlzIHRva2VuIGNhbiBiZSB2YWxpZGF0ZWQgc2VydmVyLXNpZGUgd2l0aCB0aGUgZmVkZXJhdGlvbiBBUEkuIE5vdGVcbiAgICAgKiB0aGF0IHRoZSB3aWRnZXQgaXMgcmVzcG9uc2libGUgZm9yIHZhbGlkYXRpbmcgdGhlIHRva2VuIGFuZCBjYWNoaW5nIGFueSByZXN1bHRzXG4gICAgICogaXQgbmVlZHMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8SU9wZW5JRENyZWRlbnRpYWxzPn0gUmVzb2x2ZXMgdG8gYSB0b2tlbiBmb3IgdmVyaWZpY2F0aW9uLlxuICAgICAqIEB0aHJvd3MgVGhyb3dzIGlmIHRoZSB1c2VyIHJlamVjdGVkIHRoZSByZXF1ZXN0IG9yIHRoZSByZXF1ZXN0IGZhaWxlZC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZXF1ZXN0T3BlbklEQ29ubmVjdFRva2VuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlcXVlc3RPcGVuSURDb25uZWN0VG9rZW4oKSB7XG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIF90aGlzNC50cmFuc3BvcnQuc2VuZENvbXBsZXRlKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5HZXRPcGVuSURDcmVkZW50aWFscywge30pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdmFyIHJkYXRhID0gcmVzcG9uc2UucmVzcG9uc2U7XG4gICAgICAgICAgaWYgKHJkYXRhLnN0YXRlID09PSBfR2V0T3BlbklEQWN0aW9uLk9wZW5JRFJlcXVlc3RTdGF0ZS5BbGxvd2VkKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJkYXRhKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJkYXRhLnN0YXRlID09PSBfR2V0T3BlbklEQWN0aW9uLk9wZW5JRFJlcXVlc3RTdGF0ZS5CbG9ja2VkKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiVXNlciBkZWNsaW5lZCB0byB2ZXJpZnkgdGhlaXIgaWRlbnRpdHlcIikpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmRhdGEuc3RhdGUgPT09IF9HZXRPcGVuSURBY3Rpb24uT3BlbklEUmVxdWVzdFN0YXRlLlBlbmRpbmdVc2VyQ29uZmlybWF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlckZuID0gZnVuY3Rpb24gaGFuZGxlckZuKGV2KSB7XG4gICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gZXYuZGV0YWlsO1xuICAgICAgICAgICAgICBpZiAocmVxdWVzdC5kYXRhLm9yaWdpbmFsX3JlcXVlc3RfaWQgIT09IHJlc3BvbnNlLnJlcXVlc3RJZCkgcmV0dXJuO1xuICAgICAgICAgICAgICBpZiAocmVxdWVzdC5kYXRhLnN0YXRlID09PSBfR2V0T3BlbklEQWN0aW9uLk9wZW5JRFJlcXVlc3RTdGF0ZS5BbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LmRhdGEpO1xuICAgICAgICAgICAgICAgIF90aGlzNC50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge30pOyAvLyBhY2tcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LmRhdGEuc3RhdGUgPT09IF9HZXRPcGVuSURBY3Rpb24uT3BlbklEUmVxdWVzdFN0YXRlLkJsb2NrZWQpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiVXNlciBkZWNsaW5lZCB0byB2ZXJpZnkgdGhlaXIgaWRlbnRpdHlcIikpO1xuICAgICAgICAgICAgICAgIF90aGlzNC50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge30pOyAvLyBhY2tcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiSW52YWxpZCBzdGF0ZSBvbiByZXBseTogXCIgKyByZGF0YS5zdGF0ZSkpO1xuICAgICAgICAgICAgICAgIF90aGlzNC50cmFuc3BvcnQucmVwbHkocmVxdWVzdCwge1xuICAgICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJbnZhbGlkIHN0YXRlXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBfdGhpczQub2ZmKFwiYWN0aW9uOlwiLmNvbmNhdChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLk9wZW5JRENyZWRlbnRpYWxzKSwgaGFuZGxlckZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfdGhpczQub24oXCJhY3Rpb246XCIuY29uY2F0KF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24uT3BlbklEQ3JlZGVudGlhbHMpLCBoYW5kbGVyRm4pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiSW52YWxpZCBzdGF0ZTogXCIgKyByZGF0YS5zdGF0ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlbXCJjYXRjaFwiXShyZWplY3QpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNrcyB0aGUgY2xpZW50IGZvciBhZGRpdGlvbmFsIGNhcGFiaWxpdGllcy4gQ2FwYWJpbGl0aWVzIGNhbiBiZSBxdWV1ZWQgZm9yIHRoaXNcbiAgICAgKiByZXF1ZXN0IHdpdGggdGhlIHJlcXVlc3RDYXBhYmlsaXR5KCkgZnVuY3Rpb25zLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBSZXNvbHZlcyB3aGVuIGNvbXBsZXRlLiBOb3RlIHRoYXQgdGhlIHByb21pc2UgcmVzb2x2ZXMgd2hlblxuICAgICAqIHRoZSBjYXBhYmlsaXRpZXMgcmVxdWVzdCBoYXMgZ29uZSB0aHJvdWdoLCBub3Qgd2hlbiB0aGUgY2FwYWJpbGl0aWVzIGFyZSBhcHByb3ZlZC9kZW5pZWQuXG4gICAgICogVXNlIHRoZSBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5Ob3RpZnlDYXBhYmlsaXRpZXMgYWN0aW9uIHRvIGRldGVjdCBjaGFuZ2VzLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVJlcXVlc3RlZENhcGFiaWxpdGllc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVSZXF1ZXN0ZWRDYXBhYmlsaXRpZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDMjk3NFJlbmVnb3RpYXRlQ2FwYWJpbGl0aWVzLCB7XG4gICAgICAgIGNhcGFiaWxpdGllczogdGhpcy5yZXF1ZXN0ZWRDYXBhYmlsaXRpZXNcbiAgICAgIH0pLnRoZW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZWxsIHRoZSBjbGllbnQgdGhhdCB0aGUgY29udGVudCBoYXMgYmVlbiBsb2FkZWQuXG4gICAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gdGhlIGNsaWVudCBhY2tub3dsZWRnZXMgdGhlIHJlcXVlc3QuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZENvbnRlbnRMb2FkZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2VuZENvbnRlbnRMb2FkZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uQ29udGVudExvYWRlZCwge30pLnRoZW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIHN0aWNrZXIgdG8gdGhlIGNsaWVudC5cbiAgICAgKiBAcGFyYW0ge0lTdGlja2VyQWN0aW9uUmVxdWVzdERhdGF9IHN0aWNrZXIgVGhlIHN0aWNrZXIgdG8gc2VuZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB0aGUgY2xpZW50IGFja25vd2xlZGdlcyB0aGUgcmVxdWVzdC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJzZW5kU3RpY2tlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kU3RpY2tlcihzdGlja2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uU2VuZFN0aWNrZXIsIHN0aWNrZXIpLnRoZW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc2tzIHRoZSBjbGllbnQgdG8gc2V0IHRoZSBhbHdheXMtb24tc2NyZWVuIHN0YXR1cyBmb3IgdGhpcyB3aWRnZXQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2YWx1ZSBUaGUgbmV3IHN0YXRlIHRvIHJlcXVlc3QuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IFJlc29sdmUgd2l0aCB0cnVlIGlmIHRoZSBjbGllbnQgd2FzIGFibGUgdG8gZnVsZmlsbFxuICAgICAqIHRoZSByZXF1ZXN0LCByZXNvbHZlcyB0byBmYWxzZSBvdGhlcndpc2UuIFJlamVjdHMgaWYgYW4gZXJyb3Igb2NjdXJyZWQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwic2V0QWx3YXlzT25TY3JlZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0QWx3YXlzT25TY3JlZW4odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5VcGRhdGVBbHdheXNPblNjcmVlbiwge1xuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICByZXR1cm4gcmVzLnN1Y2Nlc3M7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyBhIG1vZGFsIHdpZGdldC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdG8gdGhlIG1vZGFsIHdpZGdldC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgd2lkZ2V0LlxuICAgICAqIEBwYXJhbSB7SU1vZGFsV2lkZ2V0T3BlblJlcXVlc3REYXRhQnV0dG9uW119IGJ1dHRvbnMgVGhlIGJ1dHRvbnMgdG8gaGF2ZSBvbiB0aGUgd2lkZ2V0LlxuICAgICAqIEBwYXJhbSB7SU1vZGFsV2lkZ2V0Q3JlYXRlRGF0YX0gZGF0YSBEYXRhIHRvIHN1cHBseSB0byB0aGUgbW9kYWwgd2lkZ2V0LlxuICAgICAqIEBwYXJhbSB7V2lkZ2V0VHlwZX0gdHlwZSBUaGUgdHlwZSBvZiBtb2RhbCB3aWRnZXQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFJlc29sdmVzIHdoZW4gdGhlIG1vZGFsIHdpZGdldCBoYXMgYmVlbiBvcGVuZWQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwib3Blbk1vZGFsV2lkZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW5Nb2RhbFdpZGdldCh1cmwsIG5hbWUpIHtcbiAgICAgIHZhciBidXR0b25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcbiAgICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcbiAgICAgIHZhciB0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiBfV2lkZ2V0VHlwZS5NYXRyaXhXaWRnZXRUeXBlLkN1c3RvbTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5PcGVuTW9kYWxXaWRnZXQsIHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGJ1dHRvbnM6IGJ1dHRvbnMsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pLnRoZW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIG1vZGFsIHdpZGdldC4gVGhlIHdpZGdldCdzIHNlc3Npb24gd2lsbCBiZSB0ZXJtaW5hdGVkIHNob3J0bHkgYWZ0ZXIuXG4gICAgICogQHBhcmFtIHtJTW9kYWxXaWRnZXRSZXR1cm5EYXRhfSBkYXRhIE9wdGlvbmFsIGRhdGEgdG8gY2xvc2UgdGhlIG1vZGFsIHdpZGdldCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSBSZXNvbHZlcyB3aGVuIGNvbXBsZXRlLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcImNsb3NlTW9kYWxXaWRnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2VNb2RhbFdpZGdldCgpIHtcbiAgICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5DbG9zZU1vZGFsV2lkZ2V0LCBkYXRhKS50aGVuKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNlbmRSb29tRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2VuZFJvb21FdmVudChldmVudFR5cGUsIGNvbnRlbnQsIHJvb21JZCwgZGVsYXksIHBhcmVudERlbGF5SWQsIHN0aWNreUR1cmF0aW9uTXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbmRFdmVudChldmVudFR5cGUsIHVuZGVmaW5lZCwgY29udGVudCwgcm9vbUlkLCBkZWxheSwgcGFyZW50RGVsYXlJZCwgc3RpY2t5RHVyYXRpb25Ncyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNlbmRTdGF0ZUV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmRTdGF0ZUV2ZW50KGV2ZW50VHlwZSwgc3RhdGVLZXksIGNvbnRlbnQsIHJvb21JZCwgZGVsYXksIHBhcmVudERlbGF5SWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbmRFdmVudChldmVudFR5cGUsIHN0YXRlS2V5LCBjb250ZW50LCByb29tSWQsIGRlbGF5LCBwYXJlbnREZWxheUlkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmRFdmVudChldmVudFR5cGUsIHN0YXRlS2V5LCBjb250ZW50LCByb29tSWQsIGRlbGF5LCBwYXJlbnREZWxheUlkLCBzdGlja3lEdXJhdGlvbk1zKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uU2VuZEV2ZW50LCBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe1xuICAgICAgICB0eXBlOiBldmVudFR5cGUsXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcbiAgICAgIH0sIHN0YXRlS2V5ICE9PSB1bmRlZmluZWQgJiYge1xuICAgICAgICBzdGF0ZV9rZXk6IHN0YXRlS2V5XG4gICAgICB9KSwgcm9vbUlkICE9PSB1bmRlZmluZWQgJiYge1xuICAgICAgICByb29tX2lkOiByb29tSWRcbiAgICAgIH0pLCBkZWxheSAhPT0gdW5kZWZpbmVkICYmIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICB9KSwgcGFyZW50RGVsYXlJZCAhPT0gdW5kZWZpbmVkICYmIHtcbiAgICAgICAgcGFyZW50X2RlbGF5X2lkOiBwYXJlbnREZWxheUlkXG4gICAgICB9KSwgc3RpY2t5RHVyYXRpb25NcyAhPT0gdW5kZWZpbmVkICYmIHtcbiAgICAgICAgc3RpY2t5X2R1cmF0aW9uX21zOiBzdGlja3lEdXJhdGlvbk1zXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGV4cGVyaW1lbnRhbCBUaGlzIGN1cnJlbnRseSByZWxpZXMgb24gYW4gdW5zdGFibGUgTVNDIChNU0M0MTU3KS5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJjYW5jZWxTY2hlZHVsZWREZWxheWVkRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuY2VsU2NoZWR1bGVkRGVsYXllZEV2ZW50KGRlbGF5SWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5NU0M0MTU3VXBkYXRlRGVsYXllZEV2ZW50LCB7XG4gICAgICAgIGRlbGF5X2lkOiBkZWxheUlkLFxuICAgICAgICBhY3Rpb246IF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uLkNhbmNlbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGV4cGVyaW1lbnRhbCBUaGlzIGN1cnJlbnRseSByZWxpZXMgb24gYW4gdW5zdGFibGUgTVNDIChNU0M0MTU3KS5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZXN0YXJ0U2NoZWR1bGVkRGVsYXllZEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc3RhcnRTY2hlZHVsZWREZWxheWVkRXZlbnQoZGVsYXlJZCkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzQxNTdVcGRhdGVEZWxheWVkRXZlbnQsIHtcbiAgICAgICAgZGVsYXlfaWQ6IGRlbGF5SWQsXG4gICAgICAgIGFjdGlvbjogX1VwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbi5VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uUmVzdGFydFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGV4cGVyaW1lbnRhbCBUaGlzIGN1cnJlbnRseSByZWxpZXMgb24gYW4gdW5zdGFibGUgTVNDIChNU0M0MTU3KS5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJzZW5kU2NoZWR1bGVkRGVsYXllZEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmRTY2hlZHVsZWREZWxheWVkRXZlbnQoZGVsYXlJZCkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzQxNTdVcGRhdGVEZWxheWVkRXZlbnQsIHtcbiAgICAgICAgZGVsYXlfaWQ6IGRlbGF5SWQsXG4gICAgICAgIGFjdGlvbjogX1VwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbi5VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24uU2VuZFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSB0by1kZXZpY2UgZXZlbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBUaGUgdHlwZSBvZiBldmVudHMgYmVpbmcgc2VudC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuY3J5cHRlZCBXaGV0aGVyIHRvIGVuY3J5cHQgdGhlIG1lc3NhZ2UgY29udGVudHMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRNYXAgQSBtYXAgZnJvbSB1c2VyIElEcyB0byBkZXZpY2UgSURzIHRvIG1lc3NhZ2UgY29udGVudHMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8SVNlbmRUb0RldmljZUZyb21XaWRnZXRSZXNwb25zZURhdGE+fSBSZXNvbHZlcyB3aGVuIGNvbXBsZXRlLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInNlbmRUb0RldmljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kVG9EZXZpY2UoZXZlbnRUeXBlLCBlbmNyeXB0ZWQsIGNvbnRlbnRNYXApIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5TZW5kVG9EZXZpY2UsIHtcbiAgICAgICAgdHlwZTogZXZlbnRUeXBlLFxuICAgICAgICBlbmNyeXB0ZWQ6IGVuY3J5cHRlZCxcbiAgICAgICAgbWVzc2FnZXM6IGNvbnRlbnRNYXBcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWFkUm9vbUFjY291bnREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWRSb29tQWNjb3VudERhdGEoZXZlbnRUeXBlLCByb29tSWRzKSB7XG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgdHlwZTogZXZlbnRUeXBlXG4gICAgICB9O1xuICAgICAgaWYgKHJvb21JZHMpIHtcbiAgICAgICAgaWYgKHJvb21JZHMuaW5jbHVkZXMoX1N5bWJvbHMuU3ltYm9scy5BbnlSb29tKSkge1xuICAgICAgICAgIGRhdGEucm9vbV9pZHMgPSBfU3ltYm9scy5TeW1ib2xzLkFueVJvb207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YS5yb29tX2lkcyA9IHJvb21JZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5CZWVwZXJSZWFkUm9vbUFjY291bnREYXRhLCBkYXRhKS50aGVuKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLmV2ZW50cztcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWFkUm9vbUV2ZW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWFkUm9vbUV2ZW50cyhldmVudFR5cGUsIGxpbWl0LCBtc2d0eXBlLCByb29tSWRzLCBzaW5jZSkge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIHR5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgbXNndHlwZTogbXNndHlwZVxuICAgICAgfTtcbiAgICAgIGlmIChsaW1pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRhdGEubGltaXQgPSBsaW1pdDtcbiAgICAgIH1cbiAgICAgIGlmIChyb29tSWRzKSB7XG4gICAgICAgIGlmIChyb29tSWRzLmluY2x1ZGVzKF9TeW1ib2xzLlN5bWJvbHMuQW55Um9vbSkpIHtcbiAgICAgICAgICBkYXRhLnJvb21faWRzID0gX1N5bWJvbHMuU3ltYm9scy5BbnlSb29tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEucm9vbV9pZHMgPSByb29tSWRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2luY2UpIHtcbiAgICAgICAgZGF0YS5zaW5jZSA9IHNpbmNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzI4NzZSZWFkRXZlbnRzLCBkYXRhKS50aGVuKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLmV2ZW50cztcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWRzIGFsbCByZWxhdGVkIGV2ZW50cyBnaXZlbiBhIGtub3duIGV2ZW50SWQuXG4gICAgICogQHBhcmFtIGV2ZW50SWQgVGhlIGlkIG9mIHRoZSBwYXJlbnQgZXZlbnQgdG8gYmUgcmVhZC5cbiAgICAgKiBAcGFyYW0gcm9vbUlkIFRoZSByb29tIHRvIGxvb2sgd2l0aGluLiBXaGVuIHVuZGVmaW5lZCwgdGhlIHVzZXIncyBjdXJyZW50bHlcbiAgICAgKiB2aWV3ZWQgcm9vbS5cbiAgICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIFRoZSByZWxhdGlvbnNoaXAgdHlwZSBvZiBjaGlsZCBldmVudHMgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBXaGVuIHVuZGVmaW5lZCwgYWxsIHJlbGF0aW9ucyBhcmUgcmV0dXJuZWQuXG4gICAgICogQHBhcmFtIGV2ZW50VHlwZSBUaGUgZXZlbnQgdHlwZSBvZiBjaGlsZCBldmVudHMgdG8gc2VhcmNoIGZvci4gV2hlbiB1bmRlZmluZWQsXG4gICAgICogYWxsIHJlbGF0ZWQgZXZlbnRzIGFyZSByZXR1cm5lZC5cbiAgICAgKiBAcGFyYW0gbGltaXQgVGhlIG1heGltdW0gbnVtYmVyIG9mIGV2ZW50cyB0byByZXRyaWV2ZSBwZXIgcm9vbS4gSWYgbm90XG4gICAgICogc3VwcGxpZWQsIHRoZSBzZXJ2ZXIgd2lsbCBhcHBseSBhIGRlZmF1bHQgbGltaXQuXG4gICAgICogQHBhcmFtIGZyb20gVGhlIHBhZ2luYXRpb24gdG9rZW4gdG8gc3RhcnQgcmV0dXJuaW5nIHJlc3VsdHMgZnJvbSwgYXNcbiAgICAgKiByZWNlaXZlZCBmcm9tIGEgcHJldmlvdXMgY2FsbC4gSWYgbm90IHN1cHBsaWVkLCByZXN1bHRzIHN0YXJ0IGF0IHRoZSBtb3N0XG4gICAgICogcmVjZW50IHRvcG9sb2dpY2FsIGV2ZW50IGtub3duIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIHRvIFRoZSBwYWdpbmF0aW9uIHRva2VuIHRvIHN0b3AgcmV0dXJuaW5nIHJlc3VsdHMgYXQuIElmIG5vdFxuICAgICAqIHN1cHBsaWVkLCByZXN1bHRzIGNvbnRpbnVlIHVwIHRvIGxpbWl0IG9yIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIFRoZSBkaXJlY3Rpb24gdG8gc2VhcmNoIGZvciBhY2NvcmRpbmcgdG8gTVNDMzcxNS5cbiAgICAgKiBAcmV0dXJucyBSZXNvbHZlcyB0byB0aGUgcm9vbSByZWxhdGlvbnMuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVhZEV2ZW50UmVsYXRpb25zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfcmVhZEV2ZW50UmVsYXRpb25zID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlKGV2ZW50SWQsIHJvb21JZCwgcmVsYXRpb25UeXBlLCBldmVudFR5cGUsIGxpbWl0LCBmcm9tLCB0bywgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciB2ZXJzaW9ucywgZGF0YTtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jb250ZXh0KSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudFZlcnNpb25zKCk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHZlcnNpb25zID0gX2NvbnRleHQuc2VudDtcbiAgICAgICAgICAgICAgaWYgKHZlcnNpb25zLmluY2x1ZGVzKF9BcGlWZXJzaW9uLlVuc3RhYmxlQXBpVmVyc2lvbi5NU0MzODY5KSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSA1O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSByZWFkX3JlbGF0aW9ucyBhY3Rpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBldmVudF9pZDogZXZlbnRJZCxcbiAgICAgICAgICAgICAgICByZWxfdHlwZTogcmVsYXRpb25UeXBlLFxuICAgICAgICAgICAgICAgIGV2ZW50X3R5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgICAgICAgICByb29tX2lkOiByb29tSWQsXG4gICAgICAgICAgICAgICAgdG86IHRvLFxuICAgICAgICAgICAgICAgIGZyb206IGZyb20sXG4gICAgICAgICAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDMzg2OVJlYWRSZWxhdGlvbnMsIGRhdGEpKTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUsIHRoaXMpO1xuICAgICAgfSkpO1xuICAgICAgZnVuY3Rpb24gcmVhZEV2ZW50UmVsYXRpb25zKF94LCBfeDIsIF94MywgX3g0LCBfeDUsIF94NiwgX3g3LCBfeDgpIHtcbiAgICAgICAgcmV0dXJuIF9yZWFkRXZlbnRSZWxhdGlvbnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWFkRXZlbnRSZWxhdGlvbnM7XG4gICAgfSgpXG4gIH0sIHtcbiAgICBrZXk6IFwicmVhZFN0YXRlRXZlbnRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWRTdGF0ZUV2ZW50cyhldmVudFR5cGUsIGxpbWl0LCBzdGF0ZUtleSwgcm9vbUlkcykge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIHR5cGU6IGV2ZW50VHlwZSxcbiAgICAgICAgc3RhdGVfa2V5OiBzdGF0ZUtleSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHN0YXRlS2V5XG4gICAgICB9O1xuICAgICAgaWYgKGxpbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGF0YS5saW1pdCA9IGxpbWl0O1xuICAgICAgfVxuICAgICAgaWYgKHJvb21JZHMpIHtcbiAgICAgICAgaWYgKHJvb21JZHMuaW5jbHVkZXMoX1N5bWJvbHMuU3ltYm9scy5BbnlSb29tKSkge1xuICAgICAgICAgIGRhdGEucm9vbV9pZHMgPSBfU3ltYm9scy5TeW1ib2xzLkFueVJvb207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YS5yb29tX2lkcyA9IHJvb21JZHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5NU0MyODc2UmVhZEV2ZW50cywgZGF0YSkudGhlbihmdW5jdGlvbiAocikge1xuICAgICAgICByZXR1cm4gci5ldmVudHM7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgYnV0dG9uIGFzIGRpc2FibGVkIG9yIGVuYWJsZWQgb24gdGhlIG1vZGFsIHdpZGdldC4gQnV0dG9ucyBhcmUgZW5hYmxlZCBieSBkZWZhdWx0LlxuICAgICAqIEBwYXJhbSB7TW9kYWxCdXR0b25JRH0gYnV0dG9uSWQgVGhlIGJ1dHRvbiBJRCB0byBlbmFibGUvZGlzYWJsZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzRW5hYmxlZCBXaGV0aGVyIG9yIG5vdCB0aGUgYnV0dG9uIGlzIGVuYWJsZWQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IFJlc29sdmVzIHdoZW4gY29tcGxldGUuXG4gICAgICogQHRocm93cyBUaHJvd3MgaWYgdGhlIGJ1dHRvbiBjYW5ub3QgYmUgZGlzYWJsZWQsIG9yIHRoZSBjbGllbnQgcmVmdXNlcyB0byBkaXNhYmxlIHRoZSBidXR0b24uXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwic2V0TW9kYWxCdXR0b25FbmFibGVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldE1vZGFsQnV0dG9uRW5hYmxlZChidXR0b25JZCwgaXNFbmFibGVkKSB7XG4gICAgICBpZiAoYnV0dG9uSWQgPT09IF9Nb2RhbFdpZGdldEFjdGlvbnMuQnVpbHRJbk1vZGFsQnV0dG9uSUQuQ2xvc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNsb3NlIGJ1dHRvbiBjYW5ub3QgYmUgZGlzYWJsZWRcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uU2V0TW9kYWxCdXR0b25FbmFibGVkLCB7XG4gICAgICAgIGJ1dHRvbjogYnV0dG9uSWQsXG4gICAgICAgIGVuYWJsZWQ6IGlzRW5hYmxlZFxuICAgICAgfSkudGhlbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIG5hdmlnYXRlIHRoZSBjbGllbnQgdG8gdGhlIGdpdmVuIFVSSS4gVGhpcyBjYW4gb25seSBiZSBjYWxsZWQgd2l0aCBNYXRyaXggVVJJc1xuICAgICAqIChjdXJyZW50bHkgb25seSBtYXRyaXgudG8sIGJ1dCBpbiBmdXR1cmUgYSBNYXRyaXggVVJJIHNjaGVtZSB3aWxsIGJlIGRlZmluZWQpLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmkgVGhlIFVSSSB0byBuYXZpZ2F0ZSB0by5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gUmVzb2x2ZXMgd2hlbiBjb21wbGV0ZS5cbiAgICAgKiBAdGhyb3dzIFRocm93cyBpZiB0aGUgVVJJIGlzIGludmFsaWQgb3IgY2Fubm90IGJlIHByb2Nlc3NlZC5cbiAgICAgKiBAZXhwZXJpbWVudGFsIFRoaXMgY3VycmVudGx5IHJlbGllcyBvbiBhbiB1bnN0YWJsZSBNU0MgKE1TQzI5MzEpLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcIm5hdmlnYXRlVG9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbmF2aWdhdGVUbyh1cmkpIHtcbiAgICAgIGlmICghdXJpIHx8ICF1cmkuc3RhcnRzV2l0aChcImh0dHBzOi8vbWF0cml4LnRvLyNcIikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBtYXRyaXgudG8gVVJJXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uLk1TQzI5MzFOYXZpZ2F0ZSwge1xuICAgICAgICB1cmk6IHVyaVxuICAgICAgfSkudGhlbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyB3YXRjaGluZyBmb3IgVFVSTiBzZXJ2ZXJzLCB5aWVsZGluZyBhbiBpbml0aWFsIHNldCBvZiBjcmVkZW50aWFscyBhcyBzb29uIGFzIHBvc3NpYmxlLFxuICAgICAqIGFuZCB0aGVyZWFmdGVyIHlpZWxkaW5nIG5ldyBjcmVkZW50aWFscyB3aGVuZXZlciB0aGUgcHJldmlvdXMgb25lcyBleHBpcmUuXG4gICAgICogQHlpZWxkcyB7SVR1cm5TZXJ2ZXJ9IFRoZSBUVVJOIHNlcnZlciBVUklzIGFuZCBjcmVkZW50aWFscyBjdXJyZW50bHkgYXZhaWxhYmxlIHRvIHRoZSB3aWRnZXQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0VHVyblNlcnZlcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VHVyblNlcnZlcnMoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgcmV0dXJuIF93cmFwQXN5bmNHZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlMygpIHtcbiAgICAgICAgdmFyIHNldFR1cm5TZXJ2ZXIsIG9uVXBkYXRlVHVyblNlcnZlcnM7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMyQoX2NvbnRleHQzKSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQzLnByZXYgPSBfY29udGV4dDMubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBvblVwZGF0ZVR1cm5TZXJ2ZXJzID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3JlZiA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTIoZXYpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlMiQoX2NvbnRleHQyKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICgxKSBzd2l0Y2ggKF9jb250ZXh0Mi5wcmV2ID0gX2NvbnRleHQyLm5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VHVyblNlcnZlcihldi5kZXRhaWwuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy50cmFuc3BvcnQucmVwbHkoZXYuZGV0YWlsLCB7fSk7XG4gICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LCBfY2FsbGVlMik7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBvblVwZGF0ZVR1cm5TZXJ2ZXJzKF94OSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yZWYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9KCk7IC8vIFN0YXJ0IGxpc3RlbmluZyBmb3IgdXBkYXRlcyBiZWZvcmUgd2UgZXZlbiBzdGFydCB3YXRjaGluZywgdG8gY2F0Y2hcbiAgICAgICAgICAgICAgLy8gVFVSTiBkYXRhIHRoYXQgaXMgc2VudCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICBfdGhpcy5vbihcImFjdGlvbjpcIi5jb25jYXQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5VcGRhdGVUdXJuU2VydmVycyksIG9uVXBkYXRlVHVyblNlcnZlcnMpO1xuXG4gICAgICAgICAgICAgIC8vIE9ubHkgc2VuZCB0aGUgJ3dhdGNoJyBhY3Rpb24gaWYgd2UgYXJlbid0IGFscmVhZHkgd2F0Y2hpbmdcbiAgICAgICAgICAgICAgaWYgKCEoX3RoaXMudHVyblNlcnZlcldhdGNoZXJzID09PSAwKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMTI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX2NvbnRleHQzLnByZXYgPSAzO1xuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDY7XG4gICAgICAgICAgICAgIHJldHVybiBfYXdhaXRBc3luY0dlbmVyYXRvcihfdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uV2F0Y2hUdXJuU2VydmVycywge30pKTtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAxMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgIF9jb250ZXh0My5wcmV2ID0gODtcbiAgICAgICAgICAgICAgX2NvbnRleHQzLnQwID0gX2NvbnRleHQzW1wiY2F0Y2hcIl0oMyk7XG4gICAgICAgICAgICAgIF90aGlzLm9mZihcImFjdGlvbjpcIi5jb25jYXQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5VcGRhdGVUdXJuU2VydmVycyksIG9uVXBkYXRlVHVyblNlcnZlcnMpO1xuICAgICAgICAgICAgICB0aHJvdyBfY29udGV4dDMudDA7XG4gICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICBfdGhpcy50dXJuU2VydmVyV2F0Y2hlcnMrKztcbiAgICAgICAgICAgICAgX2NvbnRleHQzLnByZXYgPSAxMztcbiAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgIGlmICghdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAxNztcbiAgICAgICAgICAgICAgcmV0dXJuIF9hd2FpdEFzeW5jR2VuZXJhdG9yKG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFR1cm5TZXJ2ZXIgPSByZXNvbHZlO1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjYXNlIDE3OlxuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDE5O1xuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnNlbnQ7XG4gICAgICAgICAgICBjYXNlIDE5OlxuICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDE0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjE6XG4gICAgICAgICAgICAgIF9jb250ZXh0My5wcmV2ID0gMjE7XG4gICAgICAgICAgICAgIC8vIFRoZSBsb29wIHdhcyBicm9rZW4gYnkgdGhlIGNhbGxlciAtIGNsZWFuIHVwXG4gICAgICAgICAgICAgIF90aGlzLm9mZihcImFjdGlvbjpcIi5jb25jYXQoX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5VcGRhdGVUdXJuU2VydmVycyksIG9uVXBkYXRlVHVyblNlcnZlcnMpO1xuXG4gICAgICAgICAgICAgIC8vIFNpbmNlIHNlbmRpbmcgdGhlICd1bndhdGNoJyBhY3Rpb24gd2lsbCBlbmQgdXBkYXRlcyBmb3IgYWxsIG90aGVyXG4gICAgICAgICAgICAgIC8vIGNvbnN1bWVycywgb25seSBzZW5kIGl0IGlmIHdlJ3JlIHRoZSBvbmx5IGNvbnN1bWVyIHJlbWFpbmluZ1xuICAgICAgICAgICAgICBfdGhpcy50dXJuU2VydmVyV2F0Y2hlcnMtLTtcbiAgICAgICAgICAgICAgaWYgKCEoX3RoaXMudHVyblNlcnZlcldhdGNoZXJzID09PSAwKSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgX2NvbnRleHQzLm5leHQgPSAyNztcbiAgICAgICAgICAgICAgcmV0dXJuIF9hd2FpdEFzeW5jR2VuZXJhdG9yKF90aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5VbndhdGNoVHVyblNlcnZlcnMsIHt9KSk7XG4gICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLmZpbmlzaCgyMSk7XG4gICAgICAgICAgICBjYXNlIDI4OlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUzLCBudWxsLCBbWzMsIDhdLCBbMTMsLCAyMSwgMjhdXSk7XG4gICAgICB9KSkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWFyY2ggZm9yIHVzZXJzIGluIHRoZSB1c2VyIGRpcmVjdG9yeS5cbiAgICAgKiBAcGFyYW0gc2VhcmNoVGVybSBUaGUgdGVybSB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSBsaW1pdCBUaGUgbWF4aW11bSBudW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm4uIElmIG5vdCBzdXBwbGllZCwgdGhlXG4gICAgICogQHJldHVybnMgUmVzb2x2ZXMgdG8gdGhlIHNlYXJjaCByZXN1bHRzLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInNlYXJjaFVzZXJEaXJlY3RvcnlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9zZWFyY2hVc2VyRGlyZWN0b3J5ID0gX2FzeW5jVG9HZW5lcmF0b3IoIC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3JSdW50aW1lKCkubWFyayhmdW5jdGlvbiBfY2FsbGVlNChzZWFyY2hUZXJtLCBsaW1pdCkge1xuICAgICAgICB2YXIgdmVyc2lvbnMsIGRhdGE7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlNCQoX2NvbnRleHQ0KSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQ0LnByZXYgPSBfY29udGV4dDQubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBfY29udGV4dDQubmV4dCA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudFZlcnNpb25zKCk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHZlcnNpb25zID0gX2NvbnRleHQ0LnNlbnQ7XG4gICAgICAgICAgICAgIGlmICh2ZXJzaW9ucy5pbmNsdWRlcyhfQXBpVmVyc2lvbi5VbnN0YWJsZUFwaVZlcnNpb24uTVNDMzk3MykpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDQubmV4dCA9IDU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHVzZXJfZGlyZWN0b3J5X3NlYXJjaCBhY3Rpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBzZWFyY2hfdGVybTogc2VhcmNoVGVybSxcbiAgICAgICAgICAgICAgICBsaW1pdDogbGltaXRcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0NC5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDMzk3M1VzZXJEaXJlY3RvcnlTZWFyY2gsIGRhdGEpKTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0NC5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlNCwgdGhpcyk7XG4gICAgICB9KSk7XG4gICAgICBmdW5jdGlvbiBzZWFyY2hVc2VyRGlyZWN0b3J5KF94MTAsIF94MTEpIHtcbiAgICAgICAgcmV0dXJuIF9zZWFyY2hVc2VyRGlyZWN0b3J5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VhcmNoVXNlckRpcmVjdG9yeTtcbiAgICB9KClcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNvbmZpZyBmb3IgdGhlIG1lZGlhIHJlcG9zaXRvcnkuXG4gICAgICogQHJldHVybnMgUHJvbWlzZSB3aGljaCByZXNvbHZlcyB3aXRoIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBjb25maWcuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0TWVkaWFDb25maWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9nZXRNZWRpYUNvbmZpZyA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTUoKSB7XG4gICAgICAgIHZhciB2ZXJzaW9ucywgZGF0YTtcbiAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvclJ1bnRpbWUoKS53cmFwKGZ1bmN0aW9uIF9jYWxsZWU1JChfY29udGV4dDUpIHtcbiAgICAgICAgICB3aGlsZSAoMSkgc3dpdGNoIChfY29udGV4dDUucHJldiA9IF9jb250ZXh0NS5uZXh0KSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIF9jb250ZXh0NS5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50VmVyc2lvbnMoKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgdmVyc2lvbnMgPSBfY29udGV4dDUuc2VudDtcbiAgICAgICAgICAgICAgaWYgKHZlcnNpb25zLmluY2x1ZGVzKF9BcGlWZXJzaW9uLlVuc3RhYmxlQXBpVmVyc2lvbi5NU0M0MDM5KSkge1xuICAgICAgICAgICAgICAgIF9jb250ZXh0NS5uZXh0ID0gNTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgZ2V0X21lZGlhX2NvbmZpZyBhY3Rpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgY2xpZW50LlwiKTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ1LmFicnVwdChcInJldHVyblwiLCB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5NU0M0MDM5R2V0TWVkaWFDb25maWdBY3Rpb24sIGRhdGEpKTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0NS5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlNSwgdGhpcyk7XG4gICAgICB9KSk7XG4gICAgICBmdW5jdGlvbiBnZXRNZWRpYUNvbmZpZygpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRNZWRpYUNvbmZpZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdldE1lZGlhQ29uZmlnO1xuICAgIH0oKVxuICAgIC8qKlxuICAgICAqIFVwbG9hZCBhIGZpbGUgdG8gdGhlIG1lZGlhIHJlcG9zaXRvcnkgb24gdGhlIGhvbWVzZXJ2ZXIuXG4gICAgICogQHBhcmFtIGZpbGUgLSBUaGUgb2JqZWN0IHRvIHVwbG9hZC4gU29tZXRoaW5nIHRoYXQgY2FuIGJlIHNlbnQgdG9cbiAgICAgKiAgICAgICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0LnNlbmQgKHR5cGljYWxseSBhIEZpbGUpLlxuICAgICAqIEByZXR1cm5zIFJlc29sdmVzIHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgdXBsb2FkZWQgZmlsZS5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJ1cGxvYWRGaWxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdXBsb2FkRmlsZSA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTYoZmlsZSkge1xuICAgICAgICB2YXIgdmVyc2lvbnMsIGRhdGE7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlNiQoX2NvbnRleHQ2KSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQ2LnByZXYgPSBfY29udGV4dDYubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBfY29udGV4dDYubmV4dCA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudFZlcnNpb25zKCk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHZlcnNpb25zID0gX2NvbnRleHQ2LnNlbnQ7XG4gICAgICAgICAgICAgIGlmICh2ZXJzaW9ucy5pbmNsdWRlcyhfQXBpVmVyc2lvbi5VbnN0YWJsZUFwaVZlcnNpb24uTVNDNDAzOSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDYubmV4dCA9IDU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHVwbG9hZF9maWxlIGFjdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBjbGllbnQuXCIpO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Ni5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDNDAzOVVwbG9hZEZpbGVBY3Rpb24sIGRhdGEpKTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIGNhc2UgXCJlbmRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Ni5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfY2FsbGVlNiwgdGhpcyk7XG4gICAgICB9KSk7XG4gICAgICBmdW5jdGlvbiB1cGxvYWRGaWxlKF94MTIpIHtcbiAgICAgICAgcmV0dXJuIF91cGxvYWRGaWxlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXBsb2FkRmlsZTtcbiAgICB9KClcbiAgICAvKipcbiAgICAgKiBEb3dubG9hZCBhIGZpbGUgZnJvbSB0aGUgbWVkaWEgcmVwb3NpdG9yeSBvbiB0aGUgaG9tZXNlcnZlci5cbiAgICAgKiBAcGFyYW0gY29udGVudFVyaSAtIE1YQyBVUkkgb2YgdGhlIGZpbGUgdG8gZG93bmxvYWQuXG4gICAgICogQHJldHVybnMgUmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcImRvd25sb2FkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2Rvd25sb2FkRmlsZSA9IF9hc3luY1RvR2VuZXJhdG9yKCAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yUnVudGltZSgpLm1hcmsoZnVuY3Rpb24gX2NhbGxlZTcoY29udGVudFVyaSkge1xuICAgICAgICB2YXIgdmVyc2lvbnMsIGRhdGE7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3JSdW50aW1lKCkud3JhcChmdW5jdGlvbiBfY2FsbGVlNyQoX2NvbnRleHQ3KSB7XG4gICAgICAgICAgd2hpbGUgKDEpIHN3aXRjaCAoX2NvbnRleHQ3LnByZXYgPSBfY29udGV4dDcubmV4dCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICBfY29udGV4dDcubmV4dCA9IDI7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsaWVudFZlcnNpb25zKCk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHZlcnNpb25zID0gX2NvbnRleHQ3LnNlbnQ7XG4gICAgICAgICAgICAgIGlmICh2ZXJzaW9ucy5pbmNsdWRlcyhfQXBpVmVyc2lvbi5VbnN0YWJsZUFwaVZlcnNpb24uTVNDNDAzOSkpIHtcbiAgICAgICAgICAgICAgICBfY29udGV4dDcubmV4dCA9IDU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGRvd25sb2FkX2ZpbGUgYWN0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGNsaWVudC5cIik7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgY29udGVudF91cmk6IGNvbnRlbnRVcmlcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Ny5hYnJ1cHQoXCJyZXR1cm5cIiwgdGhpcy50cmFuc3BvcnQuc2VuZChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24uTVNDNDAzOURvd25sb2FkRmlsZUFjdGlvbiwgZGF0YSkpO1xuICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgY2FzZSBcImVuZFwiOlxuICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQ3LnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWU3LCB0aGlzKTtcbiAgICAgIH0pKTtcbiAgICAgIGZ1bmN0aW9uIGRvd25sb2FkRmlsZShfeDEzKSB7XG4gICAgICAgIHJldHVybiBfZG93bmxvYWRGaWxlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZG93bmxvYWRGaWxlO1xuICAgIH0oKVxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyB0aGUgY29tbXVuaWNhdGlvbiBjaGFubmVsLiBUaGlzIHNob3VsZCBiZSBkb25lIGVhcmx5IHRvIGVuc3VyZVxuICAgICAqIHRoYXQgbWVzc2FnZXMgYXJlIG5vdCBtaXNzZWQuIENvbW11bmljYXRpb24gY2FuIG9ubHkgYmUgc3RvcHBlZCBieSB0aGUgY2xpZW50LlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInN0YXJ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG4gICAgICB0aGlzLnRyYW5zcG9ydC5zdGFydCgpO1xuICAgICAgdGhpcy5nZXRDbGllbnRWZXJzaW9ucygpLnRoZW4oZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgaWYgKHYuaW5jbHVkZXMoX0FwaVZlcnNpb24uVW5zdGFibGVBcGlWZXJzaW9uLk1TQzI5NzQpKSB7XG4gICAgICAgICAgX3RoaXM1LnN1cHBvcnRzTVNDMjk3NFJlbmVnb3RpYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZU1lc3NhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldikge1xuICAgICAgdmFyIGFjdGlvbkV2ID0gbmV3IEN1c3RvbUV2ZW50KFwiYWN0aW9uOlwiLmNvbmNhdChldi5kZXRhaWwuYWN0aW9uKSwge1xuICAgICAgICBkZXRhaWw6IGV2LmRldGFpbCxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmVtaXQoXCJhY3Rpb246XCIuY29uY2F0KGV2LmRldGFpbC5hY3Rpb24pLCBhY3Rpb25Fdik7XG4gICAgICBpZiAoIWFjdGlvbkV2LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgc3dpdGNoIChldi5kZXRhaWwuYWN0aW9uKSB7XG4gICAgICAgICAgY2FzZSBfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLlN1cHBvcnRlZEFwaVZlcnNpb25zOlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbHlWZXJzaW9ucyhldi5kZXRhaWwpO1xuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5DYXBhYmlsaXRpZXM6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDYXBhYmlsaXRpZXMoZXYuZGV0YWlsKTtcbiAgICAgICAgICBjYXNlIF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24uVXBkYXRlVmlzaWJpbGl0eTpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5yZXBseShldi5kZXRhaWwsIHt9KTtcbiAgICAgICAgICAvLyBhY2sgdG8gYXZvaWQgZXJyb3Igc3BhbVxuICAgICAgICAgIGNhc2UgX1dpZGdldEFwaUFjdGlvbi5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbi5Ob3RpZnlDYXBhYmlsaXRpZXM6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQucmVwbHkoZXYuZGV0YWlsLCB7fSk7XG4gICAgICAgICAgLy8gYWNrIHRvIGF2b2lkIGVycm9yIHNwYW1cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnJlcGx5KGV2LmRldGFpbCwge1xuICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVW5rbm93biBvciB1bnN1cHBvcnRlZCB0by13aWRnZXQgYWN0aW9uOiBcIiArIGV2LmRldGFpbC5hY3Rpb25cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVwbHlWZXJzaW9uc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZXBseVZlcnNpb25zKHJlcXVlc3QpIHtcbiAgICAgIHRoaXMudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgc3VwcG9ydGVkX3ZlcnNpb25zOiBfQXBpVmVyc2lvbi5DdXJyZW50QXBpVmVyc2lvbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRDbGllbnRWZXJzaW9uc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDbGllbnRWZXJzaW9ucygpIHtcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jYWNoZWRDbGllbnRWZXJzaW9ucykpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmNhY2hlZENsaWVudFZlcnNpb25zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5zZW5kKF9XaWRnZXRBcGlBY3Rpb24uV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbi5TdXBwb3J0ZWRBcGlWZXJzaW9ucywge30pLnRoZW4oZnVuY3Rpb24gKHIpIHtcbiAgICAgICAgX3RoaXM2LmNhY2hlZENsaWVudFZlcnNpb25zID0gci5zdXBwb3J0ZWRfdmVyc2lvbnM7XG4gICAgICAgIHJldHVybiByLnN1cHBvcnRlZF92ZXJzaW9ucztcbiAgICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwibm9uLWZhdGFsIGVycm9yIGdldHRpbmcgc3VwcG9ydGVkIGNsaWVudCB2ZXJzaW9uczogXCIsIGUpO1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFuZGxlQ2FwYWJpbGl0aWVzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUNhcGFiaWxpdGllcyhyZXF1ZXN0KSB7XG4gICAgICB2YXIgX3RoaXM3ID0gdGhpcztcbiAgICAgIGlmICh0aGlzLmNhcGFiaWxpdGllc0ZpbmlzaGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5yZXBseShyZXF1ZXN0LCB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ2FwYWJpbGl0eSBuZWdvdGlhdGlvbiBhbHJlYWR5IGNvbXBsZXRlZFwiXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gU2VlIGlmIHdlIGNhbiBleHBlY3QgYSBjYXBhYmlsaXRpZXMgbm90aWZpY2F0aW9uIG9yIG5vdFxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xpZW50VmVyc2lvbnMoKS50aGVuKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIGlmICh2LmluY2x1ZGVzKF9BcGlWZXJzaW9uLlVuc3RhYmxlQXBpVmVyc2lvbi5NU0MyODcxKSkge1xuICAgICAgICAgIF90aGlzNy5vbmNlKFwiYWN0aW9uOlwiLmNvbmNhdChfV2lkZ2V0QXBpQWN0aW9uLldpZGdldEFwaVRvV2lkZ2V0QWN0aW9uLk5vdGlmeUNhcGFiaWxpdGllcyksIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgX3RoaXM3LmFwcHJvdmVkQ2FwYWJpbGl0aWVzID0gZXYuZGV0YWlsLmRhdGEuYXBwcm92ZWQ7XG4gICAgICAgICAgICBfdGhpczcuZW1pdChcInJlYWR5XCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGlmIHdlIGNhbid0IGV4cGVjdCBub3RpZmljYXRpb24sIHdlJ3JlIGFzIGRvbmUgYXMgd2UgY2FuIGJlXG4gICAgICAgICAgX3RoaXM3LmVtaXQoXCJyZWFkeVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluIGVpdGhlciBjYXNlLCByZXBseSB0byB0aGF0IGNhcGFiaWxpdGllcyByZXF1ZXN0XG4gICAgICAgIF90aGlzNy5jYXBhYmlsaXRpZXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBfdGhpczcudHJhbnNwb3J0LnJlcGx5KHJlcXVlc3QsIHtcbiAgICAgICAgICBjYXBhYmlsaXRpZXM6IF90aGlzNy5yZXF1ZXN0ZWRDYXBhYmlsaXRpZXNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFdpZGdldEFwaTtcbn0oX2V2ZW50cy5FdmVudEVtaXR0ZXIpO1xuZXhwb3J0cy5XaWRnZXRBcGkgPSBXaWRnZXRBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1XaWRnZXRBcGkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLldpZGdldERyaXZlciA9IHZvaWQgMDtcbnZhciBfID0gcmVxdWlyZShcIi4uXCIpO1xuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH0sIF90eXBlb2Yob2JqKTsgfVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgX3RvUHJvcGVydHlLZXkoZGVzY3JpcHRvci5rZXkpLCBkZXNjcmlwdG9yKTsgfSB9XG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwgeyB3cml0YWJsZTogZmFsc2UgfSk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7IHZhciBrZXkgPSBfdG9QcmltaXRpdmUoYXJnLCBcInN0cmluZ1wiKTsgcmV0dXJuIF90eXBlb2Yoa2V5KSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKF90eXBlb2YoaW5wdXQpICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKF90eXBlb2YocmVzKSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJlczsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkBAdG9QcmltaXRpdmUgbXVzdCByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUuXCIpOyB9IHJldHVybiAoaGludCA9PT0gXCJzdHJpbmdcIiA/IFN0cmluZyA6IE51bWJlcikoaW5wdXQpOyB9IC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQ29weXJpZ2h0IDIwMjAgLSAyMDI0IFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZnVuY3Rpb25zIGFuZCBiZWhhdmlvdXIgdGhlIHdpZGdldC1hcGkgaXMgdW5hYmxlIHRvXG4gKiBkbywgc3VjaCBhcyBwcm9tcHRpbmcgdGhlIHVzZXIgZm9yIGluZm9ybWF0aW9uIG9yIGludGVyYWN0aW5nIHdpdGhcbiAqIHRoZSBVSS4gQ2xpZW50cyBhcmUgZXhwZWN0ZWQgdG8gaW1wbGVtZW50IHRoaXMgY2xhc3MgYW5kIG92ZXJyaWRlXG4gKiBhbnkgZnVuY3Rpb25zIHRoZXkgbmVlZC93YW50IHRvIHN1cHBvcnQuXG4gKlxuICogVGhpcyBjbGFzcyBhc3N1bWVzIHRoZSBjbGllbnQgd2lsbCBoYXZlIGEgY29udGV4dCBvZiBhIFdpZGdldFxuICogaW5zdGFuY2UgYWxyZWFkeS5cbiAqL1xudmFyIFdpZGdldERyaXZlciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFdpZGdldERyaXZlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2lkZ2V0RHJpdmVyKTtcbiAgfVxuICBfY3JlYXRlQ2xhc3MoV2lkZ2V0RHJpdmVyLCBbe1xuICAgIGtleTogXCJ2YWxpZGF0ZUNhcGFiaWxpdGllc1wiLFxuICAgIHZhbHVlOlxuICAgIC8qKlxuICAgICAqIFZlcmlmaWVzIHRoZSB3aWRnZXQncyByZXF1ZXN0ZWQgY2FwYWJpbGl0aWVzLCByZXR1cm5pbmcgdGhlIG9uZXNcbiAgICAgKiBpdCBpcyBhcHByb3ZlZCB0byB1c2UuIE11dGF0aW5nIHRoZSByZXF1ZXN0ZWQgY2FwYWJpbGl0aWVzIHdpbGxcbiAgICAgKiBoYXZlIG5vIGVmZmVjdC5cbiAgICAgKlxuICAgICAqIFRoaXMgU0hPVUxEIHJlc3VsdCBpbiB0aGUgdXNlciBiZWluZyBwcm9tcHRlZCB0byBhcHByb3ZlL2RlbnlcbiAgICAgKiBjYXBhYmlsaXRpZXMuXG4gICAgICpcbiAgICAgKiBCeSBkZWZhdWx0IHRoaXMgcmVqZWN0cyBhbGwgY2FwYWJpbGl0aWVzIChyZXR1cm5zIGFuIGVtcHR5IHNldCkuXG4gICAgICogQHBhcmFtIHtTZXQ8Q2FwYWJpbGl0eT59IHJlcXVlc3RlZCBUaGUgc2V0IG9mIHJlcXVlc3RlZCBjYXBhYmlsaXRpZXMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8U2V0PENhcGFiaWxpdHk+Pn0gUmVzb2x2ZXMgdG8gdGhlIGFsbG93ZWQgY2FwYWJpbGl0aWVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlQ2FwYWJpbGl0aWVzKHJlcXVlc3RlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgU2V0KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmRzIGFuIGV2ZW50IGludG8gYSByb29tLiBJZiBgcm9vbUlkYCBpcyBmYWxzeSwgdGhlIGNsaWVudCBzaG91bGQgc2VuZCB0aGUgZXZlbnRcbiAgICAgKiBpbnRvIHRoZSByb29tIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBsb29raW5nIGF0LiBUaGUgd2lkZ2V0IEFQSSB3aWxsIGhhdmUgYWxyZWFkeVxuICAgICAqIHZlcmlmaWVkIHRoYXQgdGhlIHdpZGdldCBpcyBjYXBhYmxlIG9mIHNlbmRpbmcgdGhlIGV2ZW50IHRvIHRoYXQgcm9vbS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFRoZSBldmVudCB0eXBlIHRvIGJlIHNlbnQuXG4gICAgICogQHBhcmFtIHsqfSBjb250ZW50IFRoZSBjb250ZW50IGZvciB0aGUgZXZlbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbH0gc3RhdGVLZXkgVGhlIHN0YXRlIGtleSBpZiB0aGlzIGlzIGEgc3RhdGUgZXZlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgICAqIE1heSBiZSBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbH0gcm9vbUlkIFRoZSByb29tIElEIHRvIHNlbmQgdGhlIGV2ZW50IHRvLiBJZiBmYWxzeSwgdGhlIHJvb20gdGhlXG4gICAgICogdXNlciBpcyBjdXJyZW50bHkgbG9va2luZyBhdC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxJU2VuZEV2ZW50RGV0YWlscz59IFJlc29sdmVzIHdoZW4gdGhlIGV2ZW50IGhhcyBiZWVuIHNlbnQgd2l0aFxuICAgICAqIGRldGFpbHMgb2YgdGhhdCBldmVudC5cbiAgICAgKiBAdGhyb3dzIFJlamVjdGVkIHdoZW4gdGhlIGV2ZW50IGNvdWxkIG5vdCBiZSBzZW50LlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInNlbmRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kRXZlbnQoZXZlbnRUeXBlLCBjb250ZW50KSB7XG4gICAgICB2YXIgc3RhdGVLZXkgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IG51bGw7XG4gICAgICB2YXIgcm9vbUlkID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBudWxsO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkZhaWxlZCB0byBvdmVycmlkZSBmdW5jdGlvblwiKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGV4cGVyaW1lbnRhbCBQYXJ0IG9mIE1TQzQ0MDdcbiAgICAgKiBTZW5kcyBhIHN0aWNreSBldmVudCBpbnRvIGEgcm9vbS4gSWYgYHJvb21JZGAgaXMgZmFsc3ksIHRoZSBjbGllbnQgc2hvdWxkIHNlbmQgdGhlIGV2ZW50XG4gICAgICogaW50byB0aGUgcm9vbSB0aGUgdXNlciBpcyBjdXJyZW50bHkgbG9va2luZyBhdC4gVGhlIHdpZGdldCBBUEkgd2lsbCBoYXZlIGFscmVhZHlcbiAgICAgKiB2ZXJpZmllZCB0aGF0IHRoZSB3aWRnZXQgaXMgY2FwYWJsZSBvZiBzZW5kaW5nIHRoZSBldmVudCB0byB0aGF0IHJvb20uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0aWNreUR1cmF0aW9uTXMgVGhlIGxlbmd0aCBvZiB0aW1lIGEgc3RpY2t5IGV2ZW50IG1heSByZW1haW4gc3RpY2t5LCBpbiBtaWxsaXNlY29uZHMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBUaGUgZXZlbnQgdHlwZSB0byBiZSBzZW50LlxuICAgICAqIEBwYXJhbSB7Kn0gY29udGVudCBUaGUgY29udGVudCBmb3IgdGhlIGV2ZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IHJvb21JZCBUaGUgcm9vbSBJRCB0byBzZW5kIHRoZSBldmVudCB0by4gSWYgZmFsc3ksIHRoZSByb29tIHRoZVxuICAgICAqIHVzZXIgaXMgY3VycmVudGx5IGxvb2tpbmcgYXQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8SVNlbmRFdmVudERldGFpbHM+fSBSZXNvbHZlcyB3aGVuIHRoZSBldmVudCBoYXMgYmVlbiBzZW50IHdpdGhcbiAgICAgKiBkZXRhaWxzIG9mIHRoYXQgZXZlbnQuXG4gICAgICogQHRocm93cyBSZWplY3RlZCB3aGVuIHRoZSBldmVudCBjb3VsZCBub3QgYmUgc2VudC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJzZW5kU3RpY2t5RXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2VuZFN0aWNreUV2ZW50KHN0aWNreUR1cmF0aW9uTXMsIGV2ZW50VHlwZSwgY29udGVudCkge1xuICAgICAgdmFyIHJvb21JZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBleHBlcmltZW50YWwgUGFydCBvZiBNU0M0MTQwICYgTVNDNDE1N1xuICAgICAqIFNlbmRzIGEgZGVsYXllZCBldmVudCBpbnRvIGEgcm9vbS4gSWYgYHJvb21JZGAgaXMgZmFsc3ksIHRoZSBjbGllbnQgc2hvdWxkIHNlbmQgaXRcbiAgICAgKiBpbnRvIHRoZSByb29tIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBsb29raW5nIGF0LiBUaGUgd2lkZ2V0IEFQSSB3aWxsIGhhdmUgYWxyZWFkeVxuICAgICAqIHZlcmlmaWVkIHRoYXQgdGhlIHdpZGdldCBpcyBjYXBhYmxlIG9mIHNlbmRpbmcgdGhlIGV2ZW50IHRvIHRoYXQgcm9vbS5cbiAgICAgKiBAcGFyYW0ge251bWJlcnxudWxsfSBkZWxheSBIb3cgbXVjaCBsYXRlciB0byBzZW5kIHRoZSBldmVudCwgb3IgbnVsbCB0byBub3Qgc2VuZCB0aGVcbiAgICAgKiBldmVudCBhdXRvbWF0aWNhbGx5LiBNYXkgbm90IGJlIG51bGwgaWYge0BsaW5rIHBhcmVudERlbGF5SWR9IGlzIG51bGwuXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbH0gcGFyZW50RGVsYXlJZCBUaGUgSUQgb2YgdGhlIGRlbGF5ZWQgZXZlbnQgdGhpcyBvbmUgaXMgZ3JvdXBlZCB3aXRoLFxuICAgICAqIG9yIG51bGwgaWYgaXQgd2lsbCBiZSBwdXQgaW4gYSBuZXcgZ3JvdXAuIE1heSBub3QgYmUgbnVsbCBpZiB7QGxpbmsgZGVsYXl9IGlzIG51bGwuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBUaGUgZXZlbnQgdHlwZSBvZiB0aGUgZXZlbnQgdG8gYmUgc2VudC5cbiAgICAgKiBAcGFyYW0geyp9IGNvbnRlbnQgVGhlIGNvbnRlbnQgZm9yIHRoZSBldmVudCB0byBiZSBzZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IHN0YXRlS2V5IFRoZSBzdGF0ZSBrZXkgaWYgdGhlIGV2ZW50IHRvIGJlIHNlbnQgYSBzdGF0ZSBldmVudCxcbiAgICAgKiBvdGhlcndpc2UgbnVsbC4gTWF5IGJlIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSByb29tSWQgVGhlIHJvb20gSUQgdG8gc2VuZCB0aGUgZXZlbnQgdG8uIElmIGZhbHN5LCB0aGUgcm9vbSB0aGVcbiAgICAgKiB1c2VyIGlzIGN1cnJlbnRseSBsb29raW5nIGF0LlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPElTZW5kRGVsYXllZEV2ZW50RGV0YWlscz59IFJlc29sdmVzIHdoZW4gdGhlIGRlbGF5ZWQgZXZlbnQgaGFzIGJlZW5cbiAgICAgKiBwcmVwYXJlZCB3aXRoIGRldGFpbHMgb2YgaG93IHRvIHJlZmVyIHRvIGl0IGZvciB1cGRhdGluZy9zZW5kaW5nL2NhbmNlbGluZyBpdCBsYXRlci5cbiAgICAgKiBAdGhyb3dzIFJlamVjdGVkIHdoZW4gdGhlIGRlbGF5ZWQgZXZlbnQgY291bGQgbm90IGJlIHNlbnQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZERlbGF5ZWRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kRGVsYXllZEV2ZW50KGRlbGF5LCBwYXJlbnREZWxheUlkLCBldmVudFR5cGUsIGNvbnRlbnQpIHtcbiAgICAgIHZhciBzdGF0ZUtleSA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogbnVsbDtcbiAgICAgIHZhciByb29tSWQgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IG51bGw7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiRmFpbGVkIHRvIG92ZXJyaWRlIGZ1bmN0aW9uXCIpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZXhwZXJpbWVudGFsIFBhcnQgb2YgTVNDNDE0MCwgTVNDNDE1NyBhbmQgTVNDNDQwN1xuICAgICAqIFNlbmRzIGEgZGVsYXllZCBzdGlja3kgZXZlbnQgaW50byBhIHJvb20uIElmIGByb29tSWRgIGlzIGZhbHN5LCB0aGUgY2xpZW50IHNob3VsZCBzZW5kIHRoZSBldmVudFxuICAgICAqIGludG8gdGhlIHJvb20gdGhlIHVzZXIgaXMgY3VycmVudGx5IGxvb2tpbmcgYXQuIFRoZSB3aWRnZXQgQVBJIHdpbGwgaGF2ZSBhbHJlYWR5XG4gICAgICogdmVyaWZpZWQgdGhhdCB0aGUgd2lkZ2V0IGlzIGNhcGFibGUgb2Ygc2VuZGluZyB0aGUgZXZlbnQgdG8gdGhhdCByb29tLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGlja3lEdXJhdGlvbk1zIFRoZSBsZW5ndGggb2YgdGltZSBhIHN0aWNreSBldmVudCBtYXkgcmVtYWluIHN0aWNreSwgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfG51bGx9IGRlbGF5IEhvdyBtdWNoIGxhdGVyIHRvIHNlbmQgdGhlIGV2ZW50LCBvciBudWxsIHRvIG5vdCBzZW5kIHRoZVxuICAgICAqIGV2ZW50IGF1dG9tYXRpY2FsbHkuIE1heSBub3QgYmUgbnVsbCBpZiB7QGxpbmsgcGFyZW50RGVsYXlJZH0gaXMgbnVsbC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBwYXJlbnREZWxheUlkIFRoZSBJRCBvZiB0aGUgZGVsYXllZCBldmVudCB0aGlzIG9uZSBpcyBncm91cGVkIHdpdGgsXG4gICAgICogb3IgbnVsbCBpZiBpdCB3aWxsIGJlIHB1dCBpbiBhIG5ldyBncm91cC4gTWF5IG5vdCBiZSBudWxsIGlmIHtAbGluayBkZWxheX0gaXMgbnVsbC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIFRoZSBldmVudCB0eXBlIHRvIGJlIHNlbnQuXG4gICAgICogQHBhcmFtIHsqfSBjb250ZW50IFRoZSBjb250ZW50IGZvciB0aGUgZXZlbnQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbH0gcm9vbUlkIFRoZSByb29tIElEIHRvIHNlbmQgdGhlIGV2ZW50IHRvLiBJZiBmYWxzeSwgdGhlIHJvb20gdGhlXG4gICAgICogdXNlciBpcyBjdXJyZW50bHkgbG9va2luZyBhdC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxJU2VuZERlbGF5ZWRFdmVudERldGFpbHM+fSBSZXNvbHZlcyB3aGVuIHRoZSBldmVudCBoYXMgYmVlbiBzZW50IHdpdGhcbiAgICAgKiBkZXRhaWxzIG9mIHRoYXQgZXZlbnQuXG4gICAgICogQHRocm93cyBSZWplY3RlZCB3aGVuIHRoZSBldmVudCBjb3VsZCBub3QgYmUgc2VudC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJzZW5kRGVsYXllZFN0aWNreUV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmREZWxheWVkU3RpY2t5RXZlbnQoZGVsYXksIHBhcmVudERlbGF5SWQsIHN0aWNreUR1cmF0aW9uTXMsIGV2ZW50VHlwZSwgY29udGVudCkge1xuICAgICAgdmFyIHJvb21JZCA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogbnVsbDtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBleHBlcmltZW50YWwgUGFydCBvZiBNU0M0MTQwICYgTVNDNDE1N1xuICAgICAqIENhbmNlbCB0aGUgc2NoZWR1bGVkIGRlbGl2ZXJ5IG9mIHRoZSBkZWxheWVkIGV2ZW50IG1hdGNoaW5nIHRoZSBwcm92aWRlZCB7QGxpbmsgZGVsYXlJZH0uXG4gICAgICogQHRocm93cyBSZWplY3RlZCB3aGVuIHRoZXJlIGlzIG5vIG1hdGNoaW5nIGRlbGF5ZWQgZXZlbnQsXG4gICAgICogb3Igd2hlbiB0aGUgZGVsYXllZCBldmVudCBmYWlsZWQgdG8gYmUgY2FuY2VsbGVkLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcImNhbmNlbFNjaGVkdWxlZERlbGF5ZWRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxTY2hlZHVsZWREZWxheWVkRXZlbnQoZGVsYXlJZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkZhaWxlZCB0byBvdmVycmlkZSBmdW5jdGlvblwiKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGV4cGVyaW1lbnRhbCBQYXJ0IG9mIE1TQzQxNDAgJiBNU0M0MTU3XG4gICAgICogUmVzdGFydCB0aGUgc2NoZWR1bGVkIGRlbGl2ZXJ5IG9mIHRoZSBkZWxheWVkIGV2ZW50IG1hdGNoaW5nIHRoZSBwcm92aWRlZCB7QGxpbmsgZGVsYXlJZH0uXG4gICAgICogQHRocm93cyBSZWplY3RlZCB3aGVuIHRoZXJlIGlzIG5vIG1hdGNoaW5nIGRlbGF5ZWQgZXZlbnQsXG4gICAgICogb3Igd2hlbiB0aGUgZGVsYXllZCBldmVudCBmYWlsZWQgdG8gYmUgcmVzdGFydGVkLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJlc3RhcnRTY2hlZHVsZWREZWxheWVkRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzdGFydFNjaGVkdWxlZERlbGF5ZWRFdmVudChkZWxheUlkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiRmFpbGVkIHRvIG92ZXJyaWRlIGZ1bmN0aW9uXCIpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZXhwZXJpbWVudGFsIFBhcnQgb2YgTVNDNDE0MCAmIE1TQzQxNTdcbiAgICAgKiBJbW1lZGlhdGVseSBzZW5kIHRoZSBkZWxheWVkIGV2ZW50IG1hdGNoaW5nIHRoZSBwcm92aWRlZCB7QGxpbmsgZGVsYXlJZH0sXG4gICAgICogaW5zdGVhZCBvZiB3YWl0aW5nIGZvciBpdHMgc2NoZWR1bGVkIGRlbGl2ZXJ5LlxuICAgICAqIEB0aHJvd3MgUmVqZWN0ZWQgd2hlbiB0aGVyZSBpcyBubyBtYXRjaGluZyBkZWxheWVkIGV2ZW50LFxuICAgICAqIG9yIHdoZW4gdGhlIGRlbGF5ZWQgZXZlbnQgZmFpbGVkIHRvIGJlIHNlbnQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZFNjaGVkdWxlZERlbGF5ZWRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kU2NoZWR1bGVkRGVsYXllZEV2ZW50KGRlbGF5SWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJGYWlsZWQgdG8gb3ZlcnJpZGUgZnVuY3Rpb25cIikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgdG8tZGV2aWNlIGV2ZW50LiBUaGUgd2lkZ2V0IEFQSSB3aWxsIGhhdmUgYWxyZWFkeSB2ZXJpZmllZCB0aGF0IHRoZSB3aWRnZXRcbiAgICAgKiBpcyBjYXBhYmxlIG9mIHNlbmRpbmcgdGhlIGV2ZW50LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgVGhlIGV2ZW50IHR5cGUgdG8gYmUgc2VudC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuY3J5cHRlZCBXaGV0aGVyIHRvIGVuY3J5cHQgdGhlIG1lc3NhZ2UgY29udGVudHMuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRNYXAgQSBtYXAgZnJvbSB1c2VyIElEIGFuZCBkZXZpY2UgSUQgdG8gZXZlbnQgY29udGVudC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gUmVzb2x2ZXMgd2hlbiB0aGUgZXZlbnQgaGFzIGJlZW4gc2VudC5cbiAgICAgKiBAdGhyb3dzIFJlamVjdGVkIHdoZW4gdGhlIGV2ZW50IGNvdWxkIG5vdCBiZSBzZW50LlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInNlbmRUb0RldmljZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kVG9EZXZpY2UoZXZlbnRUeXBlLCBlbmNyeXB0ZWQsIGNvbnRlbnRNYXApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJGYWlsZWQgdG8gb3ZlcnJpZGUgZnVuY3Rpb25cIikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWRzIGFuIGVsZW1lbnQgb2Ygcm9vbSBhY2NvdW50IGRhdGEuIFRoZSB3aWRnZXQgQVBJIHdpbGwgaGF2ZSBhbHJlYWR5IHZlcmlmaWVkIHRoYXQgdGhlIHdpZGdldCBpc1xuICAgICAqIGNhcGFibGUgb2YgcmVjZWl2aW5nIHRoZSBgZXZlbnRUeXBlYCBvZiB0aGUgcmVxdWVzdGVkIGluZm9ybWF0aW9uLiBJZiBgcm9vbUlkc2AgaXMgc3VwcGxpZWQsIGl0IG1heVxuICAgICAqIGNvbnRhaW4gYFN5bWJvbHMuQW55Um9vbWAgdG8gZGVub3RlIHRoYXQgdGhlIHBpZWNlIG9mIHJvb20gYWNjb3VudCBkYXRhIGluIGVhY2ggb2YgdGhlIGNsaWVudCdzIGtub3duXG4gICAgICogcm9vbXMgc2hvdWxkIGJlIHJldHVybmVkLiBXaGVuIGBudWxsYCwgb25seSB0aGUgcm9vbSB0aGUgdXNlciBpcyBjdXJyZW50bHkgbG9va2luZyBhdCBzaG91bGQgYmUgY29uc2lkZXJlZC5cbiAgICAgKiBAcGFyYW0gZXZlbnRUeXBlIFRoZSBldmVudCB0eXBlIHRvIGJlIHJlYWQuXG4gICAgICogQHBhcmFtIHJvb21JZHMgV2hlbiBudWxsLCB0aGUgdXNlcidzIGN1cnJlbnRseSB2aWV3ZWQgcm9vbS4gT3RoZXJ3aXNlLCB0aGUgbGlzdCBvZiByb29tIElEc1xuICAgICAqIHRvIGxvb2sgd2l0aGluLCBwb3NzaWJseSBjb250YWluaW5nIFN5bWJvbHMuQW55Um9vbSB0byBkZW5vdGUgYWxsIGtub3duIHJvb21zLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPElSb29tQWNjb3VudERhdGFbXT59IFJlc29sdmVzIHRvIHRoZSBlbGVtZW50IG9mIHJvb20gYWNjb3VudCBkYXRhLCBvciBhbiBlbXB0eSBhcnJheS5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZWFkUm9vbUFjY291bnREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWRSb29tQWNjb3VudERhdGEoZXZlbnRUeXBlKSB7XG4gICAgICB2YXIgcm9vbUlkcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWRzIGFsbCBldmVudHMgb2YgdGhlIGdpdmVuIHR5cGUsIGFuZCBvcHRpb25hbGx5IGBtc2d0eXBlYCAoaWYgYXBwbGljYWJsZS9kZWZpbmVkKSxcbiAgICAgKiB0aGUgdXNlciBoYXMgYWNjZXNzIHRvLiBUaGUgd2lkZ2V0IEFQSSB3aWxsIGhhdmUgYWxyZWFkeSB2ZXJpZmllZCB0aGF0IHRoZSB3aWRnZXQgaXNcbiAgICAgKiBjYXBhYmxlIG9mIHJlY2VpdmluZyB0aGUgZXZlbnRzLiBMZXNzIGV2ZW50cyB0aGFuIHRoZSBsaW1pdCBhcmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCxcbiAgICAgKiBidXQgbm90IG1vcmUuIElmIGByb29tSWRzYCBpcyBzdXBwbGllZCwgaXQgbWF5IGNvbnRhaW4gYFN5bWJvbHMuQW55Um9vbWAgdG8gZGVub3RlIHRoYXRcbiAgICAgKiBgbGltaXRgIGluIGVhY2ggb2YgdGhlIGNsaWVudCdzIGtub3duIHJvb21zIHNob3VsZCBiZSByZXR1cm5lZC4gV2hlbiBgbnVsbGAsIG9ubHkgdGhlXG4gICAgICogcm9vbSB0aGUgdXNlciBpcyBjdXJyZW50bHkgbG9va2luZyBhdCBzaG91bGQgYmUgY29uc2lkZXJlZC4gSWYgYHNpbmNlYCBpcyBzcGVjaWZpZWQgYnV0XG4gICAgICogdGhlIGV2ZW50IElEIGlzbid0IHByZXNlbnQgaW4gdGhlIG51bWJlciBvZiBldmVudHMgZmV0Y2hlZCBieSB0aGUgY2xpZW50IGR1ZSB0byBgbGltaXRgLFxuICAgICAqIHRoZSBjbGllbnQgd2lsbCByZXR1cm4gYWxsIHRoZSBldmVudHMuXG4gICAgICogQHBhcmFtIGV2ZW50VHlwZSBUaGUgZXZlbnQgdHlwZSB0byBiZSByZWFkLlxuICAgICAqIEBwYXJhbSBtc2d0eXBlIFRoZSBtc2d0eXBlIG9mIHRoZSBldmVudHMgdG8gYmUgcmVhZCwgaWYgYXBwbGljYWJsZS9kZWZpbmVkLlxuICAgICAqIEBwYXJhbSBzdGF0ZUtleSBUaGUgc3RhdGUga2V5IG9mIHRoZSBldmVudHMgdG8gYmUgcmVhZCwgaWYgYXBwbGljYWJsZS9kZWZpbmVkLlxuICAgICAqIEBwYXJhbSBsaW1pdCBUaGUgbWF4aW11bSBudW1iZXIgb2YgZXZlbnRzIHRvIHJldHJpZXZlIHBlciByb29tLiBXaWxsIGJlIHplcm8gdG8gZGVub3RlIFwiYXMgbWFueVxuICAgICAqIGFzIHBvc3NpYmxlXCIuXG4gICAgICogQHBhcmFtIHJvb21JZHMgV2hlbiBudWxsLCB0aGUgdXNlcidzIGN1cnJlbnRseSB2aWV3ZWQgcm9vbS4gT3RoZXJ3aXNlLCB0aGUgbGlzdCBvZiByb29tIElEc1xuICAgICAqIHRvIGxvb2sgd2l0aGluLCBwb3NzaWJseSBjb250YWluaW5nIFN5bWJvbHMuQW55Um9vbSB0byBkZW5vdGUgYWxsIGtub3duIHJvb21zLlxuICAgICAqIEBwYXJhbSBzaW5jZSBXaGVuIG51bGwsIHJldHJpZXZlcyB0aGUgbnVtYmVyIG9mIGV2ZW50cyBzcGVjaWZpZWQgYnkgdGhlIFwibGltaXRcIiBwYXJhbWV0ZXIuXG4gICAgICogT3RoZXJ3aXNlLCB0aGUgZXZlbnQgSUQgYXQgd2hpY2ggb25seSBzdWJzZXF1ZW50IGV2ZW50cyB3aWxsIGJlIHJldHVybmVkLCBhcyBtYW55IGFzIHNwZWNpZmllZFxuICAgICAqIGluIFwibGltaXRcIi5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxJUm9vbUV2ZW50W10+fSBSZXNvbHZlcyB0byB0aGUgcm9vbSBldmVudHMsIG9yIGFuIGVtcHR5IGFycmF5LlxuICAgICAqIEBkZXByZWNhdGVkIENsaWVudHMgYXJlIGFkdmlzZWQgdG8gaW1wbGVtZW50IHtAbGluayBXaWRnZXREcml2ZXIucmVhZFJvb21UaW1lbGluZX0gaW5zdGVhZC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZWFkUm9vbUV2ZW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWFkUm9vbUV2ZW50cyhldmVudFR5cGUsIG1zZ3R5cGUsIGxpbWl0KSB7XG4gICAgICB2YXIgcm9vbUlkcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcbiAgICAgIHZhciBzaW5jZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ID8gYXJndW1lbnRzWzRdIDogdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZHMgYWxsIGV2ZW50cyBvZiB0aGUgZ2l2ZW4gdHlwZSwgYW5kIG9wdGlvbmFsbHkgc3RhdGUga2V5IChpZiBhcHBsaWNhYmxlL2RlZmluZWQpLFxuICAgICAqIHRoZSB1c2VyIGhhcyBhY2Nlc3MgdG8uIFRoZSB3aWRnZXQgQVBJIHdpbGwgaGF2ZSBhbHJlYWR5IHZlcmlmaWVkIHRoYXQgdGhlIHdpZGdldCBpc1xuICAgICAqIGNhcGFibGUgb2YgcmVjZWl2aW5nIHRoZSBldmVudHMuIExlc3MgZXZlbnRzIHRoYW4gdGhlIGxpbWl0IGFyZSBhbGxvd2VkIHRvIGJlIHJldHVybmVkLFxuICAgICAqIGJ1dCBub3QgbW9yZS4gSWYgYHJvb21JZHNgIGlzIHN1cHBsaWVkLCBpdCBtYXkgY29udGFpbiBgU3ltYm9scy5BbnlSb29tYCB0byBkZW5vdGUgdGhhdFxuICAgICAqIGBsaW1pdGAgaW4gZWFjaCBvZiB0aGUgY2xpZW50J3Mga25vd24gcm9vbXMgc2hvdWxkIGJlIHJldHVybmVkLiBXaGVuIGBudWxsYCwgb25seSB0aGVcbiAgICAgKiByb29tIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBsb29raW5nIGF0IHNob3VsZCBiZSBjb25zaWRlcmVkLlxuICAgICAqIEBwYXJhbSBldmVudFR5cGUgVGhlIGV2ZW50IHR5cGUgdG8gYmUgcmVhZC5cbiAgICAgKiBAcGFyYW0gc3RhdGVLZXkgVGhlIHN0YXRlIGtleSBvZiB0aGUgZXZlbnRzIHRvIGJlIHJlYWQsIGlmIGFwcGxpY2FibGUvZGVmaW5lZC5cbiAgICAgKiBAcGFyYW0gbGltaXQgVGhlIG1heGltdW0gbnVtYmVyIG9mIGV2ZW50cyB0byByZXRyaWV2ZS4gV2lsbCBiZSB6ZXJvIHRvIGRlbm90ZSBcImFzIG1hbnlcbiAgICAgKiBhcyBwb3NzaWJsZVwiLlxuICAgICAqIEBwYXJhbSByb29tSWRzIFdoZW4gbnVsbCwgdGhlIHVzZXIncyBjdXJyZW50bHkgdmlld2VkIHJvb20uIE90aGVyd2lzZSwgdGhlIGxpc3Qgb2Ygcm9vbSBJRHNcbiAgICAgKiB0byBsb29rIHdpdGhpbiwgcG9zc2libHkgY29udGFpbmluZyBTeW1ib2xzLkFueVJvb20gdG8gZGVub3RlIGFsbCBrbm93biByb29tcy5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxJUm9vbUV2ZW50W10+fSBSZXNvbHZlcyB0byB0aGUgc3RhdGUgZXZlbnRzLCBvciBhbiBlbXB0eSBhcnJheS5cbiAgICAgKiBAZGVwcmVjYXRlZCBDbGllbnRzIGFyZSBhZHZpc2VkIHRvIGltcGxlbWVudCB7QGxpbmsgV2lkZ2V0RHJpdmVyLnJlYWRSb29tVGltZWxpbmV9IGluc3RlYWQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVhZFN0YXRlRXZlbnRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWRTdGF0ZUV2ZW50cyhldmVudFR5cGUsIHN0YXRlS2V5LCBsaW1pdCkge1xuICAgICAgdmFyIHJvb21JZHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBzdGlja3kgZXZlbnRzIG9mIHRoZSBnaXZlbiB0eXBlIHRoZSB1c2VyIGhhcyBhY2Nlc3MgdG8uXG4gICAgICogVGhlIHdpZGdldCBBUEkgd2lsbCBoYXZlIGFscmVhZHkgdmVyaWZpZWQgdGhhdCB0aGUgd2lkZ2V0IGlzIGNhcGFibGUgb2YgcmVjZWl2aW5nIHRoZSBldmVudHMuXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHdpZGdldHMgd2lsbCBnZXQgb25seSBsaXZlIG1lc3NhZ2VzIGFzIHRoZXkgYXBwZWFyIGluIHRoZSB0aW1lbGluZS5cbiAgICAgKiBIb3dldmVyLCBzdGlja3kgZXZlbnRzIGFjdCBsaWtlIGEgc3RhdGUsIGFuZCB0aGUgY3VycmVudCBzdGF0ZSBpcyBtYWRlIGJ5IGV2ZW50cyB0aGF0IG1heSBoYXZlIGJlZW5cbiAgICAgKiBzZW50IGJlZm9yZSB0aGUgd2lkZ2V0IHdhcyBsb2FkZWQuXG4gICAgICogRXZlbnRzIGFyZSBzdGlja3kgZm9yIDFoIG1heGltdW0sIHNvIHRoZSB3aWRnZXQgaGFzIGFjY2VzcyB0byB0aGUgcGFzdCBob3VyIG9mIHN0aWNreSBldmVudHMgbWF4aW11bS5cbiAgICAgKlxuICAgICAqIEBleHBlcmltZW50YWwgUGFydCBvZiBNU0M0NDA3IC0gU3RpY2t5IEV2ZW50cyAoV2lkZ2V0IEFQSSlcbiAgICAgKiBAcGFyYW0gcm9vbUlkIC0gVGhlIElEIG9mIHRoZSByb29tLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJlYWRTdGlja3lFdmVudHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVhZFN0aWNreUV2ZW50cyhyb29tSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInJlYWRTdGlja3lFdmVudHMgaXMgbm90IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWRzIGFsbCBldmVudHMgb2YgdGhlIGdpdmVuIHR5cGUsIGFuZCBvcHRpb25hbGx5IGBtc2d0eXBlYCAoaWYgYXBwbGljYWJsZS9kZWZpbmVkKSxcbiAgICAgKiB0aGUgdXNlciBoYXMgYWNjZXNzIHRvLiBUaGUgd2lkZ2V0IEFQSSB3aWxsIGhhdmUgYWxyZWFkeSB2ZXJpZmllZCB0aGF0IHRoZSB3aWRnZXQgaXNcbiAgICAgKiBjYXBhYmxlIG9mIHJlY2VpdmluZyB0aGUgZXZlbnRzLiBMZXNzIGV2ZW50cyB0aGFuIHRoZSBsaW1pdCBhcmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCxcbiAgICAgKiBidXQgbm90IG1vcmUuXG4gICAgICogQHBhcmFtIHJvb21JZCBUaGUgSUQgb2YgdGhlIHJvb20gdG8gbG9vayB3aXRoaW4uXG4gICAgICogQHBhcmFtIGV2ZW50VHlwZSBUaGUgZXZlbnQgdHlwZSB0byBiZSByZWFkLlxuICAgICAqIEBwYXJhbSBtc2d0eXBlIFRoZSBtc2d0eXBlIG9mIHRoZSBldmVudHMgdG8gYmUgcmVhZCwgaWYgYXBwbGljYWJsZS9kZWZpbmVkLlxuICAgICAqIEBwYXJhbSBzdGF0ZUtleSBUaGUgc3RhdGUga2V5IG9mIHRoZSBldmVudHMgdG8gYmUgcmVhZCwgaWYgYXBwbGljYWJsZS9kZWZpbmVkLlxuICAgICAqIEBwYXJhbSBsaW1pdCBUaGUgbWF4aW11bSBudW1iZXIgb2YgZXZlbnRzIHRvIHJldHJpZXZlLiBXaWxsIGJlIHplcm8gdG8gZGVub3RlIFwiYXMgbWFueSBhc1xuICAgICAqIHBvc3NpYmxlXCIuXG4gICAgICogQHBhcmFtIHNpbmNlIFdoZW4gbnVsbCwgcmV0cmlldmVzIHRoZSBudW1iZXIgb2YgZXZlbnRzIHNwZWNpZmllZCBieSB0aGUgXCJsaW1pdFwiIHBhcmFtZXRlci5cbiAgICAgKiBPdGhlcndpc2UsIHRoZSBldmVudCBJRCBhdCB3aGljaCBvbmx5IHN1YnNlcXVlbnQgZXZlbnRzIHdpbGwgYmUgcmV0dXJuZWQsIGFzIG1hbnkgYXMgc3BlY2lmaWVkXG4gICAgICogaW4gXCJsaW1pdFwiLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPElSb29tRXZlbnRbXT59IFJlc29sdmVzIHRvIHRoZSByb29tIGV2ZW50cywgb3IgYW4gZW1wdHkgYXJyYXkuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicmVhZFJvb21UaW1lbGluZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWFkUm9vbVRpbWVsaW5lKHJvb21JZCwgZXZlbnRUeXBlLCBtc2d0eXBlLCBzdGF0ZUtleSwgbGltaXQsIHNpbmNlKSB7XG4gICAgICAvLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSB3ZSB0cnkgdGhlIGRlcHJlY2F0ZWQgbWV0aG9kcywgaW4gY2FzZVxuICAgICAgLy8gdGhleSdyZSBpbXBsZW1lbnRlZFxuICAgICAgaWYgKHN0YXRlS2V5ID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLnJlYWRSb29tRXZlbnRzKGV2ZW50VHlwZSwgbXNndHlwZSwgbGltaXQsIFtyb29tSWRdLCBzaW5jZSk7ZWxzZSByZXR1cm4gdGhpcy5yZWFkU3RhdGVFdmVudHMoZXZlbnRUeXBlLCBzdGF0ZUtleSwgbGltaXQsIFtyb29tSWRdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkcyB0aGUgY3VycmVudCB2YWx1ZXMgb2YgYWxsIG1hdGNoaW5nIHJvb20gc3RhdGUgZW50cmllcy5cbiAgICAgKiBAcGFyYW0gcm9vbUlkIFRoZSBJRCBvZiB0aGUgcm9vbS5cbiAgICAgKiBAcGFyYW0gZXZlbnRUeXBlIFRoZSBldmVudCB0eXBlIG9mIHRoZSBlbnRyaWVzIHRvIGJlIHJlYWQuXG4gICAgICogQHBhcmFtIHN0YXRlS2V5IFRoZSBzdGF0ZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGJlIHJlYWQuIElmIHVuZGVmaW5lZCxcbiAgICAgKiBhbGwgcm9vbSBzdGF0ZSBlbnRyaWVzIHdpdGggYSBtYXRjaGluZyBldmVudCB0eXBlIHNob3VsZCBiZSByZXR1cm5lZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxJUm9vbUV2ZW50W10+fSBSZXNvbHZlcyB0byB0aGUgZXZlbnRzIHJlcHJlc2VudGluZyB0aGVcbiAgICAgKiBjdXJyZW50IHZhbHVlcyBvZiB0aGUgcm9vbSBzdGF0ZSBlbnRyaWVzLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJlYWRSb29tU3RhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVhZFJvb21TdGF0ZShyb29tSWQsIGV2ZW50VHlwZSwgc3RhdGVLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWRTdGF0ZUV2ZW50cyhldmVudFR5cGUsIHN0YXRlS2V5LCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiwgW3Jvb21JZF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWRzIGFsbCBldmVudHMgdGhhdCBhcmUgcmVsYXRlZCB0byBhIGdpdmVuIGV2ZW50LiBUaGUgd2lkZ2V0IEFQSSB3aWxsXG4gICAgICogaGF2ZSBhbHJlYWR5IHZlcmlmaWVkIHRoYXQgdGhlIHdpZGdldCBpcyBjYXBhYmxlIG9mIHJlY2VpdmluZyB0aGUgZXZlbnQsXG4gICAgICogb3Igd2lsbCBtYWtlIHN1cmUgdG8gcmVqZWN0IGFjY2VzcyB0byBldmVudHMgd2hpY2ggYXJlIHJldHVybmVkIGZyb20gdGhpc1xuICAgICAqIGZ1bmN0aW9uLCBidXQgYXJlIG5vdCBjYXBhYmxlIG9mIHJlY2VpdmluZy4gSWYgYHJlbGF0aW9uVHlwZWAgb3IgYGV2ZW50VHlwZWBcbiAgICAgKiBhcmUgc2V0LCB0aGUgcmV0dXJuZWQgZXZlbnRzIHNob3VsZCBhbHJlYWR5IGJlIGZpbHRlcmVkLiBMZXNzIGV2ZW50cyB0aGFuXG4gICAgICogdGhlIGxpbWl0IGFyZSBhbGxvd2VkIHRvIGJlIHJldHVybmVkLCBidXQgbm90IG1vcmUuXG4gICAgICogQHBhcmFtIGV2ZW50SWQgVGhlIGlkIG9mIHRoZSBwYXJlbnQgZXZlbnQgdG8gYmUgcmVhZC5cbiAgICAgKiBAcGFyYW0gcm9vbUlkIFRoZSByb29tIHRvIGxvb2sgd2l0aGluLiBXaGVuIHVuZGVmaW5lZCwgdGhlIHVzZXInc1xuICAgICAqIGN1cnJlbnRseSB2aWV3ZWQgcm9vbS5cbiAgICAgKiBAcGFyYW0gcmVsYXRpb25UeXBlIFRoZSByZWxhdGlvbnNoaXAgdHlwZSBvZiBjaGlsZCBldmVudHMgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBXaGVuIHVuZGVmaW5lZCwgYWxsIHJlbGF0aW9ucyBhcmUgcmV0dXJuZWQuXG4gICAgICogQHBhcmFtIGV2ZW50VHlwZSBUaGUgZXZlbnQgdHlwZSBvZiBjaGlsZCBldmVudHMgdG8gc2VhcmNoIGZvci4gV2hlbiB1bmRlZmluZWQsXG4gICAgICogYWxsIHJlbGF0ZWQgZXZlbnRzIGFyZSByZXR1cm5lZC5cbiAgICAgKiBAcGFyYW0gZnJvbSBUaGUgcGFnaW5hdGlvbiB0b2tlbiB0byBzdGFydCByZXR1cm5pbmcgcmVzdWx0cyBmcm9tLCBhc1xuICAgICAqIHJlY2VpdmVkIGZyb20gYSBwcmV2aW91cyBjYWxsLiBJZiBub3Qgc3VwcGxpZWQsIHJlc3VsdHMgc3RhcnQgYXQgdGhlIG1vc3RcbiAgICAgKiByZWNlbnQgdG9wb2xvZ2ljYWwgZXZlbnQga25vd24gdG8gdGhlIHNlcnZlci5cbiAgICAgKiBAcGFyYW0gdG8gVGhlIHBhZ2luYXRpb24gdG9rZW4gdG8gc3RvcCByZXR1cm5pbmcgcmVzdWx0cyBhdC4gSWYgbm90XG4gICAgICogc3VwcGxpZWQsIHJlc3VsdHMgY29udGludWUgdXAgdG8gbGltaXQgb3IgdW50aWwgdGhlcmUgYXJlIG5vIG1vcmUgZXZlbnRzLlxuICAgICAqIEBwYXJhbSBsaW1pdCBUaGUgbWF4aW11bSBudW1iZXIgb2YgZXZlbnRzIHRvIHJldHJpZXZlIHBlciByb29tLiBJZiBub3RcbiAgICAgKiBzdXBwbGllZCwgdGhlIHNlcnZlciB3aWxsIGFwcGx5IGEgZGVmYXVsdCBsaW1pdC5cbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIFRoZSBkaXJlY3Rpb24gdG8gc2VhcmNoIGZvciBhY2NvcmRpbmcgdG8gTVNDMzcxNVxuICAgICAqIEByZXR1cm5zIFJlc29sdmVzIHRvIHRoZSByb29tIHJlbGF0aW9ucy5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJyZWFkRXZlbnRSZWxhdGlvbnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVhZEV2ZW50UmVsYXRpb25zKGV2ZW50SWQsIHJvb21JZCwgcmVsYXRpb25UeXBlLCBldmVudFR5cGUsIGZyb20sIHRvLCBsaW1pdCwgZGlyZWN0aW9uKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgY2h1bms6IFtdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc2tzIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uIHRvIHZhbGlkYXRlIHRoZWlyIGlkZW50aXR5IHRocm91Z2ggT3BlbklEIENvbm5lY3QuIFRoZVxuICAgICAqIGludGVyZmFjZSBmb3IgdGhpcyBmdW5jdGlvbiBpcyBhbiBvYnNlcnZhYmxlIHdoaWNoIGFjY2VwdHMgdGhlIHN0YXRlIG1hY2hpbmUgb2YgdGhlXG4gICAgICogT0lEQyBleGNoYW5nZSBmbG93LiBGb3IgZXhhbXBsZSwgaWYgdGhlIGNsaWVudC91c2VyIGJsb2NrcyB0aGUgcmVxdWVzdCB0aGVuIGl0IHdvdWxkXG4gICAgICogZmVlZCBiYWNrIGEgYHtzdGF0ZTogQmxvY2tlZH1gIGludG8gdGhlIG9ic2VydmFibGUuIFNpbWlsYXJseSwgaWYgdGhlIHVzZXIgYWxyZWFkeVxuICAgICAqIGFwcHJvdmVkIHRoZSB3aWRnZXQgdGhlbiBhIGB7c3RhdGU6IEFsbG93ZWR9YCB3b3VsZCBiZSBmZWQgaW50byB0aGUgb2JzZXJ2YWJsZSBhbG9uZ3NpZGVcbiAgICAgKiB0aGUgdG9rZW4gaXRzZWxmLiBJZiB0aGUgY2xpZW50IGlzIGFza2luZyBmb3IgcGVybWlzc2lvbiwgaXQgc2hvdWxkIGZlZWQgaW4gYVxuICAgICAqIGB7c3RhdGU6IFBlbmRpbmdVc2VyQ29uZmlybWF0aW9ufWAgZm9sbG93ZWQgYnkgdGhlIHJlbGV2YW50IEFsbG93ZWQgb3IgQmxvY2tlZCBzdGF0ZS5cbiAgICAgKlxuICAgICAqIFRoZSB3aWRnZXQgQVBJIHdpbGwgcmVqZWN0IHRoZSB3aWRnZXQncyByZXF1ZXN0IHdpdGggYW4gZXJyb3IgaWYgdGhpcyBjb250cmFjdCBpcyBub3RcbiAgICAgKiBtZXQgcHJvcGVybHkuIEJ5IGRlZmF1bHQsIHRoZSB3aWRnZXQgZHJpdmVyIHdpbGwgYmxvY2sgYWxsIE9JREMgcmVxdWVzdHMuXG4gICAgICogQHBhcmFtIHtTaW1wbGVPYnNlcnZhYmxlPElPcGVuSURVcGRhdGU+fSBvYnNlcnZlciBUaGUgb2JzZXJ2YWJsZSB0byBmZWVkIHVwZGF0ZXMgaW50by5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJhc2tPcGVuSURcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXNrT3BlbklEKG9ic2VydmVyKSB7XG4gICAgICBvYnNlcnZlci51cGRhdGUoe1xuICAgICAgICBzdGF0ZTogXy5PcGVuSURSZXF1ZXN0U3RhdGUuQmxvY2tlZFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTmF2aWdhdGVzIHRoZSBjbGllbnQgd2l0aCBhIG1hdHJpeC50byBVUkkuIEluIGZ1dHVyZSB0aGlzIGZ1bmN0aW9uIHdpbGwgYWxzbyBiZSBwcm92aWRlZFxuICAgICAqIHdpdGggdGhlIE1hdHJpeCBVUklzIG9uY2UgbWF0cml4LnRvIGlzIHJlcGxhY2VkLiBUaGUgZ2l2ZW4gVVJJIHdpbGwgaGF2ZSBhbHJlYWR5IGJlZW5cbiAgICAgKiBsaWdodGx5IGNoZWNrZWQgdG8gZW5zdXJlIGl0IGxvb2tzIGxpa2UgYSB2YWxpZCBVUkksIHRob3VnaCB0aGUgaW1wbGVtZW50YXRpb24gaXMgcmVjb21tZW5kZWRcbiAgICAgKiB0byBkbyBmdXJ0aGVyIGNoZWNrcyBvbiB0aGUgVVJJLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmkgVGhlIFVSSSB0byBuYXZpZ2F0ZSB0by5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gUmVzb2x2ZXMgd2hlbiBjb21wbGV0ZS5cbiAgICAgKiBAdGhyb3dzIFRocm93cyBpZiB0aGVyZSdzIGEgcHJvYmxlbSB3aXRoIHRoZSBuYXZpZ2F0aW9uLCBzdWNoIGFzIGludmFsaWQgZm9ybWF0LlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcIm5hdmlnYXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5hdmlnYXRlKHVyaSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmF2aWdhdGlvbiBpcyBub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9sbHMgZm9yIFRVUk4gc2VydmVyIGRhdGEsIHlpZWxkaW5nIGFuIGluaXRpYWwgc2V0IG9mIGNyZWRlbnRpYWxzIGFzIHNvb24gYXMgcG9zc2libGUsIGFuZFxuICAgICAqIHRoZXJlYWZ0ZXIgeWllbGRpbmcgbmV3IGNyZWRlbnRpYWxzIHdoZW5ldmVyIHRoZSBwcmV2aW91cyBvbmVzIGV4cGlyZS4gVGhlIHdpZGdldCBBUEkgd2lsbFxuICAgICAqIGhhdmUgYWxyZWFkeSB2ZXJpZmllZCB0aGF0IHRoZSB3aWRnZXQgaGFzIHBlcm1pc3Npb24gdG8gYWNjZXNzIFRVUk4gc2VydmVycy5cbiAgICAgKiBAeWllbGRzIHtJVHVyblNlcnZlcn0gVGhlIFRVUk4gc2VydmVyIFVSSXMgYW5kIGNyZWRlbnRpYWxzIGN1cnJlbnRseSBhdmFpbGFibGUgdG8gdGhlIGNsaWVudC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJnZXRUdXJuU2VydmVyc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUdXJuU2VydmVycygpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlRVUk4gc2VydmVyIHN1cHBvcnQgaXMgbm90IGltcGxlbWVudGVkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlYXJjaCBmb3IgdXNlcnMgaW4gdGhlIHVzZXIgZGlyZWN0b3J5LlxuICAgICAqIEBwYXJhbSBzZWFyY2hUZXJtIFRoZSB0ZXJtIHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHBhcmFtIGxpbWl0IFRoZSBtYXhpbXVtIG51bWJlciBvZiByZXN1bHRzIHRvIHJldHVybi4gSWYgbm90IHN1cHBsaWVkLCB0aGVcbiAgICAgKiBAcmV0dXJucyBSZXNvbHZlcyB0byB0aGUgc2VhcmNoIHJlc3VsdHMuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwic2VhcmNoVXNlckRpcmVjdG9yeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZWFyY2hVc2VyRGlyZWN0b3J5KHNlYXJjaFRlcm0sIGxpbWl0KSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgbGltaXRlZDogZmFsc2UsXG4gICAgICAgIHJlc3VsdHM6IFtdXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGNvbmZpZyBmb3IgdGhlIG1lZGlhIHJlcG9zaXRvcnkuXG4gICAgICogQHJldHVybnMgUHJvbWlzZSB3aGljaCByZXNvbHZlcyB3aXRoIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBjb25maWcuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0TWVkaWFDb25maWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TWVkaWFDb25maWcoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZXQgbWVkaWEgY29uZmlnIGlzIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGxvYWQgYSBmaWxlIHRvIHRoZSBtZWRpYSByZXBvc2l0b3J5IG9uIHRoZSBob21lc2VydmVyLlxuICAgICAqIEBwYXJhbSBmaWxlIC0gVGhlIG9iamVjdCB0byB1cGxvYWQuIFNvbWV0aGluZyB0aGF0IGNhbiBiZSBzZW50IHRvXG4gICAgICogICAgICAgICAgICAgICBYTUxIdHRwUmVxdWVzdC5zZW5kICh0eXBpY2FsbHkgYSBGaWxlKS5cbiAgICAgKiBAcmV0dXJucyBSZXNvbHZlcyB0byB0aGUgbG9jYXRpb24gb2YgdGhlIHVwbG9hZGVkIGZpbGUuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwidXBsb2FkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGxvYWRGaWxlKGZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVwbG9hZCBmaWxlIGlzIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZCBhIGZpbGUgZnJvbSB0aGUgbWVkaWEgcmVwb3NpdG9yeSBvbiB0aGUgaG9tZXNlcnZlci5cbiAgICAgKiBAcGFyYW0gY29udGVudFVyaSAtIE1YQyBVUkkgb2YgdGhlIGZpbGUgdG8gZG93bmxvYWQuXG4gICAgICogQHJldHVybnMgUmVzb2x2ZXMgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcImRvd25sb2FkRmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkb3dubG9hZEZpbGUoY29udGVudFVyaSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRG93bmxvYWQgZmlsZSBpcyBub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgSURzIG9mIGFsbCBqb2luZWQgb3IgaW52aXRlZCByb29tcyBjdXJyZW50bHkga25vd24gdG8gdGhlXG4gICAgICogY2xpZW50LlxuICAgICAqIEByZXR1cm5zIFRoZSByb29tIElEcy5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJnZXRLbm93blJvb21zXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEtub3duUm9vbXMoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJRdWVyeWluZyBrbm93biByb29tcyBpcyBub3QgaW1wbGVtZW50ZWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhwcmVzc2VzIGFuIGVycm9yIHRocm93biBieSB0aGlzIGRyaXZlciBpbiBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggdGhlIFdpZGdldCBBUEkuXG4gICAgICogQHBhcmFtIGVycm9yIFRoZSBlcnJvciB0byBoYW5kbGUuXG4gICAgICogQHJldHVybnMgVGhlIGVycm9yIGV4cHJlc3NlZCBhcyBhIHtAbGluayBJV2lkZ2V0QXBpRXJyb3JSZXNwb25zZURhdGFEZXRhaWxzfSxcbiAgICAgKiBvciB1bmRlZmluZWQgaWYgaXQgY2Fubm90IGJlIGV4cHJlc3NlZCBhcyBvbmUuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwicHJvY2Vzc0Vycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3NFcnJvcihlcnJvcikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFdpZGdldERyaXZlcjtcbn0oKTtcbmV4cG9ydHMuV2lkZ2V0RHJpdmVyID0gV2lkZ2V0RHJpdmVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2lkZ2V0RHJpdmVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xudmFyIF9XaWRnZXRBcGkgPSByZXF1aXJlKFwiLi9XaWRnZXRBcGlcIik7XG5PYmplY3Qua2V5cyhfV2lkZ2V0QXBpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfV2lkZ2V0QXBpW2tleV0pIHJldHVybjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dpZGdldEFwaVtrZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfQ2xpZW50V2lkZ2V0QXBpID0gcmVxdWlyZShcIi4vQ2xpZW50V2lkZ2V0QXBpXCIpO1xuT2JqZWN0LmtleXMoX0NsaWVudFdpZGdldEFwaSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX0NsaWVudFdpZGdldEFwaVtrZXldKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9DbGllbnRXaWRnZXRBcGlba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1N5bWJvbHMgPSByZXF1aXJlKFwiLi9TeW1ib2xzXCIpO1xuT2JqZWN0LmtleXMoX1N5bWJvbHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF9TeW1ib2xzW2tleV0pIHJldHVybjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1N5bWJvbHNba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1Bvc3RtZXNzYWdlVHJhbnNwb3J0ID0gcmVxdWlyZShcIi4vdHJhbnNwb3J0L1Bvc3RtZXNzYWdlVHJhbnNwb3J0XCIpO1xuT2JqZWN0LmtleXMoX1Bvc3RtZXNzYWdlVHJhbnNwb3J0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfUG9zdG1lc3NhZ2VUcmFuc3BvcnRba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfUG9zdG1lc3NhZ2VUcmFuc3BvcnRba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1dpZGdldFR5cGUgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL1dpZGdldFR5cGVcIik7XG5PYmplY3Qua2V5cyhfV2lkZ2V0VHlwZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX1dpZGdldFR5cGVba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2lkZ2V0VHlwZVtrZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfSVdpZGdldEFwaUVycm9yUmVzcG9uc2UgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL0lXaWRnZXRBcGlFcnJvclJlc3BvbnNlXCIpO1xuT2JqZWN0LmtleXMoX0lXaWRnZXRBcGlFcnJvclJlc3BvbnNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfSVdpZGdldEFwaUVycm9yUmVzcG9uc2Vba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfSVdpZGdldEFwaUVycm9yUmVzcG9uc2Vba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1dpZGdldEFwaUFjdGlvbiA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZXMvV2lkZ2V0QXBpQWN0aW9uXCIpO1xuT2JqZWN0LmtleXMoX1dpZGdldEFwaUFjdGlvbikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX1dpZGdldEFwaUFjdGlvbltrZXldKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XaWRnZXRBcGlBY3Rpb25ba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1dpZGdldEFwaURpcmVjdGlvbiA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZXMvV2lkZ2V0QXBpRGlyZWN0aW9uXCIpO1xuT2JqZWN0LmtleXMoX1dpZGdldEFwaURpcmVjdGlvbikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX1dpZGdldEFwaURpcmVjdGlvbltrZXldKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XaWRnZXRBcGlEaXJlY3Rpb25ba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX0FwaVZlcnNpb24gPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL0FwaVZlcnNpb25cIik7XG5PYmplY3Qua2V5cyhfQXBpVmVyc2lvbikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX0FwaVZlcnNpb25ba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfQXBpVmVyc2lvbltrZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfQ2FwYWJpbGl0aWVzID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9DYXBhYmlsaXRpZXNcIik7XG5PYmplY3Qua2V5cyhfQ2FwYWJpbGl0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfQ2FwYWJpbGl0aWVzW2tleV0pIHJldHVybjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX0NhcGFiaWxpdGllc1trZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfR2V0T3BlbklEQWN0aW9uID0gcmVxdWlyZShcIi4vaW50ZXJmYWNlcy9HZXRPcGVuSURBY3Rpb25cIik7XG5PYmplY3Qua2V5cyhfR2V0T3BlbklEQWN0aW9uKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfR2V0T3BlbklEQWN0aW9uW2tleV0pIHJldHVybjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX0dldE9wZW5JREFjdGlvbltrZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfV2lkZ2V0S2luZCA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZXMvV2lkZ2V0S2luZFwiKTtcbk9iamVjdC5rZXlzKF9XaWRnZXRLaW5kKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfV2lkZ2V0S2luZFtrZXldKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XaWRnZXRLaW5kW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xudmFyIF9Nb2RhbEJ1dHRvbktpbmQgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL01vZGFsQnV0dG9uS2luZFwiKTtcbk9iamVjdC5rZXlzKF9Nb2RhbEJ1dHRvbktpbmQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF9Nb2RhbEJ1dHRvbktpbmRba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfTW9kYWxCdXR0b25LaW5kW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xudmFyIF9Nb2RhbFdpZGdldEFjdGlvbnMgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL01vZGFsV2lkZ2V0QWN0aW9uc1wiKTtcbk9iamVjdC5rZXlzKF9Nb2RhbFdpZGdldEFjdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF9Nb2RhbFdpZGdldEFjdGlvbnNba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfTW9kYWxXaWRnZXRBY3Rpb25zW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xudmFyIF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24gPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VzL1VwZGF0ZURlbGF5ZWRFdmVudEFjdGlvblwiKTtcbk9iamVjdC5rZXlzKF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF9VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb25ba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xudmFyIF9XaWRnZXRFdmVudENhcGFiaWxpdHkgPSByZXF1aXJlKFwiLi9tb2RlbHMvV2lkZ2V0RXZlbnRDYXBhYmlsaXR5XCIpO1xuT2JqZWN0LmtleXMoX1dpZGdldEV2ZW50Q2FwYWJpbGl0eSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX1dpZGdldEV2ZW50Q2FwYWJpbGl0eVtrZXldKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9XaWRnZXRFdmVudENhcGFiaWxpdHlba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX3VybCA9IHJlcXVpcmUoXCIuL21vZGVscy92YWxpZGF0aW9uL3VybFwiKTtcbk9iamVjdC5rZXlzKF91cmwpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF91cmxba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfdXJsW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xudmFyIF91dGlscyA9IHJlcXVpcmUoXCIuL21vZGVscy92YWxpZGF0aW9uL3V0aWxzXCIpO1xuT2JqZWN0LmtleXMoX3V0aWxzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfdXRpbHNba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfdXRpbHNba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1dpZGdldCA9IHJlcXVpcmUoXCIuL21vZGVscy9XaWRnZXRcIik7XG5PYmplY3Qua2V5cyhfV2lkZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfV2lkZ2V0W2tleV0pIHJldHVybjtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gX1dpZGdldFtrZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfV2lkZ2V0UGFyc2VyID0gcmVxdWlyZShcIi4vbW9kZWxzL1dpZGdldFBhcnNlclwiKTtcbk9iamVjdC5rZXlzKF9XaWRnZXRQYXJzZXIpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF9XaWRnZXRQYXJzZXJba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2lkZ2V0UGFyc2VyW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xudmFyIF91cmxUZW1wbGF0ZSA9IHJlcXVpcmUoXCIuL3RlbXBsYXRpbmcvdXJsLXRlbXBsYXRlXCIpO1xuT2JqZWN0LmtleXMoX3VybFRlbXBsYXRlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKGtleSA9PT0gXCJkZWZhdWx0XCIgfHwga2V5ID09PSBcIl9fZXNNb2R1bGVcIikgcmV0dXJuO1xuICBpZiAoa2V5IGluIGV4cG9ydHMgJiYgZXhwb3J0c1trZXldID09PSBfdXJsVGVtcGxhdGVba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfdXJsVGVtcGxhdGVba2V5XTtcbiAgICB9XG4gIH0pO1xufSk7XG52YXIgX1NpbXBsZU9ic2VydmFibGUgPSByZXF1aXJlKFwiLi91dGlsL1NpbXBsZU9ic2VydmFibGVcIik7XG5PYmplY3Qua2V5cyhfU2ltcGxlT2JzZXJ2YWJsZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gIGlmIChrZXkgPT09IFwiZGVmYXVsdFwiIHx8IGtleSA9PT0gXCJfX2VzTW9kdWxlXCIpIHJldHVybjtcbiAgaWYgKGtleSBpbiBleHBvcnRzICYmIGV4cG9ydHNba2V5XSA9PT0gX1NpbXBsZU9ic2VydmFibGVba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfU2ltcGxlT2JzZXJ2YWJsZVtrZXldO1xuICAgIH1cbiAgfSk7XG59KTtcbnZhciBfV2lkZ2V0RHJpdmVyID0gcmVxdWlyZShcIi4vZHJpdmVyL1dpZGdldERyaXZlclwiKTtcbk9iamVjdC5rZXlzKF9XaWRnZXREcml2ZXIpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIGlmIChrZXkgaW4gZXhwb3J0cyAmJiBleHBvcnRzW2tleV0gPT09IF9XaWRnZXREcml2ZXJba2V5XSkgcmV0dXJuO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBfV2lkZ2V0RHJpdmVyW2tleV07XG4gICAgfVxuICB9KTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlVuc3RhYmxlQXBpVmVyc2lvbiA9IGV4cG9ydHMuTWF0cml4QXBpVmVyc2lvbiA9IGV4cG9ydHMuQ3VycmVudEFwaVZlcnNpb25zID0gdm9pZCAwO1xuLypcbiAqIENvcHlyaWdodCAyMDIwIFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xudmFyIE1hdHJpeEFwaVZlcnNpb24gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKE1hdHJpeEFwaVZlcnNpb24pIHtcbiAgTWF0cml4QXBpVmVyc2lvbltcIlByZXJlbGVhc2UxXCJdID0gXCIwLjAuMVwiO1xuICBNYXRyaXhBcGlWZXJzaW9uW1wiUHJlcmVsZWFzZTJcIl0gPSBcIjAuMC4yXCI7XG4gIHJldHVybiBNYXRyaXhBcGlWZXJzaW9uO1xufSh7fSk7IC8vVjAxMCA9IFwiMC4xLjBcIiwgLy8gZmlyc3QgcmVsZWFzZVxuZXhwb3J0cy5NYXRyaXhBcGlWZXJzaW9uID0gTWF0cml4QXBpVmVyc2lvbjtcbnZhciBVbnN0YWJsZUFwaVZlcnNpb24gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKFVuc3RhYmxlQXBpVmVyc2lvbikge1xuICBVbnN0YWJsZUFwaVZlcnNpb25bXCJNU0MyNzYyXCJdID0gXCJvcmcubWF0cml4Lm1zYzI3NjJcIjtcbiAgVW5zdGFibGVBcGlWZXJzaW9uW1wiTVNDMjc2Ml9VUERBVEVfU1RBVEVcIl0gPSBcIm9yZy5tYXRyaXgubXNjMjc2Ml91cGRhdGVfc3RhdGVcIjtcbiAgVW5zdGFibGVBcGlWZXJzaW9uW1wiTVNDMjg3MVwiXSA9IFwib3JnLm1hdHJpeC5tc2MyODcxXCI7XG4gIFVuc3RhYmxlQXBpVmVyc2lvbltcIk1TQzI4NzNcIl0gPSBcIm9yZy5tYXRyaXgubXNjMjg3M1wiO1xuICBVbnN0YWJsZUFwaVZlcnNpb25bXCJNU0MyOTMxXCJdID0gXCJvcmcubWF0cml4Lm1zYzI5MzFcIjtcbiAgVW5zdGFibGVBcGlWZXJzaW9uW1wiTVNDMjk3NFwiXSA9IFwib3JnLm1hdHJpeC5tc2MyOTc0XCI7XG4gIFVuc3RhYmxlQXBpVmVyc2lvbltcIk1TQzI4NzZcIl0gPSBcIm9yZy5tYXRyaXgubXNjMjg3NlwiO1xuICBVbnN0YWJsZUFwaVZlcnNpb25bXCJNU0MzODE5XCJdID0gXCJvcmcubWF0cml4Lm1zYzM4MTlcIjtcbiAgVW5zdGFibGVBcGlWZXJzaW9uW1wiTVNDMzg0NlwiXSA9IFwidG93bi5yb2Jpbi5tc2MzODQ2XCI7XG4gIFVuc3RhYmxlQXBpVmVyc2lvbltcIk1TQzM4NjlcIl0gPSBcIm9yZy5tYXRyaXgubXNjMzg2OVwiO1xuICBVbnN0YWJsZUFwaVZlcnNpb25bXCJNU0MzOTczXCJdID0gXCJvcmcubWF0cml4Lm1zYzM5NzNcIjtcbiAgVW5zdGFibGVBcGlWZXJzaW9uW1wiTVNDNDAzOVwiXSA9IFwib3JnLm1hdHJpeC5tc2M0MDM5XCI7XG4gIHJldHVybiBVbnN0YWJsZUFwaVZlcnNpb247XG59KHt9KTtcbmV4cG9ydHMuVW5zdGFibGVBcGlWZXJzaW9uID0gVW5zdGFibGVBcGlWZXJzaW9uO1xudmFyIEN1cnJlbnRBcGlWZXJzaW9ucyA9IFtNYXRyaXhBcGlWZXJzaW9uLlByZXJlbGVhc2UxLCBNYXRyaXhBcGlWZXJzaW9uLlByZXJlbGVhc2UyLFxuLy9NYXRyaXhBcGlWZXJzaW9uLlYwMTAsXG5VbnN0YWJsZUFwaVZlcnNpb24uTVNDMjc2MiwgVW5zdGFibGVBcGlWZXJzaW9uLk1TQzI3NjJfVVBEQVRFX1NUQVRFLCBVbnN0YWJsZUFwaVZlcnNpb24uTVNDMjg3MSwgVW5zdGFibGVBcGlWZXJzaW9uLk1TQzI4NzMsIFVuc3RhYmxlQXBpVmVyc2lvbi5NU0MyOTMxLCBVbnN0YWJsZUFwaVZlcnNpb24uTVNDMjk3NCwgVW5zdGFibGVBcGlWZXJzaW9uLk1TQzI4NzYsIFVuc3RhYmxlQXBpVmVyc2lvbi5NU0MzODE5LCBVbnN0YWJsZUFwaVZlcnNpb24uTVNDMzg0NiwgVW5zdGFibGVBcGlWZXJzaW9uLk1TQzM4NjksIFVuc3RhYmxlQXBpVmVyc2lvbi5NU0MzOTczLCBVbnN0YWJsZUFwaVZlcnNpb24uTVNDNDAzOV07XG5leHBvcnRzLkN1cnJlbnRBcGlWZXJzaW9ucyA9IEN1cnJlbnRBcGlWZXJzaW9ucztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFwaVZlcnNpb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLlZpZGVvQ29uZmVyZW5jZUNhcGFiaWxpdGllcyA9IGV4cG9ydHMuU3RpY2tlcnBpY2tlckNhcGFiaWxpdGllcyA9IGV4cG9ydHMuTWF0cml4Q2FwYWJpbGl0aWVzID0gdm9pZCAwO1xuZXhwb3J0cy5nZXRUaW1lbGluZVJvb21JREZyb21DYXBhYmlsaXR5ID0gZ2V0VGltZWxpbmVSb29tSURGcm9tQ2FwYWJpbGl0eTtcbmV4cG9ydHMuaXNUaW1lbGluZUNhcGFiaWxpdHkgPSBpc1RpbWVsaW5lQ2FwYWJpbGl0eTtcbmV4cG9ydHMuaXNUaW1lbGluZUNhcGFiaWxpdHlGb3IgPSBpc1RpbWVsaW5lQ2FwYWJpbGl0eUZvcjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAyMCAtIDIwMjEgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG52YXIgTWF0cml4Q2FwYWJpbGl0aWVzID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChNYXRyaXhDYXBhYmlsaXRpZXMpIHtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiU2NyZWVuc2hvdHNcIl0gPSBcIm0uY2FwYWJpbGl0eS5zY3JlZW5zaG90XCI7XG4gIE1hdHJpeENhcGFiaWxpdGllc1tcIlN0aWNrZXJTZW5kaW5nXCJdID0gXCJtLnN0aWNrZXJcIjtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiQWx3YXlzT25TY3JlZW5cIl0gPSBcIm0uYWx3YXlzX29uX3NjcmVlblwiO1xuICBNYXRyaXhDYXBhYmlsaXRpZXNbXCJSZXF1aXJlc0NsaWVudFwiXSA9IFwiaW8uZWxlbWVudC5yZXF1aXJlc19jbGllbnRcIjtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiTVNDMjkzMU5hdmlnYXRlXCJdID0gXCJvcmcubWF0cml4Lm1zYzI5MzEubmF2aWdhdGVcIjtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiTVNDMzg0NlR1cm5TZXJ2ZXJzXCJdID0gXCJ0b3duLnJvYmluLm1zYzM4NDYudHVybl9zZXJ2ZXJzXCI7XG4gIE1hdHJpeENhcGFiaWxpdGllc1tcIk1TQzM5NzNVc2VyRGlyZWN0b3J5U2VhcmNoXCJdID0gXCJvcmcubWF0cml4Lm1zYzM5NzMudXNlcl9kaXJlY3Rvcnlfc2VhcmNoXCI7XG4gIE1hdHJpeENhcGFiaWxpdGllc1tcIk1TQzQwMzlVcGxvYWRGaWxlXCJdID0gXCJvcmcubWF0cml4Lm1zYzQwMzkudXBsb2FkX2ZpbGVcIjtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiTVNDNDAzOURvd25sb2FkRmlsZVwiXSA9IFwib3JnLm1hdHJpeC5tc2M0MDM5LmRvd25sb2FkX2ZpbGVcIjtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiTVNDNDE1N1NlbmREZWxheWVkRXZlbnRcIl0gPSBcIm9yZy5tYXRyaXgubXNjNDE1Ny5zZW5kLmRlbGF5ZWRfZXZlbnRcIjtcbiAgTWF0cml4Q2FwYWJpbGl0aWVzW1wiTVNDNDE1N1VwZGF0ZURlbGF5ZWRFdmVudFwiXSA9IFwib3JnLm1hdHJpeC5tc2M0MTU3LnVwZGF0ZV9kZWxheWVkX2V2ZW50XCI7XG4gIE1hdHJpeENhcGFiaWxpdGllc1tcIk1TQzQ0MDdTZW5kU3RpY2t5RXZlbnRcIl0gPSBcIm9yZy5tYXRyaXgubXNjNDQwNy5zZW5kLnN0aWNreV9ldmVudFwiO1xuICBNYXRyaXhDYXBhYmlsaXRpZXNbXCJNU0M0NDA3UmVjZWl2ZVN0aWNreUV2ZW50XCJdID0gXCJvcmcubWF0cml4Lm1zYzQ0MDcucmVjZWl2ZS5zdGlja3lfZXZlbnRcIjtcbiAgcmV0dXJuIE1hdHJpeENhcGFiaWxpdGllcztcbn0oe30pO1xuZXhwb3J0cy5NYXRyaXhDYXBhYmlsaXRpZXMgPSBNYXRyaXhDYXBhYmlsaXRpZXM7XG52YXIgU3RpY2tlcnBpY2tlckNhcGFiaWxpdGllcyA9IFtNYXRyaXhDYXBhYmlsaXRpZXMuU3RpY2tlclNlbmRpbmddO1xuZXhwb3J0cy5TdGlja2VycGlja2VyQ2FwYWJpbGl0aWVzID0gU3RpY2tlcnBpY2tlckNhcGFiaWxpdGllcztcbnZhciBWaWRlb0NvbmZlcmVuY2VDYXBhYmlsaXRpZXMgPSBbTWF0cml4Q2FwYWJpbGl0aWVzLkFsd2F5c09uU2NyZWVuXTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgY2FwYWJpbGl0eSBpcyBhIGNhcGFiaWxpdHkgZm9yIGEgdGltZWxpbmUuXG4gKiBAcGFyYW0ge0NhcGFiaWxpdHl9IGNhcGFiaWxpdHkgVGhlIGNhcGFiaWxpdHkgdG8gdGVzdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGEgdGltZWxpbmUgY2FwYWJpbGl0eSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5leHBvcnRzLlZpZGVvQ29uZmVyZW5jZUNhcGFiaWxpdGllcyA9IFZpZGVvQ29uZmVyZW5jZUNhcGFiaWxpdGllcztcbmZ1bmN0aW9uIGlzVGltZWxpbmVDYXBhYmlsaXR5KGNhcGFiaWxpdHkpIHtcbiAgLy8gVE9ETzogQ2hhbmdlIHdoZW4gTVNDMjc2MiBiZWNvbWVzIHN0YWJsZS5cbiAgcmV0dXJuIGNhcGFiaWxpdHkgPT09IG51bGwgfHwgY2FwYWJpbGl0eSA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2FwYWJpbGl0eS5zdGFydHNXaXRoKFwib3JnLm1hdHJpeC5tc2MyNzYyLnRpbWVsaW5lOlwiKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgY2FwYWJpbGl0eSBpcyBhIHRpbWVsaW5lIGNhcGFiaWxpdHkgZm9yIHRoZSBnaXZlbiByb29tLlxuICogQHBhcmFtIHtDYXBhYmlsaXR5fSBjYXBhYmlsaXR5IFRoZSBjYXBhYmlsaXR5IHRvIHRlc3QuXG4gKiBAcGFyYW0ge3N0cmluZyB8IFN5bWJvbHMuQW55Um9vbX0gcm9vbUlkIFRoZSByb29tIElELCBvciBgU3ltYm9scy5BbnlSb29tYCBmb3IgdGhhdCBkZXNpZ25hdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGEgbWF0Y2hpbmcgY2FwYWJpbGl0eSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBpc1RpbWVsaW5lQ2FwYWJpbGl0eUZvcihjYXBhYmlsaXR5LCByb29tSWQpIHtcbiAgcmV0dXJuIGNhcGFiaWxpdHkgPT09IFwib3JnLm1hdHJpeC5tc2MyNzYyLnRpbWVsaW5lOlwiLmNvbmNhdChyb29tSWQpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHJvb20gSUQgZGVzY3JpYmVkIGJ5IGEgdGltZWxpbmUgY2FwYWJpbGl0eS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXBhYmlsaXR5IFRoZSBjYXBhYmlsaXR5IHRvIHBhcnNlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHJvb20gSUQuXG4gKi9cbmZ1bmN0aW9uIGdldFRpbWVsaW5lUm9vbUlERnJvbUNhcGFiaWxpdHkoY2FwYWJpbGl0eSkge1xuICByZXR1cm4gY2FwYWJpbGl0eS5zdWJzdHJpbmcoY2FwYWJpbGl0eS5pbmRleE9mKFwiOlwiKSArIDEpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2FwYWJpbGl0aWVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5PcGVuSURSZXF1ZXN0U3RhdGUgPSB2b2lkIDA7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG52YXIgT3BlbklEUmVxdWVzdFN0YXRlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChPcGVuSURSZXF1ZXN0U3RhdGUpIHtcbiAgT3BlbklEUmVxdWVzdFN0YXRlW1wiQWxsb3dlZFwiXSA9IFwiYWxsb3dlZFwiO1xuICBPcGVuSURSZXF1ZXN0U3RhdGVbXCJCbG9ja2VkXCJdID0gXCJibG9ja2VkXCI7XG4gIE9wZW5JRFJlcXVlc3RTdGF0ZVtcIlBlbmRpbmdVc2VyQ29uZmlybWF0aW9uXCJdID0gXCJyZXF1ZXN0XCI7XG4gIHJldHVybiBPcGVuSURSZXF1ZXN0U3RhdGU7XG59KHt9KTtcbmV4cG9ydHMuT3BlbklEUmVxdWVzdFN0YXRlID0gT3BlbklEUmVxdWVzdFN0YXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9R2V0T3BlbklEQWN0aW9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pc0Vycm9yUmVzcG9uc2UgPSBpc0Vycm9yUmVzcG9uc2U7XG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfSwgX3R5cGVvZihvYmopOyB9XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgLSAyMDI0IFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoZSBmb3JtYXQgb2YgZXJyb3JzIHJldHVybmVkIGJ5IE1hdHJpeCBBUEkgcmVxdWVzdHNcbiAqIG1hZGUgYnkgYSBXaWRnZXREcml2ZXIuXG4gKi9cblxuZnVuY3Rpb24gaXNFcnJvclJlc3BvbnNlKHJlc3BvbnNlRGF0YSkge1xuICB2YXIgZXJyb3IgPSByZXNwb25zZURhdGEuZXJyb3I7XG4gIHJldHVybiBfdHlwZW9mKGVycm9yKSA9PT0gXCJvYmplY3RcIiAmJiBlcnJvciAhPT0gbnVsbCAmJiBcIm1lc3NhZ2VcIiBpbiBlcnJvciAmJiB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUlXaWRnZXRBcGlFcnJvclJlc3BvbnNlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5Nb2RhbEJ1dHRvbktpbmQgPSB2b2lkIDA7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG52YXIgTW9kYWxCdXR0b25LaW5kID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChNb2RhbEJ1dHRvbktpbmQpIHtcbiAgTW9kYWxCdXR0b25LaW5kW1wiUHJpbWFyeVwiXSA9IFwibS5wcmltYXJ5XCI7XG4gIE1vZGFsQnV0dG9uS2luZFtcIlNlY29uZGFyeVwiXSA9IFwibS5zZWNvbmRhcnlcIjtcbiAgTW9kYWxCdXR0b25LaW5kW1wiV2FybmluZ1wiXSA9IFwibS53YXJuaW5nXCI7XG4gIE1vZGFsQnV0dG9uS2luZFtcIkRhbmdlclwiXSA9IFwibS5kYW5nZXJcIjtcbiAgTW9kYWxCdXR0b25LaW5kW1wiTGlua1wiXSA9IFwibS5saW5rXCI7XG4gIHJldHVybiBNb2RhbEJ1dHRvbktpbmQ7XG59KHt9KTtcbmV4cG9ydHMuTW9kYWxCdXR0b25LaW5kID0gTW9kYWxCdXR0b25LaW5kO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TW9kYWxCdXR0b25LaW5kLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5CdWlsdEluTW9kYWxCdXR0b25JRCA9IHZvaWQgMDtcbi8qXG4gKiBDb3B5cmlnaHQgMjAyMCBUaGUgTWF0cml4Lm9yZyBGb3VuZGF0aW9uIEMuSS5DLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbnZhciBCdWlsdEluTW9kYWxCdXR0b25JRCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoQnVpbHRJbk1vZGFsQnV0dG9uSUQpIHtcbiAgQnVpbHRJbk1vZGFsQnV0dG9uSURbXCJDbG9zZVwiXSA9IFwibS5jbG9zZVwiO1xuICByZXR1cm4gQnVpbHRJbk1vZGFsQnV0dG9uSUQ7XG59KHt9KTsgLy8gVHlwZXMgZm9yIGEgbm9ybWFsIG1vZGFsIHJlcXVlc3RpbmcgdGhlIG9wZW5pbmcgYSBtb2RhbCB3aWRnZXRcbi8vIFR5cGVzIGZvciBhIG1vZGFsIHdpZGdldCByZWNlaXZpbmcgbm90aWZpY2F0aW9ucyB0aGF0IGl0cyBidXR0b25zIGhhdmUgYmVlbiBwcmVzc2VkXG4vLyBUeXBlcyBmb3IgYSBtb2RhbCB3aWRnZXQgcmVxdWVzdGluZyBjbG9zZVxuLy8gVHlwZXMgZm9yIGEgbm9ybWFsIHdpZGdldCBiZWluZyBub3RpZmllZCB0aGF0IHRoZSBtb2RhbCB3aWRnZXQgaXQgb3BlbmVkIGhhcyBiZWVuIGNsb3NlZFxuZXhwb3J0cy5CdWlsdEluTW9kYWxCdXR0b25JRCA9IEJ1aWx0SW5Nb2RhbEJ1dHRvbklEO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TW9kYWxXaWRnZXRBY3Rpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5VcGRhdGVEZWxheWVkRXZlbnRBY3Rpb24gPSB2b2lkIDA7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgLSAyMDI0IFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xudmFyIFVwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uKSB7XG4gIFVwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbltcIkNhbmNlbFwiXSA9IFwiY2FuY2VsXCI7XG4gIFVwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbltcIlJlc3RhcnRcIl0gPSBcInJlc3RhcnRcIjtcbiAgVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uW1wiU2VuZFwiXSA9IFwic2VuZFwiO1xuICByZXR1cm4gVXBkYXRlRGVsYXllZEV2ZW50QWN0aW9uO1xufSh7fSk7XG5leHBvcnRzLlVwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbiA9IFVwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVVwZGF0ZURlbGF5ZWRFdmVudEFjdGlvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24gPSBleHBvcnRzLldpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24gPSB2b2lkIDA7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG52YXIgV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uKSB7XG4gIFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uW1wiU3VwcG9ydGVkQXBpVmVyc2lvbnNcIl0gPSBcInN1cHBvcnRlZF9hcGlfdmVyc2lvbnNcIjtcbiAgV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb25bXCJDYXBhYmlsaXRpZXNcIl0gPSBcImNhcGFiaWxpdGllc1wiO1xuICBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbltcIk5vdGlmeUNhcGFiaWxpdGllc1wiXSA9IFwibm90aWZ5X2NhcGFiaWxpdGllc1wiO1xuICBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbltcIlRoZW1lQ2hhbmdlXCJdID0gXCJ0aGVtZV9jaGFuZ2VcIjtcbiAgV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb25bXCJMYW5ndWFnZUNoYW5nZVwiXSA9IFwibGFuZ3VhZ2VfY2hhbmdlXCI7XG4gIFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uW1wiVGFrZVNjcmVlbnNob3RcIl0gPSBcInNjcmVlbnNob3RcIjtcbiAgV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb25bXCJVcGRhdGVWaXNpYmlsaXR5XCJdID0gXCJ2aXNpYmlsaXR5XCI7XG4gIFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uW1wiT3BlbklEQ3JlZGVudGlhbHNcIl0gPSBcIm9wZW5pZF9jcmVkZW50aWFsc1wiO1xuICBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbltcIldpZGdldENvbmZpZ1wiXSA9IFwid2lkZ2V0X2NvbmZpZ1wiO1xuICBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbltcIkNsb3NlTW9kYWxXaWRnZXRcIl0gPSBcImNsb3NlX21vZGFsXCI7XG4gIFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uW1wiQnV0dG9uQ2xpY2tlZFwiXSA9IFwiYnV0dG9uX2NsaWNrZWRcIjtcbiAgV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb25bXCJTZW5kRXZlbnRcIl0gPSBcInNlbmRfZXZlbnRcIjtcbiAgV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb25bXCJTZW5kVG9EZXZpY2VcIl0gPSBcInNlbmRfdG9fZGV2aWNlXCI7XG4gIFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uW1wiVXBkYXRlU3RhdGVcIl0gPSBcInVwZGF0ZV9zdGF0ZVwiO1xuICBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbltcIlVwZGF0ZVR1cm5TZXJ2ZXJzXCJdID0gXCJ1cGRhdGVfdHVybl9zZXJ2ZXJzXCI7XG4gIHJldHVybiBXaWRnZXRBcGlUb1dpZGdldEFjdGlvbjtcbn0oe30pO1xuZXhwb3J0cy5XaWRnZXRBcGlUb1dpZGdldEFjdGlvbiA9IFdpZGdldEFwaVRvV2lkZ2V0QWN0aW9uO1xudmFyIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb24pIHtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIlN1cHBvcnRlZEFwaVZlcnNpb25zXCJdID0gXCJzdXBwb3J0ZWRfYXBpX3ZlcnNpb25zXCI7XG4gIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb25bXCJDb250ZW50TG9hZGVkXCJdID0gXCJjb250ZW50X2xvYWRlZFwiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiU2VuZFN0aWNrZXJcIl0gPSBcIm0uc3RpY2tlclwiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiVXBkYXRlQWx3YXlzT25TY3JlZW5cIl0gPSBcInNldF9hbHdheXNfb25fc2NyZWVuXCI7XG4gIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb25bXCJHZXRPcGVuSURDcmVkZW50aWFsc1wiXSA9IFwiZ2V0X29wZW5pZFwiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiQ2xvc2VNb2RhbFdpZGdldFwiXSA9IFwiY2xvc2VfbW9kYWxcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIk9wZW5Nb2RhbFdpZGdldFwiXSA9IFwib3Blbl9tb2RhbFwiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiU2V0TW9kYWxCdXR0b25FbmFibGVkXCJdID0gXCJzZXRfYnV0dG9uX2VuYWJsZWRcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIlNlbmRFdmVudFwiXSA9IFwic2VuZF9ldmVudFwiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiU2VuZFRvRGV2aWNlXCJdID0gXCJzZW5kX3RvX2RldmljZVwiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiV2F0Y2hUdXJuU2VydmVyc1wiXSA9IFwid2F0Y2hfdHVybl9zZXJ2ZXJzXCI7XG4gIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb25bXCJVbndhdGNoVHVyblNlcnZlcnNcIl0gPSBcInVud2F0Y2hfdHVybl9zZXJ2ZXJzXCI7XG4gIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb25bXCJCZWVwZXJSZWFkUm9vbUFjY291bnREYXRhXCJdID0gXCJjb20uYmVlcGVyLnJlYWRfcm9vbV9hY2NvdW50X2RhdGFcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIk1TQzI4NzZSZWFkRXZlbnRzXCJdID0gXCJvcmcubWF0cml4Lm1zYzI4NzYucmVhZF9ldmVudHNcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIk1TQzI5MzFOYXZpZ2F0ZVwiXSA9IFwib3JnLm1hdHJpeC5tc2MyOTMxLm5hdmlnYXRlXCI7XG4gIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb25bXCJNU0MyOTc0UmVuZWdvdGlhdGVDYXBhYmlsaXRpZXNcIl0gPSBcIm9yZy5tYXRyaXgubXNjMjk3NC5yZXF1ZXN0X2NhcGFiaWxpdGllc1wiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiTVNDMzg2OVJlYWRSZWxhdGlvbnNcIl0gPSBcIm9yZy5tYXRyaXgubXNjMzg2OS5yZWFkX3JlbGF0aW9uc1wiO1xuICBXaWRnZXRBcGlGcm9tV2lkZ2V0QWN0aW9uW1wiTVNDMzk3M1VzZXJEaXJlY3RvcnlTZWFyY2hcIl0gPSBcIm9yZy5tYXRyaXgubXNjMzk3My51c2VyX2RpcmVjdG9yeV9zZWFyY2hcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIk1TQzQwMzlHZXRNZWRpYUNvbmZpZ0FjdGlvblwiXSA9IFwib3JnLm1hdHJpeC5tc2M0MDM5LmdldF9tZWRpYV9jb25maWdcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIk1TQzQwMzlVcGxvYWRGaWxlQWN0aW9uXCJdID0gXCJvcmcubWF0cml4Lm1zYzQwMzkudXBsb2FkX2ZpbGVcIjtcbiAgV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbltcIk1TQzQwMzlEb3dubG9hZEZpbGVBY3Rpb25cIl0gPSBcIm9yZy5tYXRyaXgubXNjNDAzOS5kb3dubG9hZF9maWxlXCI7XG4gIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb25bXCJNU0M0MTU3VXBkYXRlRGVsYXllZEV2ZW50XCJdID0gXCJvcmcubWF0cml4Lm1zYzQxNTcudXBkYXRlX2RlbGF5ZWRfZXZlbnRcIjtcbiAgcmV0dXJuIFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb247XG59KHt9KTtcbmV4cG9ydHMuV2lkZ2V0QXBpRnJvbVdpZGdldEFjdGlvbiA9IFdpZGdldEFwaUZyb21XaWRnZXRBY3Rpb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1XaWRnZXRBcGlBY3Rpb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLldpZGdldEFwaURpcmVjdGlvbiA9IHZvaWQgMDtcbmV4cG9ydHMuaW52ZXJ0ZWREaXJlY3Rpb24gPSBpbnZlcnRlZERpcmVjdGlvbjtcbi8qXG4gKiBDb3B5cmlnaHQgMjAyMCBUaGUgTWF0cml4Lm9yZyBGb3VuZGF0aW9uIEMuSS5DLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbnZhciBXaWRnZXRBcGlEaXJlY3Rpb24gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKFdpZGdldEFwaURpcmVjdGlvbikge1xuICBXaWRnZXRBcGlEaXJlY3Rpb25bXCJUb1dpZGdldFwiXSA9IFwidG9XaWRnZXRcIjtcbiAgV2lkZ2V0QXBpRGlyZWN0aW9uW1wiRnJvbVdpZGdldFwiXSA9IFwiZnJvbVdpZGdldFwiO1xuICByZXR1cm4gV2lkZ2V0QXBpRGlyZWN0aW9uO1xufSh7fSk7XG5leHBvcnRzLldpZGdldEFwaURpcmVjdGlvbiA9IFdpZGdldEFwaURpcmVjdGlvbjtcbmZ1bmN0aW9uIGludmVydGVkRGlyZWN0aW9uKGRpcikge1xuICBpZiAoZGlyID09PSBXaWRnZXRBcGlEaXJlY3Rpb24uVG9XaWRnZXQpIHtcbiAgICByZXR1cm4gV2lkZ2V0QXBpRGlyZWN0aW9uLkZyb21XaWRnZXQ7XG4gIH0gZWxzZSBpZiAoZGlyID09PSBXaWRnZXRBcGlEaXJlY3Rpb24uRnJvbVdpZGdldCkge1xuICAgIHJldHVybiBXaWRnZXRBcGlEaXJlY3Rpb24uVG9XaWRnZXQ7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBkaXJlY3Rpb25cIik7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdpZGdldEFwaURpcmVjdGlvbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuV2lkZ2V0S2luZCA9IHZvaWQgMDtcbi8qXG4gKiBDb3B5cmlnaHQgMjAyMCBUaGUgTWF0cml4Lm9yZyBGb3VuZGF0aW9uIEMuSS5DLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cbnZhciBXaWRnZXRLaW5kID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChXaWRnZXRLaW5kKSB7XG4gIFdpZGdldEtpbmRbXCJSb29tXCJdID0gXCJyb29tXCI7XG4gIFdpZGdldEtpbmRbXCJBY2NvdW50XCJdID0gXCJhY2NvdW50XCI7XG4gIFdpZGdldEtpbmRbXCJNb2RhbFwiXSA9IFwibW9kYWxcIjtcbiAgcmV0dXJuIFdpZGdldEtpbmQ7XG59KHt9KTtcbmV4cG9ydHMuV2lkZ2V0S2luZCA9IFdpZGdldEtpbmQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1XaWRnZXRLaW5kLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5NYXRyaXhXaWRnZXRUeXBlID0gdm9pZCAwO1xuLypcbiAqIENvcHlyaWdodCAyMDIwIFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xudmFyIE1hdHJpeFdpZGdldFR5cGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKE1hdHJpeFdpZGdldFR5cGUpIHtcbiAgTWF0cml4V2lkZ2V0VHlwZVtcIkN1c3RvbVwiXSA9IFwibS5jdXN0b21cIjtcbiAgTWF0cml4V2lkZ2V0VHlwZVtcIkppdHNpTWVldFwiXSA9IFwibS5qaXRzaVwiO1xuICBNYXRyaXhXaWRnZXRUeXBlW1wiU3RpY2tlcnBpY2tlclwiXSA9IFwibS5zdGlja2VycGlja2VyXCI7XG4gIHJldHVybiBNYXRyaXhXaWRnZXRUeXBlO1xufSh7fSk7XG5leHBvcnRzLk1hdHJpeFdpZGdldFR5cGUgPSBNYXRyaXhXaWRnZXRUeXBlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2lkZ2V0VHlwZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuV2lkZ2V0ID0gdm9pZCAwO1xudmFyIF8gPSByZXF1aXJlKFwiLi5cIik7XG52YXIgX3V0aWxzID0gcmVxdWlyZShcIi4vdmFsaWRhdGlvbi91dGlsc1wiKTtcbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgcmV0dXJuIF90eXBlb2YgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9LCBfdHlwZW9mKG9iaik7IH1cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIF90b1Byb3BlcnR5S2V5KGRlc2NyaXB0b3Iua2V5KSwgZGVzY3JpcHRvcik7IH0gfVxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHsgd3JpdGFibGU6IGZhbHNlIH0pOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KGFyZykgeyB2YXIga2V5ID0gX3RvUHJpbWl0aXZlKGFyZywgXCJzdHJpbmdcIik7IHJldHVybiBfdHlwZW9mKGtleSkgPT09IFwic3ltYm9sXCIgPyBrZXkgOiBTdHJpbmcoa2V5KTsgfVxuZnVuY3Rpb24gX3RvUHJpbWl0aXZlKGlucHV0LCBoaW50KSB7IGlmIChfdHlwZW9mKGlucHV0KSAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0OyB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07IGlmIChwcmltICE9PSB1bmRlZmluZWQpIHsgdmFyIHJlcyA9IHByaW0uY2FsbChpbnB1dCwgaGludCB8fCBcImRlZmF1bHRcIik7IGlmIChfdHlwZW9mKHJlcykgIT09IFwib2JqZWN0XCIpIHJldHVybiByZXM7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTsgfSAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIENvcHlyaWdodCAyMDIwIFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgYmFyZXN0IGZvcm0gb2Ygd2lkZ2V0LlxuICovXG52YXIgV2lkZ2V0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gV2lkZ2V0KGRlZmluaXRpb24pIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2lkZ2V0KTtcbiAgICB0aGlzLmRlZmluaXRpb24gPSBkZWZpbml0aW9uO1xuICAgIGlmICghdGhpcy5kZWZpbml0aW9uKSB0aHJvdyBuZXcgRXJyb3IoXCJEZWZpbml0aW9uIGlzIHJlcXVpcmVkXCIpO1xuICAgICgwLCBfdXRpbHMuYXNzZXJ0UHJlc2VudCkoZGVmaW5pdGlvbiwgXCJpZFwiKTtcbiAgICAoMCwgX3V0aWxzLmFzc2VydFByZXNlbnQpKGRlZmluaXRpb24sIFwiY3JlYXRvclVzZXJJZFwiKTtcbiAgICAoMCwgX3V0aWxzLmFzc2VydFByZXNlbnQpKGRlZmluaXRpb24sIFwidHlwZVwiKTtcbiAgICAoMCwgX3V0aWxzLmFzc2VydFByZXNlbnQpKGRlZmluaXRpb24sIFwidXJsXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyIElEIHdobyBjcmVhdGVkIHRoZSB3aWRnZXQuXG4gICAqL1xuICBfY3JlYXRlQ2xhc3MoV2lkZ2V0LCBbe1xuICAgIGtleTogXCJjcmVhdG9yVXNlcklkXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9uLmNyZWF0b3JVc2VySWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2Ygd2lkZ2V0LlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInR5cGVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZmluaXRpb24udHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSUQgb2YgdGhlIHdpZGdldC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJpZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbi5pZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgd2lkZ2V0LCBvciBudWxsIGlmIG5vdCBzZXQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwibmFtZVwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbi5uYW1lIHx8IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHRpdGxlIGZvciB0aGUgd2lkZ2V0LCBvciBudWxsIGlmIG5vdCBzZXQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwidGl0bGVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnJhd0RhdGEudGl0bGUgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGVtcGxhdGVkIFVSTCBmb3IgdGhlIHdpZGdldC5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJ0ZW1wbGF0ZVVybFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbi51cmw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG9yaWdpbiBmb3IgdGhpcyB3aWRnZXQuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwib3JpZ2luXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFVSTCh0aGlzLnRlbXBsYXRlVXJsKS5vcmlnaW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIGNsaWVudCBzaG91bGQgd2FpdCBmb3IgdGhlIGlmcmFtZSB0byBsb2FkLiBEZWZhdWx0c1xuICAgICAqIHRvIHRydWUuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwid2FpdEZvcklmcmFtZUxvYWRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIGlmICh0aGlzLmRlZmluaXRpb24ud2FpdEZvcklmcmFtZUxvYWQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAodGhpcy5kZWZpbml0aW9uLndhaXRGb3JJZnJhbWVMb2FkID09PSB0cnVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlOyAvLyBkZWZhdWx0IHRydWVcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmF3IGRhdGEgZm9yIHRoZSB3aWRnZXQuIFRoaXMgd2lsbCBhbHdheXMgYmUgZGVmaW5lZCwgdGhvdWdoXG4gICAgICogbWF5IGJlIGVtcHR5LlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInJhd0RhdGFcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlZmluaXRpb24uZGF0YSB8fCB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgY29tcGxldGUgd2lkZ2V0IFVSTCBmb3IgdGhlIGNsaWVudCB0byByZW5kZXIuXG4gICAgICogQHBhcmFtIHtJVGVtcGxhdGVQYXJhbXN9IHBhcmFtcyBUaGUgdGVtcGxhdGUgcGFyYW1ldGVycy5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIHRlbXBsYXRlZCBVUkwuXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Q29tcGxldGVVcmxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q29tcGxldGVVcmwocGFyYW1zKSB7XG4gICAgICByZXR1cm4gKDAsIF8ucnVuVGVtcGxhdGUpKHRoaXMudGVtcGxhdGVVcmwsIHRoaXMuZGVmaW5pdGlvbiwgcGFyYW1zKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFdpZGdldDtcbn0oKTtcbmV4cG9ydHMuV2lkZ2V0ID0gV2lkZ2V0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2lkZ2V0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5XaWRnZXRFdmVudENhcGFiaWxpdHkgPSBleHBvcnRzLkV2ZW50S2luZCA9IGV4cG9ydHMuRXZlbnREaXJlY3Rpb24gPSB2b2lkIDA7XG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfSwgX3R5cGVvZihvYmopOyB9XG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTsgcmV0dXJuIGFycjI7IH1cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIF90b1Byb3BlcnR5S2V5KGRlc2NyaXB0b3Iua2V5KSwgZGVzY3JpcHRvcik7IH0gfVxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHsgd3JpdGFibGU6IGZhbHNlIH0pOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KGFyZykgeyB2YXIga2V5ID0gX3RvUHJpbWl0aXZlKGFyZywgXCJzdHJpbmdcIik7IHJldHVybiBfdHlwZW9mKGtleSkgPT09IFwic3ltYm9sXCIgPyBrZXkgOiBTdHJpbmcoa2V5KTsgfVxuZnVuY3Rpb24gX3RvUHJpbWl0aXZlKGlucHV0LCBoaW50KSB7IGlmIChfdHlwZW9mKGlucHV0KSAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0OyB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07IGlmIChwcmltICE9PSB1bmRlZmluZWQpIHsgdmFyIHJlcyA9IHByaW0uY2FsbChpbnB1dCwgaGludCB8fCBcImRlZmF1bHRcIik7IGlmIChfdHlwZW9mKHJlcykgIT09IFwib2JqZWN0XCIpIHJldHVybiByZXM7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTsgfVxuLypcbiAqIENvcHlyaWdodCAyMDIwIFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xudmFyIEV2ZW50S2luZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoRXZlbnRLaW5kKSB7XG4gIEV2ZW50S2luZFtcIkV2ZW50XCJdID0gXCJldmVudFwiO1xuICBFdmVudEtpbmRbXCJTdGF0ZVwiXSA9IFwic3RhdGVfZXZlbnRcIjtcbiAgRXZlbnRLaW5kW1wiVG9EZXZpY2VcIl0gPSBcInRvX2RldmljZVwiO1xuICBFdmVudEtpbmRbXCJSb29tQWNjb3VudFwiXSA9IFwicm9vbV9hY2NvdW50XCI7XG4gIHJldHVybiBFdmVudEtpbmQ7XG59KHt9KTtcbmV4cG9ydHMuRXZlbnRLaW5kID0gRXZlbnRLaW5kO1xudmFyIEV2ZW50RGlyZWN0aW9uID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChFdmVudERpcmVjdGlvbikge1xuICBFdmVudERpcmVjdGlvbltcIlNlbmRcIl0gPSBcInNlbmRcIjtcbiAgRXZlbnREaXJlY3Rpb25bXCJSZWNlaXZlXCJdID0gXCJyZWNlaXZlXCI7XG4gIHJldHVybiBFdmVudERpcmVjdGlvbjtcbn0oe30pO1xuZXhwb3J0cy5FdmVudERpcmVjdGlvbiA9IEV2ZW50RGlyZWN0aW9uO1xudmFyIFdpZGdldEV2ZW50Q2FwYWJpbGl0eSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFdpZGdldEV2ZW50Q2FwYWJpbGl0eShkaXJlY3Rpb24sIGV2ZW50VHlwZSwga2luZCwga2V5U3RyLCByYXcpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2lkZ2V0RXZlbnRDYXBhYmlsaXR5KTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB0aGlzLmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcbiAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgIHRoaXMua2V5U3RyID0ga2V5U3RyO1xuICAgIHRoaXMucmF3ID0gcmF3O1xuICB9XG4gIF9jcmVhdGVDbGFzcyhXaWRnZXRFdmVudENhcGFiaWxpdHksIFt7XG4gICAga2V5OiBcIm1hdGNoZXNBc1N0YXRlRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWF0Y2hlc0FzU3RhdGVFdmVudChkaXJlY3Rpb24sIGV2ZW50VHlwZSwgc3RhdGVLZXkpIHtcbiAgICAgIGlmICh0aGlzLmtpbmQgIT09IEV2ZW50S2luZC5TdGF0ZSkgcmV0dXJuIGZhbHNlOyAvLyBub3QgYSBzdGF0ZSBldmVudFxuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uICE9PSBkaXJlY3Rpb24pIHJldHVybiBmYWxzZTsgLy8gZGlyZWN0aW9uIG1pc21hdGNoXG4gICAgICBpZiAodGhpcy5ldmVudFR5cGUgIT09IGV2ZW50VHlwZSkgcmV0dXJuIGZhbHNlOyAvLyBldmVudCB0eXBlIG1pc21hdGNoXG4gICAgICBpZiAodGhpcy5rZXlTdHIgPT09IG51bGwpIHJldHVybiB0cnVlOyAvLyBhbGwgc3RhdGUga2V5cyBhcmUgYWxsb3dlZFxuICAgICAgaWYgKHRoaXMua2V5U3RyID09PSBzdGF0ZUtleSkgcmV0dXJuIHRydWU7IC8vIHRoaXMgc3RhdGUga2V5IGlzIGFsbG93ZWRcblxuICAgICAgLy8gRGVmYXVsdCBub3QgYWxsb3dlZFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtYXRjaGVzQXNUb0RldmljZUV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1hdGNoZXNBc1RvRGV2aWNlRXZlbnQoZGlyZWN0aW9uLCBldmVudFR5cGUpIHtcbiAgICAgIGlmICh0aGlzLmtpbmQgIT09IEV2ZW50S2luZC5Ub0RldmljZSkgcmV0dXJuIGZhbHNlOyAvLyBub3QgYSB0by1kZXZpY2UgZXZlbnRcbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9uKSByZXR1cm4gZmFsc2U7IC8vIGRpcmVjdGlvbiBtaXNtYXRjaFxuICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9PSBldmVudFR5cGUpIHJldHVybiBmYWxzZTsgLy8gZXZlbnQgdHlwZSBtaXNtYXRjaFxuXG4gICAgICAvLyBDaGVja3MgcGFzc2VkLCB0aGUgZXZlbnQgaXMgYWxsb3dlZFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hdGNoZXNBc1Jvb21FdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXRjaGVzQXNSb29tRXZlbnQoZGlyZWN0aW9uLCBldmVudFR5cGUpIHtcbiAgICAgIHZhciBtc2d0eXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBudWxsO1xuICAgICAgaWYgKHRoaXMua2luZCAhPT0gRXZlbnRLaW5kLkV2ZW50KSByZXR1cm4gZmFsc2U7IC8vIG5vdCBhIHJvb20gZXZlbnRcbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9uKSByZXR1cm4gZmFsc2U7IC8vIGRpcmVjdGlvbiBtaXNtYXRjaFxuICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9PSBldmVudFR5cGUpIHJldHVybiBmYWxzZTsgLy8gZXZlbnQgdHlwZSBtaXNtYXRjaFxuXG4gICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09IFwibS5yb29tLm1lc3NhZ2VcIikge1xuICAgICAgICBpZiAodGhpcy5rZXlTdHIgPT09IG51bGwpIHJldHVybiB0cnVlOyAvLyBhbGwgbWVzc2FnZSB0eXBlcyBhcmUgYWxsb3dlZFxuICAgICAgICBpZiAodGhpcy5rZXlTdHIgPT09IG1zZ3R5cGUpIHJldHVybiB0cnVlOyAvLyB0aGlzIG1lc3NhZ2UgdHlwZSBpcyBhbGxvd2VkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gYWxyZWFkeSBwYXNzZWQgdGhlIGNoZWNrIGZvciBpZiB0aGUgZXZlbnQgaXMgYWxsb3dlZFxuICAgICAgfVxuXG4gICAgICAvLyBEZWZhdWx0IG5vdCBhbGxvd2VkXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hdGNoZXNBc1Jvb21BY2NvdW50RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtYXRjaGVzQXNSb29tQWNjb3VudERhdGEoZGlyZWN0aW9uLCBldmVudFR5cGUpIHtcbiAgICAgIGlmICh0aGlzLmtpbmQgIT09IEV2ZW50S2luZC5Sb29tQWNjb3VudCkgcmV0dXJuIGZhbHNlOyAvLyBub3Qgcm9vbSBhY2NvdW50IGRhdGFcbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiAhPT0gZGlyZWN0aW9uKSByZXR1cm4gZmFsc2U7IC8vIGRpcmVjdGlvbiBtaXNtYXRjaFxuICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9PSBldmVudFR5cGUpIHJldHVybiBmYWxzZTsgLy8gZXZlbnQgdHlwZSBtaXNtYXRjaFxuXG4gICAgICAvLyBDaGVja3MgcGFzc2VkLCB0aGUgZXZlbnQgaXMgYWxsb3dlZFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwiZm9yU3RhdGVFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JTdGF0ZUV2ZW50KGRpcmVjdGlvbiwgZXZlbnRUeXBlLCBzdGF0ZUtleSkge1xuICAgICAgLy8gVE9ETzogRW5hYmxlIHN1cHBvcnQgZm9yIG0uKiBuYW1lc3BhY2Ugb25jZSB0aGUgTVNDIGxhbmRzLlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdHJpeC1vcmcvbWF0cml4LXdpZGdldC1hcGkvaXNzdWVzLzIyXG4gICAgICBldmVudFR5cGUgPSBldmVudFR5cGUucmVwbGFjZSgvIy9nLCBcIlxcXFwjXCIpO1xuICAgICAgc3RhdGVLZXkgPSBzdGF0ZUtleSAhPT0gbnVsbCAmJiBzdGF0ZUtleSAhPT0gdW5kZWZpbmVkID8gXCIjXCIuY29uY2F0KHN0YXRlS2V5KSA6IFwiXCI7XG4gICAgICB2YXIgc3RyID0gXCJvcmcubWF0cml4Lm1zYzI3NjIuXCIuY29uY2F0KGRpcmVjdGlvbiwgXCIuc3RhdGVfZXZlbnQ6XCIpLmNvbmNhdChldmVudFR5cGUpLmNvbmNhdChzdGF0ZUtleSk7XG5cbiAgICAgIC8vIGNoZWF0IGJ5IHNlbmRpbmcgaXQgdGhyb3VnaCB0aGUgcHJvY2Vzc29yXG4gICAgICByZXR1cm4gV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LmZpbmRFdmVudENhcGFiaWxpdGllcyhbc3RyXSlbMF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZvclRvRGV2aWNlRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZm9yVG9EZXZpY2VFdmVudChkaXJlY3Rpb24sIGV2ZW50VHlwZSkge1xuICAgICAgLy8gVE9ETzogRW5hYmxlIHN1cHBvcnQgZm9yIG0uKiBuYW1lc3BhY2Ugb25jZSB0aGUgTVNDIGxhbmRzLlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdHJpeC1vcmcvbWF0cml4LXdpZGdldC1hcGkvaXNzdWVzLzU2XG4gICAgICB2YXIgc3RyID0gXCJvcmcubWF0cml4Lm1zYzM4MTkuXCIuY29uY2F0KGRpcmVjdGlvbiwgXCIudG9fZGV2aWNlOlwiKS5jb25jYXQoZXZlbnRUeXBlKTtcblxuICAgICAgLy8gY2hlYXQgYnkgc2VuZGluZyBpdCB0aHJvdWdoIHRoZSBwcm9jZXNzb3JcbiAgICAgIHJldHVybiBXaWRnZXRFdmVudENhcGFiaWxpdHkuZmluZEV2ZW50Q2FwYWJpbGl0aWVzKFtzdHJdKVswXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9yUm9vbUV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvclJvb21FdmVudChkaXJlY3Rpb24sIGV2ZW50VHlwZSkge1xuICAgICAgLy8gVE9ETzogRW5hYmxlIHN1cHBvcnQgZm9yIG0uKiBuYW1lc3BhY2Ugb25jZSB0aGUgTVNDIGxhbmRzLlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdHJpeC1vcmcvbWF0cml4LXdpZGdldC1hcGkvaXNzdWVzLzIyXG4gICAgICB2YXIgc3RyID0gXCJvcmcubWF0cml4Lm1zYzI3NjIuXCIuY29uY2F0KGRpcmVjdGlvbiwgXCIuZXZlbnQ6XCIpLmNvbmNhdChldmVudFR5cGUpO1xuXG4gICAgICAvLyBjaGVhdCBieSBzZW5kaW5nIGl0IHRocm91Z2ggdGhlIHByb2Nlc3NvclxuICAgICAgcmV0dXJuIFdpZGdldEV2ZW50Q2FwYWJpbGl0eS5maW5kRXZlbnRDYXBhYmlsaXRpZXMoW3N0cl0pWzBdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmb3JSb29tTWVzc2FnZUV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvclJvb21NZXNzYWdlRXZlbnQoZGlyZWN0aW9uLCBtc2d0eXBlKSB7XG4gICAgICAvLyBUT0RPOiBFbmFibGUgc3VwcG9ydCBmb3IgbS4qIG5hbWVzcGFjZSBvbmNlIHRoZSBNU0MgbGFuZHMuXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0cml4LW9yZy9tYXRyaXgtd2lkZ2V0LWFwaS9pc3N1ZXMvMjJcbiAgICAgIG1zZ3R5cGUgPSBtc2d0eXBlID09PSBudWxsIHx8IG1zZ3R5cGUgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiBtc2d0eXBlO1xuICAgICAgdmFyIHN0ciA9IFwib3JnLm1hdHJpeC5tc2MyNzYyLlwiLmNvbmNhdChkaXJlY3Rpb24sIFwiLmV2ZW50Om0ucm9vbS5tZXNzYWdlI1wiKS5jb25jYXQobXNndHlwZSk7XG5cbiAgICAgIC8vIGNoZWF0IGJ5IHNlbmRpbmcgaXQgdGhyb3VnaCB0aGUgcHJvY2Vzc29yXG4gICAgICByZXR1cm4gV2lkZ2V0RXZlbnRDYXBhYmlsaXR5LmZpbmRFdmVudENhcGFiaWxpdGllcyhbc3RyXSlbMF07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZvclJvb21BY2NvdW50RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JSb29tQWNjb3VudERhdGEoZGlyZWN0aW9uLCBldmVudFR5cGUpIHtcbiAgICAgIHZhciBzdHIgPSBcImNvbS5iZWVwZXIuY2FwYWJpbGl0aWVzLlwiLmNvbmNhdChkaXJlY3Rpb24sIFwiLnJvb21fYWNjb3VudF9kYXRhOlwiKS5jb25jYXQoZXZlbnRUeXBlKTtcbiAgICAgIHJldHVybiBXaWRnZXRFdmVudENhcGFiaWxpdHkuZmluZEV2ZW50Q2FwYWJpbGl0aWVzKFtzdHJdKVswXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgYSBjYXBhYmlsaXRpZXMgcmVxdWVzdCB0byBmaW5kIGFsbCB0aGUgZXZlbnQgY2FwYWJpbGl0eSByZXF1ZXN0cy5cbiAgICAgKiBAcGFyYW0ge0l0ZXJhYmxlPENhcGFiaWxpdHk+fSBjYXBhYmlsaXRpZXMgVGhlIGNhcGFiaWxpdGllcyByZXF1ZXN0ZWQvdG8gcGFyc2UuXG4gICAgICogQHJldHVybnMge1dpZGdldEV2ZW50Q2FwYWJpbGl0eVtdfSBBbiBhcnJheSBvZiBldmVudCBjYXBhYmlsaXR5IHJlcXVlc3RzLiBNYXkgYmUgZW1wdHksIGJ1dCBuZXZlciBudWxsLlxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcImZpbmRFdmVudENhcGFiaWxpdGllc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaW5kRXZlbnRDYXBhYmlsaXRpZXMoY2FwYWJpbGl0aWVzKSB7XG4gICAgICB2YXIgcGFyc2VkID0gW107XG4gICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoY2FwYWJpbGl0aWVzKSxcbiAgICAgICAgX3N0ZXA7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKF9pdGVyYXRvci5zKCk7ICEoX3N0ZXAgPSBfaXRlcmF0b3IubigpKS5kb25lOykge1xuICAgICAgICAgIHZhciBjYXAgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICB2YXIgX2RpcmVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgdmFyIGV2ZW50U2VnbWVudCA9IHZvaWQgMDtcbiAgICAgICAgICB2YXIgX2tpbmQgPSBudWxsO1xuXG4gICAgICAgICAgLy8gVE9ETzogRW5hYmxlIHN1cHBvcnQgZm9yIG0uKiBuYW1lc3BhY2Ugb25jZSB0aGUgTVNDcyBsYW5kLlxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRyaXgtb3JnL21hdHJpeC13aWRnZXQtYXBpL2lzc3Vlcy8yMlxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRyaXgtb3JnL21hdHJpeC13aWRnZXQtYXBpL2lzc3Vlcy81NlxuXG4gICAgICAgICAgaWYgKGNhcC5zdGFydHNXaXRoKFwib3JnLm1hdHJpeC5tc2MyNzYyLnNlbmQuZXZlbnQ6XCIpKSB7XG4gICAgICAgICAgICBfZGlyZWN0aW9uID0gRXZlbnREaXJlY3Rpb24uU2VuZDtcbiAgICAgICAgICAgIF9raW5kID0gRXZlbnRLaW5kLkV2ZW50O1xuICAgICAgICAgICAgZXZlbnRTZWdtZW50ID0gY2FwLnN1YnN0cmluZyhcIm9yZy5tYXRyaXgubXNjMjc2Mi5zZW5kLmV2ZW50OlwiLmxlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjYXAuc3RhcnRzV2l0aChcIm9yZy5tYXRyaXgubXNjMjc2Mi5zZW5kLnN0YXRlX2V2ZW50OlwiKSkge1xuICAgICAgICAgICAgX2RpcmVjdGlvbiA9IEV2ZW50RGlyZWN0aW9uLlNlbmQ7XG4gICAgICAgICAgICBfa2luZCA9IEV2ZW50S2luZC5TdGF0ZTtcbiAgICAgICAgICAgIGV2ZW50U2VnbWVudCA9IGNhcC5zdWJzdHJpbmcoXCJvcmcubWF0cml4Lm1zYzI3NjIuc2VuZC5zdGF0ZV9ldmVudDpcIi5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2FwLnN0YXJ0c1dpdGgoXCJvcmcubWF0cml4Lm1zYzM4MTkuc2VuZC50b19kZXZpY2U6XCIpKSB7XG4gICAgICAgICAgICBfZGlyZWN0aW9uID0gRXZlbnREaXJlY3Rpb24uU2VuZDtcbiAgICAgICAgICAgIF9raW5kID0gRXZlbnRLaW5kLlRvRGV2aWNlO1xuICAgICAgICAgICAgZXZlbnRTZWdtZW50ID0gY2FwLnN1YnN0cmluZyhcIm9yZy5tYXRyaXgubXNjMzgxOS5zZW5kLnRvX2RldmljZTpcIi5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2FwLnN0YXJ0c1dpdGgoXCJvcmcubWF0cml4Lm1zYzI3NjIucmVjZWl2ZS5ldmVudDpcIikpIHtcbiAgICAgICAgICAgIF9kaXJlY3Rpb24gPSBFdmVudERpcmVjdGlvbi5SZWNlaXZlO1xuICAgICAgICAgICAgX2tpbmQgPSBFdmVudEtpbmQuRXZlbnQ7XG4gICAgICAgICAgICBldmVudFNlZ21lbnQgPSBjYXAuc3Vic3RyaW5nKFwib3JnLm1hdHJpeC5tc2MyNzYyLnJlY2VpdmUuZXZlbnQ6XCIubGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNhcC5zdGFydHNXaXRoKFwib3JnLm1hdHJpeC5tc2MyNzYyLnJlY2VpdmUuc3RhdGVfZXZlbnQ6XCIpKSB7XG4gICAgICAgICAgICBfZGlyZWN0aW9uID0gRXZlbnREaXJlY3Rpb24uUmVjZWl2ZTtcbiAgICAgICAgICAgIF9raW5kID0gRXZlbnRLaW5kLlN0YXRlO1xuICAgICAgICAgICAgZXZlbnRTZWdtZW50ID0gY2FwLnN1YnN0cmluZyhcIm9yZy5tYXRyaXgubXNjMjc2Mi5yZWNlaXZlLnN0YXRlX2V2ZW50OlwiLmxlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjYXAuc3RhcnRzV2l0aChcIm9yZy5tYXRyaXgubXNjMzgxOS5yZWNlaXZlLnRvX2RldmljZTpcIikpIHtcbiAgICAgICAgICAgIF9kaXJlY3Rpb24gPSBFdmVudERpcmVjdGlvbi5SZWNlaXZlO1xuICAgICAgICAgICAgX2tpbmQgPSBFdmVudEtpbmQuVG9EZXZpY2U7XG4gICAgICAgICAgICBldmVudFNlZ21lbnQgPSBjYXAuc3Vic3RyaW5nKFwib3JnLm1hdHJpeC5tc2MzODE5LnJlY2VpdmUudG9fZGV2aWNlOlwiLmxlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjYXAuc3RhcnRzV2l0aChcImNvbS5iZWVwZXIuY2FwYWJpbGl0aWVzLnJlY2VpdmUucm9vbV9hY2NvdW50X2RhdGE6XCIpKSB7XG4gICAgICAgICAgICBfZGlyZWN0aW9uID0gRXZlbnREaXJlY3Rpb24uUmVjZWl2ZTtcbiAgICAgICAgICAgIF9raW5kID0gRXZlbnRLaW5kLlJvb21BY2NvdW50O1xuICAgICAgICAgICAgZXZlbnRTZWdtZW50ID0gY2FwLnN1YnN0cmluZyhcImNvbS5iZWVwZXIuY2FwYWJpbGl0aWVzLnJlY2VpdmUucm9vbV9hY2NvdW50X2RhdGE6XCIubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF9kaXJlY3Rpb24gPT09IG51bGwgfHwgX2tpbmQgPT09IG51bGwgfHwgZXZlbnRTZWdtZW50ID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgLy8gVGhlIGNhcGFiaWxpdHkgdXNlcyBgI2AgYXMgYSBzZXBhcmF0b3IgYmV0d2VlbiBldmVudCB0eXBlIGFuZCBzdGF0ZSBrZXkvbXNndHlwZSxcbiAgICAgICAgICAvLyBzbyB3ZSBzcGxpdCBvbiB0aGF0LiBIb3dldmVyLCBhICMgaXMgYWxzbyB2YWxpZCBpbiBlaXRoZXIgb25lIG9mIHRob3NlIHNvIHdlXG4gICAgICAgICAgLy8gam9pbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICAvLyBFZzogYG0ucm9vbS5tZXNzYWdlIyNtLnRleHRgIGlzIFwibS5yb29tLm1lc3NhZ2VcIiBldmVudCB3aXRoIG1zZ3R5cGUgXCIjbS50ZXh0XCIuXG4gICAgICAgICAgdmFyIGV4cGVjdGluZ0tleVN0ciA9IGV2ZW50U2VnbWVudC5zdGFydHNXaXRoKFwibS5yb29tLm1lc3NhZ2UjXCIpIHx8IF9raW5kID09PSBFdmVudEtpbmQuU3RhdGU7XG4gICAgICAgICAgdmFyIF9rZXlTdHIgPSBudWxsO1xuICAgICAgICAgIGlmIChldmVudFNlZ21lbnQuaW5jbHVkZXMoXCIjXCIpICYmIGV4cGVjdGluZ0tleVN0cikge1xuICAgICAgICAgICAgLy8gRGV2IG5vdGU6IHJlZ2V4IGlzIGRpZmZpY3VsdCB0byB3cml0ZSwgc28gaW5zdGVhZCB0aGUgcnVsZXMgYXJlIG1hbnVhbGx5IHdyaXR0ZW5cbiAgICAgICAgICAgIC8vIG91dC4gVGhpcyBpcyBwcm9iYWJseSBqdXN0IGFzIHVuZGVyc3RhbmRhYmxlIGFzIGEgYm9yaW5nIHJlZ2V4IHRob3VnaCwgc28gd2luLXdpbj9cblxuICAgICAgICAgICAgLy8gVGVzdCBjYXNlczpcbiAgICAgICAgICAgIC8vIHN0ciAgICAgICAgICAgICAgICAgICAgICBldmVudFNlZ21lbnQgICAgICAgIGtleVN0clxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy8gbS5yb29tLm1lc3NhZ2UjICAgICAgICAgIG0ucm9vbS5tZXNzYWdlICAgICAgPGVtcHR5IHN0cmluZz5cbiAgICAgICAgICAgIC8vIG0ucm9vbS5tZXNzYWdlI3Rlc3QgICAgICBtLnJvb20ubWVzc2FnZSAgICAgIHRlc3RcbiAgICAgICAgICAgIC8vIG0ucm9vbS5tZXNzYWdlXFwjICAgICAgICAgbS5yb29tLm1lc3NhZ2UjICAgICB0ZXN0XG4gICAgICAgICAgICAvLyBtLnJvb20ubWVzc2FnZSMjdGVzdCAgICAgbS5yb29tLm1lc3NhZ2UgICAgICAjdGVzdFxuICAgICAgICAgICAgLy8gbS5yb29tLm1lc3NhZ2VcXCMjdGVzdCAgICBtLnJvb20ubWVzc2FnZSMgICAgIHRlc3RcbiAgICAgICAgICAgIC8vIG0ucm9vbS5tZXNzYWdlXFxcXCMjdGVzdCAgIG0ucm9vbS5tZXNzYWdlXFwjICAgIHRlc3RcbiAgICAgICAgICAgIC8vIG0ucm9vbS5tZXNzYWdlXFxcXCMjI3Rlc3QgIG0ucm9vbS5tZXNzYWdlXFwjICAgICN0ZXN0XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHN0ZXA6IGV4cGxvZGUgdGhlIHN0cmluZ1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gZXZlbnRTZWdtZW50LnNwbGl0KFwiI1wiKTtcblxuICAgICAgICAgICAgLy8gVG8gZm9ybSB0aGUgZXZlbnRTZWdtZW50LCB3ZSdsbCBrZWVwIGZpbmRpbmcgcGFydHMgb2YgdGhlIGV4cGxvZGVkIHN0cmluZyB1bnRpbFxuICAgICAgICAgICAgLy8gdGhlcmUncyBvbmUgdGhhdCBkb2Vzbid0IGVuZCB3aXRoIHRoZSBlc2NhcGUgY2hhcmFjdGVyIChcXCkuIFdlJ2xsIHRoZW4gam9pbiB0aG9zZVxuICAgICAgICAgICAgLy8gc2VnbWVudHMgdG9nZXRoZXIgd2l0aCB0aGUgZXhwbG9kaW5nIGNoYXJhY3Rlci4gV2UgaGF2ZSB0byByZW1lbWJlciB0byBjb25zdW1lIHRoZVxuICAgICAgICAgICAgLy8gZXNjYXBlIGNoYXJhY3RlciBhcyB3ZWxsLlxuICAgICAgICAgICAgdmFyIGlkeCA9IHBhcnRzLmZpbmRJbmRleChmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgICByZXR1cm4gIXAuZW5kc1dpdGgoXCJcXFxcXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBldmVudFNlZ21lbnQgPSBwYXJ0cy5zbGljZSgwLCBpZHggKyAxKS5tYXAoZnVuY3Rpb24gKHApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHAuZW5kc1dpdGgoXCJcXFxcXCIpID8gcC5zdWJzdHJpbmcoMCwgcC5sZW5ndGggLSAxKSA6IHA7XG4gICAgICAgICAgICB9KS5qb2luKFwiI1wiKTtcblxuICAgICAgICAgICAgLy8gVGhlIGtleVN0ciBpcyB3aGF0ZXZlciBpcyBsZWZ0IG92ZXIuXG4gICAgICAgICAgICBfa2V5U3RyID0gcGFydHMuc2xpY2UoaWR4ICsgMSkuam9pbihcIiNcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlZC5wdXNoKG5ldyBXaWRnZXRFdmVudENhcGFiaWxpdHkoX2RpcmVjdGlvbiwgZXZlbnRTZWdtZW50LCBfa2luZCwgX2tleVN0ciwgY2FwKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yLmYoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZWQ7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBXaWRnZXRFdmVudENhcGFiaWxpdHk7XG59KCk7XG5leHBvcnRzLldpZGdldEV2ZW50Q2FwYWJpbGl0eSA9IFdpZGdldEV2ZW50Q2FwYWJpbGl0eTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdpZGdldEV2ZW50Q2FwYWJpbGl0eS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuV2lkZ2V0UGFyc2VyID0gdm9pZCAwO1xudmFyIF9XaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXRcIik7XG52YXIgX3VybCA9IHJlcXVpcmUoXCIuL3ZhbGlkYXRpb24vdXJsXCIpO1xuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH0sIF90eXBlb2Yob2JqKTsgfVxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZSkgeyB0aHJvdyBfZTsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTI7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdFtcInJldHVyblwiXSAhPSBudWxsKSBpdFtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoZGlkRXJyKSB0aHJvdyBlcnI7IH0gfSB9OyB9XG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07IHJldHVybiBhcnIyOyB9XG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBfdG9Qcm9wZXJ0eUtleShkZXNjcmlwdG9yLmtleSksIGRlc2NyaXB0b3IpOyB9IH1cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnN0cnVjdG9yLCBcInByb3RvdHlwZVwiLCB7IHdyaXRhYmxlOiBmYWxzZSB9KTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleShhcmcpIHsgdmFyIGtleSA9IF90b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpOyByZXR1cm4gX3R5cGVvZihrZXkpID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZShpbnB1dCwgaGludCkgeyBpZiAoX3R5cGVvZihpbnB1dCkgIT09IFwib2JqZWN0XCIgfHwgaW5wdXQgPT09IG51bGwpIHJldHVybiBpbnB1dDsgdmFyIHByaW0gPSBpbnB1dFtTeW1ib2wudG9QcmltaXRpdmVdOyBpZiAocHJpbSAhPT0gdW5kZWZpbmVkKSB7IHZhciByZXMgPSBwcmltLmNhbGwoaW5wdXQsIGhpbnQgfHwgXCJkZWZhdWx0XCIpOyBpZiAoX3R5cGVvZihyZXMpICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7IH0gcmV0dXJuIChoaW50ID09PSBcInN0cmluZ1wiID8gU3RyaW5nIDogTnVtYmVyKShpbnB1dCk7IH0gLypcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBDb3B5cmlnaHQgMjAyMCBUaGUgTWF0cml4Lm9yZyBGb3VuZGF0aW9uIEMuSS5DLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG52YXIgV2lkZ2V0UGFyc2VyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gV2lkZ2V0UGFyc2VyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBXaWRnZXRQYXJzZXIpO1xuICB9IC8vIHByaXZhdGUgY29uc3RydWN0b3IgYmVjYXVzZSB0aGlzIGlzIGEgdXRpbCBjbGFzc1xuXG4gIC8qKlxuICAgKiBQYXJzZXMgd2lkZ2V0cyBmcm9tIHRoZSBcIm0ud2lkZ2V0c1wiIGFjY291bnQgZGF0YSBldmVudC4gVGhpcyB3aWxsIGFsd2F5c1xuICAgKiByZXR1cm4gYW4gYXJyYXksIHRob3VnaCBtYXkgYmUgZW1wdHkgaWYgbm8gdmFsaWQgd2lkZ2V0cyB3ZXJlIGZvdW5kLlxuICAgKiBAcGFyYW0ge0lBY2NvdW50RGF0YVdpZGdldHN9IGNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIFwibS53aWRnZXRzXCIgYWNjb3VudCBkYXRhLlxuICAgKiBAcmV0dXJucyB7V2lkZ2V0W119IFRoZSB3aWRnZXRzIGluIGFjY291bnQgZGF0YSwgb3IgYW4gZW1wdHkgYXJyYXkuXG4gICAqL1xuICBfY3JlYXRlQ2xhc3MoV2lkZ2V0UGFyc2VyLCBudWxsLCBbe1xuICAgIGtleTogXCJwYXJzZUFjY291bnREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhcnNlQWNjb3VudERhdGEoY29udGVudCkge1xuICAgICAgaWYgKCFjb250ZW50KSByZXR1cm4gW107XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBfaSA9IDAsIF9PYmplY3Qka2V5cyA9IE9iamVjdC5rZXlzKGNvbnRlbnQpOyBfaSA8IF9PYmplY3Qka2V5cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIF93aWRnZXRJZCA9IF9PYmplY3Qka2V5c1tfaV07XG4gICAgICAgIHZhciByb3VnaFdpZGdldCA9IGNvbnRlbnRbX3dpZGdldElkXTtcbiAgICAgICAgaWYgKCFyb3VnaFdpZGdldCkgY29udGludWU7XG4gICAgICAgIGlmIChyb3VnaFdpZGdldC50eXBlICE9PSBcIm0ud2lkZ2V0XCIgJiYgcm91Z2hXaWRnZXQudHlwZSAhPT0gXCJpbS52ZWN0b3IubW9kdWxhci53aWRnZXRzXCIpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIXJvdWdoV2lkZ2V0LnNlbmRlcikgY29udGludWU7XG4gICAgICAgIHZhciBwcm9iYWJsZVdpZGdldElkID0gcm91Z2hXaWRnZXQuc3RhdGVfa2V5IHx8IHJvdWdoV2lkZ2V0LmlkO1xuICAgICAgICBpZiAocHJvYmFibGVXaWRnZXRJZCAhPT0gX3dpZGdldElkKSBjb250aW51ZTtcbiAgICAgICAgdmFyIGFzU3RhdGVFdmVudCA9IHtcbiAgICAgICAgICBjb250ZW50OiByb3VnaFdpZGdldC5jb250ZW50LFxuICAgICAgICAgIHNlbmRlcjogcm91Z2hXaWRnZXQuc2VuZGVyLFxuICAgICAgICAgIHR5cGU6IFwibS53aWRnZXRcIixcbiAgICAgICAgICBzdGF0ZV9rZXk6IF93aWRnZXRJZCxcbiAgICAgICAgICBldmVudF9pZDogXCIkZXhhbXBsZVwiLFxuICAgICAgICAgIHJvb21faWQ6IFwiIWV4YW1wbGVcIixcbiAgICAgICAgICBvcmlnaW5fc2VydmVyX3RzOiAxXG4gICAgICAgIH07XG4gICAgICAgIHZhciB3aWRnZXQgPSBXaWRnZXRQYXJzZXIucGFyc2VSb29tV2lkZ2V0KGFzU3RhdGVFdmVudCk7XG4gICAgICAgIGlmICh3aWRnZXQpIHJlc3VsdC5wdXNoKHdpZGdldCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlcyBhbGwgdGhlIHdpZGdldHMgcG9zc2libGUgaW4gdGhlIGdpdmVuIGFycmF5LiBUaGlzIHdpbGwgYWx3YXlzIHJldHVyblxuICAgICAqIGFuIGFycmF5LCB0aG91Z2ggbWF5IGJlIGVtcHR5IGlmIG5vIHdpZGdldHMgY291bGQgYmUgcGFyc2VkLlxuICAgICAqIEBwYXJhbSB7SVN0YXRlRXZlbnRbXX0gY3VycmVudFN0YXRlIFRoZSByb29tIHN0YXRlIHRvIHBhcnNlLlxuICAgICAqIEByZXR1cm5zIHtXaWRnZXRbXX0gVGhlIHdpZGdldHMgaW4gdGhlIHN0YXRlLCBvciBhbiBlbXB0eSBhcnJheS5cbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJwYXJzZVdpZGdldHNGcm9tUm9vbVN0YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhcnNlV2lkZ2V0c0Zyb21Sb29tU3RhdGUoY3VycmVudFN0YXRlKSB7XG4gICAgICBpZiAoIWN1cnJlbnRTdGF0ZSkgcmV0dXJuIFtdO1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGN1cnJlbnRTdGF0ZSksXG4gICAgICAgIF9zdGVwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IucygpOyAhKF9zdGVwID0gX2l0ZXJhdG9yLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgc3RhdGUgPSBfc3RlcC52YWx1ZTtcbiAgICAgICAgICB2YXIgd2lkZ2V0ID0gV2lkZ2V0UGFyc2VyLnBhcnNlUm9vbVdpZGdldChzdGF0ZSk7XG4gICAgICAgICAgaWYgKHdpZGdldCkgcmVzdWx0LnB1c2god2lkZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgYSBzdGF0ZSBldmVudCBpbnRvIGEgd2lkZ2V0LiBJZiB0aGUgc3RhdGUgZXZlbnQgZG9lcyBub3QgcmVwcmVzZW50XG4gICAgICogYSB3aWRnZXQgKHdyb25nIGV2ZW50IHR5cGUsIGludmFsaWQgd2lkZ2V0LCBldGMpIHRoZW4gbnVsbCBpcyByZXR1cm5lZC5cbiAgICAgKiBAcGFyYW0ge0lTdGF0ZUV2ZW50fSBzdGF0ZUV2ZW50IFRoZSBzdGF0ZSBldmVudC5cbiAgICAgKiBAcmV0dXJucyB7V2lkZ2V0fG51bGx9IFRoZSB3aWRnZXQsIG9yIG51bGwgaWYgaW52YWxpZFxuICAgICAqL1xuICB9LCB7XG4gICAga2V5OiBcInBhcnNlUm9vbVdpZGdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXJzZVJvb21XaWRnZXQoc3RhdGVFdmVudCkge1xuICAgICAgaWYgKCFzdGF0ZUV2ZW50KSByZXR1cm4gbnVsbDtcblxuICAgICAgLy8gVE9ETzogW0xlZ2FjeV0gUmVtb3ZlIGxlZ2FjeSBzdXBwb3J0XG4gICAgICBpZiAoc3RhdGVFdmVudC50eXBlICE9PSBcIm0ud2lkZ2V0XCIgJiYgc3RhdGVFdmVudC50eXBlICE9PSBcImltLnZlY3Rvci5tb2R1bGFyLndpZGdldHNcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gRGV2IG5vdGU6IFRocm91Z2hvdXQgdGhpcyBmdW5jdGlvbiB3ZSBoYXZlIG51bGwgc2FmZXR5IHRvIGVuc3VyZSB0aGF0XG4gICAgICAvLyBpZiB0aGUgY2FsbGVyIGRpZCBub3Qgc3VwcGx5IHNvbWV0aGluZyB1c2VmdWwgdGhhdCB3ZSBkb24ndCBlcnJvci4gVGhpc1xuICAgICAgLy8gaXMgZG9uZSBhZ2FpbnN0IHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGludGVyZmFjZSBiZWNhdXNlIG5vdCBldmVyeW9uZVxuICAgICAgLy8gd2lsbCBoYXZlIGFuIGludGVyZmFjZSB0byB2YWxpZGF0ZSBhZ2FpbnN0LlxuXG4gICAgICB2YXIgY29udGVudCA9IHN0YXRlRXZlbnQuY29udGVudCB8fCB7fTtcblxuICAgICAgLy8gRm9ybSBvdXIgYmVzdCBhcHByb3hpbWF0aW9uIG9mIGEgd2lkZ2V0IHdpdGggdGhlIGluZm9ybWF0aW9uIHdlIGhhdmVcbiAgICAgIHZhciBlc3RpbWF0ZWRXaWRnZXQgPSB7XG4gICAgICAgIGlkOiBzdGF0ZUV2ZW50LnN0YXRlX2tleSxcbiAgICAgICAgY3JlYXRvclVzZXJJZDogY29udGVudFtcImNyZWF0b3JVc2VySWRcIl0gfHwgc3RhdGVFdmVudC5zZW5kZXIsXG4gICAgICAgIG5hbWU6IGNvbnRlbnRbXCJuYW1lXCJdLFxuICAgICAgICB0eXBlOiBjb250ZW50W1widHlwZVwiXSxcbiAgICAgICAgdXJsOiBjb250ZW50W1widXJsXCJdLFxuICAgICAgICB3YWl0Rm9ySWZyYW1lTG9hZDogY29udGVudFtcIndhaXRGb3JJZnJhbWVMb2FkXCJdLFxuICAgICAgICBkYXRhOiBjb250ZW50W1wiZGF0YVwiXVxuICAgICAgfTtcblxuICAgICAgLy8gRmluYWxseSwgcHJvY2VzcyB0aGF0IHdpZGdldFxuICAgICAgcmV0dXJuIFdpZGdldFBhcnNlci5wcm9jZXNzRXN0aW1hdGVkV2lkZ2V0KGVzdGltYXRlZFdpZGdldCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByb2Nlc3NFc3RpbWF0ZWRXaWRnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2Vzc0VzdGltYXRlZFdpZGdldCh3aWRnZXQpIHtcbiAgICAgIC8vIFZhbGlkYXRlIHRoYXQgdGhlIHdpZGdldCBoYXMgdGhlIGJlc3QgY2hhbmNlIG9mIHBhc3NpbmcgYXMgYSB3aWRnZXRcbiAgICAgIGlmICghd2lkZ2V0LmlkIHx8ICF3aWRnZXQuY3JlYXRvclVzZXJJZCB8fCAhd2lkZ2V0LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoISgwLCBfdXJsLmlzVmFsaWRVcmwpKHdpZGdldC51cmwpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgLy8gVE9ETzogVmFsaWRhdGUgZGF0YSBmb3Iga25vd24gd2lkZ2V0IHR5cGVzXG4gICAgICByZXR1cm4gbmV3IF9XaWRnZXQuV2lkZ2V0KHdpZGdldCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBXaWRnZXRQYXJzZXI7XG59KCk7XG5leHBvcnRzLldpZGdldFBhcnNlciA9IFdpZGdldFBhcnNlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdpZGdldFBhcnNlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaXNWYWxpZFVybCA9IGlzVmFsaWRVcmw7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmZ1bmN0aW9uIGlzVmFsaWRVcmwodmFsKSB7XG4gIGlmICghdmFsKSByZXR1cm4gZmFsc2U7IC8vIGVhc3k6IG5vdCB2YWxpZCBpZiBub3QgcHJlc2VudFxuXG4gIHRyeSB7XG4gICAgdmFyIHBhcnNlZCA9IG5ldyBVUkwodmFsKTtcbiAgICBpZiAocGFyc2VkLnByb3RvY29sICE9PSBcImh0dHBcIiAmJiBwYXJzZWQucHJvdG9jb2wgIT09IFwiaHR0cHNcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVybC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYXNzZXJ0UHJlc2VudCA9IGFzc2VydFByZXNlbnQ7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5mdW5jdGlvbiBhc3NlcnRQcmVzZW50KG9iaiwga2V5KSB7XG4gIGlmICghb2JqW2tleV0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIi5jb25jYXQoU3RyaW5nKGtleSksIFwiIGlzIHJlcXVpcmVkXCIpKTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJ1blRlbXBsYXRlID0gcnVuVGVtcGxhdGU7XG5leHBvcnRzLnRvU3RyaW5nID0gdG9TdHJpbmc7XG4vKlxuICogQ29weXJpZ2h0IDIwMjAsIDIwMjEgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmZ1bmN0aW9uIHJ1blRlbXBsYXRlKHVybCwgd2lkZ2V0LCBwYXJhbXMpIHtcbiAgLy8gQWx3YXlzIGFwcGx5IHRoZSBzdXBwbGllZCBwYXJhbXMgb3ZlciB0b3Agb2YgZGF0YSB0byBlbnN1cmUgdGhlIGRhdGEgY2FuJ3QgbGllIGFib3V0IHRoZW0uXG4gIHZhciB2YXJpYWJsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB3aWRnZXQuZGF0YSwge1xuICAgIFwibWF0cml4X3Jvb21faWRcIjogcGFyYW1zLndpZGdldFJvb21JZCB8fCBcIlwiLFxuICAgIFwibWF0cml4X3VzZXJfaWRcIjogcGFyYW1zLmN1cnJlbnRVc2VySWQsXG4gICAgXCJtYXRyaXhfZGlzcGxheV9uYW1lXCI6IHBhcmFtcy51c2VyRGlzcGxheU5hbWUgfHwgcGFyYW1zLmN1cnJlbnRVc2VySWQsXG4gICAgXCJtYXRyaXhfYXZhdGFyX3VybFwiOiBwYXJhbXMudXNlckh0dHBBdmF0YXJVcmwgfHwgXCJcIixcbiAgICBcIm1hdHJpeF93aWRnZXRfaWRcIjogd2lkZ2V0LmlkLFxuICAgIC8vIFRPRE86IENvbnZlcnQgdG8gc3RhYmxlIChodHRwczovL2dpdGh1Yi5jb20vbWF0cml4LW9yZy9tYXRyaXgtZG9jL3B1bGwvMjg3MylcbiAgICBcIm9yZy5tYXRyaXgubXNjMjg3My5jbGllbnRfaWRcIjogcGFyYW1zLmNsaWVudElkIHx8IFwiXCIsXG4gICAgXCJvcmcubWF0cml4Lm1zYzI4NzMuY2xpZW50X3RoZW1lXCI6IHBhcmFtcy5jbGllbnRUaGVtZSB8fCBcIlwiLFxuICAgIFwib3JnLm1hdHJpeC5tc2MyODczLmNsaWVudF9sYW5ndWFnZVwiOiBwYXJhbXMuY2xpZW50TGFuZ3VhZ2UgfHwgXCJcIixcbiAgICAvLyBUT0RPOiBDb252ZXJ0IHRvIHN0YWJsZSAoaHR0cHM6Ly9naXRodWIuY29tL21hdHJpeC1vcmcvbWF0cml4LXNwZWMtcHJvcG9zYWxzL3B1bGwvMzgxOSlcbiAgICBcIm9yZy5tYXRyaXgubXNjMzgxOS5tYXRyaXhfZGV2aWNlX2lkXCI6IHBhcmFtcy5kZXZpY2VJZCB8fCBcIlwiLFxuICAgIC8vIFRPRE86IENvbnZlcnQgdG8gc3RhYmxlIChodHRwczovL2dpdGh1Yi5jb20vbWF0cml4LW9yZy9tYXRyaXgtc3BlYy1wcm9wb3NhbHMvcHVsbC80MDM5KVxuICAgIFwib3JnLm1hdHJpeC5tc2M0MDM5Lm1hdHJpeF9iYXNlX3VybFwiOiBwYXJhbXMuYmFzZVVybCB8fCBcIlwiXG4gIH0pO1xuICB2YXIgcmVzdWx0ID0gdXJsO1xuICBmb3IgKHZhciBfaSA9IDAsIF9PYmplY3Qka2V5cyA9IE9iamVjdC5rZXlzKHZhcmlhYmxlcyk7IF9pIDwgX09iamVjdCRrZXlzLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBrZXkgPSBfT2JqZWN0JGtleXNbX2ldO1xuICAgIC8vIFJlZ2V4IGVzY2FwZSBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82OTY5NDg2LzcwMzczNzlcbiAgICB2YXIgcGF0dGVybiA9IFwiJFwiLmNvbmNhdChrZXkpLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXG4gICAgdmFyIHJleHAgPSBuZXcgUmVnRXhwKHBhdHRlcm4sIFwiZ1wiKTtcblxuICAgIC8vIFRoaXMgaXMgdGVjaG5pY2FsbHkgbm90IHdoYXQgd2UncmUgc3VwcG9zZWQgdG8gZG8gZm9yIGEgY291cGxlIG9mIHJlYXNvbnM6XG4gICAgLy8gMS4gV2UgYXJlIGFzc3VtaW5nIHRoYXQgdGhlcmUgd29uJ3QgbGF0ZXIgYmUgYSAka2V5IG1hdGNoIGFmdGVyIHdlIHJlcGxhY2UgYSB2YXJpYWJsZS5cbiAgICAvLyAyLiBXZSBhcmUgYXNzdW1pbmcgdGhhdCB0aGUgdmFyaWFibGUgaXMgaW4gYSBwbGFjZSB3aGVyZSBpdCBjYW4gYmUgZXNjYXBlZCAoZWc6IHBhdGggb3IgcXVlcnkgc3RyaW5nKS5cbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShyZXhwLCBlbmNvZGVVUklDb21wb25lbnQodG9TdHJpbmcodmFyaWFibGVzW2tleV0pKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIHRvU3RyaW5nKGEpIHtcbiAgaWYgKGEgPT09IG51bGwgfHwgYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFwiXCIuY29uY2F0KGEpO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tYmFzZS10by1zdHJpbmdcbiAgcmV0dXJuIFN0cmluZyhhKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVybC10ZW1wbGF0ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuUG9zdG1lc3NhZ2VUcmFuc3BvcnQgPSB2b2lkIDA7XG52YXIgX2V2ZW50cyA9IHJlcXVpcmUoXCJldmVudHNcIik7XG52YXIgXyA9IHJlcXVpcmUoXCIuLlwiKTtcbnZhciBfZXhjbHVkZWQgPSBbXCJtZXNzYWdlXCJdO1xuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH0sIF90eXBlb2Yob2JqKTsgfVxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTsgdmFyIGtleSwgaTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHNvdXJjZVN5bWJvbEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VTeW1ib2xLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZVN5bWJvbEtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSByZXR1cm4gdGFyZ2V0OyB9XG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307IGkgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgITApLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IHJldHVybiB0YXJnZXQ7IH1cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIF90b1Byb3BlcnR5S2V5KGRlc2NyaXB0b3Iua2V5KSwgZGVzY3JpcHRvcik7IH0gfVxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHsgd3JpdGFibGU6IGZhbHNlIH0pOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWJDbGFzcywgXCJwcm90b3R5cGVcIiwgeyB3cml0YWJsZTogZmFsc2UgfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2YuYmluZCgpIDogZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuZnVuY3Rpb24gX2NyZWF0ZVN1cGVyKERlcml2ZWQpIHsgdmFyIGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QgPSBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCk7IHJldHVybiBmdW5jdGlvbiBfY3JlYXRlU3VwZXJJbnRlcm5hbCgpIHsgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLCByZXN1bHQ7IGlmIChoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KSB7IHZhciBOZXdUYXJnZXQgPSBfZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7IHJlc3VsdCA9IFJlZmxlY3QuY29uc3RydWN0KFN1cGVyLCBhcmd1bWVudHMsIE5ld1RhcmdldCk7IH0gZWxzZSB7IHJlc3VsdCA9IFN1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH0gcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIHJlc3VsdCk7IH07IH1cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gZWxzZSBpZiAoY2FsbCAhPT0gdm9pZCAwKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5mdW5jdGlvbiBfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0KCkgeyBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIgfHwgIVJlZmxlY3QuY29uc3RydWN0KSByZXR1cm4gZmFsc2U7IGlmIChSZWZsZWN0LmNvbnN0cnVjdC5zaGFtKSByZXR1cm4gZmFsc2U7IGlmICh0eXBlb2YgUHJveHkgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7IHRyeSB7IEJvb2xlYW4ucHJvdG90eXBlLnZhbHVlT2YuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChCb29sZWFuLCBbXSwgZnVuY3Rpb24gKCkge30pKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH1cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZi5iaW5kKCkgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGtleSA9IF90b1Byb3BlcnR5S2V5KGtleSk7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7IHZhciBrZXkgPSBfdG9QcmltaXRpdmUoYXJnLCBcInN0cmluZ1wiKTsgcmV0dXJuIF90eXBlb2Yoa2V5KSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKF90eXBlb2YoaW5wdXQpICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKF90eXBlb2YocmVzKSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJlczsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkBAdG9QcmltaXRpdmUgbXVzdCByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUuXCIpOyB9IHJldHVybiAoaGludCA9PT0gXCJzdHJpbmdcIiA/IFN0cmluZyA6IE51bWJlcikoaW5wdXQpOyB9IC8qXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQ29weXJpZ2h0IDIwMjAgLSAyMDI0IFRoZSBNYXRyaXgub3JnIEZvdW5kYXRpb24gQy5JLkMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqICAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qKlxuICogVHJhbnNwb3J0IGZvciB0aGUgV2lkZ2V0IEFQSSBvdmVyIHBvc3RNZXNzYWdlLlxuICovXG52YXIgUG9zdG1lc3NhZ2VUcmFuc3BvcnQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgX2luaGVyaXRzKFBvc3RtZXNzYWdlVHJhbnNwb3J0LCBfRXZlbnRFbWl0dGVyKTtcbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihQb3N0bWVzc2FnZVRyYW5zcG9ydCk7XG4gIGZ1bmN0aW9uIFBvc3RtZXNzYWdlVHJhbnNwb3J0KHNlbmREaXJlY3Rpb24sIGluaXRpYWxXaWRnZXRJZCwgdHJhbnNwb3J0V2luZG93LCBpbmJvdW5kV2luZG93KSB7XG4gICAgdmFyIF90aGlzO1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQb3N0bWVzc2FnZVRyYW5zcG9ydCk7XG4gICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKTtcbiAgICBfdGhpcy5zZW5kRGlyZWN0aW9uID0gc2VuZERpcmVjdGlvbjtcbiAgICBfdGhpcy50cmFuc3BvcnRXaW5kb3cgPSB0cmFuc3BvcnRXaW5kb3c7XG4gICAgX3RoaXMuaW5ib3VuZFdpbmRvdyA9IGluYm91bmRXaW5kb3c7XG4gICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInN0cmljdE9yaWdpbkNoZWNrXCIsIGZhbHNlKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwidGFyZ2V0T3JpZ2luXCIsIFwiKlwiKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwidGltZW91dFNlY29uZHNcIiwgMTApO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJfcmVhZHlcIiwgZmFsc2UpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJfd2lkZ2V0SWRcIiwgdm9pZCAwKTtcbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwib3V0Ym91bmRSZXF1ZXN0c1wiLCBuZXcgTWFwKCkpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJzdG9wQ29udHJvbGxlclwiLCBuZXcgQWJvcnRDb250cm9sbGVyKCkpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJoYW5kbGVNZXNzYWdlXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgaWYgKF90aGlzLnN0b3BDb250cm9sbGVyLnNpZ25hbC5hYm9ydGVkKSByZXR1cm47XG4gICAgICBpZiAoIWV2LmRhdGEpIHJldHVybjsgLy8gaW52YWxpZCBldmVudFxuXG4gICAgICBpZiAoX3RoaXMuc3RyaWN0T3JpZ2luQ2hlY2sgJiYgZXYub3JpZ2luICE9PSBnbG9iYWxUaGlzLm9yaWdpbikgcmV0dXJuOyAvLyBiYWQgb3JpZ2luXG5cbiAgICAgIC8vIHRyZWF0IHRoZSBtZXNzYWdlIGFzIGEgcmVzcG9uc2UgZmlyc3QsIHRoZW4gZG93bmdyYWRlIHRvIGEgcmVxdWVzdFxuICAgICAgdmFyIHJlc3BvbnNlID0gZXYuZGF0YTtcbiAgICAgIGlmICghcmVzcG9uc2UuYWN0aW9uIHx8ICFyZXNwb25zZS5yZXF1ZXN0SWQgfHwgIXJlc3BvbnNlLndpZGdldElkKSByZXR1cm47IC8vIGludmFsaWQgcmVxdWVzdC9yZXNwb25zZVxuXG4gICAgICBpZiAocmVzcG9uc2UucmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmFwaSAhPT0gX3RoaXMuc2VuZERpcmVjdGlvbikgcmV0dXJuOyAvLyB3cm9uZyBkaXJlY3Rpb25cbiAgICAgICAgX3RoaXMuaGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSByZXNwb25zZTtcbiAgICAgICAgaWYgKHJlcXVlc3QuYXBpICE9PSAoMCwgXy5pbnZlcnRlZERpcmVjdGlvbikoX3RoaXMuc2VuZERpcmVjdGlvbikpIHJldHVybjsgLy8gd3JvbmcgZGlyZWN0aW9uXG4gICAgICAgIF90aGlzLmhhbmRsZVJlcXVlc3QocmVxdWVzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgX3RoaXMuX3dpZGdldElkID0gaW5pdGlhbFdpZGdldElkO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuICBfY3JlYXRlQ2xhc3MoUG9zdG1lc3NhZ2VUcmFuc3BvcnQsIFt7XG4gICAga2V5OiBcInJlYWR5XCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVhZHk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIndpZGdldElkXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd2lkZ2V0SWQgfHwgbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibmV4dFJlcXVlc3RJZFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIGlkQmFzZSA9IFwid2lkZ2V0YXBpLVwiLmNvbmNhdChEYXRlLm5vdygpKTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgaWQgPSBpZEJhc2U7XG4gICAgICB3aGlsZSAodGhpcy5vdXRib3VuZFJlcXVlc3RzLmhhcyhpZCkpIHtcbiAgICAgICAgaWQgPSBcIlwiLmNvbmNhdChpZEJhc2UsIFwiLVwiKS5jb25jYXQoaW5kZXgrKyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlc2VydmUgdGhlIElEXG4gICAgICB0aGlzLm91dGJvdW5kUmVxdWVzdHMuc2V0KGlkLCBudWxsKTtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2VuZEludGVybmFsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmRJbnRlcm5hbChtZXNzYWdlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIltQb3N0bWVzc2FnZVRyYW5zcG9ydF0gU2VuZGluZyBvYmplY3QgdG8gXCIuY29uY2F0KHRoaXMudGFyZ2V0T3JpZ2luLCBcIjogXCIpLCBtZXNzYWdlKTtcbiAgICAgIHRoaXMudHJhbnNwb3J0V2luZG93LnBvc3RNZXNzYWdlKG1lc3NhZ2UsIHRoaXMudGFyZ2V0T3JpZ2luKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVwbHlcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVwbHkocmVxdWVzdCwgcmVzcG9uc2VEYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW5kSW50ZXJuYWwoX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCByZXF1ZXN0KSwge30sIHtcbiAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlRGF0YVxuICAgICAgfSkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNlbmQoYWN0aW9uLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW5kQ29tcGxldGUoYWN0aW9uLCBkYXRhKS50aGVuKGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIHJldHVybiByLnJlc3BvbnNlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNlbmRDb21wbGV0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kQ29tcGxldGUoYWN0aW9uLCBkYXRhKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcbiAgICAgIGlmICghdGhpcy5yZWFkeSB8fCAhdGhpcy53aWRnZXRJZCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTm90IHJlYWR5IG9yIHVua25vd24gd2lkZ2V0IElEXCIpKTtcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICBhcGk6IHRoaXMuc2VuZERpcmVjdGlvbixcbiAgICAgICAgd2lkZ2V0SWQ6IHRoaXMud2lkZ2V0SWQsXG4gICAgICAgIHJlcXVlc3RJZDogdGhpcy5uZXh0UmVxdWVzdElkLFxuICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfTtcbiAgICAgIGlmIChhY3Rpb24gPT09IF8uV2lkZ2V0QXBpVG9XaWRnZXRBY3Rpb24uVXBkYXRlVmlzaWJpbGl0eSkge1xuICAgICAgICByZXF1ZXN0W1widmlzaWJsZVwiXSA9IGRhdGFbXCJ2aXNpYmxlXCJdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChwclJlc29sdmUsIHByUmVqZWN0KSB7XG4gICAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24gcmVzb2x2ZShyZXNwb25zZSkge1xuICAgICAgICAgIGNsZWFuVXAoKTtcbiAgICAgICAgICBwclJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVqZWN0ID0gZnVuY3Rpb24gcmVqZWN0KGVycikge1xuICAgICAgICAgIGNsZWFuVXAoKTtcbiAgICAgICAgICBwclJlamVjdChlcnIpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgdGltZXJJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdCB0aW1lZCBvdXRcIikpO1xuICAgICAgICB9LCAoX3RoaXMyLnRpbWVvdXRTZWNvbmRzIHx8IDEpICogMTAwMCk7XG4gICAgICAgIHZhciBvblN0b3AgPSBmdW5jdGlvbiBvblN0b3AoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJUcmFuc3BvcnQgc3RvcHBlZFwiKSk7XG4gICAgICAgIH07XG4gICAgICAgIF90aGlzMi5zdG9wQ29udHJvbGxlci5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uU3RvcCk7XG4gICAgICAgIHZhciBjbGVhblVwID0gZnVuY3Rpb24gY2xlYW5VcCgpIHtcbiAgICAgICAgICBfdGhpczIub3V0Ym91bmRSZXF1ZXN0c1tcImRlbGV0ZVwiXShyZXF1ZXN0LnJlcXVlc3RJZCk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgICAgICAgIF90aGlzMi5zdG9wQ29udHJvbGxlci5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIG9uU3RvcCk7XG4gICAgICAgIH07XG4gICAgICAgIF90aGlzMi5vdXRib3VuZFJlcXVlc3RzLnNldChyZXF1ZXN0LnJlcXVlc3RJZCwge1xuICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3QsXG4gICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICByZWplY3Q6IHJlamVjdFxuICAgICAgICB9KTtcbiAgICAgICAgX3RoaXMyLnNlbmRJbnRlcm5hbChyZXF1ZXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdGFydFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgIHRoaXMuaW5ib3VuZFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCB0aGlzLmhhbmRsZU1lc3NhZ2UpO1xuICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdG9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgICAgdGhpcy5zdG9wQ29udHJvbGxlci5hYm9ydCgpO1xuICAgICAgdGhpcy5pbmJvdW5kV2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHRoaXMuaGFuZGxlTWVzc2FnZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhbmRsZVJlcXVlc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgICBpZiAodGhpcy53aWRnZXRJZCkge1xuICAgICAgICBpZiAodGhpcy53aWRnZXRJZCAhPT0gcmVxdWVzdC53aWRnZXRJZCkgcmV0dXJuOyAvLyB3cm9uZyB3aWRnZXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dpZGdldElkID0gcmVxdWVzdC53aWRnZXRJZDtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdChcIm1lc3NhZ2VcIiwgbmV3IEN1c3RvbUV2ZW50KFwibWVzc2FnZVwiLCB7XG4gICAgICAgIGRldGFpbDogcmVxdWVzdFxuICAgICAgfSkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYW5kbGVSZXNwb25zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLndpZGdldElkICE9PSB0aGlzLndpZGdldElkKSByZXR1cm47IC8vIHdyb25nIHdpZGdldFxuXG4gICAgICB2YXIgcmVxID0gdGhpcy5vdXRib3VuZFJlcXVlc3RzLmdldChyZXNwb25zZS5yZXF1ZXN0SWQpO1xuICAgICAgaWYgKCFyZXEpIHJldHVybjsgLy8gcmVzcG9uc2UgdG8gYW4gdW5rbm93biByZXF1ZXN0XG5cbiAgICAgIGlmICgoMCwgXy5pc0Vycm9yUmVzcG9uc2UpKHJlc3BvbnNlLnJlc3BvbnNlKSkge1xuICAgICAgICB2YXIgX3Jlc3BvbnNlJHJlc3BvbnNlJGVyID0gcmVzcG9uc2UucmVzcG9uc2UuZXJyb3IsXG4gICAgICAgICAgbWVzc2FnZSA9IF9yZXNwb25zZSRyZXNwb25zZSRlci5tZXNzYWdlLFxuICAgICAgICAgIGRhdGEgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3Jlc3BvbnNlJHJlc3BvbnNlJGVyLCBfZXhjbHVkZWQpO1xuICAgICAgICByZXEucmVqZWN0KG5ldyBfLldpZGdldEFwaVJlc3BvbnNlRXJyb3IobWVzc2FnZSwgZGF0YSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gUG9zdG1lc3NhZ2VUcmFuc3BvcnQ7XG59KF9ldmVudHMuRXZlbnRFbWl0dGVyKTtcbmV4cG9ydHMuUG9zdG1lc3NhZ2VUcmFuc3BvcnQgPSBQb3N0bWVzc2FnZVRyYW5zcG9ydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBvc3RtZXNzYWdlVHJhbnNwb3J0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5TaW1wbGVPYnNlcnZhYmxlID0gdm9pZCAwO1xuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH0sIF90eXBlb2Yob2JqKTsgfVxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZSkgeyB0aHJvdyBfZTsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTI7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdFtcInJldHVyblwiXSAhPSBudWxsKSBpdFtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoZGlkRXJyKSB0aHJvdyBlcnI7IH0gfSB9OyB9XG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07IHJldHVybiBhcnIyOyB9XG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBfdG9Qcm9wZXJ0eUtleShkZXNjcmlwdG9yLmtleSksIGRlc2NyaXB0b3IpOyB9IH1cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnN0cnVjdG9yLCBcInByb3RvdHlwZVwiLCB7IHdyaXRhYmxlOiBmYWxzZSB9KTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGtleSA9IF90b1Byb3BlcnR5S2V5KGtleSk7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuZnVuY3Rpb24gX3RvUHJvcGVydHlLZXkoYXJnKSB7IHZhciBrZXkgPSBfdG9QcmltaXRpdmUoYXJnLCBcInN0cmluZ1wiKTsgcmV0dXJuIF90eXBlb2Yoa2V5KSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKF90eXBlb2YoaW5wdXQpICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKF90eXBlb2YocmVzKSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJlczsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkBAdG9QcmltaXRpdmUgbXVzdCByZXR1cm4gYSBwcmltaXRpdmUgdmFsdWUuXCIpOyB9IHJldHVybiAoaGludCA9PT0gXCJzdHJpbmdcIiA/IFN0cmluZyA6IE51bWJlcikoaW5wdXQpOyB9XG4vKlxuICogQ29weXJpZ2h0IDIwMjAgVGhlIE1hdHJpeC5vcmcgRm91bmRhdGlvbiBDLkkuQy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG52YXIgU2ltcGxlT2JzZXJ2YWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNpbXBsZU9ic2VydmFibGUoaW5pdGlhbEZuKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNpbXBsZU9ic2VydmFibGUpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxpc3RlbmVyc1wiLCBbXSk7XG4gICAgaWYgKGluaXRpYWxGbikgdGhpcy5saXN0ZW5lcnMucHVzaChpbml0aWFsRm4pO1xuICB9XG4gIF9jcmVhdGVDbGFzcyhTaW1wbGVPYnNlcnZhYmxlLCBbe1xuICAgIGtleTogXCJvblVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvblVwZGF0ZShmbikge1xuICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChmbik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUodmFsKSB7XG4gICAgICB2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5saXN0ZW5lcnMpLFxuICAgICAgICBfc3RlcDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gX3N0ZXAudmFsdWU7XG4gICAgICAgICAgbGlzdGVuZXIodmFsKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvci5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IuZigpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbG9zZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzID0gW107IC8vIHJlc2V0XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBTaW1wbGVPYnNlcnZhYmxlO1xufSgpO1xuZXhwb3J0cy5TaW1wbGVPYnNlcnZhYmxlID0gU2ltcGxlT2JzZXJ2YWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNpbXBsZU9ic2VydmFibGUuanMubWFwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gX2dldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlcnJvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIHJlc29sdmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgaWYgKG5hbWUgIT09ICdlcnJvcicpIHtcbiAgICAgIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGVycm9yTGlzdGVuZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBoYW5kbGVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgJ2Vycm9yJywgaGFuZGxlciwgZmxhZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCBsaXN0ZW5lciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgIGVtaXR0ZXIub25jZShuYW1lLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXR0ZXIub24obmFtZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXZlbnRUYXJnZXQgZG9lcyBub3QgaGF2ZSBgZXJyb3JgIGV2ZW50IHNlbWFudGljcyBsaWtlIE5vZGVcbiAgICAvLyBFdmVudEVtaXR0ZXJzLCB3ZSBkbyBub3QgbGlzdGVuIGZvciBgZXJyb3JgIGV2ZW50cyBoZXJlLlxuICAgIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiB3cmFwTGlzdGVuZXIoYXJnKSB7XG4gICAgICAvLyBJRSBkb2VzIG5vdCBoYXZlIGJ1aWx0aW4gYHsgb25jZTogdHJ1ZSB9YCBzdXBwb3J0IHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIGRvIGl0IG1hbnVhbGx5LlxuICAgICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHdyYXBMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lcihhcmcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgZW1pdHRlcik7XG4gIH1cbn1cbiJdfQ==
