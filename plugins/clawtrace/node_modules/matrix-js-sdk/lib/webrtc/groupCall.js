import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import { TypedEventEmitter } from "../models/typed-event-emitter.js";
import { CallFeed, SPEAKING_THRESHOLD } from "./callFeed.js";
import { CallErrorCode, CallEvent, CallState, genCallID, setTracksEnabled, createNewMatrixCall, CallError } from "./call.js";
import { RoomStateEvent } from "../models/room-state.js";
import { logger } from "../logger.js";
import { ReEmitter } from "../ReEmitter.js";
import { SDPStreamMetadataPurpose } from "./callEventTypes.js";
import { EventType } from "../@types/event.js";
import { CallEventHandlerEvent } from "./callEventHandler.js";
import { GroupCallEventHandlerEvent } from "./groupCallEventHandler.js";
import { mapsEqual } from "../utils.js";
import { GroupCallStats } from "./stats/groupCallStats.js";
import { StatsReport } from "./stats/statsReport.js";
import { SummaryStatsReportGatherer } from "./stats/summaryStatsReportGatherer.js";
import { CallFeedStatsReporter } from "./stats/callFeedStatsReporter.js";
import { KnownMembership } from "../@types/membership.js";
export var GroupCallIntent = /*#__PURE__*/function (GroupCallIntent) {
  GroupCallIntent["Ring"] = "m.ring";
  GroupCallIntent["Prompt"] = "m.prompt";
  GroupCallIntent["Room"] = "m.room";
  return GroupCallIntent;
}({});
export var GroupCallType = /*#__PURE__*/function (GroupCallType) {
  GroupCallType["Video"] = "m.video";
  GroupCallType["Voice"] = "m.voice";
  return GroupCallType;
}({});
export var GroupCallTerminationReason = /*#__PURE__*/function (GroupCallTerminationReason) {
  GroupCallTerminationReason["CallEnded"] = "call_ended";
  return GroupCallTerminationReason;
}({});
/**
 * Because event names are just strings, they do need
 * to be unique over all event types of event emitter.
 * Some objects could emit more then one set of events.
 */
export var GroupCallEvent = /*#__PURE__*/function (GroupCallEvent) {
  GroupCallEvent["GroupCallStateChanged"] = "group_call_state_changed";
  GroupCallEvent["ActiveSpeakerChanged"] = "active_speaker_changed";
  GroupCallEvent["CallsChanged"] = "calls_changed";
  GroupCallEvent["UserMediaFeedsChanged"] = "user_media_feeds_changed";
  GroupCallEvent["ScreenshareFeedsChanged"] = "screenshare_feeds_changed";
  GroupCallEvent["LocalScreenshareStateChanged"] = "local_screenshare_state_changed";
  GroupCallEvent["LocalMuteStateChanged"] = "local_mute_state_changed";
  GroupCallEvent["ParticipantsChanged"] = "participants_changed";
  GroupCallEvent["Error"] = "group_call_error";
  return GroupCallEvent;
}({});
export var GroupCallStatsReportEvent = /*#__PURE__*/function (GroupCallStatsReportEvent) {
  GroupCallStatsReportEvent["ConnectionStats"] = "GroupCall.connection_stats";
  GroupCallStatsReportEvent["ByteSentStats"] = "GroupCall.byte_sent_stats";
  GroupCallStatsReportEvent["SummaryStats"] = "GroupCall.summary_stats";
  GroupCallStatsReportEvent["CallFeedStats"] = "GroupCall.call_feed_stats";
  return GroupCallStatsReportEvent;
}({});

/**
 * The final report-events that get consumed by client.
 */

export var GroupCallErrorCode = /*#__PURE__*/function (GroupCallErrorCode) {
  GroupCallErrorCode["NoUserMedia"] = "no_user_media";
  GroupCallErrorCode["UnknownDevice"] = "unknown_device";
  GroupCallErrorCode["PlaceCallFailed"] = "place_call_failed";
  return GroupCallErrorCode;
}({});
export class GroupCallError extends Error {
  constructor(code, msg, err) {
    // Still don't think there's any way to have proper nested errors
    if (err) {
      super(msg + ": " + err);
      _defineProperty(this, "code", void 0);
    } else {
      super(msg);
      _defineProperty(this, "code", void 0);
    }
    this.code = code;
  }
}
export class GroupCallUnknownDeviceError extends GroupCallError {
  constructor(userId) {
    super(GroupCallErrorCode.UnknownDevice, "No device found for " + userId);
    this.userId = userId;
  }
}
export class OtherUserSpeakingError extends Error {
  constructor() {
    super("Cannot unmute: another user is speaking");
  }
}
export var GroupCallState = /*#__PURE__*/function (GroupCallState) {
  GroupCallState["LocalCallFeedUninitialized"] = "local_call_feed_uninitialized";
  GroupCallState["InitializingLocalCallFeed"] = "initializing_local_call_feed";
  GroupCallState["LocalCallFeedInitialized"] = "local_call_feed_initialized";
  GroupCallState["Entered"] = "entered";
  GroupCallState["Ended"] = "ended";
  return GroupCallState;
}({});
var DEVICE_TIMEOUT = 1000 * 60 * 60; // 1 hour

function getCallUserId(call) {
  var _call$getOpponentMemb;
  return ((_call$getOpponentMemb = call.getOpponentMember()) === null || _call$getOpponentMemb === void 0 ? void 0 : _call$getOpponentMemb.userId) || call.invitee || null;
}
export class GroupCall extends TypedEventEmitter {
  constructor(client, room, type, isPtt, intent, groupCallId, dataChannelsEnabled, dataChannelOptions, isCallWithoutVideoAndAudio) {
    var _room$currentState$ge, _room$currentState$ge2;
    var useLivekit = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
    var livekitServiceURL = arguments.length > 10 ? arguments[10] : undefined;
    super();
    this.client = client;
    this.room = room;
    this.type = type;
    this.isPtt = isPtt;
    this.intent = intent;
    this.dataChannelsEnabled = dataChannelsEnabled;
    this.dataChannelOptions = dataChannelOptions;
    this.useLivekit = useLivekit;
    // Config
    _defineProperty(this, "activeSpeakerInterval", 1000);
    _defineProperty(this, "retryCallInterval", 5000);
    _defineProperty(this, "participantTimeout", 1000 * 15);
    _defineProperty(this, "pttMaxTransmitTime", 1000 * 20);
    _defineProperty(this, "activeSpeaker", void 0);
    _defineProperty(this, "localCallFeed", void 0);
    _defineProperty(this, "localScreenshareFeed", void 0);
    _defineProperty(this, "localDesktopCapturerSourceId", void 0);
    _defineProperty(this, "userMediaFeeds", []);
    _defineProperty(this, "screenshareFeeds", []);
    _defineProperty(this, "groupCallId", void 0);
    _defineProperty(this, "allowCallWithoutVideoAndAudio", void 0);
    _defineProperty(this, "calls", new Map());
    // user_id -> device_id -> MatrixCall
    _defineProperty(this, "callHandlers", new Map());
    // user_id -> device_id -> ICallHandlers
    _defineProperty(this, "activeSpeakerLoopInterval", void 0);
    _defineProperty(this, "retryCallLoopInterval", void 0);
    _defineProperty(this, "retryCallCounts", new Map());
    // user_id -> device_id -> count
    _defineProperty(this, "reEmitter", void 0);
    _defineProperty(this, "transmitTimer", null);
    _defineProperty(this, "participantsExpirationTimer", null);
    _defineProperty(this, "resendMemberStateTimer", null);
    _defineProperty(this, "initWithAudioMuted", false);
    _defineProperty(this, "initWithVideoMuted", false);
    _defineProperty(this, "initCallFeedPromise", void 0);
    _defineProperty(this, "_livekitServiceURL", void 0);
    _defineProperty(this, "stats", void 0);
    /**
     * Configure default webrtc stats collection interval in ms
     * Disable collecting webrtc stats by setting interval to 0
     */
    _defineProperty(this, "statsCollectIntervalTime", 0);
    _defineProperty(this, "onConnectionStats", report => {
      // Final emit of the summary event, to be consumed by the client
      this.emit(GroupCallStatsReportEvent.ConnectionStats, {
        report
      });
    });
    _defineProperty(this, "onByteSentStats", report => {
      // Final emit of the summary event, to be consumed by the client
      this.emit(GroupCallStatsReportEvent.ByteSentStats, {
        report
      });
    });
    _defineProperty(this, "onSummaryStats", report => {
      SummaryStatsReportGatherer.extendSummaryReport(report, this.participants);
      // Final emit of the summary event, to be consumed by the client
      this.emit(GroupCallStatsReportEvent.SummaryStats, {
        report
      });
    });
    _defineProperty(this, "onCallFeedReport", report => {
      if (this.localCallFeed) {
        report = CallFeedStatsReporter.expandCallFeedReport(report, [this.localCallFeed], "from-local-feed");
      }
      var callFeeds = [];
      this.forEachCall(call => {
        if (call.callId === report.callId) {
          call.getFeeds().forEach(f => callFeeds.push(f));
        }
      });
      report = CallFeedStatsReporter.expandCallFeedReport(report, callFeeds, "from-call-feed");
      this.emit(GroupCallStatsReportEvent.CallFeedStats, {
        report
      });
    });
    _defineProperty(this, "_state", GroupCallState.LocalCallFeedUninitialized);
    _defineProperty(this, "_participants", new Map());
    _defineProperty(this, "_creationTs", null);
    _defineProperty(this, "_enteredViaAnotherSession", false);
    /*
     * Call Setup
     *
     * There are two different paths for calls to be created:
     * 1. Incoming calls triggered by the Call.incoming event.
     * 2. Outgoing calls to the initial members of a room or new members
     *    as they are observed by the RoomState.members event.
     */
    _defineProperty(this, "onIncomingCall", newCall => {
      var _newCall$getOpponentM, _this$calls$get;
      // The incoming calls may be for another room, which we will ignore.
      if (newCall.roomId !== this.room.roomId) {
        return;
      }
      if (newCall.state !== CallState.Ringing) {
        logger.warn("GroupCall ".concat(this.groupCallId, " onIncomingCall() incoming call no longer in ringing state - ignoring"));
        return;
      }
      if (!newCall.groupCallId || newCall.groupCallId !== this.groupCallId) {
        logger.log("GroupCall ".concat(this.groupCallId, " onIncomingCall() ignored because it doesn't match the current group call"));
        newCall.reject();
        return;
      }
      var opponentUserId = (_newCall$getOpponentM = newCall.getOpponentMember()) === null || _newCall$getOpponentM === void 0 ? void 0 : _newCall$getOpponentM.userId;
      if (opponentUserId === undefined) {
        logger.warn("GroupCall ".concat(this.groupCallId, " onIncomingCall() incoming call with no member - ignoring"));
        return;
      }
      if (this.useLivekit) {
        logger.info("Received incoming call whilst in signaling-only mode! Ignoring.");
        return;
      }
      var deviceMap = (_this$calls$get = this.calls.get(opponentUserId)) !== null && _this$calls$get !== void 0 ? _this$calls$get : new Map();
      var prevCall = deviceMap.get(newCall.getOpponentDeviceId());
      if ((prevCall === null || prevCall === void 0 ? void 0 : prevCall.callId) === newCall.callId) return;
      logger.log("GroupCall ".concat(this.groupCallId, " onIncomingCall() incoming call (userId=").concat(opponentUserId, ", callId=").concat(newCall.callId, ")"));
      if (prevCall) prevCall.hangup(CallErrorCode.Replaced, false);
      // We must do this before we start initialising / answering the call as we
      // need to know it is the active call for this user+deviceId and to not ignore
      // events from it.
      deviceMap.set(newCall.getOpponentDeviceId(), newCall);
      this.calls.set(opponentUserId, deviceMap);
      this.initCall(newCall);
      var feeds = this.getLocalFeeds().map(feed => feed.clone());
      if (!this.callExpected(newCall)) {
        // Disable our tracks for users not explicitly participating in the
        // call but trying to receive the feeds
        for (var feed of feeds) {
          setTracksEnabled(feed.stream.getAudioTracks(), false);
          setTracksEnabled(feed.stream.getVideoTracks(), false);
        }
      }
      newCall.answerWithCallFeeds(feeds);
      this.emit(GroupCallEvent.CallsChanged, this.calls);
    });
    _defineProperty(this, "onRetryCallLoop", () => {
      var needsRetry = false;
      for (var [{
        userId: _userId
      }, participantMap] of this.participants) {
        var callMap = this.calls.get(_userId);
        var retriesMap = this.retryCallCounts.get(_userId);
        for (var [deviceId, participant] of participantMap) {
          var _retriesMap$get, _retriesMap;
          var call = callMap === null || callMap === void 0 ? void 0 : callMap.get(deviceId);
          var retries = (_retriesMap$get = (_retriesMap = retriesMap) === null || _retriesMap === void 0 ? void 0 : _retriesMap.get(deviceId)) !== null && _retriesMap$get !== void 0 ? _retriesMap$get : 0;
          if ((call === null || call === void 0 ? void 0 : call.getOpponentSessionId()) !== participant.sessionId && this.wantsOutgoingCall(_userId, deviceId) && retries < 3) {
            if (retriesMap === undefined) {
              retriesMap = new Map();
              this.retryCallCounts.set(_userId, retriesMap);
            }
            retriesMap.set(deviceId, retries + 1);
            needsRetry = true;
          }
        }
      }
      if (needsRetry) this.placeOutgoingCalls();
    });
    _defineProperty(this, "onCallFeedsChanged", call => {
      var opponentMemberId = getCallUserId(call);
      var opponentDeviceId = call.getOpponentDeviceId();
      if (!opponentMemberId) {
        throw new Error("Cannot change call feeds without user id");
      }
      var currentUserMediaFeed = this.getUserMediaFeed(opponentMemberId, opponentDeviceId);
      var remoteUsermediaFeed = call.remoteUsermediaFeed;
      var remoteFeedChanged = remoteUsermediaFeed !== currentUserMediaFeed;
      var deviceMap = this.calls.get(opponentMemberId);
      var currentCallForUserDevice = deviceMap === null || deviceMap === void 0 ? void 0 : deviceMap.get(opponentDeviceId);
      if ((currentCallForUserDevice === null || currentCallForUserDevice === void 0 ? void 0 : currentCallForUserDevice.callId) !== call.callId) {
        // the call in question is not the current call for this user/deviceId
        // so ignore feed events from it otherwise we'll remove our real feeds
        return;
      }
      if (remoteFeedChanged) {
        if (!currentUserMediaFeed && remoteUsermediaFeed) {
          this.addUserMediaFeed(remoteUsermediaFeed);
        } else if (currentUserMediaFeed && remoteUsermediaFeed) {
          this.replaceUserMediaFeed(currentUserMediaFeed, remoteUsermediaFeed);
        } else if (currentUserMediaFeed && !remoteUsermediaFeed) {
          this.removeUserMediaFeed(currentUserMediaFeed);
        }
      }
      var currentScreenshareFeed = this.getScreenshareFeed(opponentMemberId, opponentDeviceId);
      var remoteScreensharingFeed = call.remoteScreensharingFeed;
      var remoteScreenshareFeedChanged = remoteScreensharingFeed !== currentScreenshareFeed;
      if (remoteScreenshareFeedChanged) {
        if (!currentScreenshareFeed && remoteScreensharingFeed) {
          this.addScreenshareFeed(remoteScreensharingFeed);
        } else if (currentScreenshareFeed && remoteScreensharingFeed) {
          this.replaceScreenshareFeed(currentScreenshareFeed, remoteScreensharingFeed);
        } else if (currentScreenshareFeed && !remoteScreensharingFeed) {
          this.removeScreenshareFeed(currentScreenshareFeed);
        }
      }
    });
    _defineProperty(this, "onCallStateChanged", (call, state, _oldState) => {
      var _call$getOpponentMemb2;
      if (state === CallState.Ended) return;
      var audioMuted = this.localCallFeed.isAudioMuted();
      if (call.localUsermediaStream && call.isMicrophoneMuted() !== audioMuted) {
        call.setMicrophoneMuted(audioMuted);
      }
      var videoMuted = this.localCallFeed.isVideoMuted();
      if (call.localUsermediaStream && call.isLocalVideoMuted() !== videoMuted) {
        call.setLocalVideoMuted(videoMuted);
      }
      var opponentUserId = (_call$getOpponentMemb2 = call.getOpponentMember()) === null || _call$getOpponentMemb2 === void 0 ? void 0 : _call$getOpponentMemb2.userId;
      if (state === CallState.Connected && opponentUserId) {
        var retriesMap = this.retryCallCounts.get(opponentUserId);
        retriesMap === null || retriesMap === void 0 || retriesMap.delete(call.getOpponentDeviceId());
        if ((retriesMap === null || retriesMap === void 0 ? void 0 : retriesMap.size) === 0) this.retryCallCounts.delete(opponentUserId);
      }
    });
    _defineProperty(this, "onCallHangup", call => {
      var _call$getOpponentMemb3, _call$getOpponentMemb4;
      if (call.hangupReason === CallErrorCode.Replaced) return;
      var opponentUserId = (_call$getOpponentMemb3 = (_call$getOpponentMemb4 = call.getOpponentMember()) === null || _call$getOpponentMemb4 === void 0 ? void 0 : _call$getOpponentMemb4.userId) !== null && _call$getOpponentMemb3 !== void 0 ? _call$getOpponentMemb3 : this.room.getMember(call.invitee).userId;
      var deviceMap = this.calls.get(opponentUserId);

      // Sanity check that this call is in fact in the map
      if ((deviceMap === null || deviceMap === void 0 ? void 0 : deviceMap.get(call.getOpponentDeviceId())) === call) {
        this.disposeCall(call, call.hangupReason);
        deviceMap.delete(call.getOpponentDeviceId());
        if (deviceMap.size === 0) this.calls.delete(opponentUserId);
        this.emit(GroupCallEvent.CallsChanged, this.calls);
      }
    });
    _defineProperty(this, "onCallReplaced", (prevCall, newCall) => {
      var opponentUserId = prevCall.getOpponentMember().userId;
      var deviceMap = this.calls.get(opponentUserId);
      if (deviceMap === undefined) {
        deviceMap = new Map();
        this.calls.set(opponentUserId, deviceMap);
      }
      prevCall.hangup(CallErrorCode.Replaced, false);
      this.initCall(newCall);
      deviceMap.set(prevCall.getOpponentDeviceId(), newCall);
      this.emit(GroupCallEvent.CallsChanged, this.calls);
    });
    _defineProperty(this, "onActiveSpeakerLoop", () => {
      var topAvg = undefined;
      var nextActiveSpeaker = undefined;
      for (var callFeed of this.userMediaFeeds) {
        if (callFeed.isLocal() && this.userMediaFeeds.length > 1) continue;
        var total = callFeed.speakingVolumeSamples.reduce((acc, volume) => acc + Math.max(volume, SPEAKING_THRESHOLD));
        var avg = total / callFeed.speakingVolumeSamples.length;
        if (!topAvg || avg > topAvg) {
          topAvg = avg;
          nextActiveSpeaker = callFeed;
        }
      }
      if (nextActiveSpeaker && this.activeSpeaker !== nextActiveSpeaker && topAvg && topAvg > SPEAKING_THRESHOLD) {
        this.activeSpeaker = nextActiveSpeaker;
        this.emit(GroupCallEvent.ActiveSpeakerChanged, this.activeSpeaker);
      }
    });
    _defineProperty(this, "onRoomState", () => this.updateParticipants());
    _defineProperty(this, "onParticipantsChanged", () => {
      // Re-run setTracksEnabled on all calls, so that participants that just
      // left get denied access to our media, and participants that just
      // joined get granted access
      this.forEachCall(call => {
        var expected = this.callExpected(call);
        for (var feed of call.getLocalFeeds()) {
          setTracksEnabled(feed.stream.getAudioTracks(), !feed.isAudioMuted() && expected);
          setTracksEnabled(feed.stream.getVideoTracks(), !feed.isVideoMuted() && expected);
        }
      });
      if (this.state === GroupCallState.Entered && !this.useLivekit) this.placeOutgoingCalls();

      // Update the participants stored in the stats object
    });
    _defineProperty(this, "onStateChanged", (newState, oldState) => {
      if (newState === GroupCallState.Entered || oldState === GroupCallState.Entered || newState === GroupCallState.Ended) {
        // We either entered, left, or ended the call
        this.updateParticipants();
        this.updateMemberState().catch(e => logger.error("GroupCall ".concat(this.groupCallId, " onStateChanged() failed to update member state devices\""), e));
      }
    });
    _defineProperty(this, "onLocalFeedsChanged", () => {
      if (this.state === GroupCallState.Entered) {
        this.updateMemberState().catch(e => logger.error("GroupCall ".concat(this.groupCallId, " onLocalFeedsChanged() failed to update member state feeds"), e));
      }
    });
    this.reEmitter = new ReEmitter(this);
    this.groupCallId = groupCallId !== null && groupCallId !== void 0 ? groupCallId : genCallID();
    this._livekitServiceURL = livekitServiceURL;
    this.creationTs = (_room$currentState$ge = (_room$currentState$ge2 = room.currentState.getStateEvents(EventType.GroupCallPrefix, this.groupCallId)) === null || _room$currentState$ge2 === void 0 ? void 0 : _room$currentState$ge2.getTs()) !== null && _room$currentState$ge !== void 0 ? _room$currentState$ge : null;
    this.updateParticipants();
    room.on(RoomStateEvent.Update, this.onRoomState);
    this.on(GroupCallEvent.ParticipantsChanged, this.onParticipantsChanged);
    this.on(GroupCallEvent.GroupCallStateChanged, this.onStateChanged);
    this.on(GroupCallEvent.LocalScreenshareStateChanged, this.onLocalFeedsChanged);
    this.allowCallWithoutVideoAndAudio = !!isCallWithoutVideoAndAudio;
  }
  create() {
    var _this = this;
    return _asyncToGenerator(function* () {
      _this.creationTs = Date.now();
      _this.client.groupCallEventHandler.groupCalls.set(_this.room.roomId, _this);
      _this.client.emit(GroupCallEventHandlerEvent.Outgoing, _this);
      yield _this.sendCallStateEvent();
      return _this;
    })();
  }
  sendCallStateEvent() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var groupCallState = {
        "m.intent": _this2.intent,
        "m.type": _this2.type,
        "io.element.ptt": _this2.isPtt,
        // TODO: Specify data-channels better
        "dataChannelsEnabled": _this2.dataChannelsEnabled,
        "dataChannelOptions": _this2.dataChannelsEnabled ? _this2.dataChannelOptions : undefined
      };
      if (_this2.livekitServiceURL) {
        groupCallState["io.element.livekit_service_url"] = _this2.livekitServiceURL;
      }
      yield _this2.client.sendStateEvent(_this2.room.roomId, EventType.GroupCallPrefix, groupCallState, _this2.groupCallId);
    })();
  }
  get livekitServiceURL() {
    return this._livekitServiceURL;
  }
  updateLivekitServiceURL(newURL) {
    this._livekitServiceURL = newURL;
    return this.sendCallStateEvent();
  }
  /**
   * The group call's state.
   */
  get state() {
    return this._state;
  }
  set state(value) {
    var prevValue = this._state;
    if (value !== prevValue) {
      this._state = value;
      this.emit(GroupCallEvent.GroupCallStateChanged, value, prevValue);
    }
  }
  /**
   * The current participants in the call, as a map from members to device IDs
   * to participant info.
   */
  get participants() {
    return this._participants;
  }
  set participants(value) {
    var prevValue = this._participants;
    var participantStateEqual = (x, y) => x.sessionId === y.sessionId && x.screensharing === y.screensharing;
    var deviceMapsEqual = (x, y) => mapsEqual(x, y, participantStateEqual);

    // Only update if the map actually changed
    if (!mapsEqual(value, prevValue, deviceMapsEqual)) {
      this._participants = value;
      this.emit(GroupCallEvent.ParticipantsChanged, value);
    }
  }
  /**
   * The timestamp at which the call was created, or null if it has not yet
   * been created.
   */
  get creationTs() {
    return this._creationTs;
  }
  set creationTs(value) {
    this._creationTs = value;
  }
  /**
   * Whether the local device has entered this call via another session, such
   * as a widget.
   */
  get enteredViaAnotherSession() {
    return this._enteredViaAnotherSession;
  }
  set enteredViaAnotherSession(value) {
    this._enteredViaAnotherSession = value;
    this.updateParticipants();
  }

  /**
   * Executes the given callback on all calls in this group call.
   * @param f - The callback.
   */
  forEachCall(f) {
    for (var deviceMap of this.calls.values()) {
      for (var call of deviceMap.values()) f(call);
    }
  }
  getLocalFeeds() {
    var feeds = [];
    if (this.localCallFeed) feeds.push(this.localCallFeed);
    if (this.localScreenshareFeed) feeds.push(this.localScreenshareFeed);
    return feeds;
  }
  hasLocalParticipant() {
    var _this$participants$ge, _this$participants$ge2;
    return (_this$participants$ge = (_this$participants$ge2 = this.participants.get(this.room.getMember(this.client.getUserId()))) === null || _this$participants$ge2 === void 0 ? void 0 : _this$participants$ge2.has(this.client.getDeviceId())) !== null && _this$participants$ge !== void 0 ? _this$participants$ge : false;
  }

  /**
   * Determines whether the given call is one that we were expecting to exist
   * given our knowledge of who is participating in the group call.
   */
  callExpected(call) {
    var _this$participants$ge3;
    var userId = getCallUserId(call);
    var member = userId === null ? null : this.room.getMember(userId);
    var deviceId = call.getOpponentDeviceId();
    return member !== null && deviceId !== undefined && ((_this$participants$ge3 = this.participants.get(member)) === null || _this$participants$ge3 === void 0 ? void 0 : _this$participants$ge3.get(deviceId)) !== undefined;
  }
  initLocalCallFeed() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (_this3.useLivekit) {
        logger.info("Livekit group call: not starting local call feed.");
        return;
      }
      if (_this3.state !== GroupCallState.LocalCallFeedUninitialized) {
        throw new Error("Cannot initialize local call feed in the \"".concat(_this3.state, "\" state."));
      }
      _this3.state = GroupCallState.InitializingLocalCallFeed;

      // wraps the real method to serialise calls, because we don't want to try starting
      // multiple call feeds at once
      if (_this3.initCallFeedPromise) return _this3.initCallFeedPromise;
      try {
        _this3.initCallFeedPromise = _this3.initLocalCallFeedInternal();
        yield _this3.initCallFeedPromise;
      } finally {
        _this3.initCallFeedPromise = undefined;
      }
    })();
  }
  initLocalCallFeedInternal() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      logger.log("GroupCall ".concat(_this4.groupCallId, " initLocalCallFeedInternal() running"));
      var stream;
      try {
        stream = yield _this4.client.getMediaHandler().getUserMediaStream(true, _this4.type === GroupCallType.Video);
      } catch (error) {
        // If is allowed to join a call without a media stream, then we
        // don't throw an error here. But we need an empty Local Feed to establish
        // a connection later.
        if (_this4.allowCallWithoutVideoAndAudio) {
          stream = new MediaStream();
        } else {
          _this4.state = GroupCallState.LocalCallFeedUninitialized;
          throw error;
        }
      }

      // The call could've been disposed while we were waiting, and could
      // also have been started back up again (hello, React 18) so if we're
      // still in this 'initializing' state, carry on, otherwise bail.
      if (_this4._state !== GroupCallState.InitializingLocalCallFeed) {
        _this4.client.getMediaHandler().stopUserMediaStream(stream);
        throw new Error("Group call disposed while gathering media stream");
      }
      var callFeed = new CallFeed({
        client: _this4.client,
        roomId: _this4.room.roomId,
        userId: _this4.client.getUserId(),
        deviceId: _this4.client.getDeviceId(),
        stream,
        purpose: SDPStreamMetadataPurpose.Usermedia,
        audioMuted: _this4.initWithAudioMuted || stream.getAudioTracks().length === 0 || _this4.isPtt,
        videoMuted: _this4.initWithVideoMuted || stream.getVideoTracks().length === 0
      });
      setTracksEnabled(stream.getAudioTracks(), !callFeed.isAudioMuted());
      setTracksEnabled(stream.getVideoTracks(), !callFeed.isVideoMuted());
      _this4.localCallFeed = callFeed;
      _this4.addUserMediaFeed(callFeed);
      _this4.state = GroupCallState.LocalCallFeedInitialized;
    })();
  }
  updateLocalUsermediaStream(stream) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (_this5.localCallFeed) {
        var oldStream = _this5.localCallFeed.stream;
        _this5.localCallFeed.setNewStream(stream);
        var micShouldBeMuted = _this5.localCallFeed.isAudioMuted();
        var vidShouldBeMuted = _this5.localCallFeed.isVideoMuted();
        logger.log("GroupCall ".concat(_this5.groupCallId, " updateLocalUsermediaStream() (oldStreamId=").concat(oldStream.id, ", newStreamId=").concat(stream.id, ", micShouldBeMuted=").concat(micShouldBeMuted, ", vidShouldBeMuted=").concat(vidShouldBeMuted, ")"));
        setTracksEnabled(stream.getAudioTracks(), !micShouldBeMuted);
        setTracksEnabled(stream.getVideoTracks(), !vidShouldBeMuted);
        _this5.client.getMediaHandler().stopUserMediaStream(oldStream);
      }
    })();
  }
  enter() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      if (_this6.state === GroupCallState.LocalCallFeedUninitialized) {
        yield _this6.initLocalCallFeed();
      } else if (_this6.state !== GroupCallState.LocalCallFeedInitialized) {
        throw new Error("Cannot enter call in the \"".concat(_this6.state, "\" state"));
      }
      logger.log("GroupCall ".concat(_this6.groupCallId, " enter() running"));
      _this6.state = GroupCallState.Entered;
      _this6.client.on(CallEventHandlerEvent.Incoming, _this6.onIncomingCall);
      for (var call of _this6.client.callEventHandler.calls.values()) {
        _this6.onIncomingCall(call);
      }
      if (!_this6.useLivekit) {
        _this6.retryCallLoopInterval = setInterval(_this6.onRetryCallLoop, _this6.retryCallInterval);
        _this6.activeSpeaker = undefined;
        _this6.onActiveSpeakerLoop();
        _this6.activeSpeakerLoopInterval = setInterval(_this6.onActiveSpeakerLoop, _this6.activeSpeakerInterval);
      }
    })();
  }
  dispose() {
    var _this$stats;
    if (this.localCallFeed) {
      this.removeUserMediaFeed(this.localCallFeed);
      this.localCallFeed = undefined;
    }
    if (this.localScreenshareFeed) {
      this.client.getMediaHandler().stopScreensharingStream(this.localScreenshareFeed.stream);
      this.removeScreenshareFeed(this.localScreenshareFeed);
      this.localScreenshareFeed = undefined;
      this.localDesktopCapturerSourceId = undefined;
    }
    this.client.getMediaHandler().stopAllStreams();
    if (this.transmitTimer !== null) {
      clearTimeout(this.transmitTimer);
      this.transmitTimer = null;
    }
    if (this.retryCallLoopInterval !== undefined) {
      clearInterval(this.retryCallLoopInterval);
      this.retryCallLoopInterval = undefined;
    }
    if (this.participantsExpirationTimer !== null) {
      clearTimeout(this.participantsExpirationTimer);
      this.participantsExpirationTimer = null;
    }
    if (this.state !== GroupCallState.Entered) {
      return;
    }
    this.forEachCall(call => call.hangup(CallErrorCode.UserHangup, false));
    this.activeSpeaker = undefined;
    clearInterval(this.activeSpeakerLoopInterval);
    this.retryCallCounts.clear();
    clearInterval(this.retryCallLoopInterval);
    this.client.removeListener(CallEventHandlerEvent.Incoming, this.onIncomingCall);
    (_this$stats = this.stats) === null || _this$stats === void 0 || _this$stats.stop();
  }
  leave() {
    this.dispose();
    this.state = GroupCallState.LocalCallFeedUninitialized;
  }
  terminate() {
    var _arguments = arguments,
      _this7 = this;
    return _asyncToGenerator(function* () {
      var emitStateEvent = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : true;
      _this7.dispose();
      _this7.room.off(RoomStateEvent.Update, _this7.onRoomState);
      _this7.client.groupCallEventHandler.groupCalls.delete(_this7.room.roomId);
      _this7.client.emit(GroupCallEventHandlerEvent.Ended, _this7);
      _this7.state = GroupCallState.Ended;
      if (emitStateEvent) {
        var existingStateEvent = _this7.room.currentState.getStateEvents(EventType.GroupCallPrefix, _this7.groupCallId);
        yield _this7.client.sendStateEvent(_this7.room.roomId, EventType.GroupCallPrefix, _objectSpread(_objectSpread({}, existingStateEvent.getContent()), {}, {
          "m.terminated": GroupCallTerminationReason.CallEnded
        }), _this7.groupCallId);
      }
    })();
  }

  /*
   * Local Usermedia
   */

  isLocalVideoMuted() {
    if (this.localCallFeed) {
      return this.localCallFeed.isVideoMuted();
    }
    return true;
  }
  isMicrophoneMuted() {
    if (this.localCallFeed) {
      return this.localCallFeed.isAudioMuted();
    }
    return true;
  }

  /**
   * Sets the mute state of the local participants's microphone.
   * @param muted - Whether to mute the microphone
   * @returns Whether muting/unmuting was successful
   */
  setMicrophoneMuted(muted) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      // hasAudioDevice can block indefinitely if the window has lost focus,
      // and it doesn't make much sense to keep a device from being muted, so
      // we always allow muted = true changes to go through
      if (!muted && !(yield _this8.client.getMediaHandler().hasAudioDevice())) {
        return false;
      }
      var sendUpdatesBefore = !muted && _this8.isPtt;

      // set a timer for the maximum transmit time on PTT calls
      if (_this8.isPtt) {
        // Set or clear the max transmit timer
        if (!muted && _this8.isMicrophoneMuted()) {
          _this8.transmitTimer = setTimeout(() => {
            _this8.setMicrophoneMuted(true);
          }, _this8.pttMaxTransmitTime);
        } else if (muted && !_this8.isMicrophoneMuted()) {
          if (_this8.transmitTimer !== null) clearTimeout(_this8.transmitTimer);
          _this8.transmitTimer = null;
        }
      }
      _this8.forEachCall(call => {
        var _call$localUsermediaF;
        return (_call$localUsermediaF = call.localUsermediaFeed) === null || _call$localUsermediaF === void 0 ? void 0 : _call$localUsermediaF.setAudioVideoMuted(muted, null);
      });
      var sendUpdates = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* () {
          var updates = [];
          _this8.forEachCall(call => updates.push(call.sendMetadataUpdate()));
          yield Promise.all(updates).catch(e => logger.info("GroupCall ".concat(_this8.groupCallId, " setMicrophoneMuted() failed to send some metadata updates"), e));
        });
        return function sendUpdates() {
          return _ref.apply(this, arguments);
        };
      }();
      if (sendUpdatesBefore) yield sendUpdates();
      if (_this8.localCallFeed) {
        logger.log("GroupCall ".concat(_this8.groupCallId, " setMicrophoneMuted() (streamId=").concat(_this8.localCallFeed.stream.id, ", muted=").concat(muted, ")"));
        var hasPermission = yield _this8.checkAudioPermissionIfNecessary(muted);
        if (!hasPermission) {
          return false;
        }
        _this8.localCallFeed.setAudioVideoMuted(muted, null);
        // I don't believe its actually necessary to enable these tracks: they
        // are the one on the GroupCall's own CallFeed and are cloned before being
        // given to any of the actual calls, so these tracks don't actually go
        // anywhere. Let's do it anyway to avoid confusion.
        setTracksEnabled(_this8.localCallFeed.stream.getAudioTracks(), !muted);
      } else {
        logger.log("GroupCall ".concat(_this8.groupCallId, " setMicrophoneMuted() no stream muted (muted=").concat(muted, ")"));
        _this8.initWithAudioMuted = muted;
      }
      _this8.forEachCall(call => setTracksEnabled(call.localUsermediaFeed.stream.getAudioTracks(), !muted && _this8.callExpected(call)));
      _this8.emit(GroupCallEvent.LocalMuteStateChanged, muted, _this8.isLocalVideoMuted());
      if (!sendUpdatesBefore) yield sendUpdates();
      return true;
    })();
  }

  /**
   * If we allow entering a call without a camera and without video, it can happen that the access rights to the
   * devices have not yet been queried. If a stream does not yet have an audio track, we assume that the rights have
   * not yet been checked.
   *
   * `this.client.getMediaHandler().getUserMediaStream` clones the current stream, so it only wanted to be called when
   * not Audio Track exists.
   * As such, this is a compromise, because, the access rights should always be queried before the call.
   */
  checkAudioPermissionIfNecessary(muted) {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      // We needed this here to avoid an error in case user join a call without a device.
      try {
        if (!muted && _this9.localCallFeed && !_this9.localCallFeed.hasAudioTrack) {
          var stream = yield _this9.client.getMediaHandler().getUserMediaStream(true, !_this9.localCallFeed.isVideoMuted());
          if ((stream === null || stream === void 0 ? void 0 : stream.getTracks().length) === 0) {
            // if case permission denied to get a stream stop this here
            /* istanbul ignore next */
            logger.log("GroupCall ".concat(_this9.groupCallId, " setMicrophoneMuted() no device to receive local stream, muted=").concat(muted));
            return false;
          }
        }
      } catch (_unused) {
        /* istanbul ignore next */
        logger.log("GroupCall ".concat(_this9.groupCallId, " setMicrophoneMuted() no device or permission to receive local stream, muted=").concat(muted));
        return false;
      }
      return true;
    })();
  }

  /**
   * Sets the mute state of the local participants's video.
   * @param muted - Whether to mute the video
   * @returns Whether muting/unmuting was successful
   */
  setLocalVideoMuted(muted) {
    var _this0 = this;
    return _asyncToGenerator(function* () {
      // hasAudioDevice can block indefinitely if the window has lost focus,
      // and it doesn't make much sense to keep a device from being muted, so
      // we always allow muted = true changes to go through
      if (!muted && !(yield _this0.client.getMediaHandler().hasVideoDevice())) {
        return false;
      }
      if (_this0.localCallFeed) {
        /* istanbul ignore next */
        logger.log("GroupCall ".concat(_this0.groupCallId, " setLocalVideoMuted() (stream=").concat(_this0.localCallFeed.stream.id, ", muted=").concat(muted, ")"));
        try {
          var stream = yield _this0.client.getMediaHandler().getUserMediaStream(true, !muted);
          yield _this0.updateLocalUsermediaStream(stream);
          _this0.localCallFeed.setAudioVideoMuted(null, muted);
          setTracksEnabled(_this0.localCallFeed.stream.getVideoTracks(), !muted);
        } catch (_unused2) {
          // No permission to video device
          /* istanbul ignore next */
          logger.log("GroupCall ".concat(_this0.groupCallId, " setLocalVideoMuted() no device or permission to receive local stream, muted=").concat(muted));
          return false;
        }
      } else {
        logger.log("GroupCall ".concat(_this0.groupCallId, " setLocalVideoMuted() no stream muted (muted=").concat(muted, ")"));
        _this0.initWithVideoMuted = muted;
      }
      var updates = [];
      _this0.forEachCall(call => updates.push(call.setLocalVideoMuted(muted)));
      yield Promise.all(updates);

      // We setTracksEnabled again, independently from the call doing it
      // internally, since we might not be expecting the call
      _this0.forEachCall(call => setTracksEnabled(call.localUsermediaFeed.stream.getVideoTracks(), !muted && _this0.callExpected(call)));
      _this0.emit(GroupCallEvent.LocalMuteStateChanged, _this0.isMicrophoneMuted(), muted);
      return true;
    })();
  }
  setScreensharingEnabled(enabled) {
    var _arguments2 = arguments,
      _this1 = this;
    return _asyncToGenerator(function* () {
      var opts = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : {};
      if (enabled === _this1.isScreensharing()) {
        return enabled;
      }
      if (enabled) {
        try {
          logger.log("GroupCall ".concat(_this1.groupCallId, " setScreensharingEnabled() is asking for screensharing permissions"));
          var stream = yield _this1.client.getMediaHandler().getScreensharingStream(opts);
          var _loop = function* _loop(track) {
            var onTrackEnded = () => {
              _this1.setScreensharingEnabled(false);
              track.removeEventListener("ended", onTrackEnded);
            };
            track.addEventListener("ended", onTrackEnded);
          };
          for (var track of stream.getTracks()) {
            yield* _loop(track);
          }
          logger.log("GroupCall ".concat(_this1.groupCallId, " setScreensharingEnabled() granted screensharing permissions. Setting screensharing enabled on all calls"));
          _this1.localDesktopCapturerSourceId = opts.desktopCapturerSourceId;
          _this1.localScreenshareFeed = new CallFeed({
            client: _this1.client,
            roomId: _this1.room.roomId,
            userId: _this1.client.getUserId(),
            deviceId: _this1.client.getDeviceId(),
            stream,
            purpose: SDPStreamMetadataPurpose.Screenshare,
            audioMuted: false,
            videoMuted: false
          });
          _this1.addScreenshareFeed(_this1.localScreenshareFeed);
          _this1.emit(GroupCallEvent.LocalScreenshareStateChanged, true, _this1.localScreenshareFeed, _this1.localDesktopCapturerSourceId);

          // TODO: handle errors
          _this1.forEachCall(call => call.pushLocalFeed(_this1.localScreenshareFeed.clone()));
          return true;
        } catch (error) {
          if (opts.throwOnFail) throw error;
          logger.error("GroupCall ".concat(_this1.groupCallId, " setScreensharingEnabled() enabling screensharing error"), error);
          _this1.emit(GroupCallEvent.Error, new GroupCallError(GroupCallErrorCode.NoUserMedia, "Failed to get screen-sharing stream: ", error));
          return false;
        }
      } else {
        _this1.forEachCall(call => {
          if (call.localScreensharingFeed) call.removeLocalFeed(call.localScreensharingFeed);
        });
        _this1.client.getMediaHandler().stopScreensharingStream(_this1.localScreenshareFeed.stream);
        _this1.removeScreenshareFeed(_this1.localScreenshareFeed);
        _this1.localScreenshareFeed = undefined;
        _this1.localDesktopCapturerSourceId = undefined;
        _this1.emit(GroupCallEvent.LocalScreenshareStateChanged, false, undefined, undefined);
        return false;
      }
    })();
  }
  isScreensharing() {
    return !!this.localScreenshareFeed;
  }
  /**
   * Determines whether a given participant expects us to call them (versus
   * them calling us).
   * @param userId - The participant's user ID.
   * @param deviceId - The participant's device ID.
   * @returns Whether we need to place an outgoing call to the participant.
   */
  wantsOutgoingCall(userId, deviceId) {
    var localUserId = this.client.getUserId();
    var localDeviceId = this.client.getDeviceId();
    return (
      // If a user's ID is less than our own, they'll call us
      userId >= localUserId && (
      // If this is another one of our devices, compare device IDs to tell whether it'll call us
      userId !== localUserId || deviceId > localDeviceId)
    );
  }

  /**
   * Places calls to all participants that we're responsible for calling.
   */
  placeOutgoingCalls() {
    var _this10 = this;
    var callsChanged = false;
    var _loop2 = function _loop2(_userId2) {
      var _this10$calls$get;
      var callMap = (_this10$calls$get = _this10.calls.get(_userId2)) !== null && _this10$calls$get !== void 0 ? _this10$calls$get : new Map();
      var _loop3 = function _loop3(deviceId) {
        var prevCall = callMap.get(deviceId);
        if ((prevCall === null || prevCall === void 0 ? void 0 : prevCall.getOpponentSessionId()) !== participant.sessionId && _this10.wantsOutgoingCall(_userId2, deviceId)) {
          callsChanged = true;
          if (prevCall !== undefined) {
            logger.debug("GroupCall ".concat(_this10.groupCallId, " placeOutgoingCalls() replacing call (userId=").concat(_userId2, ", deviceId=").concat(deviceId, ", callId=").concat(prevCall.callId, ")"));
            prevCall.hangup(CallErrorCode.NewSession, false);
          }
          var newCall = createNewMatrixCall(_this10.client, _this10.room.roomId, {
            invitee: _userId2,
            opponentDeviceId: deviceId,
            opponentSessionId: participant.sessionId,
            groupCallId: _this10.groupCallId
          });
          if (newCall === null) {
            logger.error("GroupCall ".concat(_this10.groupCallId, " placeOutgoingCalls() failed to create call (userId=").concat(_userId2, ", device=").concat(deviceId, ")"));
            callMap.delete(deviceId);
          } else {
            _this10.initCall(newCall);
            callMap.set(deviceId, newCall);
            logger.debug("GroupCall ".concat(_this10.groupCallId, " placeOutgoingCalls() placing call (userId=").concat(_userId2, ", deviceId=").concat(deviceId, ", sessionId=").concat(participant.sessionId, ")"));
            newCall.placeCallWithCallFeeds(_this10.getLocalFeeds().map(feed => feed.clone()), participant.screensharing).then(() => {
              if (_this10.dataChannelsEnabled) {
                newCall.createDataChannel("datachannel", _this10.dataChannelOptions);
              }
            }).catch(e => {
              logger.warn("GroupCall ".concat(_this10.groupCallId, " placeOutgoingCalls() failed to place call (userId=").concat(_userId2, ")"), e);
              if (e instanceof CallError && e.code === GroupCallErrorCode.UnknownDevice) {
                _this10.emit(GroupCallEvent.Error, e);
              } else {
                _this10.emit(GroupCallEvent.Error, new GroupCallError(GroupCallErrorCode.PlaceCallFailed, "Failed to place call to ".concat(_userId2)));
              }
              newCall.hangup(CallErrorCode.SignallingFailed, false);
              if (callMap.get(deviceId) === newCall) callMap.delete(deviceId);
            });
          }
        }
      };
      for (var [deviceId, participant] of participantMap) {
        _loop3(deviceId);
      }
      if (callMap.size > 0) {
        _this10.calls.set(_userId2, callMap);
      } else {
        _this10.calls.delete(_userId2);
      }
    };
    for (var [{
      userId: _userId2
    }, participantMap] of this.participants) {
      _loop2(_userId2);
    }
    if (callsChanged) this.emit(GroupCallEvent.CallsChanged, this.calls);
  }

  /*
   * Room Member State
   */

  getMemberStateEvents(userId) {
    return userId === undefined ? this.room.currentState.getStateEvents(EventType.GroupCallMemberPrefix) : this.room.currentState.getStateEvents(EventType.GroupCallMemberPrefix, userId);
  }
  initCall(call) {
    var opponentMemberId = getCallUserId(call);
    if (!opponentMemberId) {
      throw new Error("Cannot init call without user id");
    }
    var onCallFeedsChanged = () => this.onCallFeedsChanged(call);
    var onCallStateChanged = (state, oldState) => this.onCallStateChanged(call, state, oldState);
    var onCallHangup = this.onCallHangup;
    var onCallReplaced = newCall => this.onCallReplaced(call, newCall);
    var deviceMap = this.callHandlers.get(opponentMemberId);
    if (deviceMap === undefined) {
      deviceMap = new Map();
      this.callHandlers.set(opponentMemberId, deviceMap);
    }
    deviceMap.set(call.getOpponentDeviceId(), {
      onCallFeedsChanged,
      onCallStateChanged,
      onCallHangup,
      onCallReplaced
    });
    call.on(CallEvent.FeedsChanged, onCallFeedsChanged);
    call.on(CallEvent.State, onCallStateChanged);
    call.on(CallEvent.Hangup, onCallHangup);
    call.on(CallEvent.Replaced, onCallReplaced);
    call.isPtt = this.isPtt;
    this.reEmitter.reEmit(call, Object.values(CallEvent));
    call.initStats(this.getGroupCallStats());
    onCallFeedsChanged();
  }
  disposeCall(call, hangupReason) {
    var opponentMemberId = getCallUserId(call);
    var opponentDeviceId = call.getOpponentDeviceId();
    if (!opponentMemberId) {
      throw new Error("Cannot dispose call without user id");
    }
    var deviceMap = this.callHandlers.get(opponentMemberId);
    var {
      onCallFeedsChanged,
      onCallStateChanged,
      onCallHangup,
      onCallReplaced
    } = deviceMap.get(opponentDeviceId);
    call.removeListener(CallEvent.FeedsChanged, onCallFeedsChanged);
    call.removeListener(CallEvent.State, onCallStateChanged);
    call.removeListener(CallEvent.Hangup, onCallHangup);
    call.removeListener(CallEvent.Replaced, onCallReplaced);
    deviceMap.delete(opponentMemberId);
    if (deviceMap.size === 0) this.callHandlers.delete(opponentMemberId);
    if (call.hangupReason === CallErrorCode.Replaced) {
      return;
    }
    var usermediaFeed = this.getUserMediaFeed(opponentMemberId, opponentDeviceId);
    if (usermediaFeed) {
      this.removeUserMediaFeed(usermediaFeed);
    }
    var screenshareFeed = this.getScreenshareFeed(opponentMemberId, opponentDeviceId);
    if (screenshareFeed) {
      this.removeScreenshareFeed(screenshareFeed);
    }
  }
  /*
   * UserMedia CallFeed Event Handlers
   */

  getUserMediaFeed(userId, deviceId) {
    return this.userMediaFeeds.find(f => f.userId === userId && f.deviceId === deviceId);
  }
  addUserMediaFeed(callFeed) {
    this.userMediaFeeds.push(callFeed);
    callFeed.measureVolumeActivity(true);
    this.emit(GroupCallEvent.UserMediaFeedsChanged, this.userMediaFeeds);
  }
  replaceUserMediaFeed(existingFeed, replacementFeed) {
    var feedIndex = this.userMediaFeeds.findIndex(f => f.userId === existingFeed.userId && f.deviceId === existingFeed.deviceId);
    if (feedIndex === -1) {
      throw new Error("Couldn't find user media feed to replace");
    }
    this.userMediaFeeds.splice(feedIndex, 1, replacementFeed);
    existingFeed.dispose();
    replacementFeed.measureVolumeActivity(true);
    this.emit(GroupCallEvent.UserMediaFeedsChanged, this.userMediaFeeds);
  }
  removeUserMediaFeed(callFeed) {
    var feedIndex = this.userMediaFeeds.findIndex(f => f.userId === callFeed.userId && f.deviceId === callFeed.deviceId);
    if (feedIndex === -1) {
      throw new Error("Couldn't find user media feed to remove");
    }
    this.userMediaFeeds.splice(feedIndex, 1);
    callFeed.dispose();
    this.emit(GroupCallEvent.UserMediaFeedsChanged, this.userMediaFeeds);
    if (this.activeSpeaker === callFeed) {
      this.activeSpeaker = this.userMediaFeeds[0];
      this.emit(GroupCallEvent.ActiveSpeakerChanged, this.activeSpeaker);
    }
  }
  /*
   * Screenshare Call Feed Event Handlers
   */

  getScreenshareFeed(userId, deviceId) {
    return this.screenshareFeeds.find(f => f.userId === userId && f.deviceId === deviceId);
  }
  addScreenshareFeed(callFeed) {
    this.screenshareFeeds.push(callFeed);
    this.emit(GroupCallEvent.ScreenshareFeedsChanged, this.screenshareFeeds);
  }
  replaceScreenshareFeed(existingFeed, replacementFeed) {
    var feedIndex = this.screenshareFeeds.findIndex(f => f.userId === existingFeed.userId && f.deviceId === existingFeed.deviceId);
    if (feedIndex === -1) {
      throw new Error("Couldn't find screenshare feed to replace");
    }
    this.screenshareFeeds.splice(feedIndex, 1, replacementFeed);
    existingFeed.dispose();
    this.emit(GroupCallEvent.ScreenshareFeedsChanged, this.screenshareFeeds);
  }
  removeScreenshareFeed(callFeed) {
    var feedIndex = this.screenshareFeeds.findIndex(f => f.userId === callFeed.userId && f.deviceId === callFeed.deviceId);
    if (feedIndex === -1) {
      throw new Error("Couldn't find screenshare feed to remove");
    }
    this.screenshareFeeds.splice(feedIndex, 1);
    callFeed.dispose();
    this.emit(GroupCallEvent.ScreenshareFeedsChanged, this.screenshareFeeds);
  }

  /**
   * Recalculates and updates the participant map to match the room state.
   */
  updateParticipants() {
    var localMember = this.room.getMember(this.client.getSafeUserId());
    if (!localMember) {
      // The client hasn't fetched enough of the room state to get our own member
      // event. This probably shouldn't happen, but sanity check & exit for now.
      logger.warn("GroupCall ".concat(this.groupCallId, " updateParticipants() tried to update participants before local room member is available"));
      return;
    }
    if (this.participantsExpirationTimer !== null) {
      clearTimeout(this.participantsExpirationTimer);
      this.participantsExpirationTimer = null;
    }
    if (this.state === GroupCallState.Ended) {
      this.participants = new Map();
      return;
    }
    var participants = new Map();
    var now = Date.now();
    var entered = this.state === GroupCallState.Entered || this.enteredViaAnotherSession;
    var nextExpiration = Infinity;
    for (var e of this.getMemberStateEvents()) {
      var member = this.room.getMember(e.getStateKey());
      var content = e.getContent();
      var calls = Array.isArray(content["m.calls"]) ? content["m.calls"] : [];
      var call = calls.find(call => call["m.call_id"] === this.groupCallId);
      var devices = Array.isArray(call === null || call === void 0 ? void 0 : call["m.devices"]) ? call["m.devices"] : [];

      // Filter out invalid and expired devices
      var validDevices = devices.filter(d => typeof d.device_id === "string" && typeof d.session_id === "string" && typeof d.expires_ts === "number" && d.expires_ts > now && Array.isArray(d.feeds));

      // Apply local echo for the unentered case
      if (!entered && (member === null || member === void 0 ? void 0 : member.userId) === this.client.getUserId()) {
        validDevices = validDevices.filter(d => d.device_id !== this.client.getDeviceId());
      }

      // Must have a connected device and be joined to the room
      if (validDevices.length > 0 && (member === null || member === void 0 ? void 0 : member.membership) === KnownMembership.Join) {
        var deviceMap = new Map();
        participants.set(member, deviceMap);
        for (var d of validDevices) {
          deviceMap.set(d.device_id, {
            sessionId: d.session_id,
            screensharing: d.feeds.some(f => f.purpose === SDPStreamMetadataPurpose.Screenshare)
          });
          if (d.expires_ts < nextExpiration) nextExpiration = d.expires_ts;
        }
      }
    }

    // Apply local echo for the entered case
    if (entered) {
      var _deviceMap = participants.get(localMember);
      if (_deviceMap === undefined) {
        _deviceMap = new Map();
        participants.set(localMember, _deviceMap);
      }
      if (!_deviceMap.has(this.client.getDeviceId())) {
        _deviceMap.set(this.client.getDeviceId(), {
          sessionId: this.client.getSessionId(),
          screensharing: this.getLocalFeeds().some(f => f.purpose === SDPStreamMetadataPurpose.Screenshare)
        });
      }
    }
    this.participants = participants;
    if (nextExpiration < Infinity) {
      this.participantsExpirationTimer = setTimeout(() => this.updateParticipants(), nextExpiration - now);
    }
  }

  /**
   * Updates the local user's member state with the devices returned by the given function.
   * @param fn - A function from the current devices to the new devices. If it
   *   returns null, the update will be skipped.
   * @param keepAlive - Whether the request should outlive the window.
   */
  updateDevices(fn) {
    var _arguments3 = arguments,
      _this11 = this;
    return _asyncToGenerator(function* () {
      var _event$getContent;
      var keepAlive = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : false;
      var now = Date.now();
      var localUserId = _this11.client.getUserId();
      var event = _this11.getMemberStateEvents(localUserId);
      var content = (_event$getContent = event === null || event === void 0 ? void 0 : event.getContent()) !== null && _event$getContent !== void 0 ? _event$getContent : {};
      var calls = Array.isArray(content["m.calls"]) ? content["m.calls"] : [];
      var call = null;
      var otherCalls = [];
      for (var c of calls) {
        if (c["m.call_id"] === _this11.groupCallId) {
          call = c;
        } else {
          otherCalls.push(c);
        }
      }
      if (call === null) call = {};
      var devices = Array.isArray(call["m.devices"]) ? call["m.devices"] : [];

      // Filter out invalid and expired devices
      var validDevices = devices.filter(d => typeof d.device_id === "string" && typeof d.session_id === "string" && typeof d.expires_ts === "number" && d.expires_ts > now && Array.isArray(d.feeds));
      var newDevices = fn(validDevices);
      if (newDevices === null) return;
      var newCalls = [...otherCalls];
      if (newDevices.length > 0) {
        newCalls.push(_objectSpread(_objectSpread({}, call), {}, {
          "m.call_id": _this11.groupCallId,
          "m.devices": newDevices
        }));
      }
      var newContent = {
        "m.calls": newCalls
      };
      yield _this11.client.sendStateEvent(_this11.room.roomId, EventType.GroupCallMemberPrefix, newContent, localUserId, {
        keepAlive
      });
    })();
  }
  addDeviceToMemberState() {
    var _this12 = this;
    return _asyncToGenerator(function* () {
      yield _this12.updateDevices(devices => [...devices.filter(d => d.device_id !== _this12.client.getDeviceId()), {
        device_id: _this12.client.getDeviceId(),
        session_id: _this12.client.getSessionId(),
        expires_ts: Date.now() + DEVICE_TIMEOUT,
        feeds: _this12.getLocalFeeds().map(feed => ({
          purpose: feed.purpose
        }))
        // TODO: Add data channels
      }]);
    })();
  }
  updateMemberState() {
    var _this13 = this;
    return _asyncToGenerator(function* () {
      // Clear the old update interval before proceeding
      if (_this13.resendMemberStateTimer !== null) {
        clearInterval(_this13.resendMemberStateTimer);
        _this13.resendMemberStateTimer = null;
      }
      if (_this13.state === GroupCallState.Entered) {
        // Add the local device
        yield _this13.addDeviceToMemberState();

        // Resend the state event every so often so it doesn't become stale
        _this13.resendMemberStateTimer = setInterval(/*#__PURE__*/_asyncToGenerator(function* () {
          logger.log("GroupCall ".concat(_this13.groupCallId, " updateMemberState() resending call member state\""));
          try {
            yield _this13.addDeviceToMemberState();
          } catch (e) {
            logger.error("GroupCall ".concat(_this13.groupCallId, " updateMemberState() failed to resend call member state"), e);
          }
        }), DEVICE_TIMEOUT * 3 / 4);
      } else {
        // Remove the local device
        yield _this13.updateDevices(devices => devices.filter(d => d.device_id !== _this13.client.getDeviceId()), true);
      }
    })();
  }

  /**
   * Cleans up our member state by filtering out logged out devices, inactive
   * devices, and our own device (if we know we haven't entered).
   */
  cleanMemberState() {
    var _this14 = this;
    return _asyncToGenerator(function* () {
      var {
        devices: myDevices
      } = yield _this14.client.getDevices();
      var deviceMap = new Map(myDevices.map(d => [d.device_id, d]));

      // updateDevices takes care of filtering out inactive devices for us
      yield _this14.updateDevices(devices => {
        var newDevices = devices.filter(d => {
          var device = deviceMap.get(d.device_id);
          return (device === null || device === void 0 ? void 0 : device.last_seen_ts) !== undefined && !(d.device_id === _this14.client.getDeviceId() && _this14.state !== GroupCallState.Entered && !_this14.enteredViaAnotherSession);
        });

        // Skip the update if the devices are unchanged
        return newDevices.length === devices.length ? null : newDevices;
      });
    })();
  }
  getGroupCallStats() {
    if (this.stats === undefined) {
      var userID = this.client.getUserId() || "unknown";
      this.stats = new GroupCallStats(this.groupCallId, userID, this.statsCollectIntervalTime);
      this.stats.reports.on(StatsReport.CONNECTION_STATS, this.onConnectionStats);
      this.stats.reports.on(StatsReport.BYTE_SENT_STATS, this.onByteSentStats);
      this.stats.reports.on(StatsReport.SUMMARY_STATS, this.onSummaryStats);
      this.stats.reports.on(StatsReport.CALL_FEED_REPORT, this.onCallFeedReport);
    }
    return this.stats;
  }
  setGroupCallStatsInterval(interval) {
    this.statsCollectIntervalTime = interval;
    if (this.stats !== undefined) {
      this.stats.stop();
      this.stats.setInterval(interval);
      if (interval > 0) {
        this.stats.start();
      }
    }
  }
}
//# sourceMappingURL=groupCall.js.map