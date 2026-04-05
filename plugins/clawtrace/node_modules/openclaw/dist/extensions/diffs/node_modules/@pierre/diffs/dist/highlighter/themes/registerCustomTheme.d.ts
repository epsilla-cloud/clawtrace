import { ThemeRegistration, ThemeRegistrationResolved } from "shiki";

//#region src/highlighter/themes/registerCustomTheme.d.ts
declare function registerCustomTheme(themeName: string, loader: () => Promise<ThemeRegistrationResolved | ThemeRegistration>): void;
//#endregion
export { registerCustomTheme };
//# sourceMappingURL=registerCustomTheme.d.ts.map