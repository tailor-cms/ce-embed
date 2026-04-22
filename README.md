# Embed

Embed content element for rendering external URLs in an iframe.

**Type:** `EMBED`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string?` | Embedded URL |
| `height` | `number` | Iframe height in pixels (default 260) |

## Edit

- URL and height fields in top toolbar with inline edit/save/cancel
- URL validation (http/https required)
- Sandboxed iframe preview with placeholder until URL is set

## Display

- Renders the embedded URL in an iframe
- Emits `interaction` on iframe load

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
