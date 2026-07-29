# Forms & Form State

Notes on controlled vs. uncontrolled inputs, what "form state" really means, and why forms tend to grow a library once they're more than a field or two. None of this is tied to a specific library — it applies whether you reach for React Hook Form, Formik, something else, or nothing at all.

## Controlled vs. uncontrolled inputs

A plain HTML input already works on its own. You type, the browser remembers what you typed, and you can grab that value later — usually with a ref, and usually only when you submit. Nobody wrote any state to make that happen. That's an **uncontrolled** input: the DOM owns the value.

A **controlled** input takes that ownership away from the DOM and hands it to your app's state. You set the input's `value` from state, and every keystroke fires an `onChange` that writes back to that state. Now state is the source of truth and the input is just showing you what's in it.

Why bother giving up the free behavior? Because sometimes you need to _do_ something as the value changes — validate as the user types, disable the submit button until a field is filled in, show a character count, fill one field based on another. You can't do any of that if the value is hiding inside the DOM where your code never sees it.

One trap that catches almost everyone once: if you give an input a `value` but forget the `onChange`, it freezes. It looks broken — you type and nothing appears — but it's doing exactly what you told it to. React re-renders, sees `value` is still the same state, and paints that same value right back over whatever you typed. A controlled input needs both halves or neither.

So it's a trade. Uncontrolled costs nothing and needs no state, but you're blind to the value until you go read it. Controlled lets you react to every keystroke — at the price of a state update, and a re-render, on every one of those keystrokes, for every field on the page.

## What "form state" actually means

The easy assumption is that a form's state is just the values. It's more than that. For each field, and for the form overall, you usually end up caring about:

- **Value** — what's in the field right now.
- **Error** — whether the value passes your rules, and what message to show if it doesn't.
- **Touched** — has the user actually been to this field yet? This one matters more than people expect. Flashing "Name is required" at someone before they've even reached the name field feels like being scolded for something you haven't done. Good forms hold their errors until a field has been touched, or until you try to submit.
- **Dirty** — has the value changed from what it started as?
- **isSubmitting** — is a submit in flight right now? Handy for disabling the button so nobody double-submits.

Tracking all of that, by hand, for every field, in every form, is exactly the kind of thing that gets tedious the third time you write it.

## Why reach for a form library

Left to your own devices, each field is a piece of state plus a change handler, and then error/touched/dirty tracking bolted on top — and you copy that shape for every field, in every form you build.

A library takes over that bookkeeping. You get the same behavior handled the same way everywhere instead of reinventing it each time, a lot less repetition as the field count climbs, and one place to decide _when_ validation runs — as they type, when they leave a field, or only on submit — rather than sprinkling checks through a dozen handlers.

The cost is real but small: there's an API to learn, and most libraries have an opinion about how inputs should be wired up that won't fit every component perfectly (see the last section).

## Two ways libraries tend to work

Most form libraries fall into one of two camps.

Some are **state-driven**: the library holds every value in state and re-renders as you type, much like the controlled inputs you'd write by hand — except it's tracking validation and touched and dirty for you. Easier to reason about, more re-renders.

Others are **uncontrolled-first**: they read straight from the DOM through refs and don't keep values in state at all, so typing doesn't re-render the form. State only enters the picture when something has to react — an error showing up, a computed field. Faster, but the library needs a real DOM node to hang its ref on.

Neither wins outright. It's simplicity versus re-renders, and the gap only really shows once forms get big.

## When a component doesn't fit

The uncontrolled-first approach assumes it can grab a ref on a single, input-like element and read the value off it. Plenty of things don't look like that — a group of buttons behaving as one field, a rich text editor, a third-party component that only speaks `value`/`onChange` and won't take a ref. For those, libraries hand you an adapter: a small wrapper that wires the library's tracked state to that component's own `value`/`onChange` props, instead of trying to use a ref that was never going to work.

## Quick recap

| Concept            | What it means                                                            |
| ------------------ | ------------------------------------------------------------------------ |
| Controlled input   | State holds the value; the input displays it via `value` + `onChange`    |
| Uncontrolled input | The DOM holds the value; read via a ref only when needed                 |
| Touched            | The user has interacted with this field at least once                    |
| Dirty              | The field's current value differs from its initial value                 |
| Validation         | Checking a value against rules; can run on change, on blur, or on submit |
| isSubmitting       | Whether a submit is currently in progress                                |
