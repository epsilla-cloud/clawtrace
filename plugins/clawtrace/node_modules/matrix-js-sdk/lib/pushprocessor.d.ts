import { type Logger } from "./logger.ts";
import { type MatrixClient } from "./client.ts";
import { type MatrixEvent } from "./models/event.ts";
import { type IAnnotatedPushRule, type IPushRule, type IPushRules, type PushRuleAction, PushRuleKind, TweakName } from "./@types/PushRules.ts";
export interface IActionsObject {
    /** Whether this event should notify the user or not. */
    notify: boolean;
    /** How this event should be notified. */
    tweaks: Partial<Record<TweakName, any>>;
}
export declare class PushProcessor {
    private readonly client;
    /**
     * Construct a Push Processor.
     * @param client - The Matrix client object to use
     */
    constructor(client: MatrixClient);
    /**
     * Maps the original key from the push rules to a list of property names
     * after unescaping.
     */
    private readonly parsedKeys;
    /**
     * Convert a list of actions into a object with the actions as keys and their values
     * @example
     * eg. `[ 'notify', { set_tweak: 'sound', value: 'default' } ]`
     *     becomes `{ notify: true, tweaks: { sound: 'default' } }`
     * @param actionList - The actions list
     *
     * @returns A object with key 'notify' (true or false) and an object of actions
     */
    static actionListToActionsObject(actionList: PushRuleAction[]): IActionsObject;
    /**
     * Rewrites conditions on a client's push rules to match the defaults
     * where applicable. Useful for upgrading push rules to more strict
     * conditions when the server is falling behind on defaults.
     *
     * @param logger - A `Logger` to write log messages to.
     * @param incomingRules - The client's existing push rules
     * @param userId - The Matrix ID of the client.
     * @returns The rewritten rules
     */
    static rewriteDefaultRules(logger: Logger, incomingRules: IPushRules, userId?: string | undefined): IPushRules;
    /**
     * Create a RegExp object for the given glob pattern with a single capture group around the pattern itself, caching the result.
     * No cache invalidation is present currently,
     * as this will be inherently bounded to the size of the user's own push rules.
     * @param pattern - the glob pattern to convert to a RegExp
     * @param alignToWordBoundary - whether to align the pattern to word boundaries,
     *     as specified for `content.body` matches, will use lookaround assertions to ensure the match only includes the pattern
     * @param flags - the flags to pass to the RegExp constructor, defaults to case-insensitive
     */
    static getPushRuleGlobRegex(pattern: string, alignToWordBoundary?: boolean, flags?: string): RegExp;
    /**
     * Pre-caches the parsed keys for push rules and cleans out any obsolete cache
     * entries. Should be called after push rules are updated.
     * @param newRules - The new push rules.
     */
    updateCachedPushRuleKeys(newRules: IPushRules): void;
    private static cachedGlobToRegex;
    private matchingRuleFromKindSet;
    private templateRuleToRaw;
    private eventFulfillsCondition;
    private eventFulfillsSenderNotifPermCondition;
    private eventFulfillsRoomMemberCountCondition;
    private eventFulfillsDisplayNameCondition;
    /**
     * Check whether the given event matches the push rule condition by fetching
     * the property from the event and comparing against the condition's glob-based
     * pattern.
     * @param cond - The push rule condition to check for a match.
     * @param ev - The event to check for a match.
     */
    private eventFulfillsEventMatchCondition;
    /**
     * Check whether the given event matches the push rule condition by fetching
     * the property from the event and comparing exactly against the condition's
     * value.
     * @param cond - The push rule condition to check for a match.
     * @param ev - The event to check for a match.
     */
    private eventFulfillsEventPropertyIsCondition;
    /**
     * Check whether the given event matches the push rule condition by fetching
     * the property from the event and comparing exactly against the condition's
     * value.
     * @param cond - The push rule condition to check for a match.
     * @param ev - The event to check for a match.
     */
    private eventFulfillsEventPropertyContains;
    private eventFulfillsCallStartedCondition;
    /**
     * Parse the key into the separate fields to search by splitting on
     * unescaped ".", and then removing any escape characters.
     *
     * @param str - The key of the push rule condition: a dotted field.
     * @returns The unescaped parts to fetch.
     * @internal
     */
    static partsForDottedKey(str: string): string[];
    /**
     * For a dotted field and event, fetch the value at that position, if one
     * exists.
     *
     * @param key - The key of the push rule condition: a dotted field to fetch.
     * @param ev - The matrix event to fetch the field from.
     * @returns The value at the dotted path given by key.
     */
    private valueForDottedKey;
    private matchingRuleForEventWithRulesets;
    private pushActionsForEventAndRulesets;
    ruleMatchesEvent(rule: Partial<IPushRule> & Pick<IPushRule, "conditions">, ev: MatrixEvent): boolean;
    /**
     * Get the user's push actions for the given event
     */
    actionsForEvent(ev: MatrixEvent): IActionsObject;
    actionsAndRuleForEvent(ev: MatrixEvent): {
        actions?: IActionsObject;
        rule?: IAnnotatedPushRule;
    };
    /**
     * Get one of the users push rules by its ID
     *
     * @param ruleId - The ID of the rule to search for
     * @returns The push rule, or null if no such rule was found
     */
    getPushRuleById(ruleId: string): IPushRule | null;
    /**
     * Get one of the users push rules by its ID
     *
     * @param ruleId - The ID of the rule to search for
     * @returns rule The push rule, or null if no such rule was found
     * @returns kind - The PushRuleKind of the rule to search for
     */
    getPushRuleAndKindById(ruleId: string): {
        rule: IPushRule;
        kind: PushRuleKind;
    } | null;
}
//# sourceMappingURL=pushprocessor.d.ts.map