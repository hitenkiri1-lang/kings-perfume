import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

// 1. Royal Crown / Imperial Crest Icon
export function RoyalCrownIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 18.5h18l-1.5 2.5H4.5L3 18.5z" fill="currentColor" fillOpacity="0.08" />
      <path d="M4.5 18.5L3 8l5.5 4L12 4l3.5 8L21 8l-1.5 10.5H4.5z" />
      <circle cx="12" cy="4" r="1.25" fill="currentColor" />
      <circle cx="3" cy="8" r="1" fill="currentColor" />
      <circle cx="21" cy="8" r="1" fill="currentColor" />
      <circle cx="8.5" cy="12" r="0.75" fill="currentColor" />
      <circle cx="15.5" cy="12" r="0.75" fill="currentColor" />
    </svg>
  );
}

// 2. Perfume Flacon / Glass Bottle Icon
export function FlaconIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Stopper */}
      <rect x="9" y="2" width="6" height="3" rx="0.5" />
      <path d="M10.5 5v2.5h3V5" />
      {/* Bottle Shoulder & Body */}
      <path d="M6 10.5c0-1.5 1-2.5 3-2.5h6c2 0 3 1 3 2.5V20c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V10.5z" />
      {/* Label outline inside bottle */}
      <rect x="8.5" y="12" width="7" height="6" rx="0.5" strokeDasharray="1.5 1.5" strokeOpacity="0.6" />
      <line x1="10.5" y1="15" x2="13.5" y2="15" strokeOpacity="0.8" />
    </svg>
  );
}

// 3. Olfactory Distillation Droplet Icon
export function OlfactoryDropIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2.5C12 2.5 6 10 6 15a6 6 0 0 0 12 0c0-5-6-12.5-6-12.5z" fill="currentColor" fillOpacity="0.08" />
      <circle cx="12" cy="15" r="2.5" strokeDasharray="2 1.5" />
      {/* Radiating aroma ripples */}
      <path d="M3.5 14a8.5 8.5 0 0 1 2-5" strokeOpacity="0.5" />
      <path d="M20.5 14a8.5 8.5 0 0 0-2-5" strokeOpacity="0.5" />
    </svg>
  );
}

// 4. Botanical Essence Sprig Icon
export function BotanicalSprigIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22C12 14 15 4 21 3" />
      <path d="M12 18c-3-1-5-3.5-5-6.5a6 6 0 0 1 5-2" fill="currentColor" fillOpacity="0.06" />
      <path d="M13.5 13c3-1 5-3.5 5-6.5a6 6 0 0 0-5-2" fill="currentColor" fillOpacity="0.06" />
      <path d="M12 13c-2.5-1-4-3-4-5.5a5 5 0 0 1 4-1.5" />
      <path d="M11 7c2-1 3.5-2.5 3.5-4.5" />
    </svg>
  );
}

// 5. Shield of Authenticity / Heritage Hallmark Icon
export function ShieldHeritageIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3L4 6.5v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10v-6L12 3z" />
      <path d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L7 10.5l3.5-.5L12 7z" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}

// 6. Velvet Courier / Luxury White-Glove Delivery Icon
export function VelvetCourierIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Luxury packaging box */}
      <rect x="3" y="7" width="18" height="14" rx="1.5" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="7" x2="12" y2="21" />
      {/* Silk Ribbon Bow */}
      <path d="M12 7c-1.5-2-3.5-3.5-4.5-2-1 1.5.5 3 4.5 2z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 7c1.5-2 3.5-3.5 4.5-2 1 1.5-.5 3-4.5 2z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

// 7. Celestial Star Facet Icon (Ratings & Prestige)
export function StarFacetIcon({ size = 24, filled = false, className = "", ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0.5" : "1.25"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 14.8 8.8 22 9.4 16.6 14.2 18.2 21.2 12 17.5 5.8 21.2 7.4 14.2 2 9.4 9.2 8.8 12 2" />
    </svg>
  );
}

// 8. Monocle / Luxury Magnifier
export function LuxurySearchIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="10.5" cy="10.5" r="7" />
      <line x1="15.5" y1="15.5" x2="21.5" y2="21.5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Lens reflection sparkle */}
      <path d="M8 8a3.5 3.5 0 0 1 5 0" strokeOpacity="0.5" />
    </svg>
  );
}

// 9. Luxury Boutique Shopper Bag
export function LuxuryBagIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 8.5L5.5 21h13L20 8.5H4z" />
      <path d="M8.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" />
      {/* Subtle ribbon fold */}
      <path d="M10 12h4" strokeOpacity="0.6" />
    </svg>
  );
}

// 10. Filigree Heart Talisman (Wishlist)
export function FiligreeHeartIcon({ size = 24, filled = false, className = "", ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0.5" : "1.25"}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      {!filled && (
        <path d="M12 7a2.5 2.5 0 0 0-2-1" strokeOpacity="0.5" />
      )}
    </svg>
  );
}

// 11. Olfactory Scales / Accord Comparison Icon
export function OlfactoryCompareIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M6 7l6-3 6 3" />
      <path d="M3 13l3-6 3 6c0 1.5-1.3 2.5-3 2.5S3 14.5 3 13z" fill="currentColor" fillOpacity="0.08" />
      <path d="M15 13l3-6 3 6c0 1.5-1.3 2.5-3 2.5s-3-1-3-2.5z" fill="currentColor" fillOpacity="0.08" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

// 12. Artisan Compass Rose (Global Rare Sourcing)
export function CompassRoseIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <polygon points="12 4 14 10 20 12 14 14 12 20 10 14 4 12 10 10 12 4" fill="currentColor" fillOpacity="0.1" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
