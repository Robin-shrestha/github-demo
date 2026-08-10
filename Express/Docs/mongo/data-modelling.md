# Data Modelling

Modelling is deciding what a document contains and how documents relate to each other. It
happens before any code is written, and the decisions are hard to reverse once an application
has data in it.

## Deciding the fields

For each field, three questions:

- What type is it, and is that type stable? A phone number stored as a number loses leading
  zeros. Store it as a string.
- Is it required, or can a document exist without it?
- Does it have a sensible default?

Store what you are given, not what you can compute. A `total` field that is the sum of line
items will eventually disagree with the line items. Compute it on read instead.

Dates should be dates, not strings. A stored `Date` can be compared and sorted by the
database. A string like `"12/01/2026"` cannot be sorted correctly and its meaning depends on
who wrote it.

## Embedding and referencing

Two documents can be related in two ways. Either one lives inside the other, or one holds the
id of the other.

Embedded:

```json
{
  "_id": "...",
  "name": "Example Order",
  "address": { "street": "12 Main St", "city": "Kathmandu" }
}
```

Referenced:

```json
{
  "_id": "...",
  "name": "Example Order",
  "customer": "6712a3f19c4d2b0012a4b8e1"
}
```

## Choosing between them

Three tests. If the answer to all three is yes, embed.

**Is it always read together with the parent?** An address is read whenever the order is read,
so keeping it inside avoids a second query. A customer profile is read on its own far more
often, so it belongs in its own collection.

**Does it belong to exactly one parent?** An address belongs to one order. A category belongs
to many products, and duplicating it into every product means updating it in every product.

**Is it bounded?** A document has a hard 16MB limit. Anything that grows without limit, such
as comments or activity logs, will eventually hit it. Two or three addresses per customer is
bounded. Comments are not.

The trade is between read cost and write cost. Embedding makes reads cheap because everything
arrives in one query, and makes updates expensive because the same data may be stored in many
places. Referencing does the opposite.

## Duplication is allowed

In a relational database, storing the same value twice is usually a mistake. In a document
database it is a normal choice, made deliberately when reads matter more than writes. A line
item can store the product name as it was at the time of the order, which is also more
correct than looking it up later, because the product may have been renamed since.

The rule is to know why the duplicate exists and what keeps it acceptable. Duplication by
accident is still a bug.

## Practical starting point

Start by referencing. It keeps documents small and each collection independent, and it is
easier to embed later than to pull an embedded structure apart once code depends on it.
Embed when a specific read is slow and the three tests above allow it.
