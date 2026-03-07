import type { LocaleMeta, TourModule } from "./types";

const tourModules = import.meta.glob<TourModule>("../../content/*/tour.ts", { eager: true });

export const availableLocales: LocaleMeta[] = Object.values(tourModules).map((m) => m.meta);
