import { Camera, Loader2, MapPin, X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AuthForm } from "@/components/auth/AuthForm";
import { PipelineStrata, type Stage, type StageState } from "@/components/challenges/PipelineStrata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Domain = Database["public"]["Enums"]["challenge_domain"];

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

type Phase = "idle" | "uploading" | "saving" | "categorising" | "matching" | "done" | "error";

interface MatchResult {
  institutionId: string;
  score: number;
  reason: string;
}

/*
 * design-brief.md: this page's job is to make someone feel their problem was SEEN
 * and is headed toward real expertise — not swallowed by a government form.
 *
 * Three decisions follow from that, and they are why this is not a stock form:
 *  1. The description is the hero. It is what a citizen actually has to say, so it
 *     gets the visual weight. Title/photo/location are optional supports that never
 *     gate submission.
 *  2. Submitting does not end in a toast. It reveals the real AI categorisation and
 *     the real matched institutions inline — the payoff IS the evidence that the
 *     problem went somewhere.
 *  3. Progress is shown as the lifecycle strata filling in, not a spinner, so the
 *     wait for two slow model calls reads as movement rather than a hang.
 */
export function ChallengeSubmissionForm() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const [geoNote, setGeoNote] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoNote, setPhotoNote] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<Domain | null>(null);
  // Domain confidence is intentionally NOT surfaced here. contracts.md forbids
  // showing raw scores as percentages, and a bare float is jargon on a citizen
  // page — the plain-language domain name is the useful part.
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [institutionNames, setInstitutionNames] = useState<Record<string, string>>({});

  const fileInput = useRef<HTMLInputElement>(null);
  const busy = phase !== "idle" && phase !== "done" && phase !== "error";
  const descriptionTooShort = description.trim().length > 0 && description.trim().length < 20;

  function captureLocation() {
    if (!navigator.geolocation) {
      setGeoNote(t("submit.geo.unsupported"));
      return;
    }
    setGeoBusy(true);
    setGeoNote(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoBusy(false);
      },
      () => {
        // Denied or unavailable is not an error — the typed location still works.
        setGeoBusy(false);
        setGeoNote(t("submit.geo.denied"));
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  function addPhotos(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((f) => f.size > MAX_PHOTO_BYTES);
    const ok = incoming.filter((f) => f.size <= MAX_PHOTO_BYTES);

    setPhotoNote(tooBig.length > 0 ? t("submit.photo.tooBig", { count: tooBig.length }) : null);
    setPhotos((prev) => [...prev, ...ok].slice(0, MAX_PHOTOS));
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || description.trim().length < 20) return;

    setError(null);
    setMatches([]);
    setDomain(null);


    // The row id is generated HERE, before anything is written, because photos must
    // be uploaded and their URLs included in the INSERT itself. The owner cannot
    // PATCH their own challenge afterwards — the only UPDATE policy on `challenges`
    // is admin-only, and PostgREST reports that block as HTTP 200 with zero rows
    // changed, so an insert-then-attach flow would silently drop every photo.
    const challengeId = crypto.randomUUID();
    const trimmed = description.trim();

    try {
      let photoUrls: string[] = [];

      if (photos.length > 0) {
        setPhase("uploading");
        photoUrls = await Promise.all(
          photos.map(async (file, i) => {
            const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
            const path = `${user.id}/${challengeId}/${i}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from("challenge-photos")
              .upload(path, file, { upsert: true, contentType: file.type });
            if (upErr) throw new Error(t("submit.error.photo", { message: upErr.message }));
            return supabase.storage.from("challenge-photos").getPublicUrl(path).data.publicUrl;
          }),
        );
      }

      setPhase("saving");
      const { error: insErr } = await supabase.from("challenges").insert({
        id: challengeId,
        submitted_by: user.id,
        title: title.trim() || trimmed.slice(0, 60),
        description: trimmed,
        location_text: locationText.trim() || null,
        lat: coords?.lat ?? null,
        lon: coords?.lon ?? null,
        photo_urls: photoUrls,
      });
      if (insErr) throw new Error(insErr.message);

      // From here the submission is SAVED. Anything that fails below degrades to a
      // softer message rather than an error — the citizen's report is not lost.
      setPhase("categorising");
      const { data: cat, error: catErr } = await supabase.functions.invoke("categorize-challenge", {
        body: { challengeId, description: trimmed },
      });

      if (catErr || !cat?.success) {
        setPhase("done");
        setError(t("submit.error.categorisePartial"));
        return;
      }

      setDomain(cat.result.domain as Domain);


      setPhase("matching");
      const { data: mat, error: matErr } = await supabase.functions.invoke("match-institutions", {
        body: { challengeId, description: trimmed, domain: cat.result.domain },
      });

      if (matErr || !mat?.success) {
        setPhase("done");
        setError(t("submit.error.matchPartial"));
        return;
      }

      const found = (mat.matches ?? []) as MatchResult[];
      setMatches(found);

      if (found.length > 0) {
        const { data: insts } = await supabase
          .from("institutions")
          .select("id, name")
          .in("id", found.map((m) => m.institutionId));
        setInstitutionNames(Object.fromEntries((insts ?? []).map((i) => [i.id, i.name])));
      }

      setPhase("done");
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : t("error.generic"));
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setLocationText("");
    setCoords(null);
    setPhotos([]);
    setPhase("idle");
    setError(null);
    setMatches([]);
    setDomain(null);

  }

  const stages: Stage[] = [
    { key: "submitted", label: t("submit.stage.saved"), detail: t("submit.stage.savedDetail") },
    {
      key: "ai_matched",
      label: t("submit.stage.categorised"),
      detail: domain ? t(`challenge.domain.${domain}`) : t("submit.stage.categorisedDetail"),
    },
    {
      key: "claimed",
      label: t("submit.stage.matched"),
      detail:
        matches.length > 0
          ? t("submit.stage.matchedCount", { count: matches.length })
          : t("submit.stage.matchedDetail"),
    },
  ];

  function stateOf(key: string): StageState {
    const order = ["submitted", "ai_matched", "claimed"];
    const idx = order.indexOf(key);
    const reached =
      phase === "saving" || phase === "uploading"
        ? 0
        : phase === "categorising"
          ? 1
          : phase === "matching"
            ? 2
            : phase === "done"
              ? 3
              : -1;
    if (phase === "error") return idx === 0 ? "failed" : "pending";
    if (reached < 0) return "pending";
    if (idx < reached) return "done";
    if (idx === reached) return phase === "done" ? "done" : "active";
    return "pending";
  }

  if (authLoading) {
    return <p className="text-muted-foreground">{t("common.loading")}</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {t("submit.auth.heading")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("submit.auth.body")}</p>
        </div>
        {/* Same AuthForm the SignIn page uses — one credential surface, one set
            of error strings, so the two can never drift apart. */}
        <AuthForm mode="signin" compact />
      </div>
    );
  }

  // ---------- success view: show the citizen what actually happened ----------
  if (phase === "done") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            {t("submit.done.heading")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("submit.done.body")}</p>
        </div>

        <PipelineStrata stages={stages} stateOf={stateOf} />

        {error ? (
          <p className="rounded-md border border-border bg-secondary p-4 text-sm">{error}</p>
        ) : null}

        {matches.length > 0 ? (
          <section>
            <h3 className="font-display text-xl font-semibold">{t("submit.done.sentTo")}</h3>
            <ul className="mt-3 space-y-3">
              {matches.map((m) => (
                <li key={m.institutionId} className="rounded-lg border border-border p-4">
                  <p className="font-medium">{institutionNames[m.institutionId] ?? m.institutionId}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.reason}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">{t("submit.done.matchNote")}</p>
          </section>
        ) : null}

        <Button onClick={resetForm} variant="outline" size="lg">
          {t("submit.done.another")}
        </Button>
      </div>
    );
  }

  // ---------- the form ----------
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8" noValidate>
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">{t("submit.heading")}</h2>
        <p className="mt-2 text-muted-foreground">{t("submit.intro")}</p>
      </div>

      {/* The description is the hero field — biggest target, first in the order. */}
      <div className="space-y-2">
        <Label htmlFor="description">{t("submit.description.label")}</Label>
        <p id="description-help" className="text-sm text-muted-foreground">
          {t("submit.description.help")}
        </p>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={7}
          required
          disabled={busy}
          aria-describedby="description-help description-count"
          placeholder={t("submit.description.placeholder")}
        />
        <p id="description-count" className="text-sm text-muted-foreground">
          {descriptionTooShort ? t("submit.description.tooShort") : t("submit.description.count", { count: description.trim().length })}
        </p>
      </div>

      <fieldset className="space-y-6 rounded-lg border border-border p-5" disabled={busy}>
        <legend className="px-2 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("submit.optional.legend")}
        </legend>

        <div className="space-y-2">
          <Label htmlFor="title">{t("submit.title.label")}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            placeholder={t("submit.title.placeholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t("submit.location.label")}</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="location"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder={t("submit.location.placeholder")}
              className="flex-1"
            />
            {/* Explicit button, never auto-prompted — an unexpected OS permission
                dialog on load is hostile, and typing the place always works. */}
            <Button type="button" variant="outline" onClick={captureLocation} disabled={geoBusy}>
              {geoBusy ? <Loader2 className="animate-spin" /> : <MapPin />}
              {t("submit.location.useCurrent")}
            </Button>
          </div>
          {coords ? (
            <p className="font-mono text-xs text-muted-foreground">
              {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
            </p>
          ) : null}
          {geoNote ? <p className="text-sm text-muted-foreground">{geoNote}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="photos">{t("submit.photo.label")}</Label>
          <input
            ref={fileInput}
            id="photos"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => addPhotos(e.target.files)}
          />
          <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
            <Camera />
            {t("submit.photo.add")}
          </Button>
          <p className="text-sm text-muted-foreground">{t("submit.photo.help", { max: MAX_PHOTOS })}</p>
          {photoNote ? <p className="text-sm text-destructive">{photoNote}</p> : null}
          {photos.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-1">
              {photos.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-md border border-border py-1 pl-3 pr-1 text-sm">
                  <span className="max-w-40 truncate">{f.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={t("submit.photo.remove", { name: f.name })}
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  >
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </fieldset>

      {busy ? <PipelineStrata stages={stages} stateOf={stateOf} /> : null}

      {error ? (
        <p role="alert" className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        variant="accent"
        disabled={busy || description.trim().length < 20}
        className="w-full sm:w-auto"
      >
        {busy ? <Loader2 className="animate-spin" /> : null}
        {busy ? t("submit.sending") : t("submit.cta")}
      </Button>
    </form>
  );
}
