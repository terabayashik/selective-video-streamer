import { Query } from "./Query";
import { spawn } from "child_process";
import path from "path";

export const startStream = (query: Query) => {
  const filename = path.parse(query.filename).name;
  // TODO: Add "-flags +global_header" if needed
  const ffmpegStream = spawn("ffmpeg", [
    "-y",
    "-re",
    "-stream_loop",
    "-1",
    "-i",
    path.join(query.dirpath, query.filename),
    "-c",
    "copy",
    "-fflags",
    "+genpts",
    "-f",
    "flv",
    `rtmp://localhost/live/${filename}`,
  ]);
  ffmpegStream.stdout.on("data", (line: string) => {
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
