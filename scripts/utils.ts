import path from "path";

export const r = (...pathSegments: string[]) => path.resolve(__dirname, ...pathSegments);

const getCommentText = (text: string, marker: "START" | "END") => `<!-- ${text}:${marker} -->`;

export const regexGlobalCaptureGroup = (input: string, regex: RegExp) => {
  const output = [];
  let matches;

  const getMatch = (match: any[]) => {
    for (let i = 1; i < match.length; i++) {
      const value = match[i];
      if (value) return value;
    }
  };

  while ((matches = regex.exec(input))) {
    const captured = getMatch(matches);
    if (captured) {
      output.push(captured);
    }
  }
  if (!output.length) return null;
  return output;
};

export function insertTextBetweenComments(file: string, text: string, comment: string): string {
  const startComment = getCommentText(comment, "START");
  const endComment = getCommentText(comment, "END");
  const lines = file.split("\n");
  const start = lines.findIndex(line => line.includes(startComment));
  const end = lines.findIndex(line => line.includes(endComment), start + 1);
  if (start === -1 || end === -1) throw `Could not find ${comment} in ${file}`;
  lines.splice(start + 1, end - start - 1, ...text.split("\n"));
  return lines.join("\n");
}

export const isNonNullable = <T>(i: T): i is NonNullable<T> => i != null;
