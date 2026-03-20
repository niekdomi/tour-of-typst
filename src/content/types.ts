export interface LocaleMeta {
  locale: string;
  label: string;
}

export interface Chapter {
  key: string;
  title: string;
}

export interface Part {
  title: string;
  chapters: Chapter[];
}

export interface TourModule {
  meta: LocaleMeta;
  parts: Part[];
}
