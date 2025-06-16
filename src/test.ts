import { stdVertex } from "./engine/render/res/primitives/topology";

// Создаем namespace
namespace VRC {
  export const std = stdVertex;
  // Добавьте другие классы здесь
}

// Устанавливаем глобальные переменные
(globalThis as any).VRC = VRC;
(globalThis as any).std = stdVertex;

// Экспортируем для TypeScript
export { VRC, std: stdVertex as std };

// Модульная декларация для файлов, которые импортируют этот модуль
declare module "*.ts" {
  global {
    var VRC: typeof VRC;
    var std: typeof stdVertex;
  }
}