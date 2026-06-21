# Job Posting API Bruno Collection

Open this folder in Bruno as a native Bruno collection:

```text
bruno/Job Posting API
```

In Bruno, use **Open Collection**, not **Import Collection**, for this folder.

If you want to use **Import Collection**, import this OpenAPI file instead:

```text
bruno/job-posting-api.openapi.json
```

Use the `Local` environment.

Default variables:

```text
baseUrl = http://localhost:8000
token =
userId =
jobId =
applicationId =
```

Typical flow:

1. Run `Auth/Register` or `Auth/Login`.
2. Copy the returned `token` into the `token` environment variable.
3. For protected requests, keep the `Local` environment selected.
4. Copy created ids into `userId`, `jobId`, or `applicationId` as needed.

Notes from the current backend implementation:

- The backend starts on `process.env.PORT || 4000`, but the frontend points to `http://localhost:8000`. Set `PORT=8000` or change `baseUrl` in Bruno.
- Protected endpoints require `Authorization: Bearer {{token}}`.
- Employer-only APIs require a user with role `employer`.
- Jobseeker-only application APIs require a user with role `jobseeker`.
