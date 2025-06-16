"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Eye, Search, MapPin, Calendar, IndianRupee} from "lucide-react"
import { PackageDetailsModal } from "./PackageDetailsPage"
import { EditPackageModal } from "./EditPackagePopUp"
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios"
import { useSession } from "next-auth/react"

interface Package {
  _id: string
  locations: string[]
  packageDescription: string
  cost: number
  tripDays: number
  images: string[]
  createdAt: string
}

export function PackagesSection() {
  const { data: session, status } = useSession();
  const [packages, setPackages] = useState<Package[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const userId = session?.user?.id;
  useEffect( () => {
    const fetchPackages = async () => {
      try{
        const res = await  axiosInstance.get(`/api/guide/${userId}/packages`)
        setPackages(res.data.data)
      }catch (error){
        toast.error("Failed to fetch packages!")
      }
    }
    fetchPackages()
  }, [])

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.locations.some((location) => location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pkg.packageDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowDetailsModal(true)
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setShowEditModal(true)
  }

  const handleDelete = async (packageId: string) => {
    try {
      await axiosInstance.delete(`/api/package/delete/${packageId}`);
      setPackages(packages.filter((pkg) => pkg._id !== packageId))
      toast(`Package has been successfully deleted.`)
    } catch (error) {
      toast(`Failed to delete package. Please try again.`)
    }
  }

  const handleUpdatePackage = (updatedPackage: Package) => {
    setPackages(packages.map((pkg) => (pkg._id === updatedPackage._id ? updatedPackage : pkg)))
    setShowEditModal(false)
    setEditingPackage(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Packages</h1>
          <p className="text-muted-foreground">Manage your travel packages</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {packages.length} Total Packages
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <Card key={pkg._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <img src={pkg.images[0] || "/placeholder.svg"} alt="Package" className="object-cover w-full h-full" />
              <div className="absolute top-2 right-2">
                <Badge className="bg-black/70 text-white">{pkg.tripDays} Days</Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{pkg.locations.join(", ")}</CardTitle>
                <div className="text-lg font-bold text-primary">₹{pkg.cost}</div>
              </div>
              <CardDescription className="line-clamp-2">{pkg.packageDescription}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{pkg.locations.length} locations</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{pkg.tripDays} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  <span>{pkg.cost}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(pkg)} className="flex-1 gap-1 bg-secondary hover:bg-secondary/80">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)} className="flex-1 gap-1 bg-accent">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pkg._id)}
                  className="gap-1 text-destructive hover:text-destructive hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm ? "No packages found matching your search." : "No packages found."}
          </div>
        </div>
      )}

      <PackageDetailsModal package={selectedPackage} open={showDetailsModal} onOpenChange={setShowDetailsModal} />

      <EditPackageModal
        package={editingPackage}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdate={handleUpdatePackage}
      />
    </div>
  )
}
