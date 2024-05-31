import { convert2img } from "mdimg";
import fs from "fs";

const INPUT_DIR = "contents";
const OUTPUT_DIR = "public";
const contents: { [key: string]: string[] } = {};

async function convertSingleDir(dir: string) {
  const pageMap: { [key: string]: string } = {};
  const promises = fs.readdirSync(dir).map(async (file) => {
    if (file.endsWith(".md")) {
      const fileName = `${dir}/${file.replace(".md", ".png")}`;
      const convertRes = await convert2img({
        mdFile: `${dir}/${file}`,
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

  await Promise.all(promises);

  const pages: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    if (file.endsWith(".md")) {
      pages.push(pageMap[file]);
    }
  });

  contents[dir] = pages;
}

async function createIndexPage(slides: string[]) {
  const indexMD = `
# Slides

${slides.map((slide) => `- ${slide.replace("contents/", "")}`).join("\n")}

Input a slide name for browsing.
  `;

  const convertRes = await convert2img({
    mdText: indexMD,
    outputFilename: `public/contents/index.png`,
    width: 600,
    cssTemplate: "github",
  });

  if (convertRes.error) {
    console.error(convertRes.error);
  }
}

fs.existsSync(OUTPUT_DIR) && fs.rmSync(OUTPUT_DIR, { recursive: true });

const promises = fs
  .readdirSync(INPUT_DIR, { withFileTypes: true })
  .map(async (dir) => {
    if (dir.isDirectory()) {
      await convertSingleDir(`${INPUT_DIR}/${dir.name}`);
    }
  });

await Promise.all(promises);

fs.writeFileSync("public/contents.json", JSON.stringify({ contents }, null, 2));

await createIndexPage(Object.keys(contents));

console.log("Conversion complete!");
