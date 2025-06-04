"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Save } from "lucide-react"
import { toast } from "react-hot-toast"

interface Package {
  _id: string
  locations: string[]
  packageDescription: string
  cost: number
  tripDays: number
  images: string[]
  createdAt: string
}

interface EditPackageModalProps {
  package: Package | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedPackage: Package) => void
}

export function EditPackageModal({ package: pkg, open, onOpenChange, onUpdate }: EditPackageModalProps) {
  const [formData, setFormData] = useState({
    locations: [""],
    packageDescription: "",
    cost: "",
    tripDays: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (pkg) {
      setFormData({
        locations: pkg.locations.length > 0 ? pkg.locations : [""],
        packageDescription: pkg.packageDescription,
        cost: pkg.cost.toString(),
        tripDays: pkg.tripDays.toString(),
      })
    }
  }, [pkg])

  const addLocation = () => {
    setFormData({
      ...formData,
      locations: [...formData.locations, ""],
    })
  }

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter((_, i) => i !== index),
    })
  }

  const updateLocation = (index: number, value: string) => {
    const newLocations = [...formData.locations]
    newLocations[index] = value
    setFormData({
      ...formData,
      locations: newLocations,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pkg) return

    setIsSubmitting(true)

    try {
      const validLocations = formData.locations.filter((loc) => loc.trim() !== "")
      if (validLocations.length === 0) {
        throw new Error("At least one location is required")
      }

      const updatedPackage: Package = {
        ...pkg,
        locations: validLocations,
        packageDescription: formData.packageDescription,
        cost: Number(formData.cost),
        tripDays: Number(formData.tripDays),
      }

      // API call would go here
      // await updatePackage(pkg._id, updatedPackage)

      onUpdate(updatedPackage)
      toast(`Package Updated, Your travel package has been successfully updated.`)
    } catch (error) {
      toast(`Failed to update package. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!pkg) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogDescription>Update your travel package details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Locations</Label>
              <div className="space-y-2 mt-2">
                {formData.locations.map((location, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Location ${index + 1}`}
                      value={location}
                      onChange={(e) => updateLocation(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.locations.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeLocation(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addLocation} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Location
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Package Description</Label>
              <Textarea
                id="edit-description"
                value={formData.packageDescription}
                onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-cost">Cost (INR)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-days">Trip Duration (Days)</Label>
                <Input
                  id="edit-days"
                  type="number"
                  value={formData.tripDays}
                  onChange={(e) => setFormData({ ...formData, tripDays: e.target.value })}
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Updating..." : "Update Package"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
