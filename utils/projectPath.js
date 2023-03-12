import path from "path";
import url from "url";

const filename = url.fileURLToPath(import.meta.url);
export const projectPath = path.dirname(filename).split("/").slice(0, -1).join("/");
