-- Approved rename: 'tourist' -> 'citizen'. The original label was inherited
-- from the base repo's tourism-app enum and reads oddly for a civic platform
-- ("a citizen submitting a challenge is a tourist" made no sense).
--
-- Safe operation: ALTER TYPE ... RENAME VALUE preserves the underlying OID,
-- so the profiles.user_type DEFAULT 'tourist' clause and any existing rows
-- continue working automatically under the new name — no data migration,
-- no DEFAULT clause update needed.

ALTER TYPE public.user_type RENAME VALUE 'tourist' TO 'citizen';
