import React from 'react';

/**
 * GlobalTradeFlare
 * 
 * Minimal, ambient background graphic visible strictly in dark mode.
 * Represents global trade routes, maritime geodesics, and international trade nexus
 * originating from the Indian export corridor and radiating towards key enquiry touchpoints.
 * 
 * Engineered to:
 * 1. Stay strictly subtle (hairlines 0.05-0.18 opacity, deep ambient gold flare).
 * 2. Never interfere with text contrast or readability.
 * 3. Subconsciously direct the eye upward and diagonally toward the primary
 *    "Trade Enquiries" action hubs (Navbar CTA and Hero actions).
 * 4. Remain completely non-interactive (pointer-events-none).
 */
export const GlobalTradeFlare: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 hidden dark:block transition-opacity duration-700"
    >
      {/* ================================================================= */}
      {/* 1. PRIMARY AMBIENT GOLD FLARES (Diffused lighting directed at CTAs) */}
      {/* ================================================================= */}
      
      {/* Focal CTA Flare (Top-Right: illuminates the "Trade Enquiries" Navbar & commercial action zone) */}
      <div
        className="absolute -top-32 right-0 sm:right-10 w-[480px] h-[480px] lg:w-[680px] lg:h-[680px] rounded-full opacity-60 mix-blend-screen filter blur-[90px] lg:blur-[130px] animate-flare-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(198, 154, 69, 0.28) 0%, rgba(217, 182, 108, 0.12) 40%, rgba(17, 19, 24, 0) 75%)',
        }}
      />

      {/* Secondary Trade Origin Flare (Center-Left: India Export Hub origin) */}
      <div
        className="absolute top-[28%] -left-20 w-[420px] h-[420px] lg:w-[560px] lg:h-[560px] rounded-full opacity-40 mix-blend-screen filter blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(198, 154, 69, 0.18) 0%, rgba(198, 154, 69, 0.06) 50%, rgba(17, 19, 24, 0) 80%)',
        }}
      />

      {/* Deep Atmosphere Vignette Overlay (ensures content in center & text stays 100% crisp & readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-ink/40 to-brand-ink/90 pointer-events-none" />

      {/* ================================================================= */}
      {/* 2. MINIMAL VECTOR TRADE ARCS & GEODESIC NAVIGATION MESH           */}
      {/* ================================================================= */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-85"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle gold gradient for active route lines */}
          <linearGradient id="tradeRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C69A45" stopOpacity="0.08" />
            <stop offset="45%" stopColor="#C69A45" stopOpacity="0.32" />
            <stop offset="85%" stopColor="#D9B66C" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
          </linearGradient>

          {/* Secondary subtle transit gradient */}
          <linearGradient id="routeFaintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C69A45" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C69A45" stopOpacity="0.02" />
          </linearGradient>

          {/* Radial mask to fade out lines gently at viewport extremes */}
          <radialGradient id="vignetteMask" cx="55%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </radialGradient>

          <mask id="meshMask">
            <rect width="1600" height="1000" fill="url(#vignetteMask)" />
          </mask>
        </defs>

        <g mask="url(#meshMask)">
          {/* Concentric Trade Latitudes / Global Great Circles */}
          <ellipse
            cx="820"
            cy="520"
            rx="720"
            ry="290"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.75"
            strokeDasharray="3 9"
            strokeOpacity="0.12"
          />
          <ellipse
            cx="820"
            cy="520"
            rx="560"
            ry="210"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.75"
            strokeDasharray="2 12"
            strokeOpacity="0.09"
          />
          <ellipse
            cx="820"
            cy="520"
            rx="940"
            ry="380"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.6"
            strokeDasharray="4 16"
            strokeOpacity="0.07"
          />

          {/* Longitudinal Meridian Arch (Subtle global sphere curve) */}
          <path
            d="M 820 120 C 620 320, 620 720, 820 920"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.75"
            strokeDasharray="3 10"
            strokeOpacity="0.1"
          />
          <path
            d="M 820 120 C 1020 320, 1020 720, 820 920"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.75"
            strokeDasharray="3 10"
            strokeOpacity="0.1"
          />

          {/* ============================================================= */}
          {/* DIRECTIONAL TRADE ARCS (Sweeping towards the Enquiry Hub)      */}
          {/* ============================================================= */}

          {/* Primary Action Trajectory: India Hub (480, 520) -> Europe/Atlantic -> Apex Enquiry CTA (1380, 75) */}
          <path
            d="M 480 540 C 620 410, 1020 220, 1440 68"
            fill="none"
            stroke="url(#tradeRouteGrad)"
            strokeWidth="1.25"
            strokeDasharray="6 8"
            className="animate-trade-flow"
          />

          {/* Companion Guidance Arc 2: Reinforcing focus upward to header actions */}
          <path
            d="M 480 540 C 720 460, 1140 280, 1480 120"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.8"
            strokeDasharray="4 12"
            strokeOpacity="0.22"
          />

          {/* Secondary Route: East Asian Maritime Highway */}
          <path
            d="M 480 540 C 780 610, 1180 560, 1520 480"
            fill="none"
            stroke="url(#routeFaintGrad)"
            strokeWidth="0.75"
            strokeDasharray="3 9"
          />

          {/* Western Trans-Atlantic Trade Transit */}
          <path
            d="M 480 540 C 320 480, 160 380, 60 260"
            fill="none"
            stroke="url(#routeFaintGrad)"
            strokeWidth="0.75"
            strokeDasharray="2 8"
          />

          {/* Middle East & Gulf Strategic Corridor */}
          <path
            d="M 480 540 C 360 520, 290 510, 180 560"
            fill="none"
            stroke="#C69A45"
            strokeWidth="0.75"
            strokeDasharray="2 6"
            strokeOpacity="0.15"
          />

          {/* ============================================================= */}
          {/* TRADE NODES & FOCUS BEACONS                                   */}
          {/* ============================================================= */}

          {/* India Export Origin Hub (Mumbai / Western Seaboard Corridor) */}
          <g transform="translate(480, 540)">
            <circle r="3" fill="#C69A45" />
            <circle r="7" fill="none" stroke="#C69A45" strokeWidth="0.75" strokeOpacity="0.4" />
            <circle
              r="14"
              fill="none"
              stroke="#C69A45"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              strokeDasharray="2 4"
            />
            {/* Subtle Coordinates Tag */}
            <text
              x="12"
              y="4"
              fill="#C69A45"
              fillOpacity="0.45"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="0.15em"
            >
              ORIGIN · MUMBAI PORT (18.9°N)
            </text>
          </g>

          {/* Middle Transit Junction (Dubai / Jebel Ali Nexus) */}
          <g transform="translate(340, 505)">
            <circle r="2" fill="#C69A45" fillOpacity="0.6" />
            <circle r="5" fill="none" stroke="#C69A45" strokeWidth="0.5" strokeOpacity="0.25" />
          </g>

          {/* European Destination Node (Rotterdam) */}
          <g transform="translate(860, 275)">
            <circle r="2.5" fill="#C69A45" fillOpacity="0.7" />
            <circle r="6" fill="none" stroke="#C69A45" strokeWidth="0.5" strokeOpacity="0.3" />
            <text
              x="10"
              y="-4"
              fill="#C69A45"
              fillOpacity="0.35"
              fontSize="7.5"
              fontFamily="monospace"
              letterSpacing="0.12em"
            >
              HUB · ROTTERDAM
            </text>
          </g>

          {/* ENQUIRY TARGET BEACON (Top-Right: directly aligned under the Enquire CTA) */}
          <g transform="translate(1440, 68)">
            {/* Soft radiant focus ring */}
            <circle r="4" fill="#FFFFFF" fillOpacity="0.95" />
            <circle
              r="10"
              fill="none"
              stroke="#D9B66C"
              strokeWidth="1"
              strokeOpacity="0.7"
              className="animate-ping"
              style={{ animationDuration: '3.5s' }}
            />
            <circle
              r="18"
              fill="none"
              stroke="#C69A45"
              strokeWidth="0.75"
              strokeOpacity="0.35"
              strokeDasharray="2 4"
            />
            {/* Subtle indicator label pointing into the enquiry zone */}
            <text
              x="-14"
              y="-12"
              textAnchor="end"
              fill="#D9B66C"
              fillOpacity="0.6"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="0.18em"
            >
              GLOBAL ENQUIRY NEXUS ↗
            </text>
          </g>

          {/* Singapore / Southeast Asia Port */}
          <g transform="translate(980, 560)">
            <circle r="2" fill="#C69A45" fillOpacity="0.5" />
            <circle r="5" fill="none" stroke="#C69A45" strokeWidth="0.5" strokeOpacity="0.2" />
          </g>
        </g>
      </svg>

      {/* Very faint fine nautical alignment tick marks along bottom-right edge */}
      <div className="absolute bottom-6 right-8 text-[9px] font-mono tracking-[0.25em] text-brand-gold/25 hidden md:block">
        GLOBAL TRADE TRANSIT · SIWI EXPORT NETWORK
      </div>
    </div>
  );
};
