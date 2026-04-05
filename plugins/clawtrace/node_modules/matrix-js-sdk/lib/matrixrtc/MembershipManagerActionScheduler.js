import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { logger as rootLogger } from "../logger.js";
import { sleep } from "../utils.js";
import { MembershipActionType } from "./MembershipManager.js";

/** @internal */

/** @internal */

/**
 * This scheduler tracks the state of the current membership participation
 * and runs one central timer that wakes up a handler callback with the correct action + state
 * whenever necessary.
 *
 * It can also be awakened whenever a new action is added which is
 * earlier then the current "next awake".
 * @internal
 */
export class ActionScheduler {
  constructor(/** This is the callback called for each scheduled action (`this.addAction()`) */
  membershipLoopHandler, parentLogger) {
    this.membershipLoopHandler = membershipLoopHandler;
    _defineProperty(this, "logger", void 0);
    /**
     * This is tracking the state of the scheduler loop.
     * Only used to prevent starting the loop twice.
     */
    _defineProperty(this, "running", false);
    // function for the wakeup mechanism (in case we add an action externally and need to leave the current sleep)
    _defineProperty(this, "wakeup", update => {
      this.logger.error("Cannot call wakeup before calling `startWithJoin()`");
    });
    _defineProperty(this, "_actions", []);
    this.logger = (parentLogger !== null && parentLogger !== void 0 ? parentLogger : rootLogger).getChild("[NewMembershipActionScheduler]");
  }
  get actions() {
    return this._actions;
  }

  /**
   * This starts the main loop of the membership manager that handles event sending, delayed event sending and delayed event restarting.
   * @param initialActions The initial actions the manager will start with. It should be enough to pass: DelayedLeaveActionType.Initial
   * @returns Promise that resolves once all actions have run and no more are scheduled.
   * @throws This throws an error if one of the actions throws.
   * In most other error cases the manager will try to handle any server errors by itself.
   */
  startWithJoin() {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (_this.running) {
        _this.logger.error("Cannot call startWithJoin() on NewMembershipActionScheduler while already running");
        return;
      }
      _this.running = true;
      _this._actions = [{
        ts: Date.now(),
        type: MembershipActionType.SendDelayedEvent
      }];
      try {
        var _loop = function* _loop() {
          // Sort so next (smallest ts) action is at the beginning
          _this._actions.sort((a, b) => a.ts - b.ts);
          var nextAction = _this._actions[0];
          var wakeupUpdate = undefined;

          // while we await for the next action, wakeup has to resolve the wakeupPromise
          var wakeupPromise = new Promise(resolve => {
            _this.wakeup = update => {
              wakeupUpdate = update;
              resolve();
            };
          });
          if (nextAction.ts > Date.now()) yield Promise.race([wakeupPromise, sleep(nextAction.ts - Date.now())]);
          var handlerResult = {};
          if (!wakeupUpdate) {
            _this.logger.debug("Current MembershipManager processing: ".concat(nextAction.type, "\nQueue:"), _this._actions, "\nDate.now: \"".concat(Date.now()));
            try {
              // `this.wakeup` can also be called and sets the `wakeupUpdate` object while we are in the handler.
              handlerResult = yield _this.membershipLoopHandler(nextAction.type);
            } catch (e) {
              throw Error("The MembershipManager shut down because of the end condition: ".concat(e));
            }
          }
          // remove the processed action only after we are done processing
          _this._actions.splice(0, 1);
          // The wakeupUpdate always wins since that is a direct external update.
          var actionUpdate = wakeupUpdate !== null && wakeupUpdate !== void 0 ? wakeupUpdate : handlerResult;
          if ("replace" in actionUpdate) {
            _this._actions = actionUpdate.replace;
          } else if ("insert" in actionUpdate) {
            _this._actions.push(...actionUpdate.insert);
          }
        };
        while (_this._actions.length > 0) {
          yield* _loop();
        }
      } finally {
        // Set the rtc session running state since we cannot recover from here and the consumer user of the
        // MatrixRTCSession class needs to manually rejoin.
        _this.running = false;
      }
      _this.logger.debug("Leave MembershipManager ActionScheduler loop (no more actions)");
    })();
  }
  initiateJoin() {
    var _this$wakeup;
    (_this$wakeup = this.wakeup) === null || _this$wakeup === void 0 || _this$wakeup.call(this, {
      replace: [{
        ts: Date.now(),
        type: MembershipActionType.SendDelayedEvent
      }]
    });
  }
  initiateLeave() {
    var _this$wakeup2;
    (_this$wakeup2 = this.wakeup) === null || _this$wakeup2 === void 0 || _this$wakeup2.call(this, {
      replace: [{
        ts: Date.now(),
        type: MembershipActionType.SendScheduledDelayedLeaveEvent
      }]
    });
  }
}
//# sourceMappingURL=MembershipManagerActionScheduler.js.map