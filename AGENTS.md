<!-- CONTEXT FRAMEWORK START -->

# Read what is installed, not what you remember

There is no framework. The stack is under **Tech Stack** below, and the installed versions are in `package.json` - read them there, not from memory. Your training data may predate what is in this repo.

<!-- CONTEXT FRAMEWORK END -->

<!-- CONTEXT STATUS START -->

## Project Status

**Current: PRODUCTION**

- **DEVELOPMENT** - not live, no real users or data. Schema, route and data changes need no migration or backward-compat handling.
- **STAGING** - deployed to staging or a small beta. Treat data as semi-real; no destructive changes without a note.
- **PRODUCTION** - real users and data. Every schema or route change MUST preserve existing data and MUST NOT break already-issued links.

Never assume the project is live, or not, without reading this.

<!-- CONTEXT STATUS END -->

<!-- CONTEXT START-HERE START -->

## Before You Start

1. **Read `context/CORE_RULES.md` first.** It is the always-on contract and it is short.
2. **Read the rule files before writing, editing, or brainstorming a single line of code:** `context/CLEAN_CODE_RULES.md`, `context/JS_TS_RULES.md` and `context/ES6_TS_RULES.md`. This is non-negotiable and applies to every task - implementation, refactor, bug fix, plan, prototype, throwaway script. Re-read when you start a new task; do not rely on memory from a prior session.
3. Read the relevant file(s) in `context/` before touching that area. The table below says which.
4. Follow existing patterns - do not invent new conventions.

<!-- CONTEXT START-HERE END -->

## Project

`picktime` is a published npm library, not an experiment. It is `<pick-time>`, a form-associated time picker
custom element that submits with the form, validates through `ElementInternals`, and formats itself from the
user's locale. Kumar Deepak is its sole author in `package.json` and owns the releases. It produces two things: the `picktime` package on
npm (ESM only, one runtime dependency, `@floating-ui/dom`) and the demo at
https://kumardeepakcom.github.io/picktime/, built from `demo/` and deployed to GitHub Pages. v2 callers are still
supported through the `src/compat.ts` shim, so nothing here may break them.

## Commands

```sh
npm run dev            # Vite dev server for demo/
npm test               # Vitest, real browser via Playwright
npm run typecheck      # tsc --noEmit
npm run lint           # Biome (lint + format check)
npm run lint:fix       # Biome autofix
npm run build          # Library build + .d.ts emit
npm run check:package  # publint + are-the-types-wrong
```

## Tech Stack

> Always use the latest stable versions. Before any third-party API call, query Context7 for current docs and grep the installed package for deprecation markers. Context7 is the primary source of truth, not a fallback. When a library API behaves unexpectedly, read the docs first - do not add speculative fallbacks, custom shims, version pins, or hand-rolled re-implementations. Build on what the library actually offers, not on guesses.

> Vanilla browser TypeScript. No framework, no JSX, no runtime template engine.

- Language: TypeScript 7, strict, ESM only. Styles are plain modern CSS (native nesting, `color-mix()`) in `src/styles.css`, inlined into the bundle with `?inline`.
- Runtime: the browsers listed in `browserslist` in `package.json`. Node runs the tooling only, at the versions in `engines`.
- Build: Vite in lib mode (`vite.config.ts`), declarations emitted separately by `tsc -p tsconfig.build.json`. Tests are Vitest in real browsers through Playwright.
- Output: `dist/`, ESM only, two entries (`index`, `element`), `.d.ts` and sourcemaps beside them, `@floating-ui/dom` left external.

<!-- CONTEXT WORKFLOW START -->

## Workflow Rules

> The full always-on contract is [`context/CORE_RULES.md`](context/CORE_RULES.md). Read it first, every session, before any plan or edit. It is genuinely not repeated here: it loads alongside this file, so a copy would cost the same tokens twice.

The git ban, the ask-before-you-build gate, the no-delete-without-confirmation rule and the reply style all live there. Reply style has a longer form in [`context/COMMUNICATION.md`](context/COMMUNICATION.md).

<!-- CONTEXT WORKFLOW END -->

## Key Context Files

> Read the files relevant to the area you are touching. Add a row whenever you create a new doc.

<!-- CONTEXT CONTEXT-TABLE START -->

| File                          | Purpose                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| `context/CORE_RULES.md`       | The always-on contract. Read first, every session.                   |
| `context/COMMUNICATION.md`    | Reply style: short and in points; detail only when asked.            |
| `context/CLEAN_CODE_RULES.md` | Clean Code: naming, functions, comments, errors, tests, smells, DRY. |
| `context/JS_TS_RULES.md`      | Strict TypeScript, the typeof policy, trust-validated-shape rules.   |
| `context/ES6_TS_RULES.md`     | TypeScript syntax style and naming conventions.                      |
| `context/TODO.md`             | Local working notes: shipped state, open items. Gitignored.          |

<!-- CONTEXT CONTEXT-TABLE END -->

<!-- CONTEXT VOICE START -->

## User-Facing Copy

The project is operated by one person, and users interact with that person, not a team or company.
Every piece of user-facing text reflects that.

- Use first-person singular ("I", "me", "my") or impersonal phrasing. Never "we", "us", "our".
- Applies to every user-facing surface: UI strings, button labels, error messages, dialogs, email subjects and bodies, notifications.
- Examples: "I have received your payment" or "Payment received", not "We have received your payment".

<!-- CONTEXT VOICE END -->

<!-- CONTEXT FORMATTING START -->

## Formatting

- Biome handles linting and formatting.
- Do not alter intentional line breaks outside the requested change.

<!-- CONTEXT FORMATTING END -->

<!-- CONTEXT ANTIPATTERNS START -->

## Anti-Patterns

Never do these. Each one has cost real time on a real project.

Only the ones the numbered rules do not already cover are listed here.

- **Weakening a rule to make something pass** - loosening a type, disabling a lint rule, skipping a test, relaxing validation.
- **Restating the codebase in documentation** - directory trees, dependency lists and file-by-file inventories belong in the code. The Architecture table below is the one exception: it records which module owns what, which the file names alone do not say.
- **Breaking a v2 caller.** `src/compat.ts` is a published contract, not legacy code.

<!-- CONTEXT ANTIPATTERNS END -->

## Other Rules

> This project's own sections, kept as written. Keep what is still true, delete the rest.

## Architecture

The central rule: **the controller owns state, the element owns the DOM.**
Nothing in the controller touches the document, and nothing in the element does
time arithmetic. Keeping that line clean is what makes the clock logic testable.

| File                | Responsibility                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/controller.ts` | Headless time state. Stores seconds-of-day, steps fields, computes validity. No DOM.                      |
| `src/element.ts`    | The custom element. Renders controller state, maps gestures to controller calls, owns `ElementInternals`. |
| `src/parse.ts`      | Lenient parsing of typed human input (`"9:30 pm"`, `"0930"`).                                             |
| `src/format.ts`     | All display formatting, via `Intl`. Nothing formatted here is ever stored.                                |
| `src/position.ts`   | Floating UI wiring. One `autoUpdate` loop per open, always disposed.                                      |
| `src/compat.ts`     | v2 `new PickTime(input, options)` shim.                                                                   |
| `src/index.ts`      | Public exports, and registers `<pick-time>`.                                                              |
| `src/styles.css`    | Shadow-root stylesheet, inlined into the bundle via `?inline`.                                            |

### Invariants worth protecting

- **Time is one number.** The controller stores seconds since midnight, never a
  `{hours, minutes, meridiem}` triple. Most of the v2 bug class came from
  keeping several fields in sync by hand.
- **Never test a time value for truthiness.** Midnight is `0`. `value || default`
  is how v2 turned hour 0 into 12; the same trap applies to minutes and seconds.
- **Display is always derived.** If you find yourself storing a formatted
  string, that is a bug waiting to happen.
- **Every listener takes the instance `AbortSignal`.** `disconnectedCallback`
  aborts once and the component is fully detached. Do not add a listener that
  needs its own bespoke removal.
- **Fields step independently.** Incrementing 09:59 by a minute gives 09:00, not
  10:00, matching `<input type="time">` and the ARIA spinbutton role.
- **`#commit()` is the only write path.** It publishes the form value, refreshes
  validity, re-renders, and emits events, in that order. Do not call
  `setFormValue` or `#render` from anywhere else.

## Conventions

- **Relative imports must carry the `.js` extension.** Without it the emitted
  `.d.ts` files fail Node16 ESM resolution, which `attw` catches.
- **Non-null assertions (`!`) are a Biome error.** Narrow properly instead.
- **Lightning CSS targets are passed explicitly** from `browserslist`, because
  Vite does not derive them. No Sass.
- **Tests run in a real browser.** jsdom cannot do the Popover API, the top
  layer, or layout, so it is not an option here. Anything involving the popover
  must account for `toggle` being dispatched asynchronously.

## Release

Changesets drives versioning. Add one with `npx changeset`, then the release
workflow publishes from `main` with provenance, authenticated by npm Trusted
Publishing (OIDC), not a token.
