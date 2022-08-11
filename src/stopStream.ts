import { ChildProcessWithoutNullStreams } from "child_process";

export const stopStream = (stream: ChildProcessWithoutNullStreams) => {
  stream.kill();
};
