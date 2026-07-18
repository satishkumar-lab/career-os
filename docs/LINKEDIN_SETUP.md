# LinkedIn Integration Setup (Phase 2)

This guide configures **real LinkedIn OAuth 2.0** for CareerOS using LinkedIn's official **Sign In with LinkedIn using OpenID Connect** product.

CareerOS stores OAuth tokens **server-side only** in Supabase. The browser never receives access or refresh tokens.

---

## Architecture overview

| Layer | Responsibility |
| --- | --- |
| `/api/linkedin/connect` | Starts official LinkedIn OAuth (3-legged) |
| `/api/linkedin/callback` | Exchanges authorization code, fetches `/v2/userinfo`, stores connection |
| `/api/linkedin/status` | Returns safe connection metadata to the UI |
| `/api/linkedin/sync` | Refreshes profile from LinkedIn (refresh token when needed) |
| `/api/linkedin/disconnect` | Deletes connection + tokens |
| `linkedin_connections` table | Member ID, name, email, avatar, timestamps (RLS: user read own row) |
| `linkedin_oauth_tokens` table | Access + refresh tokens (**no client access**) |

Official endpoints used:

- Authorize: `https://www.linkedin.com/oauth/v2/authorization`
- Token: `https://www.linkedin.com/oauth/v2/accessToken`
- UserInfo: `https://api.linkedin.com/v2/userinfo`
- Scopes: `openid profile email`

Docs: [Sign In with LinkedIn using OpenID Connect](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)

---

## Step 1 — Create a LinkedIn Developer application

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps).
2. Click **Create app**.
3. Complete the required fields (app name, LinkedIn Page, privacy policy URL, app logo).
4. Open your new app from **My Apps**.

---

## Step 2 — Enable the OpenID Connect product

1. In your app, open the **Products** tab.
2. Find **Sign In with LinkedIn using OpenID Connect**.
3. Click **Request access** / **Add product** and wait for approval (often instant for development).

This grants the official scopes:

- `openid`
- `profile`
- `email`

Do **not** use deprecated scopes such as `r_liteprofile` or `r_emailaddress`.

---

## Step 3 — Configure OAuth redirect URLs

1. Open the **Auth** tab in your LinkedIn app.
2. Under **OAuth 2.0 settings**, add these **Authorized redirect URLs**:

**Local development**

```text
http://localhost:3000/api/linkedin/callback
```

**Production** (replace with your domain)

```text
https://your-domain.com/api/linkedin/callback
```

3. Copy your **Client ID** and **Primary Client Secret**.

---

## Step 4 — Run the Supabase database migration

In Supabase Dashboard → **SQL Editor**, run:

```text
supabase/migrations/20260718153000_create_linkedin_connections.sql
```

This creates:

- `linkedin_connections` — safe profile metadata (RLS enabled for owner read)
- `linkedin_oauth_tokens` — tokens accessible only via service role

Verify in **Table Editor** that both tables exist.

---

## Step 5 — Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### Security rules

- `SUPABASE_SERVICE_ROLE_KEY` and `LINKEDIN_CLIENT_SECRET` are **server-only**.
- Never prefix secrets with `NEXT_PUBLIC_`.
- Never commit `.env.local`.

Optional:

```env
LINKEDIN_OAUTH_STATE_SECRET=long_random_string
```

If omitted, the app falls back to `LINKEDIN_CLIENT_SECRET` for OAuth state signing.

---

## Step 6 — Configure Supabase Auth redirect URLs (CareerOS login)

If you use Google login via Supabase, ensure Supabase **Authentication → URL Configuration** includes:

```text
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

This is separate from the LinkedIn callback URL.

---

## Step 7 — Start the app and connect LinkedIn

1. Restart the dev server after changing env vars:

```bash
npm run dev
```

2. Sign in to CareerOS.
3. Open `/linkedin`.
4. Click **Connect LinkedIn**.
5. Approve LinkedIn permissions.
6. You should return to Mission Control with:

   - ✅ LinkedIn Connected
   - Connected as: *your name*
   - Last synced: *timestamp*
   - **Sync Again** / **Disconnect**

---

## Step 8 — Production deployment (Vercel)

Add the same environment variables in Vercel → **Project → Settings → Environment Variables**:

| Variable | Environments |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview |
| `LINKEDIN_CLIENT_ID` | Production, Preview |
| `LINKEDIN_CLIENT_SECRET` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | Production → `https://your-domain.com` (must match LinkedIn redirect URL host) |

Add your production LinkedIn redirect URL in the LinkedIn Developer Portal before going live.

---

## Token expiry & reconnect

- Access token expiry is stored in `token_expires_at`.
- `/api/linkedin/status` returns `state: "expired"` when the token is expired.
- **Sync Again** attempts a refresh token exchange when LinkedIn issued a refresh token.
- If refresh fails, the UI shows **Reconnect LinkedIn**.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `LinkedIn OAuth not configured` | Set `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`, restart server |
| `redirect_uri mismatch` | Redirect URL in LinkedIn app must exactly match `/api/linkedin/callback` |
| `Invalid or expired LinkedIn authorization state` | Retry connect; clear cookies; check server clock |
| `Unauthorized` on callback | Sign in to CareerOS before connecting LinkedIn |
| DB errors on connect | Run migration `20260718153000_create_linkedin_connections.sql` |
| LinkedIn account already connected | Each LinkedIn member ID can link to one CareerOS user |

---

## What is intentionally NOT implemented

Per product requirements, this phase does **not** include:

- Follower counts
- Profile views
- Impressions / analytics
- Unofficial LinkedIn APIs or scrapers

The module is structured so future official LinkedIn APIs can be added in server routes without redesigning the UI shell.
