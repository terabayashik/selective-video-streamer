// TODO: Add alias for stream
export interface Query {
  dirpath: string;
  filename: string;
}

export const isQuery = (arg: unknown): arg is Query => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as Query).dirpath === "string" &&
    typeof (arg as Query).filename === "string"
  );
};
