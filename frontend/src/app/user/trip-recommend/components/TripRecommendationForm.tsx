"use client";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { TRIP_TYPES, ACTIVITIES } from "../constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Plane,
  X,
  Compass,
  MapPinned,
  Loader2,
  BadgeInfo,
} from "lucide-react";

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
  seasonFrom: string;
  seasonTo: string;
  activities: string[];
  state: string;
  country: string;
}

interface SubmissionData
  extends Omit<FormData, "activities" | "seasonFrom" | "seasonTo"> {
  activities: string | string[];
  season: string;
}

export default function TripRecommendation() {
  const [formData, setFormData] = useState<FormData>({
    trip_type: "",
    budget: "",
    seasonFrom: "",
    seasonTo: "",
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
  const [activeTab, setActiveTab] = useState<string>("form");

  // For UI enhancements
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [showTipText, setShowTipText] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For all fields except activities
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormIsDirty(true);

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
        setFormIsDirty(true);
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
      setFormIsDirty(true);
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
      (value) =>
        value === null ||
        value === undefined ||
        (typeof value === "string" && !value.trim()) ||
        (Array.isArray(value) && value.length === 0)
    );
    if (allEmpty) {
      toast.error("Please fill out at least one field.");
      return false;
    }

    // Check that if one season field is filled, both should be filled
    if (
      (data.seasonFrom && !data.seasonTo) ||
      (!data.seasonFrom && data.seasonTo)
    ) {
      toast.error("Please select both From and To months for the season.");
      return false;
    }

    // Check special characters only fields
    const invalidField = Object.entries(data).some(([key, val]) => {
      if (key === "activities" || !String(val).trim()) return false;
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
      // Return null to use fallback
      return null;
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!validateInput(formData)) return;

      setIsLoading(true);
      setActiveTab("results"); // Format the season range (e.g., "jan-oct")
      let seasonString = "";
      if (formData.seasonFrom && formData.seasonTo) {
        seasonString = `${formData.seasonFrom.toLowerCase()}-${formData.seasonTo.toLowerCase()}`;
      } else if (formData.seasonFrom) {
        seasonString = formData.seasonFrom.toLowerCase();
      }

      // Create a submission data object
      const submissionData: SubmissionData = {
        trip_type: formData.trip_type,
        budget: formData.budget,
        season: seasonString, // Send the formatted season string
        activities: formData.activities.length
          ? formData.activities.join(",")
          : "",
        state: formData.state,
        country: formData.country,
      };

      // Filter out empty fields
      const filteredData: Partial<SubmissionData> = Object.fromEntries(
        Object.entries(submissionData).filter(([_, value]) => value !== "")
      );

      // Make API call to Hugging Face Space API endpoint
      const response = await fetch(
        "https://prithwi-trip-recommendation-model.hf.space/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredData),
        }
      );

      // Check response
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (Array.isArray(result) && result.length) {
        // Add fetching images in parallel
        const recommendationsWithImages = await Promise.all(
          result.map(async (rec) => {
            try {
              const imageUrl = await fetchImageFromGoogle(rec.Place);
              return { ...rec, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for place:",
                rec.Place,
                error
              );
              return { ...rec, imageUrl: null };
            }
          })
        );

        setRecommendations(recommendationsWithImages);
      } else {
        setRecommendations([]);
        toast.error("No recommendations found with the given criteria.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while fetching recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeActivity = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a !== activity),
    }));
    setFormIsDirty(true);
  };
  const handleImageError = (placeName: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [placeName]: true,
    }));
    console.log(`Image error for ${placeName}, using fallback`);
  };

  const handleClearForm = () => {
    setFormData({
      trip_type: "",
      budget: "",
      seasonFrom: "",
      seasonTo: "",
      activities: [],
      state: "",
      country: "",
    });
    setActivityInput("");
    setFormIsDirty(false);
  };

  // Memoized value to avoid unnecessary rerenders
  const formIsEmpty = useMemo(() => {
    return Object.values(formData).every((value) => {
      return Array.isArray(value) ? value.length === 0 : !value;
    });
  }, [formData]);

  // Months for season selection
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const budgetOptions = ["low", "medium", "high", "luxury"];

  return (
    <>
      <Card className="border-border shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-muted/40 px-4">
            <TabsList className="w-full justify-start h-14 bg-transparent border-b border-border rounded-none gap-2">
              <TabsTrigger
                value="form"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 relative"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
                {formIsDirty && activeTab !== "form" && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4"
                disabled={recommendations.length === 0 && !isLoading}
              >
                <Compass className="w-4 h-4 mr-2" />
                Recommendations
                {recommendations.length > 0 && (
                  <span className="ml-2 text-xs font-medium bg-primary/20 text-primary rounded-full px-2">
                    {recommendations.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="form" className="mt-0 p-0">
            <form onSubmit={handleSubmit} className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                <div className="md:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label
                        htmlFor="trip_type"
                        className="text-sm font-medium flex items-center"
                      >
                        Trip Type
                        <BadgeInfo
                          className="w-4 h-4 ml-1 text-muted-foreground cursor-help"
                          onMouseEnter={() => setShowTipText(true)}
                          onMouseLeave={() => setShowTipText(false)}
                        />
                      </Label>
                      {showTipText && (
                        <div className="text-xs text-muted-foreground animate-in fade-in">
                          E.g. beach, historical, wildlife
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <div className="flex items-center border border-input rounded-md focus-within:ring-1 focus-within:ring-ring">
                        <Plane className="ml-3 h-4 w-4 text-muted-foreground" />{" "}
                        <Input
                          id="trip_type"
                          name="trip_type"
                          value={formData.trip_type}
                          onChange={handleChange}
                          placeholder="What kind of place do you want to visit?"
                          autoComplete="off"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>{" "}
                      {showSuggestions.trip_type && (
                        <div className="absolute left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-popover border border-border rounded-md shadow-md z-10">
                          {suggestions.trip_type.length > 0 ? (
                            suggestions.trip_type.map((suggestion) => (
                              <div
                                key={suggestion}
                                onClick={() =>
                                  handleSuggestionClick("trip_type", suggestion)
                                }
                                className="p-2 hover:bg-muted cursor-pointer text-sm capitalize"
                              >
                                {suggestion.replace(/_/g, " ")}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground italic">
                              No matching trip types found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium">
                      Budget Preference
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {" "}
                      {budgetOptions.map((budget) => (
                        <Button
                          key={budget}
                          type="button"
                          variant={
                            formData.budget === budget ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              budget: prev.budget === budget ? "" : budget,
                            }))
                          }
                          className={`transition-all ${
                            formData.budget !== budget
                              ? "hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-900 dark:hover:text-amber-300 dark:hover:border-amber-800"
                              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-secondary"
                          }`}
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                          {budget}
                        </Button>
                      ))}
                    </div>
                  </div>{" "}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Travel Season (Months)
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="seasonFrom"
                          className="text-xs text-muted-foreground"
                        >
                          From
                        </Label>
                        <Select
                          value={formData.seasonFrom}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              seasonFrom: value,
                              // Reset seasonTo if it's before seasonFrom
                              seasonTo:
                                prev.seasonTo &&
                                months.indexOf(value) >
                                  months.indexOf(prev.seasonTo)
                                  ? value
                                  : prev.seasonTo,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Start month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-2 text-amber-500" />
                                  {month}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="seasonTo"
                          className="text-xs text-muted-foreground"
                        >
                          To
                        </Label>
                        <Select
                          value={formData.seasonTo}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              seasonTo: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="End month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months
                              .filter(
                                (month) =>
                                  !formData.seasonFrom ||
                                  months.indexOf(month) >=
                                    months.indexOf(formData.seasonFrom)
                              )
                              .map((month) => (
                                <SelectItem key={month} value={month}>
                                  <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-2 text-amber-500" />
                                    {month}
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="activities" className="text-sm font-medium">
                      Activities
                    </Label>
                    <div className="relative">
                      {" "}
                      <Input
                        id="activities"
                        value={activityInput}
                        onChange={handleActivityInputChange}
                        placeholder="What activities are you interested in?"
                        autoComplete="off"
                      />{" "}
                      {showSuggestions.activities && (
                        <div className="absolute left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-popover border border-border rounded-md shadow-md z-10">
                          {suggestions.activities.length > 0 ? (
                            suggestions.activities.map((suggestion) => (
                              <div
                                key={suggestion}
                                onClick={() =>
                                  handleSuggestionClick(
                                    "activities",
                                    suggestion
                                  )
                                }
                                className="p-2 hover:bg-muted cursor-pointer text-sm"
                              >
                                {suggestion}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground italic">
                              No matching activities found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {formData.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {" "}
                        {formData.activities.map((activity, index) => {
                          // Create a rotating set of color classes for variety
                          const colorClasses = [
                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
                            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
                            "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
                          ];
                          const colorIndex = index % colorClasses.length;

                          return (
                            <Badge
                              key={activity}
                              variant="outline"
                              className={`flex items-center gap-1 py-1 px-2 border-0 ${colorClasses[colorIndex]}`}
                            >
                              {activity}
                              <X
                                className="h-3.5 w-3.5 cursor-pointer hover:text-destructive"
                                onClick={() => removeActivity(activity)}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State
                      </Label>
                      <div className="relative">
                        <div className="flex items-center border border-input rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <MapPin className="ml-3 h-4 w-4 text-muted-foreground" />{" "}
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State name"
                            autoComplete="off"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country
                      </Label>
                      <div className="relative">
                        <div className="flex items-center border border-input rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <MapPinned className="ml-3 h-4 w-4 text-muted-foreground" />{" "}
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country name"
                            autoComplete="off"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearForm}
                  disabled={formIsEmpty}
                >
                  Reset Form
                </Button>

                <Button
                  type="submit"
                  className="gap-2"
                  disabled={formIsEmpty || isLoading}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Finding Trips..." : "Get Recommendations"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            {recommendations.length > 0 ? (
              <div className="space-y-2 p-6">
                {" "}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center">
                      <Compass className="w-5 h-5 mr-2 text-primary" />
                      {recommendations.length} Destinations Found
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore these personalized recommendations based on your
                      preferences
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("form")}
                    className="gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Refine Search
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recommendations.map((rec, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden border-muted transition-all hover:shadow-lg group relative"
                    >
                      <div className="relative">
                        <div className="relative h-56 w-full overflow-hidden bg-muted">
                          {" "}
                          {rec.imageUrl && !imageErrors[rec.Place] ? (
                            <>
                              <Image
                                src={rec.imageUrl}
                                alt={`Image of ${rec.Place}`}
                                fill
                                unoptimized={true}
                                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                onError={() => handleImageError(rec.Place)}
                              />
                              {/* Overlay effect on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:from-black/80 transition-opacity duration-300"></div>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                            </>
                          ) : (
                            <>
                              {/* Simple elegant placeholder */}
                              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <div className="text-center">
                                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Image not available
                                  </p>
                                </div>
                              </div>
                            </>
                          )}{" "}
                          <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                            <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-md inline-block">
                              <h3 className="font-semibold text-lg text-white line-clamp-1 drop-shadow-sm">
                                {rec.Place}
                              </h3>
                              <p className="text-white/90 text-sm drop-shadow-sm flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-primary" />
                                {rec.State}, {rec.Country}
                              </p>
                            </div>
                          </div>
                        </div>{" "}
                        {rec.Type && (
                          <div className="absolute top-3 left-3 z-10">
                            <Badge
                              variant="secondary"
                              className="capitalize bg-white/90 dark:bg-gray-800/90 text-primary border border-primary/20 shadow-md font-medium px-3 py-1 backdrop-blur-sm"
                            >
                              {rec.Type.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        )}{" "}
                        {rec.Score && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-md px-2 py-1.5 backdrop-blur-sm"
                            >
                              {renderStarRating(rec.Score * 100)}
                            </Badge>
                          </div>
                        )}
                        {/* Interactive icon for view on map - appears on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              rec.Place
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary/80 hover:bg-primary text-white rounded-full p-3 transform hover:scale-110 transition-all duration-300"
                          >
                            <MapPin className="h-5 w-5" />
                          </a>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {rec.Budget && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 bg-background/90 shadow-sm"
                            >
                              <DollarSign className="h-3 w-3 mr-1 text-primary" />
                              {rec.Budget}
                            </Badge>
                          )}
                          {rec.Season && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 bg-background/90 shadow-sm"
                            >
                              <Calendar className="h-3 w-3 mr-1 text-primary" />
                              {rec.Season}
                            </Badge>
                          )}
                        </div>{" "}
                        {rec.Activities && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                              <BadgeInfo className="h-3.5 w-3.5 mr-1.5" />
                              Suggested Activities
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {" "}
                              {rec.Activities.split(",").map((activity, i) => {
                                // Create a rotating set of color classes for variety
                                const colorClasses = [
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                                  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
                                  "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
                                  "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
                                ];
                                const colorIndex = i % colorClasses.length;

                                return (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className={`text-xs border-0 ${colorClasses[colorIndex]} shadow-sm transition-transform hover:scale-105`}
                                  >
                                    {activity.trim()}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {/* Moved the View on Map link to the overlay button */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                {isLoading ? (
                  <div className="space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                    <h3 className="text-lg font-medium">
                      Finding your perfect destinations...
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      We're searching for the best matches based on your
                      preferences.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-full p-4 mx-auto">
                      <Compass className="h-10 w-10 text-muted-foreground/70" />
                    </div>
                    <h3 className="text-xl font-medium">
                      No recommendations yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Fill out the form with your travel preferences and click
                      "Get Recommendations" to discover amazing destinations.
                    </p>
                    <Button onClick={() => setActiveTab("form")}>
                      Start Searching
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}

const renderStarRating = (percentage: number): JSX.Element => {
  const maxStars = 5;
  const starPercentage = (percentage / 100) * maxStars;
  const fullStars = Math.floor(starPercentage);
  const hasHalfStar = starPercentage % 1 >= 0.5;

  // Display the score as a number along with stars
  const score = (percentage / 20).toFixed(1); // Convert to 5-point scale

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(maxStars)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-amber-500 drop-shadow-sm"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-amber-500 drop-shadow-sm"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id={`half-star-${i}`}
                    x1="0"
                    x2="100%"
                    y1="0"
                    y2="0"
                  >
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#D1D5DB" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-star-${i})`}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            );
          } else {
            return (
              <svg
                key={i}
                className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          }
        })}
      </div>
      <span className="text-xs font-semibold">{score}</span>
    </div>
  );
};
