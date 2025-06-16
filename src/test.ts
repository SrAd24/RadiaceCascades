
import { stdVertex } from "./engine/render/res/primitives/topology";

// Создаем namespace
namespace VRC {
  export const std = stdVertex;
  // Добавьте другие классы здесь
}

// Делаем доступным глобально только после импорта этого модуля
declare global {
  let std: typeof stdVertex;
}

// Устанавливаем глобальные переменные
(globalThis as any).VRC = VRC;
(globalThis as any).std = stdVertex;

// Экспортируем для TypeScript
export { VRC, std };

declare module "*" {
  global {
    var std: typeof stdVertex;
  }
}
