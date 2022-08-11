import { isQuery } from "./Query";
import { checkDeps } from "./checkDeps";
import { startStream } from "./startStream";
import { stopStream } from "./stopStream";
import { ChildProcessWithoutNullStreams } from "child_process";
import express from "express";

const port = 3000;

const main = () => {
  if (!checkDeps()) {
    console.error("Dependencies missing.");
    return;
  }
  const app = express();
  const activeStreams = new Map<
    { dirpath: string; filename: string },
    ChildProcessWithoutNullStreams
  >();

  app.get("/", (_, res) => {
    res.send("Hi.");
  });

  app.get("/start", (req, res) => {
    if (isQuery(req.query)) {
      const key = {
        dirpath: req.query.dirpath,
        filename: req.query.filename,
      };
      if (!activeStreams.has(key)) {
        const stream = startStream(req.query);
        activeStreams.set(key, stream);
        res.send(`Successfully started playing "${req.query.filename}".`);
      } else {
        res.send("This stream has already started.");
      }
    } else {
      res
        .status(400)
        .send(
          'Some queries are missing. "dirpath" and "filename" are required.'
        );
    }
  });

  app.get("/stop", (req, res) => {
    if (isQuery(req.query)) {
      const key = {
        dirpath: req.query.dirpath,
        filename: req.query.filename,
      };
      const stream = activeStreams.get(key);
      if (stream) {
        stopStream(stream);
        activeStreams.delete(key);
        res.send(`Successfully stop playing "${req.query.filename}".`);
      } else {
        res.status(404).send("Stream not found.");
      }
    } else {
      res
        .status(400)
        .send(
          'Some queries are missing. "dirpath" and "filename" are required.'
        );
    }
  });

  app.get("/info", (_, res) => {
    res.json(activeStreams);
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

main();
