/* =============================================================================
    Projet      : Fisheye
    Fichier     : logConfig.js
    Auteur      : Trackozor
    Description : Configuration avancée des logs.
============================================================================= */

import { ENVIRONMENTS } from "./constants.js";

export const LOG_LEVELS = Object.freeze({
  [ENVIRONMENTS.DEVELOPMENT]: {
    default: true,
    info: true,
    warn: true,
    error: true,
    success: true,
  },
  [ENVIRONMENTS.STAGING]: {
    default: true,
    info: true,
    warn: true,
    error: true,
    success: false,
  },
  [ENVIRONMENTS.PRODUCTION]: {
    default: true,
    info: false,
    warn: true,
    error: true,
    success: false,
  },
});

export const LOG_STYLES = Object.freeze({
  default: "color: #000000;",
  info: "color: #007BFF; font-weight: bold;",
  warn: "color: #FFA500; font-weight: bold;",
  error: "color: #FF0000; font-weight: bold;",
  success: "color: #28A745; font-weight: bold;",
});

export const LOG_ICONS = Object.freeze({
  default: "🔵",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
  success: "✅",
});
