import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { neynar } from "frog/hubs";
import { handle } from "frog/vercel";
import pages from "../public/slides.json";

type State = {
  page: number;
};

const images: string[] = pages.pages;

const isLocal = import.meta.env?.VITE_HOST === "localhost";

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
      initialState: {
        page: 0,
      },
    });

app.frame("/", async (c) => {
  const { buttonValue, deriveState } = c;
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
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
