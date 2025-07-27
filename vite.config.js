import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [],
    test: {
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'json', 'lcov'],
            reportOnFailure: true,
        },
    },
})
