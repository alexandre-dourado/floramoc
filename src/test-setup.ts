import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve())
window.HTMLMediaElement.prototype.pause = vi.fn()

afterEach(() => cleanup())
