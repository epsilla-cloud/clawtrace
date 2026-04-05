import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { parseBeaconContent, parseBeaconInfoContent } from "../content-helpers.js";
import { sortEventsByLatestContentTimestamp } from "../utils.js";
import { TypedEventEmitter } from "./typed-event-emitter.js";
export var BeaconEvent = /*#__PURE__*/function (BeaconEvent) {
  BeaconEvent["New"] = "Beacon.new";
  BeaconEvent["Update"] = "Beacon.update";
  BeaconEvent["LivenessChange"] = "Beacon.LivenessChange";
  BeaconEvent["Destroy"] = "Beacon.Destroy";
  BeaconEvent["LocationUpdate"] = "Beacon.LocationUpdate";
  return BeaconEvent;
}({});
export var isTimestampInDuration = (startTimestamp, durationMs, timestamp) => timestamp >= startTimestamp && startTimestamp + durationMs >= timestamp;

// beacon info events are uniquely identified by
// `<roomId>_<state_key>`

export var getBeaconInfoIdentifier = event => "".concat(event.getRoomId(), "_").concat(event.getStateKey());

// https://github.com/matrix-org/matrix-spec-proposals/pull/3672
export class Beacon extends TypedEventEmitter {
  constructor(rootEvent) {
    super();
    this.rootEvent = rootEvent;
    _defineProperty(this, "roomId", void 0);
    // beaconInfo is assigned by setBeaconInfo in the constructor
    // ! to make tsc believe it is definitely assigned
    _defineProperty(this, "_beaconInfo", void 0);
    _defineProperty(this, "_isLive", void 0);
    _defineProperty(this, "livenessWatchTimeout", void 0);
    _defineProperty(this, "_latestLocationEvent", void 0);
    _defineProperty(this, "clearLatestLocation", () => {
      this._latestLocationEvent = undefined;
      this.emit(BeaconEvent.LocationUpdate, this.latestLocationState);
    });
    this.roomId = this.rootEvent.getRoomId();
    this.setBeaconInfo(this.rootEvent);
  }
  get isLive() {
    return !!this._isLive;
  }
  get identifier() {
    return getBeaconInfoIdentifier(this.rootEvent);
  }
  get beaconInfoId() {
    return this.rootEvent.getId();
  }
  get beaconInfoOwner() {
    return this.rootEvent.getStateKey();
  }
  get beaconInfoEventType() {
    return this.rootEvent.getType();
  }
  get beaconInfo() {
    return this._beaconInfo;
  }
  get latestLocationState() {
    return this._latestLocationEvent && parseBeaconContent(this._latestLocationEvent.getContent());
  }
  get latestLocationEvent() {
    return this._latestLocationEvent;
  }
  update(beaconInfoEvent) {
    if (getBeaconInfoIdentifier(beaconInfoEvent) !== this.identifier) {
      throw new Error("Invalid updating event");
    }
    // don't update beacon with an older event
    if (beaconInfoEvent.getTs() < this.rootEvent.getTs()) {
      return;
    }
    this.rootEvent = beaconInfoEvent;
    this.setBeaconInfo(this.rootEvent);
    this.emit(BeaconEvent.Update, beaconInfoEvent, this);
    this.clearLatestLocation();
  }
  destroy() {
    if (this.livenessWatchTimeout) {
      clearTimeout(this.livenessWatchTimeout);
    }
    this._isLive = false;
    this.emit(BeaconEvent.Destroy, this.identifier);
  }

  /**
   * Monitor liveness of a beacon
   * Emits BeaconEvent.LivenessChange when beacon expires
   */
  monitorLiveness() {
    if (this.livenessWatchTimeout) {
      clearTimeout(this.livenessWatchTimeout);
    }
    this.checkLiveness();
    if (!this.beaconInfo) return;
    if (this.isLive) {
      var expiryInMs = this.beaconInfo.timestamp + this.beaconInfo.timeout - Date.now();
      if (expiryInMs > 1) {
        this.livenessWatchTimeout = setTimeout(() => {
          this.monitorLiveness();
        }, expiryInMs);
      }
    } else if (this.beaconInfo.timestamp > Date.now()) {
      // beacon start timestamp is in the future
      // check liveness again then
      this.livenessWatchTimeout = setTimeout(() => {
        this.monitorLiveness();
      }, this.beaconInfo.timestamp - Date.now());
    }
  }

  /**
   * Process Beacon locations
   * Emits BeaconEvent.LocationUpdate
   */
  addLocations(beaconLocationEvents) {
    var _validLocationEvents$;
    // discard locations for beacons that are not live
    if (!this.isLive) {
      return;
    }
    var validLocationEvents = beaconLocationEvents.filter(event => {
      var content = event.getContent();
      var parsed = parseBeaconContent(content);
      if (!parsed.uri || !parsed.timestamp) return false; // we won't be able to process these
      var {
        timestamp
      } = parsed;
      return this._beaconInfo.timestamp &&
      // only include positions that were taken inside the beacon's live period
      isTimestampInDuration(this._beaconInfo.timestamp, this._beaconInfo.timeout, timestamp) && (
      // ignore positions older than our current latest location
      !this.latestLocationState || timestamp > this.latestLocationState.timestamp);
    });
    var latestLocationEvent = (_validLocationEvents$ = validLocationEvents.sort(sortEventsByLatestContentTimestamp)) === null || _validLocationEvents$ === void 0 ? void 0 : _validLocationEvents$[0];
    if (latestLocationEvent) {
      this._latestLocationEvent = latestLocationEvent;
      this.emit(BeaconEvent.LocationUpdate, this.latestLocationState);
    }
  }
  setBeaconInfo(event) {
    this._beaconInfo = parseBeaconInfoContent(event.getContent());
    this.checkLiveness();
  }
  checkLiveness() {
    var prevLiveness = this.isLive;

    // element web sets a beacon's start timestamp to the senders local current time
    // when Alice's system clock deviates slightly from Bob's a beacon Alice intended to be live
    // may have a start timestamp in the future from Bob's POV
    // handle this by adding 6min of leniency to the start timestamp when it is in the future
    if (!this.beaconInfo) return;
    var startTimestamp = this.beaconInfo.timestamp > Date.now() ? this.beaconInfo.timestamp - 360000 /* 6min */ : this.beaconInfo.timestamp;
    this._isLive = !!this._beaconInfo.live && !!startTimestamp && isTimestampInDuration(startTimestamp, this._beaconInfo.timeout, Date.now());
    if (prevLiveness !== this.isLive) {
      this.emit(BeaconEvent.LivenessChange, this.isLive, this);
    }
  }
}
//# sourceMappingURL=beacon.js.map