import { stdVertex } from "./engine/render/res/primitives/topology";

// Создаем namespace
namespace VRC {
  export const std = stdVertex;
  // Добавьте другие классы здесь
}

(globalThis as any).VRC = VRC;

// Если хотите прямой доступ без namespace
declare global {
  let std: typeof stdVertex;
}

(globalThis as any).std = stdVertex;

export { VRC, std };
