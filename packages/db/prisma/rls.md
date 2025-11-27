This file contains the rls policies for the different tables, ideally these sql should be applied in a migration file but rn it can stay here.

These rls are applied in the supabase sql editor. You can go to the sql table editor and apply these rules

```sql
create policy "organizations can view their farmers"
on "public"."Farmers"
to authenticated
using ((select auth.uid() as uid)::text = organization_id);

create policy "organizations can create farmers"
on "public"."Farmers"
to authenticated
with check ((select auth.uid() as uid)::text = organization_id);

create policy "organizations can update their farmers only"
on "public"."Farmers"
to authenticated
using ((select auth.uid() as uid)::text = organization_id)
with check ((select auth.uid() as uid)::text = organization_id);

create policy "organizations can delete their farmers only"
on "public"."Farmers"
to authenticated
using ((select auth.uid() as uid)::text = organization_id);
```
