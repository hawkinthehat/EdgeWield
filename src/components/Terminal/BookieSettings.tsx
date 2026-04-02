'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const ALL_BOOKS = [
  { id: 'fanduel', name: 'FanDuel', logo: '🔵' },
  { id: 'draftkings', name: 'DraftKings', logo: '👑' },
  { id: 'betmgm', name: 'BetMGM', logo: '🦁' },
  { id: 'caesars', name: 'Caesars', logo: '🏛️' },
  { id: 'betrivers', name: 'BetRivers', logo: '⚡' },
] as const;

type BookId = (typeof ALL_BOOKS)[number]['id'];

function normalizeBooks(books: string[] | null | undefined): BookId[] {
  if (!Array.isArray(books)) {
    return ['fanduel', 'draftkings', 'betmgm'];
  }

  const validIds = new Set<BookId>(ALL_BOOKS.map((book) => book.id));
  const normalized = books
    .map((book) => book.toLowerCase())
    .filter((book): book is BookId => validIds.has(book as BookId));

  return normalized.length > 0 ? Array.from(new Set(normalized)) : ['fanduel', 'draftkings', 'betmgm'];
}

async function updateBookiePreferences(selected: BookId[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return;
  }

  await supabase.from('profiles').update({ active_bookies: selected }).eq('id', user.id);
}

export default function BookieSettings({
  currentBooks,
  onChange,
}: {
  currentBooks: string[];
  onChange?: (books: string[]) => void;
}) {
  const initialSelection = useMemo(() => normalizeBooks(currentBooks), [currentBooks]);
  const [selected, setSelected] = useState<BookId[]>(initialSelection);

  useEffect(() => {
    setSelected(initialSelection);
  }, [initialSelection]);

  const toggleBook = (id: BookId) => {
    setSelected((prev) => {
      const nextSelection = prev.includes(id) ? prev.filter((book) => book !== id) : [...prev, id];
      const normalized = nextSelection.length > 0 ? nextSelection : prev;
      void updateBookiePreferences(normalized);
      onChange?.(normalized);
      return normalized;
    });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Your Active Bookies</h3>
      <div className="grid grid-cols-1 gap-2">
        {ALL_BOOKS.map((book) => (
          <button
            key={book.id}
            type="button"
            onClick={() => toggleBook(book.id)}
            className={`flex items-center justify-between rounded-2xl border p-3 transition-all ${
              selected.includes(book.id)
                ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{book.logo}</span>
              <span className="text-sm font-bold">{book.name}</span>
            </div>
            {selected.includes(book.id) ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <Circle size={18} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
