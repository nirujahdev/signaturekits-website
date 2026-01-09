'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
      <Input
        type="text"
        placeholder="Search jerseys..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 border-0 border-b-2 border-transparent bg-transparent focus:border-current focus:outline-none focus:ring-0 rounded-none"
      />
    </form>
  );
}

