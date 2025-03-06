declare module 'rollup/parseAst' {
    export function parseAst(input: string): any;
    export function parseAstAsync(input: string): Promise<any>;
  }