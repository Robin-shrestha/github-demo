# RTK Query

RTK Query is the data fetching part of Redux Toolkit. If you are already using Redux Toolkit, it is the built-in way to talk to a server.

## Why use it

Fetching data by hand means writing the same code every time. You need a `useEffect` to start the request, a `useState` for the data, another for the loading flag, another for errors, and a way to avoid setting state after a component unmounts. You also need somewhere to cache the result so two components do not fetch the same thing twice.

RTK Query does all of that. You describe the endpoints once and it gives you typed hooks that fetch, cache, track loading and error state, and refetch when data changes.

## Defining an API

You create one API object with `createApi`. It takes a base URL and a set of endpoints. Each endpoint is either a query (for reading) or a mutation (for writing).

```ts
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: ["Post"],
    }),
    addPost: builder.mutation<Post, NewPost>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = api;
```

It plugs into the store like a normal slice, plus its middleware:

```ts
configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
```

## Using the hooks

A query hook fetches when the component mounts and returns the state. No `useEffect`, no manual `useState`.

```tsx
const { data, isLoading, isError, refetch } = useGetPostsQuery();
```

A mutation hook gives you a trigger function and its own status.

```tsx
const [addPost, { isLoading }] = useAddPostMutation();
addPost({ title: "Hello" });
```

## Caching and invalidation

Results are cached by the query's arguments. If several components call the same query hook, RTK Query makes one request and shares the result. When nothing is using a cached entry, it is dropped after a short delay.

Tags keep the cache in sync with writes. A query lists the tags it provides, and a mutation lists the tags it invalidates. When a mutation invalidates a tag, any query that provides that tag refetches on its own, so you never write a manual refresh after a write.

## Server state vs client state

RTK Query is for server state, meaning data that lives on a backend that you keep a local copy of. It is not a replacement for regular slices, which hold state your app owns directly, like a theme or a logged in flag. A typical app uses both.

## Quick recap

| Term           | What it is                                                   |
| -------------- | ------------------------------------------------------------ |
| createApi      | One object describing a server's endpoints                   |
| Query          | A read endpoint, exposed as a hook that fetches and caches   |
| Mutation       | A write endpoint, exposed as a trigger hook                  |
| fetchBaseQuery | A small wrapper around fetch used as the base request        |
| Caching        | The same request from many components makes one network call |
| Tags           | How a write marks a read's cache stale so it refetches       |
