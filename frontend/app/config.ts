/**
 * API configuration for frontend-backend communication.
 * In production, use environment variables.
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://zapier-ccsr.onrender.com";
export const HOOKS_URL = process.env.NEXT_PUBLIC_HOOKS_URL || "http://localhost:3002";
