declare module '*.vue';


interface ImportMeta {
  hot?: {
      accept: (path: string, callback: () => void) => void;
      decline: () => void;
      dispose: (callback: () => void) => void;
      on: (event: string, callback: () => void) => void;
  };
}
