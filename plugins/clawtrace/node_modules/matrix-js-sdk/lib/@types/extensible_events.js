/*
Copyright 2021 - 2023 The Matrix.org Foundation C.I.C.

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

import { NamespacedValue, UnstableValue } from "matrix-events-sdk";
import { isProvided } from "../extensible_events_v1/utilities.js";

// Types and utilities for MSC1767: Extensible events (version 1) in Matrix

/**
 * Represents the stable and unstable values of a given namespace.
 */

/**
 * Represents a namespaced value, if the value is a string. Used to extract provided types
 * from a TSNamespace<N> (in cases where only stable *or* unstable is provided).
 */

/**
 * Creates a type which is V when T is `never`, otherwise T.
 */
// See https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379091887 for details on the array syntax.

/**
 * The namespaced value for m.message
 */
export var M_MESSAGE = new UnstableValue("m.message", "org.matrix.msc1767.message");

/**
 * An m.message event rendering
 */

/**
 * The content for an m.message event
 */

/**
 * The namespaced value for m.text
 */
export var M_TEXT = new UnstableValue("m.text", "org.matrix.msc1767.text");

/**
 * The content for an m.text event
 */

/**
 * The namespaced value for m.html
 */
export var M_HTML = new UnstableValue("m.html", "org.matrix.msc1767.html");

/**
 * The content for an m.html event
 */

/**
 * The content for an m.message, m.text, or m.html event
 */

/**
 * The namespaced value for an m.reference relation
 */
export var REFERENCE_RELATION = new NamespacedValue("m.reference");

/**
 * Represents any relation type
 */

/**
 * An m.relates_to relationship
 */

/**
 * Partial types for a Matrix Event.
 */

/**
 * Represents a potentially namespaced event type.
 */

/**
 * Determines if two event types are the same, including namespaces.
 * @param given - The given event type. This will be compared
 * against the expected type.
 * @param expected - The expected event type.
 * @returns True if the given type matches the expected type.
 */
export function isEventTypeSame(given, expected) {
  if (typeof given === "string") {
    if (typeof expected === "string") {
      return expected === given;
    } else {
      return expected.matches(given);
    }
  } else {
    if (typeof expected === "string") {
      return given.matches(expected);
    } else {
      var expectedNs = expected;
      var givenNs = given;
      return expectedNs.matches(givenNs.name) || isProvided(givenNs.altName) && expectedNs.matches(givenNs.altName);
    }
  }
}
//# sourceMappingURL=extensible_events.js.map