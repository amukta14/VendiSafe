import React, { useState, useEffect } from "react";
import { Vendor, Zone, HygieneReport } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Star,
  Navigation,
  FileText,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function VendorDashboard() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vendor, setVendor] = useState(null);
  const [nearbyZones, setNearbyZones] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchVendor = async () => {
    if (!phoneNumber.trim()) return;
    
    setLoading(true);
    try {
      const vendors = await Vendor.filter({ phone: phoneNumber.trim() });
      if (vendors.length > 0) {
        const foundVendor = vendors[0];
        setVendor(foundVendor);
        
        // Load nearby zones and reports
        const [zones, reports] = await Promise.all([
          Zone.list(),
          HygieneReport.filter({ vendor_id: foundVendor.id })
        ]);
        
        setNearbyZones(zones.slice(0, 5)); // Show top 5 zones
        setRecentReports(reports.slice(0, 3)); // Show recent 3 reports
      } else {
        setVendor(null);
        setNearbyZones([]);
        setRecentReports([]);
      }
    } catch (error) {
      console.error("Error searching vendor:", error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'legal': return 'bg-green-100 text-green-800 border-green-200';
      case 'illegal': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'relocate_required': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'legal': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'illegal': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'relocate_required': return <Navigation className="w-5 h-5 text-orange-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getHygieneStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
            Vendor Compliance Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check your legal vending status, hygiene rating, and get compliance recommendations
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-orange-200/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-3">
              <Shield className="w-6 h-6 text-orange-600" />
              Find Your Vendor Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Enter Your Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 text-center text-lg"
                />
              </div>
              <Button 
                onClick={searchVendor}
                disabled={loading || !phoneNumber.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-semibold py-3"
              >
                {loading ? "Searching..." : "Check My Status"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Profile */}
        {vendor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Overview */}
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  {vendor.business_name || vendor.name}
                </CardTitle>
                <p className="text-gray-600 text-lg">{vendor.food_type.replace('_', ' ').toUpperCase()}</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Legal Status */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      {getStatusIcon(vendor.zone_status)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Status</h3>
                    <Badge className={`${getStatusColor(vendor.zone_status)} px-4 py-2 text-sm font-semibold`}>
                      {vendor.zone_status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Hygiene Rating */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3 gap-1">
                      {getHygieneStars(vendor.hygiene_score)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hygiene Rating</h3>
                    <div className="text-2xl font-bold text-yellow-600">
                      {vendor.hygiene_score}/5
                    </div>
                  </div>

                  {/* Complaints */}
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Total Complaints</h3>
                    <div className="text-2xl font-bold text-red-600">
                      {vendor.total_complaints || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Alert */}
            {vendor.zone_status === 'illegal' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Urgent: Illegal Vending Zone Detected</strong>
                  <br />
                  You are operating in a non-designated area and face eviction risk. Please review the legal zones below and consider relocating immediately.
                </AlertDescription>
              </Alert>
            )}

            {vendor.zone_status === 'relocate_required' && (
              <Alert className="border-orange-200 bg-orange-50">
                <Navigation className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Relocation Required</strong>
                  <br />
                  Your current zone status requires relocation. Check the recommended zones below for safer vending options.
                </AlertDescription>
              </Alert>
            )}

            {vendor.zone_status === 'legal' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Compliant Vending Status</strong>
                  <br />
                  You are operating in a designated legal zone. Keep maintaining good hygiene standards to retain your status.
                </AlertDescription>
              </Alert>
            )}

            {/* Vendor Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Information */}
              <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Vendor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">{vendor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{vendor.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-semibold">{vendor.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-semibold text-right max-w-48">{vendor.address}</span>
                  </div>
                  {vendor.license_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">License:</span>
                      <span className="font-semibold">{vendor.license_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified:</span>
                    <Badge className={vendor.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {vendor.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Legal Zones */}
              <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-green-600" />
                    Recommended Legal Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nearbyZones.filter(zone => zone.status === 'legal').slice(0, 4).map((zone) => (
                      <div key={zone.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <div className="font-semibold text-green-800">{zone.name}</div>
                          <div className="text-sm text-green-600">{zone.area}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-700">
                            {zone.current_vendors}/{zone.max_vendors} vendors
                          </div>
                          {zone.current_vendors < zone.max_vendors && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Space Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            {recentReports.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" />
                    Recent Hygiene Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div key={report.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={`${
                            report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(report.created_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{report.description}</p>
                        <p className="text-xs text-red-600 mt-1">Issue: {report.issue_type.replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => window.open(`https://maps.google.com/?q=${vendor.latitude},${vendor.longitude}`)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
              <Button 
                variant="outline"
                className="border-orange-200 hover:bg-orange-50"
                onClick={() => window.open(`tel:+91${vendor.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </motion.div>
        )}

        {/* No vendor found */}
        {phoneNumber && !vendor && !loading && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-orange-200/50">
            <CardContent>
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vendor Not Found</h3>
              <p className="text-gray-600 mb-6">
                No vendor registered with phone number "{phoneNumber}". 
                <br />Please check the number or contact support for registration.
              </p>
              <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                <Phone className="w-4 h-4 mr-2" />
                Contact Support for Registration
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
