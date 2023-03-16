// @ts-nocheck
import fs from 'fs';

export const parseJSON = (JSONfile) => JSON.parse(fs.readFileSync(JSONfile));
