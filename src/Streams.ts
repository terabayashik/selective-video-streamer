import { ChildProcessWithoutNullStreams } from "child_process";

export type Stream = {
  dirpath: string;
  filename: string;
  stream: ChildProcessWithoutNullStreams;
};
