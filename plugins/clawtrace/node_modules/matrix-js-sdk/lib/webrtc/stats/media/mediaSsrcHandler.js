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

import { parse as parseSdp } from "sdp-transform";
export class MediaSsrcHandler {
  constructor() {
    _defineProperty(this, "ssrcToMid", {
      local: new Map(),
      remote: new Map()
    });
  }
  findMidBySsrc(ssrc, type) {
    var mid;
    this.ssrcToMid[type].forEach((ssrcs, m) => {
      if (ssrcs.find(s => s == ssrc)) {
        mid = m;
        return;
      }
    });
    return mid;
  }
  parse(description, type) {
    var sdp = parseSdp(description);
    var ssrcToMid = new Map();
    sdp.media.forEach(m => {
      if (!!m.mid && m.type === "video" || m.type === "audio") {
        var _m$ssrcs;
        var ssrcs = [];
        (_m$ssrcs = m.ssrcs) === null || _m$ssrcs === void 0 || _m$ssrcs.forEach(ssrc => {
          if (ssrc.attribute === "cname") {
            ssrcs.push("".concat(ssrc.id));
          }
        });
        ssrcToMid.set("".concat(m.mid), ssrcs);
      }
    });
    this.ssrcToMid[type] = ssrcToMid;
  }
  getSsrcToMidMap(type) {
    return this.ssrcToMid[type];
  }
}
//# sourceMappingURL=mediaSsrcHandler.js.map