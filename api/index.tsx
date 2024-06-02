import { Button, FrameContext, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { neynar, pinata } from "frog/hubs";
import { handle } from "frog/vercel";
import contents from "../public/contents.json";

type State = {
  page: number;
  currentSlide?: string;
};

const CONTENT_BASE = "contents";

const isLocal = import.meta.env?.VITE_HOST === "localhost";
const slides: { [key: string]: string[] } = contents.contents;

export const app = isLocal
  ? new Frog<{ State: State }>({
      assetsPath: "/",
      basePath: "/api",
      initialState: {
        page: 0,
      },
    })
  : new Frog<{ State: State }>({
      assetsPath: "/",
      basePath: "/api",
      hub: neynar({ apiKey: import.meta.env?.VITE_NEYNAR_KEY }),
      // hub: pinata(),
      initialState: {
        page: 0,
      },
    });

app.frame("/", async (c) => {
  return c.res({
    action: "/submit",
    image: "/contents/index.png",
    intents: [
      <TextInput placeholder="Enter a slide..." />,
      <Button>Go</Button>,
    ],
  });
});

app.frame("/submit", async (c) => {
  const { inputText, deriveState } = c;
  let slide = inputText;
  if (inputText) {
    deriveState((previousState) => {
      previousState.currentSlide = inputText;
      previousState.page = 0;
    });
  } else {
    slide = deriveState().currentSlide;
  }

  return await browseHandler(slide!, c);
});

app.frame("/:slide", async (c) => {
  const slide = c.req.param("slide");
  if (c.previousState.currentSlide !== slide) {
    c.previousState.currentSlide = slide;
    c.previousState.page = 0;
  }

  return await browseHandler(slide, c);
});

async function browseHandler(slide: string, c: FrameContext<any>) {
  const { buttonValue, deriveState } = c;
  const images = slides[`${CONTENT_BASE}/${slide}`];
  const state = deriveState((previousState) => {
    if (buttonValue === "inc" && previousState.page < images.length - 1)
      previousState.page++;
    if (buttonValue === "dec" && previousState.page) previousState.page--;
  });
  const content = images[state.page];

  return c.res({
    image: content,
    intents: [
      <Button value="dec">Prev</Button>,
      <Button value="inc">Next</Button>,
      <Button action="/">Home</Button>,
    ],
  });
}

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
