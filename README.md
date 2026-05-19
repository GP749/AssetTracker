# Asset Tracker

Local-first tool check-in / check-out for a small team. Runs on your laptop, no cloud. Phones on the same Wi-Fi can scan printed QR codes to check tools out.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 7 + SQLite (better-sqlite3 driver adapter) · `html5-qrcode` for scanning · `qrcode` for label generation · Unsplash API for tool photos (optional).

## Features
- **Inventory dashboard** with status / category / location filters and full-text search
- **Member picker** (cookie + localStorage) — no real auth, single-tenant trust
- **Check-out / return** with optional notes and condition logging
- **Locations** — track where each tool lives (Shelf A1, Bay 3, Truck…) and filter by it
- **Maintenance** — mark any tool out of service with a reason, then "mark serviced" to release it
- **Damage on return** — checkbox routes a damaged tool straight to maintenance with the return note copied as the reason
- **Overdue tracking** — `OVERDUE_DAYS` env var (default 14); cards and the detail page light up red, dashboard has an "overdue only" filter
- **Edit + delete tools**, with safety check (can't delete a tool that's currently checked out)
- **Members CRUD**, with checkout-history protection (members with history can't be deleted to preserve the audit log)
- **Printable QR labels** at `/tools/[id]/label` with a 60×40mm print stylesheet
- **Camera scanner** at `/scan` (works on laptop over HTTP, phone requires HTTPS)
- **Unsplash auto-photo** — when a free API key is set, the seed and "Add tool" form fetch a stock photo by name

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

### Optional: Unsplash photos
By default the seed creates tools without photos. To auto-fetch a relevant stock photo for each tool:

1. Go to https://unsplash.com/oauth/applications and create a free developer app (any name and description — no review needed for personal/dev use).
2. Copy the **Access Key** (not the Secret Key).
3. Paste it into `.env`:
   ```
   UNSPLASH_ACCESS_KEY="your-key-here"
   ```
4. Re-seed:
   ```bash
   npm run db:seed
   ```

The "Add tool" form also picks up the key and shows an "Auto-fetch a photo from Unsplash" checkbox.

Free tier allows 50 requests/hour — plenty for seeding and a few manual adds.

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
Username + password login. Browse is public — anyone on the LAN can see the inventory, scan QRs, view tool details, and view insights. **Any action that mutates data** (check-out, return, add tool, edit, delete, member management, CSV import) requires a signed-in member.

- **Sessions** are signed cookies (HMAC-SHA256 over `<memberId>.<exp>` with `AUTH_SECRET`). Default lifetime 30 days, `HttpOnly`, `SameSite=Lax`.
- **Passwords** are hashed with `scrypt` (Node's built-in, no extra deps) + a random per-user salt.
- **Roles** are flat — every signed-in member can do everything (matches the "trusted small team" model).
- **Seeded credentials**: usernames are the first names lowercased — `alex`, `jamie`, `kim`, `morgan`, `sam`. Default password for all five is `changeme`. Change it on the **Team** page after signing in.
- **Adding members** is done on `/members` once signed in (name + username + password). The signed-in member can't remove themselves; members with checkout history are kept to preserve the audit log.

### `AUTH_SECRET`
A 32+ character random string used to sign session cookies. Generate one with:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
The seed will work with any value; existing sessions invalidate whenever you change it.

## Adding a tool
Header → **Add** → fill name + category + location, optionally upload a photo (JPG/PNG/WEBP/GIF, max 8 MB). Photos land in `public/uploads/<uuid>.<ext>` and the DB stores the relative URL. With an Unsplash key set, tick "Auto-fetch a photo from Unsplash" to skip uploading.

## Editing / deleting a tool
From a tool's detail page → **Edit**. You can update any field and replace the photo (leave blank to keep current). At the bottom there's a "Danger zone" delete button — it's blocked if the tool is currently checked out.

## Maintenance flow
On any available tool's detail page, expand **Mark for maintenance**, enter a reason, submit. The tool moves to maintenance and stays out of circulation until someone hits **Mark serviced**. On return, a "Tool is damaged" checkbox does the same in one step and copies the return note as the maintenance reason.

## Overdue
Configure `OVERDUE_DAYS` in `.env` (default 14). Once an open checkout passes that age:
- The tool's card shows a red "overdue · Nd" badge
- The detail page banner turns red and shows days out vs max
- The dashboard shows an "overdue" count pill and an "overdue only" filter button

## Removing a member
Header → **Members** → **Remove**. Members with any checkout history are kept (button disabled) so the audit log stays intact.

## Troubleshooting

**`tsx` not found when running `npm run db:seed`** — run `npm install` again; `tsx` is a dev dependency.

**`Cannot find module '@/generated/prisma/client'`** — run `npm run db:generate`.

**Camera doesn't start on phone** — your laptop is on HTTP. Run with `npm run dev` (HTTPS) and make sure the phone URL starts with `https://`.

**Scanned QR opens the wrong URL** — `APP_BASE_URL` in `.env` doesn't match what the phone uses. Update it, restart the dev server, and reprint labels.
