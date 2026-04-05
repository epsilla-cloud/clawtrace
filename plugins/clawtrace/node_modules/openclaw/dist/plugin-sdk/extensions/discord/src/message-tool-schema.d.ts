export declare function createDiscordMessageToolComponentsSchema(): import("@sinclair/typebox").TObject<{
    text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    reusable: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    container: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        accentColor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        spoiler: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>>;
    blocks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        type: import("@sinclair/typebox").TString;
        text: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        texts: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        accessory: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            button: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                label: import("@sinclair/typebox").TString;
                style: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<string>>;
                url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                emoji: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                    name: import("@sinclair/typebox").TString;
                    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                    animated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                }>>;
                disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                allowedUsers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            }>>;
        }>>;
        spacing: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<string>>;
        divider: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        buttons: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            label: import("@sinclair/typebox").TString;
            style: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<string>>;
            url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            emoji: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                name: import("@sinclair/typebox").TString;
                id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                animated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            }>>;
            disabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            allowedUsers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>>>;
        select: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<string>>;
            placeholder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            minValues: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            maxValues: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                label: import("@sinclair/typebox").TString;
                value: import("@sinclair/typebox").TString;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                emoji: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                    name: import("@sinclair/typebox").TString;
                    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                    animated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                }>>;
                default: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            }>>>;
        }>>;
        items: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            url: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            spoiler: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>>>;
        file: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        spoiler: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>>>;
    modal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        title: import("@sinclair/typebox").TString;
        triggerLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        triggerStyle: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<string>>;
        fields: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            type: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            label: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            placeholder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            required: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                label: import("@sinclair/typebox").TString;
                value: import("@sinclair/typebox").TString;
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                emoji: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                    name: import("@sinclair/typebox").TString;
                    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                    animated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                }>>;
                default: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            }>>>;
            minValues: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            maxValues: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            minLength: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            maxLength: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            style: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<string>>;
        }>>;
    }>>;
}>;
