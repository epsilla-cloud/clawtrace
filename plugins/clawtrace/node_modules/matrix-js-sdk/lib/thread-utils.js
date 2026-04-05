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

import { THREAD_RELATION_TYPE } from "./models/thread.js";
/**
 * Returns a filter function for the /relations endpoint to filter out relations directly
 * to the thread root event that should not live in the thread timeline
 *
 * @param threadId - the thread ID (ie. the event ID of the root event of the thread)
 * @returns the filtered list of events
 */
export function getRelationsThreadFilter(threadId) {
  return e => {
    var _e$content, _e$content2;
    return ((_e$content = e.content) === null || _e$content === void 0 || (_e$content = _e$content["m.relates_to"]) === null || _e$content === void 0 ? void 0 : _e$content.event_id) !== threadId || ((_e$content2 = e.content) === null || _e$content2 === void 0 || (_e$content2 = _e$content2["m.relates_to"]) === null || _e$content2 === void 0 ? void 0 : _e$content2.rel_type) === THREAD_RELATION_TYPE.name;
  };
}
//# sourceMappingURL=thread-utils.js.map