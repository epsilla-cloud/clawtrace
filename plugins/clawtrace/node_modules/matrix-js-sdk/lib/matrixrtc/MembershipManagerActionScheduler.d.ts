import { type Logger } from "../logger.ts";
import { type EmptyObject } from "../matrix.ts";
import { MembershipActionType } from "./MembershipManager.ts";
/** @internal */
export interface Action {
    /**
     * When this action should be executed
     */
    ts: number;
    /**
     * The state of the different loops
     * can also be thought of as the type of the action
     */
    type: MembershipActionType;
}
/** @internal */
export type ActionUpdate = {
    /** Replace all existing scheduled actions with this new array */
    replace: Action[];
} | {
    /** Add these actions to the existing scheduled actions */
    insert: Action[];
} | EmptyObject;
/**
 * This scheduler tracks the state of the current membership participation
 * and runs one central timer that wakes up a handler callback with the correct action + state
 * whenever necessary.
 *
 * It can also be awakened whenever a new action is added which is
 * earlier then the current "next awake".
 * @internal
 */
export declare class ActionScheduler {
    /** This is the callback called for each scheduled action (`this.addAction()`) */
    private membershipLoopHandler;
    private logger;
    /**
     * This is tracking the state of the scheduler loop.
     * Only used to prevent starting the loop twice.
     */
    running: boolean;
    constructor(
    /** This is the callback called for each scheduled action (`this.addAction()`) */
    membershipLoopHandler: (type: MembershipActionType) => Promise<ActionUpdate>, parentLogger?: Logger);
    private wakeup;
    private _actions;
    get actions(): Action[];
    /**
     * This starts the main loop of the membership manager that handles event sending, delayed event sending and delayed event restarting.
     * @param initialActions The initial actions the manager will start with. It should be enough to pass: DelayedLeaveActionType.Initial
     * @returns Promise that resolves once all actions have run and no more are scheduled.
     * @throws This throws an error if one of the actions throws.
     * In most other error cases the manager will try to handle any server errors by itself.
     */
    startWithJoin(): Promise<void>;
    initiateJoin(): void;
    initiateLeave(): void;
}
//# sourceMappingURL=MembershipManagerActionScheduler.d.ts.map