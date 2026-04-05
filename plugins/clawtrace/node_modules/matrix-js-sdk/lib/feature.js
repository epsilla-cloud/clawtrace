import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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

export var ServerSupport = /*#__PURE__*/function (ServerSupport) {
  ServerSupport[ServerSupport["Stable"] = 0] = "Stable";
  ServerSupport[ServerSupport["Unstable"] = 1] = "Unstable";
  ServerSupport[ServerSupport["Unsupported"] = 2] = "Unsupported";
  return ServerSupport;
}({});
export var Feature = /*#__PURE__*/function (Feature) {
  Feature["Thread"] = "Thread";
  Feature["ThreadUnreadNotifications"] = "ThreadUnreadNotifications";
  /**
   * @deprecated this is now exposed as a capability not a feature
   */
  Feature["LoginTokenRequest"] = "LoginTokenRequest";
  Feature["RelationBasedRedactions"] = "RelationBasedRedactions";
  Feature["AccountDataDeletion"] = "AccountDataDeletion";
  Feature["RelationsRecursion"] = "RelationsRecursion";
  Feature["IntentionalMentions"] = "IntentionalMentions";
  return Feature;
}({});
var featureSupportResolver = {
  [Feature.Thread]: {
    unstablePrefixes: ["org.matrix.msc3440"],
    matrixVersion: "v1.3"
  },
  [Feature.ThreadUnreadNotifications]: {
    unstablePrefixes: ["org.matrix.msc3771", "org.matrix.msc3773"],
    matrixVersion: "v1.4"
  },
  [Feature.LoginTokenRequest]: {
    unstablePrefixes: ["org.matrix.msc3882"]
  },
  [Feature.RelationBasedRedactions]: {
    unstablePrefixes: ["org.matrix.msc3912"]
  },
  [Feature.AccountDataDeletion]: {
    unstablePrefixes: ["org.matrix.msc3391"]
  },
  [Feature.RelationsRecursion]: {
    unstablePrefixes: ["org.matrix.msc3981"],
    matrixVersion: "v1.10"
  },
  [Feature.IntentionalMentions]: {
    unstablePrefixes: ["org.matrix.msc3952_intentional_mentions"],
    matrixVersion: "v1.7"
  }
};
export function buildFeatureSupportMap(_x) {
  return _buildFeatureSupportMap.apply(this, arguments);
}
function _buildFeatureSupportMap() {
  _buildFeatureSupportMap = _asyncToGenerator(function* (versions) {
    var supportMap = new Map();
    for (var [feature, supportCondition] of Object.entries(featureSupportResolver)) {
      var _versions$versions$in, _versions$versions, _supportCondition$uns, _supportCondition$uns2;
      var supportMatrixVersion = (_versions$versions$in = (_versions$versions = versions.versions) === null || _versions$versions === void 0 ? void 0 : _versions$versions.includes(supportCondition.matrixVersion || "")) !== null && _versions$versions$in !== void 0 ? _versions$versions$in : false;
      var supportUnstablePrefixes = (_supportCondition$uns = (_supportCondition$uns2 = supportCondition.unstablePrefixes) === null || _supportCondition$uns2 === void 0 ? void 0 : _supportCondition$uns2.every(unstablePrefix => {
        var _versions$unstable_fe;
        return ((_versions$unstable_fe = versions.unstable_features) === null || _versions$unstable_fe === void 0 ? void 0 : _versions$unstable_fe[unstablePrefix]) === true;
      })) !== null && _supportCondition$uns !== void 0 ? _supportCondition$uns : false;
      if (supportMatrixVersion) {
        supportMap.set(feature, ServerSupport.Stable);
      } else if (supportUnstablePrefixes) {
        supportMap.set(feature, ServerSupport.Unstable);
      } else {
        supportMap.set(feature, ServerSupport.Unsupported);
      }
    }
    return supportMap;
  });
  return _buildFeatureSupportMap.apply(this, arguments);
}
//# sourceMappingURL=feature.js.map