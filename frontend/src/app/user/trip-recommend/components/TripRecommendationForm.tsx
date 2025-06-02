"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { TRIP_TYPES, ACTIVITIES } from "../constants";

interface Recommendation {
  Place: string;
  Type: string;
  Budget: string;
  Season: string;
  Activities?: string;
  State: string;
  Country: string;
  Score: number;
  imageUrl?: string | null;
}

interface FormData {
  trip_type: string;
  budget: string;
  season: string;
  activities: string[];
  state: string;
  country: string;
}

interface SubmissionData extends Omit<FormData, "activities"> {
  activities: string | string[];
}

export default function TripRecommendation() {
  const [formData, setFormData] = useState<FormData>({
    trip_type: "",
    budget: "",
    season: "",
    activities: [],
    state: "",
    country: "",
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add explicit types for suggestions
  const [suggestions, setSuggestions] = useState<{
    trip_type: string[];
    activities: string[];
  }>({
    trip_type: [],
    activities: [],
  });

  const [showSuggestions, setShowSuggestions] = useState({
    trip_type: false,
    activities: false,
  });

  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [activityInput, setActivityInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For all fields except activities
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle suggestions for trip_type
    if (name === "trip_type") {
      const tripTypeSuggestions = TRIP_TYPES.filter((type) =>
        type.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions((prev) => ({
        ...prev,
        trip_type: tripTypeSuggestions,
      }));
      setShowSuggestions((prev) => ({
        ...prev,
        trip_type: true,
      }));
    }
  };

  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setActivityInput(value);

    if (value) {
      const activitySuggestions = ACTIVITIES.filter(
        (activity) =>
          activity.toLowerCase().includes(value.toLowerCase()) &&
          !formData.activities.includes(activity)
      );
      setSuggestions((prev) => ({ ...prev, activities: activitySuggestions }));
      setShowSuggestions((prev) => ({ ...prev, activities: true }));
    } else {
      setShowSuggestions((prev) => ({ ...prev, activities: false }));
    }
  };

  const handleSuggestionClick = (field: string, value: string) => {
    if (field === "activities") {
      if (!formData.activities.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          activities: [...prev.activities, value],
        }));
        setActivityInput("");
      }
      setShowSuggestions((prev) => ({
        ...prev,
        activities: false,
      }));
    } else {
      // For other fields, replace the value
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setShowSuggestions((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions({
        trip_type: false,
        activities: false,
      });
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const validateInput = (data: FormData) => {
    // Check if all empty
    const allEmpty = Object.values(data).every(
      (value) => !String(value).trim()
    );
    if (allEmpty) {
      toast.error("Please fill out at least one field.");
      return false;
    }

    // Check special characters only fields
    const invalidField = Object.entries(data).some(([key, val]) => {
      if (!String(val).trim()) return false;
      return !/[a-zA-Z0-9]/.test(String(val));
    });

    if (invalidField) {
      toast.error("Please enter valid characters in the fields.");
      return false;
    }
    return true;
  };

  const fetchImageFromGoogle = async (placeName: string | number) => {
    // Check if we already have this image in cache
    if (imageCache[placeName]) {
      return imageCache[placeName];
    }

    try {
      const searchQuery = `${placeName} travel destination`;
      const url = `https://www.googleapis.com/customsearch/v1?key=${
        process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      }&cx=${
        process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID
      }&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const imageUrl = data.items[0].link;
        // Save to cache
        setImageCache((prev) => ({
          ...prev,
          [placeName]: imageUrl,
        }));
        return imageUrl;
      }

      // If no image found, return null to use fallback
      return null;
    } catch (error) {
      console.error("Error fetching image from Google:", error);
      return null;
    }
  };

  const getPlaceholderImage = (placeName: string): string => {
    return "https://images.unsplash.com/photo-1499591934245-40b55745b905?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJpcHxlbnwwfHwwfHx8MA%3D%3D";
  };

  const handleImageError = (placeName: string): void => {
    setImageErrors((prev) => ({
      ...prev,
      [placeName]: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendations([]);

    // Create a copy of form data for submission
    const submissionData: SubmissionData = {
      ...formData,
      activities: formData.activities,
    };

    if (!validateInput(formData)) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://prithwi-trip-recommendation-model.hf.space/recommend",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const recs = await res.json();

      if (!Array.isArray(recs) || recs.length === 0) {
        toast("No recommendations found. Try different criteria.", {
          icon: "🛫",
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        });
        setIsLoading(false);
        return;
      }

      // Fetch images for each recommendation
      const recsWithImages = await Promise.all(
        recs.map(async (rec) => {
          const imageUrl = await fetchImageFromGoogle(rec.Place);
          return {
            ...rec,
            imageUrl: imageUrl || null,
          };
        })
      );

      toast.success(`${recs.length} recommendations found!`, {
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });

      setRecommendations(recsWithImages);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Error: ${errorMessage}`, {
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      });
    } finally {
      setFormData((prev) => ({
        ...prev,
        activities: [],
      }));
      setActivityInput("");
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes moveBackground {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .gradient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: linear-gradient(
            45deg,
            hsl(var(--primary) / 0.1),
            hsl(var(--secondary) / 0.1),
            hsl(var(--accent) / 0.1),
            hsl(var(--primary) / 0.1)
          );
          background-size: 400% 400%;
          animation: moveBackground 15s ease infinite;
          opacity: 0.5;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .recommendation-card {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .recommendation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .suggestions-container {
          position: absolute;
          background: hsl(var(--background) / 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
          width: calc(100% - 8rem); /* Adjust width to match input */
          z-index: 50;
          margin-top: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          left: 8rem; /* Align with input */
        }

        .suggestion-item {
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          color: hsl(var(--foreground));
        }

        .suggestion-item:hover {
          background-color: hsl(var(--primary) / 0.1);
        }
      `}</style>

      <div className="gradient-bg"></div>
      <div className="container mx-auto px-4 py-8 min-h-screen mt-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">
          Discover Your Perfect Trip
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Form */}
          <div className="w-full lg:w-1/2">
            <form
              id="tripForm"
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg space-y-6"
            >
              <div className="space-y-4">
                {/* Trip Type Field */}
                <div className="flex items-center space-x-4 relative">
                  <label
                    htmlFor="trip_type"
                    className="w-32 text-lg font-medium text-primary"
                  >
                    Trip Type
                  </label>
                  <input
                    type="text"
                    id="trip_type"
                    name="trip_type"
                    value={formData.trip_type}
                    onChange={handleChange}
                    className="flex-1 p-3 text-black dark:text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter trip type..."
                  />
                  {showSuggestions.trip_type &&
                    suggestions.trip_type.length > 0 && (
                      <div className="suggestions-container">
                        {suggestions.trip_type.map((type, index) => (
                          <div
                            key={index}
                            className="suggestion-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuggestionClick("trip_type", type);
                            }}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Activities Field */}
                <div className="flex items-start space-x-4">
                  <label className="w-32 text-lg font-medium text-primary pt-3">
                    Activities
                  </label>
                  <div className="flex-1 space-y-2">
                    {/* Selected activities chips */}
                    <div className="flex flex-wrap gap-2">
                      {formData.activities.map((activity) => (
                        <div
                          key={activity}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                        >
                          {activity}
                          <button
                            type="button"
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                activities: prev.activities.filter(
                                  (a) => a !== activity
                                ),
                              }));
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Activity input with suggestions */}
                    <div className="relative">
                      <input
                        type="text"
                        value={activityInput}
                        onChange={handleActivityInputChange}
                        placeholder="Type activity and select from suggestions"
                        className="w-full p-3 text-black dark:text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {showSuggestions.activities &&
                        suggestions.activities.length > 0 && (
                          <div className="suggestions-container">
                            {suggestions.activities.map((activity, index) => (
                              <div
                                key={index}
                                className="suggestion-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSuggestionClick("activities", activity);
                                }}
                              >
                                {activity}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {[
                  {
                    id: "budget" as keyof FormData,
                    label: "Budget",
                    placeholder: "e.g., Low, Medium, High",
                  },
                  {
                    id: "season" as keyof FormData,
                    label: "Season",
                    placeholder: "e.g., Jun-May, All, Oct-Dec",
                  },
                  {
                    id: "state" as keyof FormData,
                    label: "State",
                    placeholder: "e.g., California",
                  },
                  {
                    id: "country" as keyof FormData,
                    label: "Country",
                    placeholder: "e.g., USA",
                  },
                ].map(({ id, label, placeholder }) => (
                  <div key={id} className="flex items-center space-x-4">
                    <label
                      htmlFor={id}
                      className="w-32 text-lg font-medium text-primary"
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="flex-1 p-3 text-black dark:text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-secondary text-primary-foreground font-semibold rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Get Recommendations"}
              </button>
            </form>
          </div>

          {/* Right side - Recommendations */}
          <div className="w-full lg:w-1/2">
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-primary">
                  Your Recommendations
                </h2>
                <div className="space-y-4">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="relative recommendation-card bg-card p-4 rounded-xl shadow-lg border border-border transition-all hover:shadow-xl min-h-[220px]"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/3">
                          <div className="relative h-40 w-full rounded-lg overflow-hidden">
                            <Image
                              src={
                                imageErrors[rec.Place]
                                  ? "https://images.unsplash.com/photo-1499591934245-40b55745b905?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJpcHxlbnwwfHwwfHx8MA%3D%3D"
                                  : rec.imageUrl ||
                                    getPlaceholderImage(rec.Place)
                              }
                              alt={rec.Place}
                              fill
                              className="object-cover"
                              unoptimized
                              onError={() => handleImageError(rec.Place)}
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-2">
                          <h3 className="text-xl font-bold text-primary">
                            {rec.Place}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/80 text-accent-foreground">
                              {rec.Type}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/80 text-accent-foreground">
                              {rec.Budget}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/80 text-primary-foreground">
                              {rec.Season}
                            </span>
                          </div>
                          {rec.Activities && (
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Activities: {rec.Activities}
                              </p>
                            </div>
                          )}
                          <p className="text-sm">
                            <span className="font-medium">Location:</span>{" "}
                            {rec.State}, {rec.Country}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm font-medium mr-2">
                              Rating:
                            </span>
                            {renderStarRating(rec.Score * 100)}
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                rec.Place
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
                            >
                              View on Map
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card p-8 rounded-xl shadow-lg border border-border flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-muted-foreground mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-muted-foreground mb-2">
                  {isLoading
                    ? "Finding perfect trips..."
                    : "Your trip recommendations will appear here"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill out the form and click "Get Recommendations" to discover
                  amazing destinations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const renderStarRating = (percentage: number): JSX.Element => {
  const maxStars = 5;
  const starPercentage = (percentage / 100) * maxStars;
  const fullStars = Math.floor(starPercentage);
  const hasHalfStar = starPercentage % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, i) => {
        if (i < fullStars) {
          return (
            <svg
              key={i}
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <svg
              key={i}
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <path
                fill="url(#half-star)"
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        } else {
          return (
            <svg
              key={i}
              className="w-4 h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        }
      })}
      {/* <span className="ml-1 text-sm text-gray-600">
        ({Math.round(percentage)}%)
      </span> */}
    </div>
  );
};
