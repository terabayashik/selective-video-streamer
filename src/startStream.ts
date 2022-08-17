import { Query } from "./Query";
import { spawn } from "child_process";
import path from "path";

export const startStream = (query: Query) => {
  const filename = path.parse(query.filename).name;
  const ffmpegStream = spawn("ffmpeg", [
    "-y",
    "-re",
    "-stream_loop",
    "-1",
    "-i",
    path.join(query.dirpath, query.filename),
    "-c",
    "copy",
    "-flags",
    "+global_header",
    "-fflags",
    "+genpts",
    "-f",
    "flv",
    `rtmp://localhost/live/${filename}`,
  ]);
  // TODO: Add handler to update stream info
  ffmpegStream.stderr.on("data", (data) => {
    const line = `${data}`;
    if (line.startsWith("frame=")) {
      console.log(line);
    }
  });
  ffmpegStream.on("spawn", () => {
    console.log(
      `Stream of ${query.filename} available from http://localhost/live/${filename}.m3u8`
    );
  });
  ffmpegStream.on("exit", (code) => {
    console.log(`Stream of ${query.filename} exited with code ${code}`);
  });
  return ffmpegStream;
};
