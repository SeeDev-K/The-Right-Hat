# Create the first TRH admin

After creating a user through `/signup` or directly inside Supabase Auth, copy the user's UUID from Supabase Auth Users.

Then run this SQL in Supabase SQL Editor:

```sql
insert into public.admin_profiles (user_id, full_name, role)
values ('PASTE_AUTH_USER_UUID_HERE', 'Ibrahim Mounjeddine', 'owner')
on conflict (user_id) do update
set role = 'owner', full_name = excluded.full_name;
```

Only users present in `admin_profiles` with role `owner` or `admin` can access protected admin APIs.

Recommended production roles:

- `owner`: full project owner
- `admin`: daily platform manager
- `editor`: future CMS editor
- `analyst`: future analytics-only access
