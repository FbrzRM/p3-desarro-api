// En ESM nativo, Jest no inyecta el objeto `jest` como global (solo
// describe/it/expect/beforeEach). El spec de la práctica usa `jest.fn()` sin
// importarlo, así que lo exponemos globalmente aquí.
import { jest } from '@jest/globals';

globalThis.jest = jest;
