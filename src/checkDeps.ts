import { execSync } from "child_process";

export const checkDeps = () => {
  try {
    execSync("ffmpeg -version");
    return true;
  } catch {
    return false;
  }
};
