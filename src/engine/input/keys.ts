/* FILE NAME   : keys.ts
 * PURPOSE     : Cascade radiance implementation project.
 * PROGRAMMER  : CGSG'SrAd'2024.
 *               Timofey Hudyakov (TH4),
 *               Rybinskiy Gleb (GR1),
 *               Ilyasov Alexander (AI3).
 * LAST UPDATE : 10.06.2025
 */

/** Keys constants */
export const Keys = {
  A: 'KeyA', B: 'KeyB', C: 'KeyC', D: 'KeyD', E: 'KeyE', F: 'KeyF',
  G: 'KeyG', H: 'KeyH', I: 'KeyI', J: 'KeyJ', K: 'KeyK', L: 'KeyL',
  M: 'KeyM', N: 'KeyN', O: 'KeyO', P: 'KeyP', Q: 'KeyQ', R: 'KeyR',
  S: 'KeyS', T: 'KeyT', U: 'KeyU', V: 'KeyV', W: 'KeyW', X: 'KeyX',
  Y: 'KeyY', Z: 'KeyZ',

  Digit0: 'Digit0', Digit1: 'Digit1', Digit2: 'Digit2', Digit3: 'Digit3',
  Digit4: 'Digit4', Digit5: 'Digit5', Digit6: 'Digit6', Digit7: 'Digit7',
  Digit8: 'Digit8', Digit9: 'Digit9',

  F1: 'F1', F2: 'F2', F3: 'F3', F4: 'F4', F5: 'F5', F6: 'F6',
  F7: 'F7', F8: 'F8', F9: 'F9', F10: 'F10', F11: 'F11', F12: 'F12',

  ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight',

  Space: 'Space', Enter: 'Enter', Escape: 'Escape', Tab: 'Tab',
  Backspace: 'Backspace', Delete: 'Delete', Insert: 'Insert',
  Home: 'Home', End: 'End', PageUp: 'PageUp', PageDown: 'PageDown',

  Shift: 'ShiftLeft', ShiftRight: 'ShiftRight',
  Ctrl: 'ControlLeft', CtrlRight: 'ControlRight',
  Alt: 'AltLeft', AltRight: 'AltRight',
  Meta: 'MetaLeft', MetaRight: 'MetaRight',

  Numpad0: 'Numpad0', Numpad1: 'Numpad1', Numpad2: 'Numpad2',
  Numpad3: 'Numpad3', Numpad4: 'Numpad4', Numpad5: 'Numpad5',
  Numpad6: 'Numpad6', Numpad7: 'Numpad7', Numpad8: 'Numpad8',
  Numpad9: 'Numpad9', NumpadAdd: 'NumpadAdd', NumpadSubtract: 'NumpadSubtract',
  NumpadMultiply: 'NumpadMultiply', NumpadDivide: 'NumpadDivide',
  NumpadDecimal: 'NumpadDecimal', NumpadEnter: 'NumpadEnter'
} as const;

/** Mouse buttons constants */
export const MouseButtons = {
  Left: 0,
  Middle: 1,
  Right: 2
} as const;

/** END OF 'keys.ts' FILE */