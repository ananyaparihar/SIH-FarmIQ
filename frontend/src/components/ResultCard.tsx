import type { Lang } from "../i18n";
import { classToKey, translations } from "../i18n";
import type { PredictResponse } from "../lib/api";

interface ResultCardProps {
  lang: Lang;
  result: PredictResponse;
}

const VERDICT_STYLES: Record<
  string,
  { border: string; text: string; rotate: string }
> = {
  fresh: {
    border: "border-fresh",
    text: "text-fresh",
    rotate: "-rotate-2"
  },
  mild: {
    border: "border-mild",
    text: "text-mild",
    rotate: "rotate-1"
  },
  rotten: {
    border: "border-rotten",
    text: "text-rotten",
    rotate: "-rotate-1"
  }
};

const RISK_STYLES: Record<
  string,
  { border: string; text: string; rotate: string }
> = {
  LOW: {
    border: "border-fresh",
    text: "text-fresh",
    rotate: "-rotate-1"
  },

  MEDIUM: {
    border: "border-mild",
    text: "text-mild",
    rotate: "rotate-1"
  },

  HIGH: {
    border: "border-rotten",
    text: "text-rotten",
    rotate: "-rotate-2"
  },

  UNFIT: {
    border: "border-rotten",
    text: "text-rotten",
    rotate: "-rotate-2"
  }
};

export default function ResultCard({
  lang,
  result
}: ResultCardProps) {
  const t = translations[lang];

  const key = classToKey(result.prediction);
  const style = VERDICT_STYLES[key];

  const breakdown = Object.entries(
    result.probabilities
  ).sort((a, b) => b[1] - a[1]);

  const risk = result.risk;
  const riskStyle = RISK_STYLES[risk.risk_level];

  return (
    <div className="border-t border-line pt-6">

      {/* --------------------------------------------- */}
      {/* VISION RESULT                                 */}
      {/* --------------------------------------------- */}

      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="mb-1 font-sans text-xs uppercase tracking-wide text-charcoal/60">
            {t.verdictLabel}
          </p>

          <div
            className={`inline-block ${style.rotate} border-4 ${style.border} px-4 py-1.5`}
          >
            <span
              className={`font-display text-2xl font-semibold ${style.text}`}
            >
              {t.verdicts[key]}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="mb-1 font-sans text-xs uppercase tracking-wide text-charcoal/60">
            {t.confidenceLabel}
          </p>

          <p className="font-display text-2xl">
            {result.confidence.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* VISION BREAKDOWN                              */}
      {/* --------------------------------------------- */}

      <div className="mt-6">
        <p className="mb-2 font-sans text-xs uppercase tracking-wide text-charcoal/60">
          {t.breakdownLabel}
        </p>

        <div className="space-y-2">
          {breakdown.map(([className, value]) => {
            const rowKey = classToKey(className);

            return (
              <div
                key={className}
                className="flex items-center gap-3"
              >
                <span className="w-28 shrink-0 font-sans text-sm text-charcoal/80">
                  {t.verdicts[rowKey]}
                </span>

                <div className="h-2 flex-1 rounded-full bg-line/50">
                  <div
                    className={`h-2 rounded-full ${
                      rowKey === "fresh"
                        ? "bg-fresh"
                        : rowKey === "mild"
                        ? "bg-mild"
                        : "bg-rotten"
                    }`}
                    style={{
                      width: `${value}%`
                    }}
                  />
                </div>

                <span className="w-12 shrink-0 text-right font-sans text-sm text-charcoal/60">
                  {value.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BATCH INFORMATION                             */}
      {/* --------------------------------------------- */}

      <div className="mt-8 border-y border-line py-5">
        <p className="mb-4 font-sans text-xs uppercase tracking-wide text-charcoal/60">
          {t.batchInformation}
        </p>

        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <p className="font-sans text-xs text-charcoal/60">
              {t.cropLabel}
            </p>
            <p className="font-sans text-sm font-medium">
              {result.batch_data.crop}
            </p>
          </div>

          <div>
            <p className="font-sans text-xs text-charcoal/60">
              {t.harvestAgeLabel}
            </p>
            <p className="font-sans text-sm font-medium">
              {result.batch_data.harvest_age} {t.daysLabel}
            </p>
          </div>

          <div>
            <p className="font-sans text-xs text-charcoal/60">
              {t.storageLabel}
            </p>
            <p className="font-sans text-sm font-medium">
              {result.batch_data.storage}
            </p>
          </div>

          <div>
            <p className="font-sans text-xs text-charcoal/60">
              {t.transportLabel}
            </p>
            <p className="font-sans text-sm font-medium">
              {result.batch_data.transport_days} {t.daysLabel}
            </p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* SPOILAGE RISK                                 */}
      {/* --------------------------------------------- */}

      <div className="mt-8">
        <p className="mb-2 font-sans text-xs uppercase tracking-wide text-charcoal/60">
          {t.spoilageRiskLabel}
        </p>

        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-4xl font-semibold">
            {risk.spoilage_risk.toFixed(1)}%
          </p>

          <div
            className={`inline-block ${riskStyle.rotate} border-4 ${riskStyle.border} px-4 py-1.5`}
          >
            <span
              className={`font-display text-xl font-semibold ${riskStyle.text}`}
            >
              {risk.risk_level}
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* RECOMMENDATION                                */}
      {/* --------------------------------------------- */}

      <div className="mt-8">
        <p className="mb-2 font-sans text-xs uppercase tracking-wide text-charcoal/60">
          {t.recommendationLabel}
        </p>

        <p className="font-sans text-sm leading-relaxed text-ink">
          {risk.recommendation}
        </p>
      </div>
    </div>
  );
}