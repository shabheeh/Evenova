import { api } from "@/lib/api";
import type { FilterState } from "@/pages/EventsPage";
import type { CreateEventFormData } from "@/types/event.types";

export const createEvent = async (data: CreateEventFormData) => {
  try {
    const response = await api.post("/events", data);
    return response.data;
  } catch (error) {
    const err = error as Error;
    throw err;
  }
};

export const getEvents = async (
  query: FilterState,
  pagination: {skip: number, limit: number} = { skip: 0, limit: 6 }
) => {
  try {
    const params: Record<string, string | number> = {
      skip: pagination.skip,
      limit: pagination.limit,
    };

    if (query.searchQuery?.trim()) {
      params.searchQuery = query.searchQuery.trim();
    }

    if (query.location?.trim()) {
      params.location = query.location.trim();
    }

    if (query.selectedDate) {
      params.selectedDate = query.selectedDate.toISOString();
    }

    if (query.selectedCategories?.length > 0) {
      params.selectedCategories = query.selectedCategories.join(",");
    }

    if (query.priceRange) {
      params.priceRange = JSON.stringify(query.priceRange);
    }

    const response = await api.get("/events", { params });

    return response.data.data;
  } catch (error) {
    const err = error as Error;
    throw err;
  }
};

export const getEvent = async (id: string) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  } catch (error) {
    const err = error as Error;
    throw err;
  }
}