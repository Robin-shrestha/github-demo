# File Uploads

A JSON body is text. A file is bytes, and `express.json()` has no way to parse those. Uploads
need a different format.

## multipart/form-data

A form or a `FormData` object sends a request as multiple parts, one per field, separated by a
boundary. Text fields and files travel side by side in the same request:

```js
const formData = new FormData();
formData.append("title", "My document");
formData.append("file", selectedFile);

fetch("/items", { method: "POST", body: formData });
```

Never set `Content-Type` by hand on a request like this. The browser writes it, boundary
included. Setting it manually breaks the boundary and the server can't parse the body.

`express.json()` ignores multipart requests entirely, so a separate library is needed to read
them. Multer is the usual one for Express.

## Multer basics

```js
import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

router.post("/items", upload.single("file"), createItem);
```

`upload.single("file")` expects one file under the field name `"file"` and puts it on
`req.file`. The name has to match what the client appended, or the file never arrives.

A few other shapes:

```js
upload.array("files", 10); // several files, one field, req.files is an array
upload.fields([
  // more than one distinct file field
  { name: "avatar", maxCount: 1 },
  { name: "documents", maxCount: 10 },
]);
```

Multer parses the request before the route handler runs, so any body validation (Zod, for
example) has to come after Multer in the middleware chain, not before it.

## What to validate

**Size.** Always set a limit, or a single request can fill the disk.

```js
multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB
```

**Type.** Check `file.mimetype` and reject anything unexpected:

```js
fileFilter(req, file, cb) {
  cb(null, file.mimetype.startsWith("image/"));
}
```

This catches honest mistakes, like someone picking the wrong file. It's not a hard guarantee,
since the type is reported by the client and can be faked, but it's the right first check.

**Filename.** Never use the uploaded file's original name to build a path on disk. It comes
from the client and could contain something like `../../.env`. Generate a new name instead:

```js
cb(null, `${Date.now()}-${file.originalname}`);
```

This also avoids two uploads with the same name overwriting each other.

## Saving the reference

Store the file's path in the database,
This can take many forms.

- if we know where the file is stored, just saving the final file path is enough. eg: /uploads/filename.jpg. Then either the server or the client can complete the path on their respective sides to access the file.
- if we are saving the file in a separate storage (eg. s3, cloudinary etc) then we can use the full remote path

## Handling upload errors

Multer errors (file too big, wrong field name) come through as a `MulterError` and should map
to a 400, since they're the client's mistake, not the server's:

```js
if (err.name === "MulterError") {
  return res.status(400).json({ error: err.message });
}
```

If `fileFilter` rejects a file, Multer just leaves it off the request. Check for it explicitly:

```js
if (!req.file) {
  return res.status(400).json({ error: "No file uploaded" });
}
```
