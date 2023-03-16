// @ts-nocheck
import fs from 'fs';

export function parseJSON(JSONfile, cb) {
  fs.readFile(JSONfile, (err, fileContent) =>
    err ? cb([]) : cb(JSON.parse(fileContent))
  );
}
