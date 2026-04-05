import { type Room } from "./models/room.ts";
import { type IHierarchyRoom, type IHierarchyRelation } from "./@types/spaces.ts";
export declare class RoomHierarchy {
    readonly root: Room;
    private readonly pageSize?;
    private readonly maxDepth?;
    private readonly suggestedOnly;
    readonly viaMap: Map<string, Set<string>>;
    readonly backRefs: Map<string, string[]>;
    readonly roomMap: Map<string, IHierarchyRoom>;
    private loadRequest?;
    private nextBatch?;
    private _rooms?;
    private serverSupportError?;
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
    constructor(root: Room, pageSize?: number | undefined, maxDepth?: number | undefined, suggestedOnly?: boolean);
    get noSupport(): boolean;
    get canLoadMore(): boolean;
    get loading(): boolean;
    get rooms(): IHierarchyRoom[] | undefined;
    load(pageSize?: number | undefined): Promise<IHierarchyRoom[]>;
    getRelation(parentId: string, childId: string): IHierarchyRelation | undefined;
    isSuggested(parentId: string, childId: string): boolean | undefined;
    removeRelation(parentId: string, childId: string): void;
}
//# sourceMappingURL=room-hierarchy.d.ts.map