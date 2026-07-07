# What is the DOM?

The DOM (Document Object Model) is the browser's live, in-memory tree representation of an HTML page. Every element — `<div>`, `<img>`, `<button>` — becomes a node object with properties (`append`, `classList`) and methods(`addEventListener`,`onclick` ) you can read and mutate from JavaScript.

## Selecting

```ts
document.querySelector("#cards-container");
document.querySelectorAll(".card");
```

## Creating & Updating

```ts
const card = document.createElement("div");
card.className = "card";
card.textContent = "Hello";
parent.append(card);
```

## Removing

```ts
card.remove();
cardsContainer.innerHTML = "";
```

## Events

```ts
cardsContainer.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
});
```

## DOM vs. Virtual DOM

The DOM above is a real browser API. The **Virtual DOM** (used by React) is not a browser feature at all — it's a plain JavaScript object tree that describes what the UI _should_ look like. On a state change, React builds a new virtual tree, diffs it against the previous one, and applies only the minimal real DOM operations needed to reconcile the difference.

A Simple mental modal for DOM vs VDOM

- DOM: Editing the printed document directly. Every change requires physically updating the page.
- Virtual DOM: Editing a digital draft first, comparing it with the previous draft, then applying only the necessary changes to the printed document.
