"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  Upload,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";

interface ProfileData {
  guideName: string;
  guideEmail: string;
  contactNumber: string;
  description: string;
  profileImage: string | File;
  totalPackages: number;
  joinDate: string;
  createdAt?: string;
}
interface EditData {
  guideName?: string;
  contactNumber?: string;
  description?: string;
  profileImage?: string | File;
}

interface Errors {
  guideName: string;
  contactNumber: string;
  description: string;
  profileImage: string;
}

export function ProfileSection() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editData, setEditData] = useState<Partial<EditData> | null>(null);
  const [errors, setErrors] = useState<Errors>({
    guideName: "",
    contactNumber: "",
    description: "",
    profileImage: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const userId = session?.user?.id;

  // Function to generate a random avatar URL
  const generateRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setEditData((prev) => ({
      ...prev,
      profileImage: randomAvatar,
    }));
    setErrors({ ...errors, profileImage: "" });
  };

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/api/guide/${userId}`);
        const guideInfo = res.data.data.guide;
        const totalPackages = res.data.data.package?.length || 0;

        const profile: ProfileData = {
          ...guideInfo,
          totalPackages,
          joinDate:
            guideInfo.createdAt ||
            guideInfo.joinDate ||
            new Date().toISOString(),
          profileImage: guideInfo.profileImage || "",
        };

        setProfileData(profile);
        setEditData({ ...guideInfo });
      } catch (error) {
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [status, userId]);

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return { isValid: true, message: "" };

    const normalized = phone.trim();

    // Check for non-digit characters (excluding leading +)
    if (!/^\+?\d*$/.test(normalized)) {
      return {
        isValid: false,
        message:
          "Phone number can only contain digits and optionally a leading '+'",
      };
    }

    const digitCount = normalized.replace(/\D/g, "").length; // Count only digits

    if (digitCount < 7) {
      return {
        isValid: false,
        message: "Phone number is too short (min 7 digits)",
      };
    }
    if (digitCount > 14) {
      return {
        isValid: false,
        message: "Phone number is too long (max 14 digits)",
      };
    }

    // Specific format checks for better user guidance
    const isLocal = /^\d{10}$/.test(normalized);
    const isIndia = /^\+91\d{10}$/.test(normalized);
    const isInternational = /^\+\d{7,14}$/.test(normalized); // More flexible for international

    if (isLocal || isIndia || isInternational) {
      return { isValid: true, message: "" };
    }

    return {
      isValid: false,
      message:
        "Invalid phone number format. Examples: 9876543210, +919876543210, or +1234567890",
    };
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateInputs = () => {
    if (!editData) return false;

    const newErrors: Errors = {
      guideName: "",
      contactNumber: "",
      description: "",
      profileImage: "",
    };
    let isValid = true;

    // Validate guideName (2-30 characters)
    if (
      !editData.guideName ||
      editData.guideName.trim().length < 2 ||
      editData.guideName.length > 30
    ) {
      newErrors.guideName = "Name must be between 2-30 characters";
      isValid = false;
    }

    // Validate contact number
    const phoneValidation = validatePhoneNumber(editData.contactNumber || "");
    if (!phoneValidation.isValid) {
      newErrors.contactNumber = phoneValidation.message;
      isValid = false;
    }

    // Validate description (4-500 chars)
    if (
      editData.description &&
      (editData.description.length < 4 || editData.description.length > 500)
    ) {
      newErrors.description = "Description must be between 4-500 characters";
      isValid = false;
    }

    // Validate profile image URL or file
    if (
      editData.profileImage &&
      typeof editData.profileImage === "string" && // Only validate if it's a string (URL)
      !isValidUrl(editData.profileImage)
    ) {
      newErrors.profileImage =
        "Please enter a valid image URL or upload an image.";
      isValid = false;
    } else if (
      editData.profileImage &&
      !(editData.profileImage instanceof File) &&
      typeof editData.profileImage !== "string"
    ) {
      // This case handles when profileImage is set but not a string (URL) or a File object
      newErrors.profileImage =
        "Invalid image input. Please upload a valid image or enter a URL.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setErrors({ ...errors, profileImage: "Please upload an image file" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setErrors({ ...errors, profileImage: "Image must be less than 2MB" });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditData((prev) => ({
        ...prev,
        profileImage: res.data.url,
      }));
      setErrors({ ...errors, profileImage: "" });
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profileData) {
      setEditData({
        guideName: profileData.guideName,
        contactNumber: profileData.contactNumber,
        description: profileData.description,
        profileImage: profileData.profileImage,
      });
    }
    setErrors({
      guideName: "",
      contactNumber: "",
      description: "",
      profileImage: "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validateInputs() || !editData || !profileData) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      const updateData = {
        guideName: editData.guideName || profileData.guideName,
        contactNumber: editData.contactNumber || profileData.contactNumber,
        description: editData.description || profileData.description,
        profileImage: editData.profileImage || profileData.profileImage,
      };

      // If the profile image is a URL (string), send it directly to backend
      if (typeof updateData.profileImage === "string") {
        // No need for additional processing for random avatar URLs
        // They're already in the correct format for the API
      }

      await axiosInstance.patch("/api/guide/update", updateData);

      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          guideName: editData.guideName || prev.guideName,
          contactNumber: editData.contactNumber || prev.contactNumber,
          description: editData.description || prev.description,
          profileImage: editData.profileImage || prev.profileImage,
        };
      });

      setIsEditing(false);
      toast.success("Profile Updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (status === "loading" || !profileData) return <p>Loading...</p>;
  if (!userId) return <p>User not logged in</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and information
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    typeof editData?.profileImage === "string"
                      ? editData.profileImage
                      : "/travel1.avif"
                  }
                  alt="Profile image"
                />
                <AvatarFallback className="text-lg">
                  {profileData.guideName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="space-y-2 w-full max-w-md">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-center">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={generateRandomAvatar}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Generate Random Avatar
                    </Button>
                    <Label
                      htmlFor="profileImageUpload"
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      <div className="flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-muted">
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                      </div>
                      <Input
                        id="profileImageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>
                  </div>
                  {errors.profileImage && (
                    <p className="text-sm text-red-500">
                      {errors.profileImage}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guideName">Full Name</Label>
                  {isEditing ? (
                    <div className="space-y-1">
                      <Input
                        id="guideName"
                        value={editData?.guideName || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            guideName: e.target.value,
                          })
                        }
                        required
                      />
                      {errors.guideName && (
                        <p className="text-sm text-red-500">
                          {errors.guideName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <span>{profileData.guideName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.guideEmail}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="contactNumber"
                      value={editData?.contactNumber || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder="+919876543210 or 9876543210"
                    />
                    {errors.contactNumber && (
                      <p className="text-sm text-red-500">
                        {errors.contactNumber}
                        <br />
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Textarea
                    id="description"
                    value={editData?.description || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    rows={4}
                    minLength={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between">
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {editData?.description?.length || 0}/500
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <p>{profileData.description || "no bio provided!"}</p>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="gap-2"
                  disabled={isUploading}
                >
                  <Save className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Packages
                </span>
                <span className="text-2xl font-bold">
                  {profileData.totalPackages}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined{" "}
                  {new Date(profileData.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
