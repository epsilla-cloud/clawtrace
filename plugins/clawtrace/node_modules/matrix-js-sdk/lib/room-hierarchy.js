import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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

import { EventType } from "./@types/event.js";
export class RoomHierarchy {
  /**
   * Construct a new RoomHierarchy
   *
   * A RoomHierarchy instance allows you to easily make use of the /hierarchy API and paginate it.
   *
   * @param root - the root of this hierarchy
   * @param pageSize - the maximum number of rooms to return per page, can be overridden per load request.
   * @param maxDepth - the maximum depth to traverse the hierarchy to
   * @param suggestedOnly - whether to only return rooms with suggested=true.
   */
  constructor(root, pageSize, maxDepth) {
    var suggestedOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    this.root = root;
    this.pageSize = pageSize;
    this.maxDepth = maxDepth;
    this.suggestedOnly = suggestedOnly;
    // Map from room id to list of servers which are listed as a via somewhere in the loaded hierarchy
    _defineProperty(this, "viaMap", new Map());
    // Map from room id to list of rooms which claim this room as their child
    _defineProperty(this, "backRefs", new Map());
    // Map from room id to object
    _defineProperty(this, "roomMap", new Map());
    _defineProperty(this, "loadRequest", void 0);
    _defineProperty(this, "nextBatch", void 0);
    _defineProperty(this, "_rooms", void 0);
    _defineProperty(this, "serverSupportError", void 0);
  }
  get noSupport() {
    return !!this.serverSupportError;
  }
  get canLoadMore() {
    return !!this.serverSupportError || !!this.nextBatch || !this._rooms;
  }
  get loading() {
    return !!this.loadRequest;
  }
  get rooms() {
    return this._rooms;
  }
  load() {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var pageSize = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : _this.pageSize;
      if (_this.loadRequest) return _this.loadRequest.then(r => r.rooms);
      _this.loadRequest = _this.root.client.getRoomHierarchy(_this.root.roomId, pageSize, _this.maxDepth, _this.suggestedOnly, _this.nextBatch);
      var rooms;
      try {
        ({
          rooms,
          next_batch: _this.nextBatch
        } = yield _this.loadRequest);
      } catch (e) {
        if (e.errcode === "M_UNRECOGNIZED") {
          _this.serverSupportError = e;
        } else {
          throw e;
        }
        return [];
      } finally {
        _this.loadRequest = undefined;
      }
      if (_this._rooms) {
        _this._rooms = _this._rooms.concat(rooms);
      } else {
        _this._rooms = rooms;
      }
      rooms.forEach(room => {
        _this.roomMap.set(room.room_id, room);
        room.children_state.forEach(ev => {
          if (ev.type !== EventType.SpaceChild) return;
          var childRoomId = ev.state_key;

          // track backrefs for quicker hierarchy navigation
          if (!_this.backRefs.has(childRoomId)) {
            _this.backRefs.set(childRoomId, []);
          }
          _this.backRefs.get(childRoomId).push(room.room_id);

          // fill viaMap
          if (Array.isArray(ev.content.via)) {
            if (!_this.viaMap.has(childRoomId)) {
              _this.viaMap.set(childRoomId, new Set());
            }
            var vias = _this.viaMap.get(childRoomId);
            ev.content.via.forEach(via => vias.add(via));
          }
        });
      });
      return rooms;
    })();
  }
  getRelation(parentId, childId) {
    var _this$roomMap$get;
    return (_this$roomMap$get = this.roomMap.get(parentId)) === null || _this$roomMap$get === void 0 ? void 0 : _this$roomMap$get.children_state.find(e => e.state_key === childId);
  }
  isSuggested(parentId, childId) {
    var _this$getRelation;
    return (_this$getRelation = this.getRelation(parentId, childId)) === null || _this$getRelation === void 0 ? void 0 : _this$getRelation.content.suggested;
  }

  // locally remove a relation as a form of local echo
  removeRelation(parentId, childId) {
    var backRefs = this.backRefs.get(childId);
    if ((backRefs === null || backRefs === void 0 ? void 0 : backRefs.length) === 1) {
      this.backRefs.delete(childId);
    } else if (backRefs !== null && backRefs !== void 0 && backRefs.length) {
      this.backRefs.set(childId, backRefs.filter(ref => ref !== parentId));
    }
    var room = this.roomMap.get(parentId);
    if (room) {
      room.children_state = room.children_state.filter(ev => ev.state_key !== childId);
    }
  }
}
//# sourceMappingURL=room-hierarchy.js.map