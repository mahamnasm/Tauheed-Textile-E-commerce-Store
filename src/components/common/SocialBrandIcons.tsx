import React from "react";

export function YouTubeBrandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="YouTube">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="white" />
    </svg>
  );
}

export function InstagramBrandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Instagram">
      <defs>
        <radialGradient id="igGradient" cx="20%" cy="110%" r="130%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="10%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="65%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igGradient)" />
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="white" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.6" />
      <circle cx="15.8" cy="8.2" r="0.9" fill="white" />
    </svg>
  );
}

export function FacebookBrandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Facebook">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.5 8.5H15V6H13C10.8 6 10 7.3 10 9.5V11H8V13.5H10V19H12.5V13.5H14.5L15 11H12.5V9.6C12.5 8.9 12.8 8.5 13.5 8.5Z"
        fill="white"
      />
    </svg>
  );
}

export function TikTokBrandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="TikTok">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M16.5 8.2C15.4 8.1 14.4 7.4 13.9 6.4V14.1C13.9 16.3 12.1 18 10 18C7.8 18 6 16.3 6 14.1C6 11.9 7.8 10.1 10 10.1C10.4 10.1 10.8 10.2 11.1 10.3V12.4C10.8 12.2 10.4 12.1 10 12.1C8.9 12.1 8 13 8 14.1C8 15.2 8.9 16.1 10 16.1C11.1 16.1 12 15.2 12 14.1V4H14.1C14.3 5.4 15.3 6.5 16.7 6.7L16.5 8.2Z"
        fill="white"
      />
    </svg>
  );
}

export function WhatsAppBrandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="WhatsApp">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 12C17.5 15.04 15.04 17.5 12 17.5C10.97 17.5 10 17.22 9.17 16.72L6.5 17.5L7.3 14.9C6.73 14.04 6.5 13.05 6.5 12C6.5 8.96 8.96 6.5 12 6.5C15.04 6.5 17.5 8.96 17.5 12ZM15.15 13.8C15.02 13.73 14.36 13.41 14.24 13.36C14.11 13.31 14.02 13.29 13.93 13.41C13.84 13.54 13.58 13.84 13.5 13.93C13.42 14.02 13.34 14.03 13.21 13.97C13.08 13.9 12.67 13.77 12.18 13.33C11.8 12.99 11.54 12.57 11.47 12.44C11.39 12.32 11.46 12.25 11.52 12.19C11.58 12.13 11.65 12.04 11.72 11.96C11.78 11.88 11.8 11.82 11.85 11.73C11.89 11.64 11.87 11.57 11.83 11.5C11.8 11.43 11.44 10.55 11.3 10.18C11.15 9.83 11.01 9.88 10.9 9.87C10.8 9.87 10.69 9.87 10.58 9.87C10.47 9.87 10.3 9.91 10.15 10.07C10 10.23 9.58 10.62 9.58 11.42C9.58 12.22 10.16 12.99 10.25 13.1C10.33 13.21 11.4 14.86 13.04 15.57C13.43 15.74 13.73 15.84 13.97 15.92C14.36 16.04 14.71 16.02 15 15.98C15.31 15.93 15.98 15.58 16.12 15.18C16.26 14.78 16.26 14.44 16.22 14.37C16.17 14.31 16.09 14.28 15.96 14.21L15.15 13.8Z"
        fill="white"
      />
    </svg>
  );
}
