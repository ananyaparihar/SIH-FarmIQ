import { useEffect, useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ResultCard from "./components/ResultCard";
import { translations, type Lang } from "./i18n";
import {
  predictProduce,
  type PredictResponse
} from "./lib/api";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");

  // Image state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Prediction state
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Post-harvest information
  const [crop, setCrop] = useState("Mango");
  const [harvestAge, setHarvestAge] = useState<number>(0);
  const [storage, setStorage] = useState("Open room");
  const [transportDays, setTransportDays] = useState<number>(0);

  const t = translations[lang];

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileSelected(selected: File) {
    if (!selected.type.startsWith("image/")) {
      setError(t.errorBadFile);
      return;
    }

    setError(null);
    setResult(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleInspect() {
    if (!file) return;

    // Basic validation
    if (harvestAge < 0) {
      setError("Harvest age cannot be negative.");
      return;
    }

    if (transportDays < 0) {
      setError("Transport duration cannot be negative.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await predictProduce({
        file,
        crop,
        harvestAge,
        storage,
        transportDays,

        // Send selected language to backend
        language: lang
      });

      setResult(response);
    } catch (err) {
      console.error(err);
      setError(t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);

    // Reset post-harvest information
    setCrop("Mango");
    setHarvestAge(0);
    setStorage("Open room");
    setTransportDays(0);
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-6 py-10 sm:py-16">
      <header className="mb-10 flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight">
            {t.appName}
          </h1>

          <p className="font-sans text-xs text-charcoal/60">
            {t.tagline}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLang(lang === "en" ? "hi" : "en");

            // Clear previous result so recommendation
            // gets translated in the newly selected language
            setResult(null);
          }}
          className="font-sans text-sm underline decoration-line underline-offset-4 hover:decoration-ink"
        >
          {t.langToggle}
        </button>
      </header>

      <main>
        <h2 className="mb-2 font-display text-2xl leading-snug">
          {t.heroTitle}
        </h2>

        <p className="mb-8 font-sans text-sm leading-relaxed text-charcoal/70">
          {t.heroBody}
        </p>

        {/* --------------------------------------------- */}
        {/* POST-HARVEST INFORMATION                      */}
        {/* --------------------------------------------- */}

        <section className="mb-8 space-y-5">

          {/* Crop */}
          <div>
            <label className="mb-2 block font-sans text-sm font-medium">
              {lang === "hi" ? "फसल" : "Crop"}
            </label>

            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-slip border border-line bg-paper px-4 py-3 font-sans text-sm text-ink outline-none focus:border-ink"
            >
              <option value="Mango">Mango</option>
              <option value="Tomato">Tomato</option>
              <option value="Apple">Apple</option>
              <option value="Banana">Banana</option>
              <option value="Potato">Potato</option>
              <option value="Onion">Onion</option>
            </select>
          </div>

          {/* Harvest age */}
          <div>
            <label className="mb-2 block font-sans text-sm font-medium">
              {lang === "hi" ? "कटाई की आयु" : "Harvest age"}
            </label>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={harvestAge}
                onChange={(e) =>
                  setHarvestAge(Number(e.target.value))
                }
                className="w-full rounded-slip border border-line bg-paper px-4 py-3 font-sans text-sm text-ink outline-none focus:border-ink"
              />

              <span className="font-sans text-sm text-charcoal/60">
                {lang === "hi" ? "दिन" : "days"}
              </span>
            </div>
          </div>

          {/* Storage */}
          <div>
            <label className="mb-2 block font-sans text-sm font-medium">
              {lang === "hi" ? "भंडारण की स्थिति" : "Storage condition"}
            </label>

            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              className="w-full rounded-slip border border-line bg-paper px-4 py-3 font-sans text-sm text-ink outline-none focus:border-ink"
            >
              <option value="Open room">
                {lang === "hi" ? "खुला कमरा" : "Open room"}
              </option>

              <option value="Covered room">
                {lang === "hi" ? "ढका हुआ कमरा" : "Covered room"}
              </option>

              <option value="Cold storage">
                {lang === "hi" ? "कोल्ड स्टोरेज" : "Cold storage"}
              </option>

              <option value="Refrigerated">
                {lang === "hi" ? "रेफ्रिजरेटेड" : "Refrigerated"}
              </option>
            </select>
          </div>

          {/* Transport */}
          <div>
            <label className="mb-2 block font-sans text-sm font-medium">
              {lang === "hi"
                ? "अपेक्षित परिवहन अवधि"
                : "Expected transport duration"}
            </label>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={transportDays}
                onChange={(e) =>
                  setTransportDays(Number(e.target.value))
                }
                className="w-full rounded-slip border border-line bg-paper px-4 py-3 font-sans text-sm text-ink outline-none focus:border-ink"
              />

              <span className="font-sans text-sm text-charcoal/60">
                {lang === "hi" ? "दिन" : "days"}
              </span>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- */}
        {/* IMAGE UPLOAD                                  */}
        {/* --------------------------------------------- */}

        <UploadPanel
          lang={lang}
          previewUrl={previewUrl}
          onFileSelected={handleFileSelected}
          error={error}
        />

        {/* --------------------------------------------- */}
        {/* INSPECT BUTTON                                */}
        {/* --------------------------------------------- */}

        {file && !result && (
          <button
            type="button"
            onClick={handleInspect}
            disabled={isLoading}
            className="mt-4 w-full rounded-slip bg-ink py-3 font-sans text-sm font-medium text-paper transition-opacity disabled:opacity-50"
          >
            {isLoading
              ? t.inspecting
              : lang === "hi"
              ? "बैच की जांच करें"
              : "Analyze Batch"}
          </button>
        )}

        {/* --------------------------------------------- */}
        {/* RESULT                                        */}
        {/* --------------------------------------------- */}

        {result && (
          <>
            <div className="mt-8">
              <ResultCard
                lang={lang}
                result={result}
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 w-full rounded-slip border border-line py-3 font-sans text-sm font-medium text-ink"
            >
              {t.newInspection}
            </button>
          </>
        )}
      </main>
    </div>
  );
}