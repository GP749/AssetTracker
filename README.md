# Asset Tracker

Local-first tool check-in / check-out for a small team. Runs on your laptop, no cloud. Phones on the same Wi-Fi can scan printed QR codes to check tools out.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 7 + SQLite (better-sqlite3 driver adapter) · `html5-qrcode` for scanning · `qrcode` for label generation.

## Requirements
- Windows 10/11, macOS, or Linux
- Node.js LTS (≥ 22)

## Run
```bash
npm install
npm run db:migrate    # creates prisma/dev.db and applies migrations
npm run db:seed       # 3 example members + 5 example tools
npm run dev           # https://localhost:3000 (see HTTPS note below)
```

Stop with Ctrl+C.

If you don't need HTTPS yet (laptop-only testing), use `npm run dev:http` to skip the cert generation and serve at `http://localhost:3000`.

### First-time HTTPS setup (Windows)
`npm run dev` uses Next.js's `--experimental-https`, which downloads `mkcert` and generates a self-signed cert the first time it runs. **It will trigger a UAC prompt to install a local certificate authority** — you have to accept it in an interactive terminal. After that the cert is reused on every subsequent start.

If PowerShell complains that `npm` scripts can't run (`UnauthorizedAccess` / `running scripts is disabled`), run this once as your user:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Use it from your phone (so QR scanning actually works)
Mobile browsers refuse camera access over plain HTTP unless the host is exactly `localhost`. So:

1. Note your laptop's LAN IP — Next.js prints it on startup (`Network: https://192.168.x.x:3000`).
2. Edit `.env` and set `APP_BASE_URL` to that LAN URL, e.g. `APP_BASE_URL="https://192.168.1.42:3000"`.
3. Restart `npm run dev`. From now on, printed QR labels encode that URL.
4. On your phone (same Wi-Fi), open the LAN URL in Safari/Chrome and accept the cert warning once.
5. Open `/scan` and point the camera at a printed label — it routes straight to the tool.

You can re-print labels at any time from a tool's detail page → **Print QR label**.

## Database scripts
The SQLite file lives at `prisma/dev.db`. All data — tools, members, checkouts — is in this one file.

| Command | What it does |
|-|-|
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:seed` | Wipe and reseed the demo data |
| `npm run db:reset` | Drop the DB, re-run all migrations, re-seed (Prisma asks for confirmation) |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) at `http://localhost:5555` |
| `npm run db:backup` | Copy `prisma/dev.db` to `prisma/backup-<timestamp>.db` |
| `npm run db:generate` | Regenerate the Prisma client (rarely needed; runs after migrate) |

To back up the data manually, just copy `prisma/dev.db` and the `public/uploads/` folder somewhere safe. That's the entire state of the app.

To restore, replace those two paths and restart.

## Project layout
```
prisma/
  schema.prisma          # data model
  migrations/            # source of truth for the DB schema
  dev.db                 # SQLite file (gitignored)
public/uploads/          # tool photos (gitignored)
src/
  app/
    page.tsx             # dashboard
    tools/[id]/page.tsx  # tool detail + check-out/return
    tools/[id]/label/    # printable QR label
    tools/new/           # add tool form
    scan/                # camera scanner
    members/             # team list
    api/qr/[id]/         # PNG QR code endpoint
  components/            # SiteHeader, MemberPicker, CheckoutPanel, etc.
  lib/
    db.ts                # PrismaClient singleton (better-sqlite3 adapter)
    session.ts           # reads memberId cookie
    upload.ts            # saves uploaded photos
    actions/             # server actions (tools, checkouts, members)
  generated/prisma/      # Prisma client output (gitignored, regenerated on demand)
```

## Auth model
There is no real auth in v1. The site header has a "who are you?" dropdown. Picking yourself sets:
- `localStorage["assetTracker.memberId"]` (per-device persistence)
- a `memberId` cookie (so server actions know who you are)

Server actions for check-out / return read the cookie. If no member is selected, the check-out button on the tool page tells you to pick yourself first.

## Adding a tool
Header → **Add tool** → fill name + category, optionally upload a photo (JPG/PNG/WEBP/GIF, max 8 MB). Photos land in `public/uploads/<uuid>.<ext>` and the DB stores the relative URL.

## Removing a member
Header → **Members** → **Remove**. Members with any checkout history are kept (button disabled) so the audit log stays intact.

## Troubleshooting

**`tsx` not found when running `npm run db:seed`** — run `npm install` again; `tsx` is a dev dependency.

**`Cannot find module '@/generated/prisma/client'`** — run `npm run db:generate`.

**Camera doesn't start on phone** — your laptop is on HTTP. Run with `npm run dev` (HTTPS) and make sure the phone URL starts with `https://`.

**Scanned QR opens the wrong URL** — `APP_BASE_URL` in `.env` doesn't match what the phone uses. Update it, restart the dev server, and reprint labels.
