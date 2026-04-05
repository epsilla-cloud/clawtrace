export declare enum MatrixApiVersion {
    Prerelease1 = "0.0.1",
    Prerelease2 = "0.0.2"
}
export declare enum UnstableApiVersion {
    MSC2762 = "org.matrix.msc2762",
    MSC2762_UPDATE_STATE = "org.matrix.msc2762_update_state",
    MSC2871 = "org.matrix.msc2871",
    MSC2873 = "org.matrix.msc2873",
    MSC2931 = "org.matrix.msc2931",
    MSC2974 = "org.matrix.msc2974",
    MSC2876 = "org.matrix.msc2876",
    MSC3819 = "org.matrix.msc3819",
    MSC3846 = "town.robin.msc3846",
    MSC3869 = "org.matrix.msc3869",
    MSC3973 = "org.matrix.msc3973",
    MSC4039 = "org.matrix.msc4039"
}
export type ApiVersion = MatrixApiVersion | UnstableApiVersion | string;
export declare const CurrentApiVersions: ApiVersion[];
