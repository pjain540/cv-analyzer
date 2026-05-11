/// <reference types="vite/client" />

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.jpg";
declare module "*.png";
declare module "*.webp";
declare module "*.svg";
