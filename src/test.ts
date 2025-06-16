import { stdVertex } from "./engine/render/res/primitives/topology";

// Автоматическая активация при импорте
const ctx = {
  std: stdVertex,
};

// Делаем доступным для TypeScript
declare global {
  interface Window {
    __modules?: typeof ctx;
  }
}

// Активируем только для текущего модуля
if (typeof window !== "undefined") {
  window.__modules = ctx;
}
console.log(window.__modules);

// Экспортируем псевдонимы
export const std = stdVertex;

// export const std = stdVertex;
