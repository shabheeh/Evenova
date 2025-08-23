"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  "Business & Professional",
  "Music & Entertainment",
  "Sports & Fitness",
  "Technology",
  "Arts & Culture",
  "Food & Drink",
  "Health & Wellness",
  "Education",
  "Community",
  "Travel & Outdoor",
];


interface EventsFiltersProps {
  selectedCategories: string[];
  priceRange: [number, number];
  onFiltersChange: (categories: string[], priceRange: [number, number]) => void;
}

export function EventsFilters({
  selectedCategories,
  priceRange,
  onFiltersChange,
}: EventsFiltersProps) {
  const [localSelectedCategories, setLocalSelectedCategories] =
    useState<string[]>(selectedCategories);
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(priceRange);

  useEffect(() => {
    onFiltersChange(localSelectedCategories, localPriceRange);
  }, [localSelectedCategories, localPriceRange]);

  const toggleCategory = (category: string) => {
    setLocalSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setLocalSelectedCategories([]);
    setLocalPriceRange([0, 500]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={localSelectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                value={localPriceRange}
                onValueChange={(value) =>
                  setLocalPriceRange(value as [number, number])
                }
                max={10000}
                step={100}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{localPriceRange[0]}</span>
                <span>₹{localPriceRange[1]}+</span>
              </div>
            </div>
          </div>

          {localSelectedCategories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {localSelectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category} ×
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
