import { convert2img } from "mdimg";
import fs from "fs";

const pageMap: { [key: string]: string } = {};

fs.rmdirSync("public/images", { recursive: true });

const promises = fs.readdirSync("contents").map(async (file) => {
  if (file.endsWith(".md")) {
    const fileName = `images/${file.replace(".md", ".png")}`;
    const convertRes = await convert2img({
      mdFile: `contents/${file}`,
      outputFilename: `public/${fileName}`,
      width: 600,
      cssTemplate: "github",
    });

    if (convertRes.error) {
      console.error(convertRes.error);
    }

    pageMap[file] = `/${fileName}`;
  }
});

Promise.all(promises).then(() => {
  const pages: string[] = [];
  fs.readdirSync("contents").forEach((file) => {
    if (file.endsWith(".md")) {
      pages.push(pageMap[file]);
    }
  });

  fs.writeFileSync("public/slides.json", JSON.stringify({ pages }, null, 2));

  console.log("Conversion complete!");
});
