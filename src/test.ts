
import { stdVertex } from "./engine/render/res/primitives/topology";

// Создаем namespace
namespace VRC {
  export const std = stdVertex;
  // Добавьте другие классы здесь
}

// Делаем доступным глобально только после импорта этого модуля
declare global {
  var VRC: typeof VRC;
  var std: typeof stdVertex;
}

// Устанавливаем глобальные переменные
(globalThis as any).VRC = VRC;
(globalThis as any).std = stdVertex;

// Экспортируем для TypeScript
export { VRC, std: stdVertex as std };

// Дополнительная типизация для модулей, которые импортируют этот файл
declare module "*" {
  global {
    var std: typeof stdVertex;
    var VRC: typeof VRC;
  }
}
