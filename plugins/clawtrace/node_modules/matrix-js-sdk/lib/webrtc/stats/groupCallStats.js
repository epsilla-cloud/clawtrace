import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2023 The Matrix.org Foundation C.I.C.

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
import { CallStatsReportGatherer } from "./callStatsReportGatherer.js";
import { StatsReportEmitter } from "./statsReportEmitter.js";
import { SummaryStatsReportGatherer } from "./summaryStatsReportGatherer.js";
import { logger } from "../../logger.js";
export class GroupCallStats {
  constructor(groupCallId, userId) {
    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10000;
    this.groupCallId = groupCallId;
    this.userId = userId;
    this.interval = interval;
    _defineProperty(this, "timer", void 0);
    _defineProperty(this, "gatherers", new Map());
    _defineProperty(this, "reports", new StatsReportEmitter());
    _defineProperty(this, "summaryStatsReportGatherer", new SummaryStatsReportGatherer(this.reports));
  }
  start() {
    if (this.timer === undefined && this.interval > 0) {
      this.timer = setInterval(() => {
        this.processStats();
      }, this.interval);
    }
  }
  stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.gatherers.forEach(c => c.stopProcessingStats());
    }
  }
  hasStatsReportGatherer(callId) {
    return this.gatherers.has(callId);
  }
  addStatsReportGatherer(callId, opponentMemberId, peerConnection) {
    if (this.hasStatsReportGatherer(callId)) {
      return false;
    }
    this.gatherers.set(callId, new CallStatsReportGatherer(callId, opponentMemberId, peerConnection, this.reports));
    return true;
  }
  removeStatsReportGatherer(callId) {
    return this.gatherers.delete(callId);
  }
  getStatsReportGatherer(callId) {
    return this.hasStatsReportGatherer(callId) ? this.gatherers.get(callId) : undefined;
  }
  updateOpponentMember(callId, opponentMember) {
    var _this$getStatsReportG;
    (_this$getStatsReportG = this.getStatsReportGatherer(callId)) === null || _this$getStatsReportG === void 0 || _this$getStatsReportG.setOpponentMemberId(opponentMember);
  }
  processStats() {
    var summary = [];
    this.gatherers.forEach(c => {
      summary.push(c.processStats(this.groupCallId, this.userId));
    });
    Promise.all(summary).then(s => this.summaryStatsReportGatherer.build(s)).catch(err => {
      logger.error("Could not build summary stats report", err);
    });
  }
  setInterval(interval) {
    this.interval = interval;
  }
}
//# sourceMappingURL=groupCallStats.js.map