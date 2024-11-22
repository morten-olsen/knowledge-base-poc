/// <reference types="vite/client" />
//
declare module '*?worker' {
  const A: new () => Worker;
  export default A;
}
declare module '*?*&url' {
  export default string;
}
declare module '*?url' {
  export default string;
}
declare module '*?*&inline' {
  export default string;
}
declare module '*?inline' {
  export default string;
}
