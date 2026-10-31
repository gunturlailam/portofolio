"use client";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <button
      onClick={() => switchLocale(locale === 'id' ? 'en' : 'id')}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/60 text-gray-600 transition-all hover:scale-110 hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
      aria-label="Switch language"
      title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">{locale === 'id' ? 'EN' : 'ID'}</span>
    </button>
  );
}
