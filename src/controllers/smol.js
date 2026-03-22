import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const helloSmol = (request, response) => {
  console.log(`Request method: ${request.method}`)
  return response.sendFile(path.join(__dirname, "../public/index.html"));
}

