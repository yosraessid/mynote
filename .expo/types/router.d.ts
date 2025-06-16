/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/notes/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `/notes/form`; params?: Router.UnknownInputParams; } | { pathname: `/notes/note`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/notes/dashboard`; params?: Router.UnknownOutputParams; } | { pathname: `/notes/form`; params?: Router.UnknownOutputParams; } | { pathname: `/notes/note`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/notes/dashboard${`?${string}` | `#${string}` | ''}` | `/notes/form${`?${string}` | `#${string}` | ''}` | `/notes/note${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/notes/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `/notes/form`; params?: Router.UnknownInputParams; } | { pathname: `/notes/note`; params?: Router.UnknownInputParams; };
    }
  }
}
