"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Phone, Mail, MapPin, Calendar } from "lucide-react"
import toast from "react-hot-toast";

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    guideName: "John Doe",
    guideEmail: "john.doe@example.com",
    contactNumber: "+1234567890",
    description: "Experienced travel guide with 10+ years of expertise in adventure tourism and cultural tours.",
    location: "New York, USA",
    joinDate: "2020-01-15",
    totalPackages: 12,
    rating: 4.8,
  })
  const [editData, setEditData] = useState(profileData)

  const handleEdit = () => {
    setEditData(profileData)
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      // API call to update profile
      // await updateProfile(editData)
      setProfileData(editData)
      setIsEditing(false)
      toast(
        `Profile Updated! Your profile has been successfully updated.`
      )
    } catch (error) {
      toast(
        `title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"`
      )
    }
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your guide profile and information</p>
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
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-lg">
                  {profileData.guideName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{profileData.guideName}</h3>
                <p className="text-muted-foreground">Professional Travel Guide</p>
                <Badge variant="secondary">Verified Guide</Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guideName">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="guideName"
                    value={editData.guideName}
                    onChange={(e) => setEditData({ ...editData, guideName: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <span>{profileData.guideName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guideEmail">Email</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.guideEmail}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                {isEditing ? (
                  <Input
                    id="contactNumber"
                    value={editData.contactNumber}
                    onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.contactNumber}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={4}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <p>{profileData.description}</p>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
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
                <span className="text-sm text-muted-foreground">Total Packages</span>
                <span className="text-2xl font-bold">{profileData.totalPackages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                <span className="text-2xl font-bold">{profileData.rating}/5</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              {/* <Button variant="outline" className="w-full justify-start">
                View Public Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
