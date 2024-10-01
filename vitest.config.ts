// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node' // Set environment to Node.js
    // Optionally, specify setupFiles if needed
    // setupFiles: ['./src/setupTests.ts'],
  }
})
