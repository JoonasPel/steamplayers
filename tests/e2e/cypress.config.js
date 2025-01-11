const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    screenshotOnRunFailure: true,
    env: {
      baseUrl: "https://steamplayers.info",
    },
  },
});
