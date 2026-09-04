export type Lang = "en" | "hi";

export const translations = {
  en: {
    batchInformation: "Batch Information",
    cropLabel: "Crop",
    harvestAgeLabel: "Harvest age",
    storageLabel: "Storage",
    transportLabel: "Transport",
    spoilageRiskLabel: "Spoilage Risk",
    daysLabel: "days",
    appName: "FarmIQ",
    tagline: "Produce condition inspection",
    heroTitle: "Check your produce before it leaves the crate",
    heroBody:
      "Photograph a fruit or vegetable and FarmIQ grades its condition — fresh, mild spoilage, or rotten — with a care recommendation.",
    uploadLabel: "Inspection slot",
    uploadHint: "Drop a photo here, or tap to choose one",
    uploadHintMobile: "Tap to take or choose a photo",
    changePhoto: "Choose a different photo",
    inspectButton: "Inspect produce",
    inspecting: "Inspecting…",
    newInspection: "New inspection",
    verdictLabel: "Verdict",
    confidenceLabel: "Confidence",
    breakdownLabel: "Full breakdown",
    recommendationLabel: "Recommendation",
    errorGeneric:
      "Couldn't reach the inspection service. Make sure the backend is running and try again.",
    errorBadFile: "That doesn't look like an image. Choose a JPG or PNG file.",
    langToggle: "हिंदी",
    verdicts: {
      fresh: "Fresh",
      mild: "Mild spoilage",
      rotten: "Rotten"
    },
    recommendations: {
      fresh:
        "In good condition. Store as usual and prioritize selling or using within the typical shelf life for this produce.",
      mild:
        "Early spoilage signs are present. Move this stock to the front for near-term sale, or use it soon rather than holding it in storage.",
      rotten:
        "Not fit for sale or consumption. Remove from stock and dispose of it separately so it doesn't affect nearby produce."
    }
  },
  hi: {
    batchInformation: "बैच की जानकारी",
    cropLabel: "फसल",
    harvestAgeLabel: "कटाई की आयु",
    storageLabel: "भंडारण",
    transportLabel: "परिवहन",
    spoilageRiskLabel: "खराब होने का जोखिम",
    daysLabel: "दिन",
    appName: "फार्मआईक्यू",
    tagline: "उपज की स्थिति जांच",
    heroTitle: "उपज को आगे भेजने से पहले जांच लें",
    heroBody:
      "फल या सब्ज़ी की फोटो लें, फार्मआईक्यू उसकी स्थिति बताएगा — ताज़ा, हल्की खराबी, या सड़ा हुआ — साथ में देखभाल की सलाह भी।",
    uploadLabel: "जांच स्थान",
    uploadHint: "यहाँ फोटो डालें, या चुनने के लिए टैप करें",
    uploadHintMobile: "फोटो लेने या चुनने के लिए टैप करें",
    changePhoto: "दूसरी फोटो चुनें",
    inspectButton: "उपज जांचें",
    inspecting: "जांच हो रही है…",
    newInspection: "नई जांच",
    verdictLabel: "नतीजा",
    confidenceLabel: "विश्वास स्तर",
    breakdownLabel: "पूरा विवरण",
    recommendationLabel: "सलाह",
    errorGeneric:
      "जांच सेवा से संपर्क नहीं हो सका। सुनिश्चित करें कि बैकएंड चल रहा है और फिर से कोशिश करें।",
    errorBadFile: "यह छवि जैसी नहीं लगती। कृपया JPG या PNG फ़ाइल चुनें।",
    langToggle: "English",
    verdicts: {
      fresh: "ताज़ा",
      mild: "हल्की खराबी",
      rotten: "सड़ा हुआ"
    },
    recommendations: {
      fresh:
        "स्थिति अच्छी है। सामान्य रूप से भंडारण करें और इस उपज की सामान्य शेल्फ लाइफ के भीतर बिक्री या उपयोग को प्राथमिकता दें।",
      mild:
        "शुरुआती खराबी के लक्षण दिख रहे हैं। इस स्टॉक को जल्द बिक्री के लिए आगे रखें, या इसे भंडारण में रखने के बजाय जल्दी उपयोग करें।",
      rotten:
        "बिक्री या उपयोग के लायक नहीं है। इसे स्टॉक से हटाकर अलग से नष्ट करें ताकि आस-पास की उपज प्रभावित न हो।"
    }
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

/** Maps a backend class name (e.g. "Fresh", "Mild", "Rotten") to a translation key. */
export function classToKey(className: string): "fresh" | "mild" | "rotten" {
  const normalized = className.trim().toLowerCase();
  if (normalized.startsWith("fresh")) return "fresh";
  if (normalized.startsWith("rot")) return "rotten";
  return "mild";
}
