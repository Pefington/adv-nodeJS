import path from "path";
import url from "url";

const filename = url.fileURLToPath(import.meta.url);
const rootDir = path.dirname(filename).split("/").slice(0, -1).join("/");

export default rootDir;
