const next = require("next");
const express = require("express");
const getPublicKeys = require("./api/getPublicKeys");

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;

const app = express();
const nextApp = next({ dev: isDev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.use(getPublicKeys);

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
  });
});
