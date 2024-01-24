declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.scss';
declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.mp3';
declare module 'react-csv';

declare namespace pathname {
  export default function resolvePathname(to: string, from?: string): string;
}

declare module 'resolve-pathname' {
  export = pathname;
}
