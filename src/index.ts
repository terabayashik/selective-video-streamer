import { isQuery } from "./Query";
import { checkDeps } from "./checkDeps";
import { getGlobalIp } from "./getGlobalIp";
import { startStream } from "./startStream";
import { stopStream } from "./stopStream";
import { ChildProcessWithoutNullStreams } from "child_process";
import express from "express";
import { isEqual } from "lodash";
import path from "path";

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

  app.get("/start", async (req, res) => {
    if (isQuery(req.query)) {
      const key = {
        dirpath: req.query.dirpath,
        filename: req.query.filename,
      };
      for (const item of activeStreams.keys()) {
        if (isEqual(key, item)) {
          res.send("This stream has already started.");
          return;
        }
      }
      const stream = startStream(req.query);
      activeStreams.set(key, stream);
      res.send(
        `Successfully started playing "${
          req.query.filename
        }" at http://${await getGlobalIp()}/live/${
          path.parse(key.filename).name
        }.m3u8.`
      );
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
      for (const [streamKey, streamValue] of activeStreams.entries()) {
        if (isEqual(key, streamKey)) {
          stopStream(streamValue);
          console.log(`Stream of ${key.filename} stopped.`);
          activeStreams.delete(streamKey);
          res.send(`Successfully stopped playing "${req.query.filename}".`);
          return;
        }
      }
      res.status(404).send("Stream not found.");
    } else {
      res
        .status(400)
        .send(
          'Some queries are missing. "dirpath" and "filename" are required.'
        );
    }
  });

  app.get("/info", (_, res) => {
    const json = { streams: [] } as {
      streams: { dirpath: string; filename: string }[];
    };
    for (const stream of activeStreams.keys()) {
      json.streams.push({ dirpath: stream.dirpath, filename: stream.filename });
    }
    res.json(json);
  });

  app.listen(port, async () => {
    console.log("[Usage]");
    console.log("- Start stream");
    console.log(
      `curl "http://${await getGlobalIp()}:${port}/start?dirpath=/path/to/vid&filename=video.mp4"`
    );
    console.log("- Stop stream");
    console.log(
      `curl "http://${await getGlobalIp()}:${port}/stop?dirpath=/path/to/vid&filename=video.mp4"`
    );
    console.log("- Show stream info");
    console.log(`curl "http://${await getGlobalIp()}:${port}/info"`);
    console.log(
      "=================================================================="
    );
  });
};

main();
