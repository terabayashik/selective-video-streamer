import { Query } from "./Query";
import { spawn } from "child_process";
import path from "path";

export const startStream = (query: Query) => {
  // Sample
  // ffmpeg -y -re -stream_loop -1 -i "./【MMD】ＸＳさんでPackaged (HD)【MME】_tc.mp4" -codec:v copy -codec:a copy -fflags genpts -flags +global_header -f flv "rtmp://localhost/live/10"
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
    console.log(`Stream for ${query.filename} started`);
  });
  ffmpegStream.on("exit", (code) => {
    console.log(`Stream for ${query.filename} exited with code ${code}`);
  });
  return ffmpegStream;
};
