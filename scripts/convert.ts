import { convert2img } from "mdimg";
import fs from "fs";

fs.readdirSync("contents").forEach(async (file) => {
  if (file.endsWith(".md")) {
    const convertRes = await convert2img({
      mdFile: `contents/${file}`,
      outputFilename: `images/${file.replace(".md", ".png")}`,
      width: 600,
      cssTemplate: "github",
    });

    console.log(`Convert to image successfully!\nFile: ${convertRes.data}`);
  }
});
