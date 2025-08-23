import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from "axios";

interface ImageSearchProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

interface UnsplashImage {
  id: string;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  description: string | null;
}

export function ImageSearch({ onImageSelect, currentImage }: ImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchImages = async () => {
    if (!searchQuery.trim()) return;    

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=12&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
      );
      setImages(response.data.results);
    } catch (error) {
      console.error("Error searching images:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for event images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchImages()}
        />
        <Button type="button" onClick={searchImages} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {currentImage && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Image:</p>
          <img
            src={currentImage}
            alt="Selected"
            className="h-32 w-48 object-cover rounded-lg border"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image: UnsplashImage) => (
          <Card
            key={image.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onImageSelect(image.urls.regular)}
          >
            <img
              src={image.urls.small}
              alt={image.alt_description || "image"}
              className="w-full h-32 object-cover rounded"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
