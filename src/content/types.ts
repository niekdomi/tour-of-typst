export interface LocaleMeta {
  locale: string;
  label: string;
}

export interface Chapter {
  key: string;
  title: string;
}

export interface TourModule {
  meta: LocaleMeta;
  chapters: Chapter[];
}
