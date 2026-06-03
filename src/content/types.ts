export interface LocaleMeta {
  locale: string;
  label: string;
}

export interface Chapter {
  readonly key: string;
  readonly title: string;
}

export interface Part {
  readonly title: string;
  readonly chapters: readonly Chapter[];
}

export interface TourModule {
  meta: LocaleMeta;
  readonly parts: readonly Part[];
}
