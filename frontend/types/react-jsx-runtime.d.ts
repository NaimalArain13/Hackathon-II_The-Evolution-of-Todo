// Type declaration for react/jsx-runtime to fix TypeScript error
declare module 'react/jsx-runtime' {
  export declare const Fragment: typeof import('react').Fragment;
  export declare const jsx: typeof import('react').jsx;
  export declare const jsxs: typeof import('react').jsxs;
}