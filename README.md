## CareerOS

A personal career dashboard for a single user.

### Tech stack

- [Next.js 15](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)

### Project structure

```
src/
├── app/                  # Routes (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/               # shadcn/ui components
└── lib/
    ├── utils.ts          # shadcn `cn()` helper
    └── supabase/
        ├── client.ts     # Supabase client (Client Components)
        └── server.ts     # Supabase client (Server Components/Actions)
```

Pages and features are added incrementally as the app is built out.

### Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment variable template and fill in your Supabase project credentials:

   ```bash
   cp .env.local.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

### Adding shadcn/ui components

```bash
npx shadcn@latest add <component>
```
