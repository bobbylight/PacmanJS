import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            reporter: ['text', 'json', 'lcov'],
            reportOnFailure: true,
        },
    },
})
