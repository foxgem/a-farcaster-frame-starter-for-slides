# Page 3

The following is a typescript code example.

```typescript
import passport from "@fastify/passport";
import { oauthConfig } from "../constant";
var OAuth2Strategy = require("passport-oauth2").Strategy;

export function useOauth(type: string) {
  passport.use(
    `${type}`,
    new OAuth2Strategy(oauthConfig[type], function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      return done(null, accessToken);
    })
  );
}
```
