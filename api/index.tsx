import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { neynar } from "frog/hubs";
import { handle } from "frog/vercel";
import Markdoc from "@markdoc/markdoc";
import { html } from "./toHtml.js";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

const pages = [
  `
# Header 1

Page 1
`,
  `
# Header 2

Page 2
`,
];

function mdToHtml(md: string) {
  const ast = Markdoc.parse(md);
  const content = Markdoc.transform(ast);
  const processed = Markdoc.renderers
    .html(content)
    .replace("<article>", "")
    .replace("</article>", "");

  console.log("processed", processed);

  return html(processed);
}

let final = mdToHtml(pages[0]);

console.log("final", JSON.stringify(final));

const h1 = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      height: "100%",
      justifyContent: "center",
      textAlign: "center",
      width: "100%",
    }}
  >
    <h1>Header 1</h1>
    <p>
      This is a <strong>paragraph</strong>.
    </p>
  </div>
);

console.log("h1", JSON.stringify(h1));

const isLocal = import.meta.env?.VITE_HOST === "localhost";

export const app = isLocal
  ? new Frog({
      assetsPath: "/",
      basePath: "/api",
    })
  : new Frog({
      assetsPath: "/",
      basePath: "/api",
      hub: neynar({ apiKey: import.meta.env?.VITE_NEYNAR_KEY }),
    });

app.frame("/", async (c) => {
  const { buttonValue } = c;
  const index = buttonValue === "page2" ? 1 : 0;
  const content = mdToHtml(pages[index]);

  return c.res({
    image: content as any,
    intents: [
      <Button value="page1">Prev</Button>,
      <Button value="page2">Next</Button>,
    ],
  });
});

app.frame("/old", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response"
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`
            : "Welcome!"}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
