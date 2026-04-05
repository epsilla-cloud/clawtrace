import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/*
Copyright 2018 - 2022 The Matrix.org Foundation C.I.C.

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

import { MsgType } from "./@types/event.js";
import { M_TEXT, REFERENCE_RELATION } from "./@types/extensible_events.js";
import { isProvided } from "./extensible_events_v1/utilities.js";
import { M_ASSET, LocationAssetType, M_LOCATION, M_TIMESTAMP } from "./@types/location.js";
import { M_TOPIC } from "./@types/topic.js";
/**
 * Generates the content for a HTML Message event
 * @param body - the plaintext body of the message
 * @param htmlBody - the HTML representation of the message
 * @returns
 */
export function makeHtmlMessage(body, htmlBody) {
  return {
    msgtype: MsgType.Text,
    format: "org.matrix.custom.html",
    body: body,
    formatted_body: htmlBody
  };
}

/**
 * Generates the content for a HTML Notice event
 * @param body - the plaintext body of the notice
 * @param htmlBody - the HTML representation of the notice
 * @returns
 */
export function makeHtmlNotice(body, htmlBody) {
  return {
    msgtype: MsgType.Notice,
    format: "org.matrix.custom.html",
    body: body,
    formatted_body: htmlBody
  };
}

/**
 * Generates the content for a HTML Emote event
 * @param body - the plaintext body of the emote
 * @param htmlBody - the HTML representation of the emote
 * @returns
 */
export function makeHtmlEmote(body, htmlBody) {
  return {
    msgtype: MsgType.Emote,
    format: "org.matrix.custom.html",
    body: body,
    formatted_body: htmlBody
  };
}

/**
 * Generates the content for a Plaintext Message event
 * @param body - the plaintext body of the emote
 * @returns
 */
export function makeTextMessage(body) {
  return {
    msgtype: MsgType.Text,
    body: body
  };
}

/**
 * Generates the content for a Plaintext Notice event
 * @param body - the plaintext body of the notice
 * @returns
 */
export function makeNotice(body) {
  return {
    msgtype: MsgType.Notice,
    body: body
  };
}

/**
 * Generates the content for a Plaintext Emote event
 * @param body - the plaintext body of the emote
 * @returns
 */
export function makeEmoteMessage(body) {
  return {
    msgtype: MsgType.Emote,
    body: body
  };
}

/** Location content helpers */

export var getTextForLocationEvent = (uri, assetType, timestamp, description) => {
  var date = "at ".concat(new Date(timestamp).toISOString());
  var assetName = assetType === LocationAssetType.Self ? "User" : undefined;
  var quotedDescription = description ? "\"".concat(description, "\"") : undefined;
  return [assetName, "Location", quotedDescription, uri, date].filter(Boolean).join(" ");
};

/**
 * Generates the content for a Location event
 * @param uri - a geo:// uri for the location
 * @param timestamp - the timestamp when the location was correct (milliseconds since the UNIX epoch)
 * @param description - the (optional) label for this location on the map
 * @param assetType - the (optional) asset type of this location e.g. "m.self"
 * @param text - optional. A text for the location
 */
export var makeLocationContent = (text, uri, timestamp, description, assetType) => {
  var defaultedText = text !== null && text !== void 0 ? text : getTextForLocationEvent(uri, assetType || LocationAssetType.Self, timestamp, description);
  var timestampEvent = timestamp ? {
    [M_TIMESTAMP.name]: timestamp
  } : {};
  return _objectSpread({
    msgtype: MsgType.Location,
    body: defaultedText,
    geo_uri: uri,
    [M_LOCATION.name]: {
      description,
      uri
    },
    [M_ASSET.name]: {
      type: assetType || LocationAssetType.Self
    },
    [M_TEXT.name]: defaultedText
  }, timestampEvent);
};

/**
 * Parse location event content and transform to
 * a backwards compatible modern m.location event format
 */
export var parseLocationEvent = wireEventContent => {
  var _location$uri, _asset$type;
  var location = M_LOCATION.findIn(wireEventContent);
  var asset = M_ASSET.findIn(wireEventContent);
  var timestamp = M_TIMESTAMP.findIn(wireEventContent);
  var text = M_TEXT.findIn(wireEventContent);
  var geoUri = (_location$uri = location === null || location === void 0 ? void 0 : location.uri) !== null && _location$uri !== void 0 ? _location$uri : wireEventContent === null || wireEventContent === void 0 ? void 0 : wireEventContent.geo_uri;
  var description = location === null || location === void 0 ? void 0 : location.description;
  var assetType = (_asset$type = asset === null || asset === void 0 ? void 0 : asset.type) !== null && _asset$type !== void 0 ? _asset$type : LocationAssetType.Self;
  var fallbackText = text !== null && text !== void 0 ? text : wireEventContent.body;
  return makeLocationContent(fallbackText, geoUri, timestamp !== null && timestamp !== void 0 ? timestamp : undefined, description, assetType);
};

/**
 * Topic event helpers
 */

export var makeTopicContent = (topic, htmlTopic) => {
  var renderings = [];
  // Put HTML first because clients will render the first type in
  // the array that they understand
  if (isProvided(htmlTopic)) {
    renderings.push({
      body: htmlTopic,
      mimetype: "text/html"
    });
  }
  if (isProvided(topic)) {
    renderings.push({
      body: topic,
      mimetype: "text/plain"
    });
  }
  return {
    topic,
    [M_TOPIC.name]: {
      "m.text": renderings
    }
  };
};
export var parseTopicContent = content => {
  var _ref, _mtopic$find$body, _mtopic$find, _mtopic$find2;
  var mtopicParent = M_TOPIC.findIn(content);
  var mtopic = Array.isArray(mtopicParent) ? mtopicParent : mtopicParent === null || mtopicParent === void 0 ? void 0 : mtopicParent["m.text"];
  // TODO remove support for the old malformed m.topic arrays after a few releases (only allow array in m.text)
  //      https://github.com/matrix-org/matrix-js-sdk/pull/4984#pullrequestreview-3174251065
  //const mtopic = M_TOPIC.findIn<MTopicContent>(content)?.["m.text"];
  if (!Array.isArray(mtopic)) {
    var _content$topic;
    return {
      text: (_content$topic = content.topic) !== null && _content$topic !== void 0 ? _content$topic : undefined
    };
  }
  var text = (_ref = (_mtopic$find$body = mtopic === null || mtopic === void 0 || (_mtopic$find = mtopic.find(r => !isProvided(r.mimetype) || r.mimetype === "text/plain")) === null || _mtopic$find === void 0 ? void 0 : _mtopic$find.body) !== null && _mtopic$find$body !== void 0 ? _mtopic$find$body : content.topic) !== null && _ref !== void 0 ? _ref : undefined;
  var html = mtopic === null || mtopic === void 0 || (_mtopic$find2 = mtopic.find(r => r.mimetype === "text/html")) === null || _mtopic$find2 === void 0 ? void 0 : _mtopic$find2.body;
  return {
    text,
    html
  };
};

/**
 * Beacon event helpers
 */

export var makeBeaconInfoContent = (timeout, isLive, description, assetType, timestamp) => ({
  description,
  timeout,
  live: isLive,
  [M_TIMESTAMP.name]: timestamp || Date.now(),
  [M_ASSET.name]: {
    type: assetType !== null && assetType !== void 0 ? assetType : LocationAssetType.Self
  }
});
/**
 * Flatten beacon info event content
 */
export var parseBeaconInfoContent = content => {
  var _M_TIMESTAMP$findIn;
  var {
    description,
    timeout,
    live
  } = content;
  var timestamp = (_M_TIMESTAMP$findIn = M_TIMESTAMP.findIn(content)) !== null && _M_TIMESTAMP$findIn !== void 0 ? _M_TIMESTAMP$findIn : undefined;
  var asset = M_ASSET.findIn(content);
  return {
    description,
    timeout,
    live,
    assetType: asset === null || asset === void 0 ? void 0 : asset.type,
    timestamp
  };
};
export var makeBeaconContent = (uri, timestamp, beaconInfoEventId, description) => ({
  [M_LOCATION.name]: {
    description,
    uri
  },
  [M_TIMESTAMP.name]: timestamp,
  "m.relates_to": {
    rel_type: REFERENCE_RELATION.name,
    event_id: beaconInfoEventId
  }
});
export var parseBeaconContent = content => {
  var _M_TIMESTAMP$findIn2;
  var location = M_LOCATION.findIn(content);
  var timestamp = (_M_TIMESTAMP$findIn2 = M_TIMESTAMP.findIn(content)) !== null && _M_TIMESTAMP$findIn2 !== void 0 ? _M_TIMESTAMP$findIn2 : undefined;
  return {
    description: location === null || location === void 0 ? void 0 : location.description,
    uri: location === null || location === void 0 ? void 0 : location.uri,
    timestamp
  };
};
//# sourceMappingURL=content-helpers.js.map