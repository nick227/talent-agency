import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { usePerformers } from '@talent/sdk';
import type { PerformerCategory } from '@/constants/categories';

export function useRosterData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { city } = useParams<{ city?: string }>();
  const navigate = useNavigate();

  const initialCategory = (searchParams.get('category') as PerformerCategory) || '';
  const locationParam = searchParams.get('location') || '';

  // Convert city slug (e.g., new-york) back to readable city name for filtering (title case)
  const cityName = city
    ? city
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';
  // Determine which location filter to use: query param takes precedence, otherwise use city from path
  const effectiveLocation = locationParam || cityName;

  const [category, setCategory] = useState<PerformerCategory | ''>(initialCategory);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Sync category changes to URL query (preserve path city)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as any)._searchDebounce);
    (window as any)._searchDebounce = setTimeout(() => setDebouncedSearch(val), 350);
  };

  // Main performer list (filtered)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePerformers({
    category: category || undefined,
    location: effectiveLocation || undefined,
    q: debouncedSearch || undefined,
    limit: 24,
  });

  const performers = data?.pages.flatMap((p) => p.data) ?? [];

  // Unfiltered performer list to derive available cities via the SDK client
  const { data: allPerformersData, isLoading: citiesLoading } = usePerformers({
    limit: 50,
  });

  const cities = useMemo(() => {
    const all = allPerformersData?.pages.flatMap((p) => p.data) ?? [];
    const citySet = new Set<string>(
      all
        .map((p) => p.location?.split(',')[0].trim())
        .filter((loc): loc is string => Boolean(loc))
    );
    return Array.from(citySet);
  }, [allPerformersData]);

  const handleCityChange = (selected: string) => {
    const params = new URLSearchParams(searchParams);
    if (selected) {
      params.set('location', selected);
      const slug = selected.toLowerCase().replace(/\s+/g, '-');
      navigate(`/${slug}?${params.toString()}`, { replace: true });
    } else {
      params.delete('location');
      const query = params.toString();
      navigate(query ? `/?${query}` : '/', { replace: true });
    }
  };

  const clearFilters = () => {
    setCategory('');
    setSearch('');
    setDebouncedSearch('');
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('location');
    setSearchParams(params);
    if (city) navigate('/', { replace: true });
  };

  // If a city is in the path but no results, fallback to home (no city)
  useEffect(() => {
    if (city && !isLoading && performers.length === 0) {
      navigate('/', { replace: true });
    }
  }, [city, isLoading, performers.length, navigate]);

  return {
    category,
    setCategory,
    search,
    handleSearch,
    performers,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    cities,
    citiesLoading,
    handleCityChange,
    effectiveLocation,
    clearFilters,
    debouncedSearch,
  };
}
