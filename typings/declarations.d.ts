declare var __webpack_public_path__: string;
declare module "*.hbs";

declare namespace process {
    export namespace env {
        export const NODE_ENV: string;
    }
}
declare var require: {
    (path: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
declare interface Iterable<T>{

}
interface Window{
    [name:string]:any;
}