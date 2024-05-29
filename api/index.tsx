import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { neynar } from "frog/hubs";
import { handle } from "frog/vercel";

type State = {
  page: number;
};

const images: string[] = [
  "/images/page1.png",
  "/images/page2.png",
  "/images/page3.png",
];

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
