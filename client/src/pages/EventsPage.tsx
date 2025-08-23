import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventsSearch } from "@/components/common/EventsSearch";
import { EventsGrid } from "@/components/common/EventsGrid";
import { EventsFilters } from "@/components/common/EventFilters";
import { getEvents } from "@/services/eventService";

export interface FilterState {
  searchQuery: string;
  location: string;
  selectedDate: Date | undefined;
  selectedCategories: string[];
  priceRange: [number, number];
}

export default function EventsPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    location: "",
    selectedDate: undefined,
    selectedCategories: [],
    priceRange: [0, 10000],
  });

  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 6
  });

  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["events", filters, pagination],
    queryFn: () => getEvents(filters, pagination),
    staleTime: 5 * 60 * 1000,
    enabled: true,
    retry: 3,
  });

  const events = data?.events || [];
  const totalCount = data?.total || 0;
  const hasMore = data?.hasMore || false;

  const updateSearchFilters = (
    searchQuery: string,
    location: string,
    selectedDate: Date | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery,
      location,
      selectedDate,
    }));
    setPagination({ skip: 0, limit: 6 });
  };

  const updateCategoryFilters = (
    selectedCategories: string[],
    priceRange: [number, number]
  ) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories,
      priceRange,
    }));
  };

  const loadMoreEvents = () => {
    if (hasMore && !isLoading) {
      setPagination(prev => ({
        ...prev,
        skip: prev.skip + prev.limit
      }));
    }
  };

  if (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Discover Events
          </h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect event for you
          </p>
        </div>

        <EventsSearch
          searchQuery={filters.searchQuery}
          location={filters.location}
          selectedDate={filters.selectedDate}
          onFiltersChange={updateSearchFilters}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <aside className="lg:w-64 flex-shrink-0">
            <EventsFilters
              selectedCategories={filters.selectedCategories}
              priceRange={filters.priceRange}
              onFiltersChange={updateCategoryFilters}
            />
          </aside>

          <div className="flex-1">
            <EventsGrid
              events={events}
              loading={isLoading || isFetching}
              error={error as Error}
              onRefresh={refetch}
              onLoadMore={loadMoreEvents}
              hasMore={hasMore}
              totalCount={totalCount}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
