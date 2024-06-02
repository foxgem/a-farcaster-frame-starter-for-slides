# A Farcaster Frame Starter For Slides

## What

With this starter, you can create a frame for slides on Farcaster in one minute.

The sweeter thing is you can use markdown and no need to touch any code for frame.

## How

This is how:

1. create a direct for your new slides in `contents`.
1. write the slides in markdown.
1. `pnpm convert`
1. review it locally with `pnpm dev`
1. publish it on vercel with `pnpm deploy`

Done!

### Known Issues

Using relative paths for images in slides won't generate the final images for the sliedes correctly.

But you can start a local http server for a workaround. See the example in [this example](contents/doc/01-what.md):

```markdown
![content-org](http://localhost:9000/contents/doc/content-org.png)
```

To setup a local http server:

```shell
python3 -m http.server 9000
```

## The Frames Site

The default site generated is organized as below:

1. `/` is the index of the whole site.
1. `/submit` is the target frame for the `Go` button.
1. `/:slide` presents the selected `slide` in a frame. The value of `slide` is one of the names of the subdirectories in `contents`.

## Customization

This starter is using [mdimg](https://github.com/LolipopJ/mdimg) and the site builder is in [convert.ts](./scripts/convert.ts). So:

- for style, read `mdimg` document.
- for generation, change `convert.ts` and update `/api/index.tsx`.

## Showcase

Read this document in [this frame](https://warpcast.com/foxgem/0xaebf8686).
