"use client";

import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const STORAGE_KEY = "domain-notice-dismissed";

export default function DomainChangeNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl p-6 text-sm text-gray-100">
        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📢</span>
          <h3 className="text-base font-semibold text-white">
            Domain &amp; Email Migration Notice
          </h3>
        </div>

        {/* Body */}
        <p className="text-gray-300 mb-3 leading-relaxed">
          Since <span className="font-semibold text-white">19 March 2026</span>, Carbonhub
          has transitioned to new domains as{" "}
          <code className="text-xs bg-gray-800 text-gray-200 rounded px-1 py-0.5">
            carbonhub.app
          </code>{" "}
          was not renewed:
        </p>

        <ul className="space-y-2 text-gray-300">
          <li>
            <span className="mr-1">🌐</span>
            <span className="font-semibold text-white">Website:</span>{" "}
            <a
              href="https://carbonhub.faizath.com"
              className="text-green-400 underline underline-offset-2 hover:text-green-300 transition-colors"
            >
              carbonhub.faizath.com
            </a>{" "}
            <span className="text-gray-500 text-xs">
              (formerly <em>carbonhub.app</em>)
            </span>
          </li>
          <li>
            <span className="mr-1">⚙️</span>
            <span className="font-semibold text-white">API:</span>{" "}
            <a
              href="https://carbonhub-api.faizath.com"
              className="text-green-400 underline underline-offset-2 hover:text-green-300 transition-colors"
            >
              carbonhub-api.faizath.com
            </a>{" "}
            <span className="text-gray-500 text-xs">
              (formerly <em>api.carbonhub.app</em>)
            </span>
          </li>
          <li>
            <span className="mr-1">📧</span>
            <span className="font-semibold text-white">Email:</span>{" "}
            <a
              href="mailto:contact@carbonhub.faizath.com"
              className="text-green-400 underline underline-offset-2 hover:text-green-300 transition-colors"
            >
              contact@carbonhub.faizath.com
            </a>{" "}
            <span className="text-gray-500 text-xs">
              (formerly <em>contact@carbonhub.app</em>)
            </span>
          </li>
          <li>
            <span className="mr-1">🛰️</span>
            <span className="font-semibold text-white">CDN:</span>{" "}
            <span className="text-gray-300">carbonhub-cdn.faizath.com</span>{" "}
            <span className="text-gray-500 text-xs">
              (formerly <em>cdn.carbonhub.app</em>)
            </span>
          </li>
          <li>
            <span className="mr-1">📈</span>
            <span className="font-semibold text-white">Status Pages:</span>{" "}
            <a
              href="https://status.faizath.com/status/carbonhub"
              className="text-green-400 underline underline-offset-2 hover:text-green-300 transition-colors"
            >
              status.faizath.com/status/carbonhub
            </a>{" "}
            <span className="text-gray-500 text-xs">
              (formerly <em>status.carbonhub.app</em>)
            </span>
          </li>
        </ul>

        <button
          onClick={dismiss}
          className="mt-5 w-full rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium py-2 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
