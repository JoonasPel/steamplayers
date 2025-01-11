const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    screenshotOnRunFailure: false,
    env: {
      baseUrl: "https://steamplayers.info",
    },
  },
});
