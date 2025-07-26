import React, { useState } from "react";
import { HygieneReport, Vendor } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle,
  Camera, 
  MapPin,
  Upload,
  CheckCircle,
  Phone,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function ReportHygiene() {
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_phone: "",
    issue_type: "",
    description: "",
    severity: "",
    latitude: "",
    longitude: "",
    photo_url: ""
  });
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const issueTypes = [
    { value: "garbage_disposal", label: "Garbage Disposal Issues" },
    { value: "water_contamination", label: "Water Contamination" },
    { value: "food_safety", label: "Food Safety Concerns" },
    { value: "cleanliness", label: "General Cleanliness" },
    { value: "drainage", label: "Drainage Problems" },
    { value: "other", label: "Other Issues" }
  ];

  const severityLevels = [
    { value: "low", label: "Low Priority", color: "text-green-600", desc: "Minor cleanliness issue" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600", desc: "Moderate hygiene concern" }, 
    { value: "high", label: "High Priority", color: "text-orange-600", desc: "Serious hygiene violation" },
    { value: "critical", label: "Critical", color: "text-red-600", desc: "Immediate health hazard" }
  ];

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
          alert("Could not get your location. Please enter coordinates manually.");
        }
      );
    } else {
      setLocationLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      try {
        const { file_url } = await UploadFile({ file });
        setFormData(prev => ({ ...prev, photo_url: file_url }));
      } catch (error) {
        console.error("Error uploading photo:", error);
        alert("Failed to upload photo. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.issue_type || !formData.description || !formData.severity || !formData.latitude || !formData.longitude) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await HygieneReport.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      reporter_name: "",
      reporter_phone: "",
      issue_type: "",
      description: "",
      severity: "",
      latitude: "",
      longitude: "",
      photo_url: ""
    });
    setPhoto(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Card className="text-center bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Report Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for reporting this hygiene issue. 
                Your report has been logged and will be investigated by local authorities.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={resetForm}
                  className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                >
                  Submit Another Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/"}
                  className="w-full border-orange-200 hover:bg-orange-50"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
            Report Hygiene Issues
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help improve street vendor hygiene standards by reporting issues. 
            Your reports contribute to safer food environments for everyone.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Reporter Information */}
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-600" />
                  Reporter Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reporter_name">Your Name</Label>
                  <Input
                    id="reporter_name"
                    value={formData.reporter_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporter_name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reporter_phone">Your Phone Number</Label>
                  <Input
                    id="reporter_phone"
                    type="tel"
                    value={formData.reporter_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, reporter_phone: e.target.value }))}
                    placeholder="9876543210"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Issue Details */}
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="issue_type">Issue Type *</Label>
                  <Select value={formData.issue_type} onValueChange={(value) => setFormData(prev => ({ ...prev, issue_type: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity Level *</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex flex-col">
                            <span className={`font-semibold ${level.color}`}>{level.label}</span>
                            <span className="text-xs text-gray-500">{level.desc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Detailed Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="description">Describe the Issue *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide detailed information about the hygiene issue you observed..."
                    className="mt-1 h-32"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {locationLoading ? "Getting Location..." : "Use Current Location"}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                      placeholder="28.6139"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                      placeholder="77.2090"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Photo Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="photo">Upload Photo (Optional)</Label>
                  <div className="mt-2">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo').click()}
                      className="w-full border-purple-200 hover:bg-purple-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {photo ? "Change Photo" : "Upload Photo"}
                    </Button>
                    {photo && (
                      <p className="text-sm text-green-600 mt-2">
                        Photo uploaded: {photo.name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Alert className="mt-8 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important:</strong> All reports are reviewed by local authorities. 
              Please ensure your report is accurate and constructive. False reports may result in penalties.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold px-12 py-3 text-lg"
            >
              {isSubmitting ? "Submitting Report..." : "Submit Hygiene Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
