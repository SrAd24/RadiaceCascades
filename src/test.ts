
import { stdVertex } from "./engine/render/res/primitives/topology";

// Создаем namespace
namespace VRC {
  export const std = stdVertex;
  // Добавьте другие классы здесь
}

// Делаем namespace глобально доступным
declare global {
  var VRC: typeof VRC;
}

(globalThis as any).VRC = VRC;

// Если хотите прямой доступ без namespace
declare global {
  var std: typeof stdVertex;
}

(globalThis as any).std = stdVertex;

export { VRC, std: stdVertex as std };
