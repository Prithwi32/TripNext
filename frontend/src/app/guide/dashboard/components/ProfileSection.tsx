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
import { Edit, Save, X, Phone, Mail, Calendar, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";

export function ProfileSection() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({
    guideName: "",
    contactNumber: "",
    description: "",
    profileImage: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/api/guide/${userId}`);
        const guideInfo = res.data.data.guide;
        const totalPackages = res.data.data.package?.length || 0;

        setProfileData({
          ...guideInfo,
          totalPackages,
          joinDate:
            guideInfo.createdAt ||
            guideInfo.joinDate ||
            new Date().toISOString(),
        });
        setEditData({ ...guideInfo });
      } catch (error) {
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [status, userId]);

  const validatePhoneNumber = (phone) => {
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

  const validateInputs = () => {
    const newErrors = {
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
    const phoneValidation = validatePhoneNumber(editData.contactNumber);
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

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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

      setEditData((prev) => ({ ...prev, profileImage: res.data.url }));
      setErrors({ ...errors, profileImage: "" });
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditData(profileData);
    setErrors({
      guideName: "",
      contactNumber: "",
      description: "",
      profileImage: "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validateInputs()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      const updateData = {
        guideName: editData.guideName,
        contactNumber: editData.contactNumber,
        description: editData.description,
        profileImage: editData.profileImage,
      };

      await axiosInstance.patch("/api/guide/update", updateData);

      setProfileData((prev) => ({
        ...prev,
        ...updateData,
        joinDate: prev.joinDate,
        totalPackages: prev.totalPackages,
      }));

      console.log(updateData);
      setIsEditing(false);
      toast.success("Profile Updated!");
    } catch (error) {
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    typeof editData.profileImage === "string"
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
                <div className="space-y-2 w-64">
                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      placeholder="Image URL"
                      value={
                        typeof editData.profileImage === "string"
                          ? editData.profileImage
                          : ""
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          profileImage: e.target.value,
                        })
                      }
                    />
                    <span className="text-muted-foreground">or</span>
                  </div>
                  <Label
                    htmlFor="profileImageUpload"
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted">
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
                  {errors.profileImage && (
                    <p className="text-sm text-red-500">
                      {errors.profileImage}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guideName">Full Name</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="guideName"
                      value={editData.guideName}
                      onChange={(e) =>
                        setEditData({ ...editData, guideName: e.target.value })
                      }
                      required
                    />
                    {errors.guideName && (
                      <p className="text-sm text-red-500">{errors.guideName}</p>
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

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                {isEditing ? (
                  <div className="space-y-1">
                    <Input
                      id="contactNumber"
                      value={editData.contactNumber}
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
                    value={editData.description}
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
                      {editData.description?.length || 0}/500
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <p>{profileData.description}</p>
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
