import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLoginRedirectUrl,
  handleUnauthorizedError,
  shouldHandleUnauthorizedError,
} from "./authSession.js";

test("401 auto logout clears auth state and redirects protected requests to login", () => {
  let cleared = false;
  const redirects = [];
  const error = {
    response: { status: 401 },
    config: {
      headers: { Authorization: "Bearer token" },
    },
  };

  const handled = handleUnauthorizedError({
    error,
    clearAuth: () => {
      cleared = true;
    },
    redirect: (nextUrl) => {
      redirects.push(nextUrl);
    },
    locationLike: {
      pathname: "/placeorder",
      search: "?step=confirm",
    },
  });

  assert.equal(handled, true);
  assert.equal(cleared, true);
  assert.deepEqual(redirects, ["/login?redirect=%2Fplaceorder%3Fstep%3Dconfirm"]);
});

test("401 auto logout ignores skipped requests and auth pages", () => {
  assert.equal(
    shouldHandleUnauthorizedError({
      response: { status: 401 },
      config: {
        headers: { Authorization: "Bearer token" },
        skipAuthHandling: true,
      },
    }),
    false
  );

  assert.equal(buildLoginRedirectUrl({ pathname: "/login", search: "" }), null);
});
