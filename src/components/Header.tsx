import { getTranslations } from "../../content/i18n";
import type { Locale } from "../../content/i18n";
import { availableLocales } from "../content";
import type { Chapter, Part } from "../content/types";
import { locale, setLocale } from "../lib/locale";
import TableOfContents from "./TableOfContents";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface LocaleOption {
  value: string;
  label: string;
}

interface Props {
  parts: Part[];
  chapters: Chapter[];
  currentIndex: number;
  contentFraction: number;
  onNavigate?: (index: number) => void;
  onResetAll?: () => void;
}

export default function Header(props: Props) {
  const t = () => getTranslations(locale());
  const localeOptions: LocaleOption[] = availableLocales.map(({ locale: l, label }) => ({
    value: l,
    label,
  }));

  const hasPrev = () => props.currentIndex > 0;
  const hasNext = () => props.currentIndex < props.chapters.length - 1;

  return (
    <header class="shrink-0 border-b border-border bg-background">
      <div class="flex h-14 items-center" style={{ "max-width": "1600px", margin: "0 auto" }}>
        <div class="flex min-w-0 items-center gap-4 pl-8" style={{ flex: props.contentFraction }}>
          <span class="flex shrink-0 items-baseline gap-1 font-serif text-xl font-bold text-brand">
            <span>Tour of</span>
            <a
              href="https://typst.app/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
            >
              typst
            </a>
          </span>

          {props.parts.length > 0 && (
            <>
              <span class="h-5 w-px shrink-0 bg-border" />
              <TableOfContents
                parts={props.parts}
                chapters={props.chapters}
                currentIndex={props.currentIndex}
                onNavigate={props.onNavigate}
              />
              <nav class="ml-auto flex shrink-0 gap-1" aria-label="Chapter navigation">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={!hasPrev()}
                  aria-label="Previous chapter"
                  onClick={() => props.onNavigate?.(props.currentIndex - 1)}
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={!hasNext()}
                  aria-label="Next chapter"
                  onClick={() => props.onNavigate?.(props.currentIndex + 1)}
                >
                  →
                </Button>
              </nav>
            </>
          )}
        </div>

        <div class="w-px" />

        <div
          class="flex items-center justify-end gap-3 pr-8"
          style={{ flex: 1 - props.contentFraction }}
        >
          <Button variant="ghost" size="sm" onClick={props.onResetAll}>
            Reset All
          </Button>

          <Select<LocaleOption>
            value={localeOptions.find((o) => o.value === locale())}
            onChange={(opt: LocaleOption | null) => {
              if (opt) setLocale(opt.value as Locale);
            }}
            options={localeOptions}
            optionValue="value"
            optionTextValue="label"
            aria-label={t().selectLanguage}
            itemComponent={(p) => <SelectItem item={p.item}>{p.item.rawValue.label}</SelectItem>}
          >
            <SelectTrigger size="sm" class="w-auto">
              <SelectValue<LocaleOption>>{(state) => state.selectedOption().label}</SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
