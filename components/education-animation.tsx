import React from "react";

export default function EducationAnimation({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden
    >
      <svg
        width="420"
        height="300"
        viewBox="0 0 420 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient + Glow Filter */}
          <linearGradient id="grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== Soft Floating Gradient Orbs ===== */}
        <circle cx="210" cy="150" r="130" fill="url(#grad)" opacity="0.06" />
        <circle cx="100" cy="80" r="70" fill="#7C3AED" opacity="0.05">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,10;0,0"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="310" cy="220" r="90" fill="#06B6D4" opacity="0.05">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-10;0,0"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ===== Center Educational Book (Symbolic) ===== */}
        <g transform="translate(140,120)">
          <path
            d="M0 60 C35 20 125 20 160 60 L160 80 C125 120 35 120 0 80 Z"
            fill="#0f1724"
          />
          <path
            d="M8 62 C38 34 88 34 118 62 L118 78 C88 106 38 106 8 78 Z"
            fill="#ffffff"
          />
          <path
            d="M28 70 L110 70"
            stroke="#e6e6e6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Subtle floating motion */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="140,120;140,115;140,120"
            dur="6s"
            repeatCount="indefinite"
          />
        </g>

        {/* ===== Decorative Orbit Path ===== */}
        <circle
          cx="210"
          cy="150"
          r="110"
          stroke="url(#grad)"
          strokeWidth="0.8"
          strokeOpacity="0.25"
          fill="none"
        />
      </svg>
    </div>
  );
}
