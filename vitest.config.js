const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
    test: {
        globals: true//Vitest ko hum keh rahe hain: "Har test file mein test() aur expect() ko automatically available kar do."
    }
});
//is file main testing ky liye configuration define kia gya hai it's like rules for testing.