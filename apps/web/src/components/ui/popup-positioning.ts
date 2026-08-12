/**
 * Base UI lets non-dropdown popups (popover, tooltip, hover card) fall back to
 * the perpendicular axis when neither the requested side nor its flip fits.
 * Radix only ever flipped and shifted along the requested axis, so opt out to
 * keep placements where the app expects them.
 */
export const STAY_ON_AXIS = { fallbackAxisSide: 'none' } as const;
