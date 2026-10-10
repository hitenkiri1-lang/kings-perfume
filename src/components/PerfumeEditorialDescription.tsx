import React from "react";
import { RoyalCrownIcon, OlfactoryDropIcon, ShieldHeritageIcon } from "@/components/icons/LuxuryIcons";

export interface ParsedPerfumeInfo {
  title: string | null;
  tagline: string | null;
  paragraphs: string[];
  character: string | null;
  concentration: string | null;
  perfectFor: string | null;
  otherAttributes: { key: string; value: string }[];
}

/**
 * Utility to parse structured or markdown perfume descriptions
 * Handles raw markdown (e.g. ### Headers, **Bold taglines**, **Key:** Value)
 * and turns them into high-fidelity Haute Parfumerie editorial layouts.
 */
export function parsePerfumeDescription(text: string): ParsedPerfumeInfo {
  if (!text) {
    return {
      title: null,
      tagline: null,
      paragraphs: [],
      character: null,
      concentration: null,
      perfectFor: null,
      otherAttributes: [],
    };
  }

  // Normalize line endings
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rawBlocks = normalized.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  let title: string | null = null;
  let tagline: string | null = null;
  let character: string | null = null;
  let concentration: string | null = null;
  let perfectFor: string | null = null;
  const otherAttributes: { key: string; value: string }[] = [];
  const paragraphs: string[] = [];

  for (const block of rawBlocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    // Check if entire block is a list of attributes
    let allAttr = true;
    for (const line of lines) {
      if (!/^\*\*([^*:]+):\*\*/.test(line) && !/^#{1,4}\s+/.test(line)) {
        allAttr = false;
        break;
      }
    }

    if (allAttr) {
      for (const line of lines) {
        if (/^#{1,4}\s+/.test(line)) {
          if (!title) title = line.replace(/^#{1,4}\s+/, "").trim();
        } else {
          const match = line.match(/^\*\*([^*:]+):\*\*\s*(.*)$/);
          if (match) {
            assignAttribute(match[1].trim(), match[2].trim());
          }
        }
      }
      continue;
    }

    // Single line block
    if (lines.length === 1) {
      const line = lines[0];
      if (/^#{1,4}\s+/.test(line)) {
        if (!title) title = line.replace(/^#{1,4}\s+/, "").trim();
        continue;
      }
      const attrMatch = line.match(/^\*\*([^*:]+):\*\*\s*(.*)$/);
      if (attrMatch) {
        assignAttribute(attrMatch[1].trim(), attrMatch[2].trim());
        continue;
      }
      if (/^\*\*([^*]+)\*\*$/.test(line) && !line.includes(":") && line.length < 160 && !tagline) {
        tagline = line.replace(/^\*\*|\*\*$/g, "").trim();
        continue;
      }
    }

    // Mixed block (prose + possible attributes)
    const proseLines: string[] = [];
    for (const line of lines) {
      if (/^#{1,4}\s+/.test(line)) {
        if (!title) title = line.replace(/^#{1,4}\s+/, "").trim();
      } else {
        const attrMatch = line.match(/^\*\*([^*:]+):\*\*\s*(.*)$/);
        if (attrMatch) {
          assignAttribute(attrMatch[1].trim(), attrMatch[2].trim());
        } else if (/^\*\*([^*]+)\*\*$/.test(line) && !line.includes(":") && line.length < 160 && !tagline) {
          tagline = line.replace(/^\*\*|\*\*$/g, "").trim();
        } else {
          proseLines.push(line);
        }
      }
    }

    if (proseLines.length > 0) {
      paragraphs.push(proseLines.join(" "));
    }
  }

  function assignAttribute(rawKey: string, val: string) {
    const k = rawKey.toLowerCase();
    if (k.includes("character") || k.includes("family") || k.includes("accord")) {
      character = val;
    } else if (k.includes("concentration") || k.includes("purity") || k.includes("oil")) {
      concentration = val;
    } else if (k.includes("perfect for") || k.includes("ideal for") || k.includes("occasion") || k.includes("best for")) {
      perfectFor = val;
    } else {
      otherAttributes.push({ key: rawKey, value: val });
    }
  }

  return { title, tagline, paragraphs, character, concentration, perfectFor, otherAttributes };
}

/**
 * Splits comma, bullet, or bullet-like lists into individual array elements
 */
function splitPills(text: string): string[] {
  return text
    .split(/[•·|,/]|(?:\band\b)/i)
    .map((s) => s.replace(/^\s*[-*]\s*/, "").trim())
    .filter((s) => s.length > 0 && s.length < 50);
}

/**
 * Parse concentration into title and subtitle description
 * e.g. "Extrait de Parfum (Highest concentration for long-lasting performance)"
 */
function parseConcentration(text: string) {
  const match = text.match(/^([^(]+)(?:\((.*)\))?$/);
  if (match) {
    return {
      main: match[1].trim(),
      sub: match[2]?.trim() || null,
    };
  }
  return { main: text, sub: null };
}

/**
 * Helper to strip markdown formatting for compact previews (e.g. table comparison)
 */
export function stripPerfumeMarkdown(text: string): string {
  if (!text) return "";
  const info = parsePerfumeDescription(text);
  if (info.paragraphs.length > 0) {
    return info.paragraphs.join(" ").replace(/\*\*/g, "").replace(/\*/g, "");
  }
  return text.replace(/###/g, "").replace(/\*\*/g, "").replace(/\*/g, "").trim();
}

/**
 * Formats inline bold (**text**) and italic (*text*) inside narrative prose
 */
function FormattedInline({ text }: { text: string }) {
  // Simple regex parser for **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={idx} className="font-semibold text-[#181512]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={idx} className="italic text-[#2A241E]">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

interface PerfumeEditorialDescriptionProps {
  description: string;
  variant?: "hero" | "compact" | "tab";
  className?: string;
}

export function PerfumeEditorialDescription({
  description,
  variant = "hero",
  className = "",
}: PerfumeEditorialDescriptionProps) {
  const data = parsePerfumeDescription(description);
  const accords = data.character ? splitPills(data.character) : [];
  const occasions = data.perfectFor ? splitPills(data.perfectFor) : [];
  const conc = data.concentration ? parseConcentration(data.concentration) : null;

  // COMPACT VARIANT: for QuickView modal
  if (variant === "compact") {
    return (
      <div className={`space-y-3.5 ${className}`}>
        {/* Luxury Tagline */}
        {data.tagline && (
          <p className="font-serif italic text-sm text-[#181512] font-normal leading-relaxed border-l-2 border-gold/70 pl-3">
            “{data.tagline}”
          </p>
        )}

        {/* Narrative Prose */}
        {data.paragraphs.length > 0 && (
          <p className="text-xs sm:text-[13px] leading-relaxed text-[#5C554B] font-light">
            <FormattedInline text={data.paragraphs[0]} />
          </p>
        )}

        {/* Accords Badges */}
        {accords.length > 0 && (
          <div className="pt-1">
            <span className="text-[9.5px] uppercase tracking-wider text-gold font-mono font-semibold block mb-1.5">
              Olfactory Character
            </span>
            <div className="flex flex-wrap gap-1.5">
              {accords.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F0] border border-[#EAE3D6] px-2.5 py-0.5 text-[11px] font-medium text-[#181512]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Concentration Highlight */}
        {conc && (
          <div className="flex items-center gap-2 rounded-xl bg-[#FAF7F0] border border-[#EAE3D6] px-3 py-2 text-xs">
            <span className="text-gold font-serif text-sm">✦</span>
            <span className="font-serif font-medium text-[#181512]">{conc.main}</span>
            {conc.sub && (
              <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                {conc.sub.length > 30 ? "Highest Concentration" : conc.sub}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // TAB VARIANT: for "The Story" tab at bottom of product detail page
  if (variant === "tab") {
    return (
      <div className={`space-y-6 ${className}`}>
        {data.tagline && (
          <div className="border-l-2 border-gold pl-4 py-1">
            <blockquote className="font-serif italic text-xl text-[#181512]">
              “{data.tagline}”
            </blockquote>
          </div>
        )}

        <div className="space-y-4 text-base text-[#5C554B] font-light leading-relaxed">
          {data.paragraphs.map((p, i) => (
            <p key={i}>
              <FormattedInline text={p} />
            </p>
          ))}
        </div>

        {/* Attribute Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0EBE2]">
          {accords.length > 0 && (
            <div className="rounded-2xl bg-[#FAF7F0] border border-[#EAE3D6] p-4">
              <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-semibold block mb-2">
                Fragrance Accords & Character
              </span>
              <div className="flex flex-wrap gap-1.5">
                {accords.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#EAE3D6] px-3 py-1 text-xs font-medium text-[#181512]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {conc && (
            <div className="rounded-2xl bg-[#FAF7F0] border border-[#EAE3D6] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-semibold block mb-1">
                  Perfume Oil Concentration
                </span>
                <span className="font-serif text-lg font-medium text-[#181512] block">
                  {conc.main}
                </span>
                {conc.sub && (
                  <p className="text-xs text-[#6B6154] font-light mt-1">
                    {conc.sub}
                  </p>
                )}
              </div>
            </div>
          )}

          {occasions.length > 0 && (
            <div className="sm:col-span-2 rounded-2xl bg-[#FAF7F0] border border-[#EAE3D6] p-4">
              <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-semibold block mb-2">
                Curated Occasions & Wearability
              </span>
              <div className="flex flex-wrap gap-2">
                {occasions.map((o, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-white border border-[#ECE5D8] px-3 py-1 text-xs text-[#4A453F] font-light shadow-2xs"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.otherAttributes.map((attr, idx) => (
            <div key={idx} className="rounded-2xl bg-[#FAF7F0] border border-[#EAE3D6] p-4">
              <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-semibold block mb-1">
                {attr.key}
              </span>
              <span className="text-sm text-[#181512] font-medium block">
                {attr.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // HERO VARIANT (default): for Product Details page under price
  return (
    <div className={`space-y-5 ${className}`}>
      {/* Luxury Tagline Quote */}
      {data.tagline && (
        <div className="relative pl-3.5 border-l-2 border-gold/70 py-0.5">
          <p className="font-serif italic text-base sm:text-[17px] text-[#181512] font-normal leading-relaxed">
            “{data.tagline}”
          </p>
        </div>
      )}

      {/* Narrative Story Prose */}
      {data.paragraphs.length > 0 && (
        <div className="space-y-3">
          {data.paragraphs.map((p, idx) => (
            <p key={idx} className="text-[14.5px] leading-relaxed text-[#5C554B] font-light">
              <FormattedInline text={p} />
            </p>
          ))}
        </div>
      )}

      {/* Olfactory Character & Accord Badges */}
      {accords.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-2.5">
            <OlfactoryDropIcon size={14} className="text-gold" />
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-gold font-mono">
              Olfactory Character
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {accords.map((chord, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#EAE3D6] text-xs font-medium text-[#181512] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gold transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {chord}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Perfume Oil Concentration Hallmark Card */}
      {conc && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#FAF7F0] to-[#FAF8F5] border border-[#EAE3D6] flex items-start sm:items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <RoyalCrownIcon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-[15px] font-medium text-[#181512]">
                {conc.main}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-gold/10 text-gold font-bold">
                Royal Extrait
              </span>
            </div>
            {conc.sub && (
              <span className="text-[#6B6154] font-light text-xs block mt-0.5">
                {conc.sub}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Curated Occasions / Perfect For */}
      {occasions.length > 0 && (
        <div className="flex items-start gap-2 pt-1">
          <span className="text-muted-foreground font-semibold shrink-0 font-mono text-[10px] uppercase pt-1 tracking-wider">
            Perfect For:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {occasions.map((occ, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-[#FAF7F0] border border-[#EAE3D6] text-[11px] text-[#4A453F] font-medium"
              >
                {occ}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Custom Attributes */}
      {data.otherAttributes.length > 0 && (
        <div className="pt-2 space-y-1.5">
          {data.otherAttributes.map((attr, idx) => (
            <div key={idx} className="flex items-baseline gap-2 text-xs">
              <span className="text-muted-foreground font-semibold shrink-0 font-mono text-[10px] uppercase tracking-wider">
                {attr.key}:
              </span>
              <span className="text-[#181512] font-medium">
                {attr.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
