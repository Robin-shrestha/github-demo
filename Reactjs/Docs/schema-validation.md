# Schema Validation

## The problem TypeScript doesn't solve

It's easy to assume that once a project is in TypeScript, bad data can't get in — you typed the shape, so the shape is guaranteed. It isn't. TypeScript types are a compile-time thing: they help your editor and the compiler catch mistakes while you write code, and then they're **erased**. The JavaScript that actually runs in the browser has no idea your types ever existed.

That's fine for values your own code creates. It's not fine for anything coming from _outside_ — a form the user typed into, a response from an API, something pulled out of `localStorage`, a query param in the URL. You can write `const student = (await res.json()) as Student` and TypeScript will believe you, but that `as` is a promise you're making, not a check. If the server sends back something different — a missing field, a number where you expected a string, `null` — nothing stops it. The type says one thing; the actual data says another; and the mismatch only shows up later as a confusing crash somewhere far from the cause.

## What schema validation is

A schema is a description of what data should look like, written as actual runtime code rather than a compile-time type. You declare "a student has a name that's a non-empty string, an email that looks like an email, an experience count that's a number ≥ 0," and the library gives you back something you can _run_ against real data to ask "does this actually match?" — getting either the cleaned-up value or a list of what's wrong.

The point is that this check happens **while the program runs**, at the exact boundary where untrusted data comes in. It catches the bad API response or the malformed form input right there, instead of letting it slip through and blow up later.

In Zod, that looks like a schema you build up from small pieces:

```ts
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  experienceYears: z.number().min(0, "Must be 0 or more"),
});
```

and then, at a boundary, you run it:

```ts
const result = studentSchema.safeParse(dataFromForm);
if (!result.success) {
  // result.error holds what failed and why
} else {
  // result.data is the validated, correctly-typed value
}
```

## Schema can define the type

Schema libraries can usually infer the type so that we can use that during the compile time(no duplicate type defination).

```ts
type Student = z.infer<typeof studentSchema>;
// { name: string; email: string; experienceYears: number }
```

Without it, you'd write the validation rules in one place and a matching `interface Student` in another, and it would be entirely on you to keep them in sync.

## Where you actually use it

Anywhere untrusted data crosses into your app:

- **Form input** — instead of scattering `required`/pattern/min rules across individual fields, describe the whole form as one schema. Most form libraries accept a schema through an adapter (often called a _resolver_), so the library handles the wiring and your schema handles the rules.
- **API responses** — validate what comes back before trusting it. This gets especially important once you're talking to a real backend instead of mock data: the network is exactly the kind of boundary where the shape you expect and the shape you get can differ.
- **Environment variables / config** — check that required config is present and well-formed at startup, rather than discovering a missing value halfway through a request.
- **URL params, localStorage, anything external** — same idea,

## Quick recap

| Idea               | What it means                                                             |
| ------------------ | ------------------------------------------------------------------------- |
| Compile-time type  | TypeScript's check while you write; erased before the code runs           |
| Runtime validation | An actual check performed while the program runs, on real data            |
| Schema             | A runtime description of valid data you can validate against              |
| Inferred type      | A TypeScript type derived from the schema, so rules and type stay in sync |
| Resolver           | The adapter that lets a form library validate using a schema              |
| Refinement         | A custom/cross-field rule expressed inside the schema                     |
