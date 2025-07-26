import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup, Circle } from "react-leaflet";
import { Vendor, Zone, HygieneReport } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Phone, 
  Star,
  Navigation,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (color, status) => {
  const colors = {
    legal: '#22c55e',
    illegal: '#ef4444', 
    pending: '#f59e0b',
    relocate_required: '#f97316'
  };
  
  return new L.DivIcon({
    html: `<div style="background-color: ${colors[status] || '#6b7280'}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>`,
    className: 'custom-vendor-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function Dashboard() {
  const [vendors, setVendors] = useState([]);
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [mapCenter] = useState([28.6139, 77.2090]); // New Delhi coordinates

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [vendorData, zoneData, reportData] = await Promise.all([
      Vendor.list(),
      Zone.list(),
      HygieneReport.filter({ status: 'open' })
    ]);
    setVendors(vendorData);
    setZones(zoneData);
    setReports(reportData);
  };

  const getZoneColor = (status) => {
    switch (status) {
      case 'legal': return '#22c55e';
      case 'illegal': return '#ef4444';
      case 'pending_approval': return '#f59e0b';
      case 'restricted': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'legal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'illegal': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'relocate_required': return <Navigation className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getHygieneStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const parseCoordinates = (coordString) => {
    try {
      return JSON.parse(coordString);
    } catch {
      return [];
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-orange-200/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Delhi Street Vendor Zones
              </h1>
              <p className="text-gray-600 mt-1">Real-time legal compliance and hygiene monitoring</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{vendors.filter(v => v.zone_status === 'legal').length}</div>
                <div className="text-sm text-gray-600">Legal Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{vendors.filter(v => v.zone_status === 'illegal').length}</div>
                <div className="text-sm text-gray-600">At Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{reports.length}</div>
                <div className="text-sm text-gray-600">Open Reports</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Zone Polygons */}
            {zones.map((zone) => {
              const coordinates = parseCoordinates(zone.coordinates);
              if (coordinates.length === 0) return null;
              
              return (
                <Polygon
                  key={zone.id}
                  positions={coordinates}
                  pathOptions={{
                    fillColor: getZoneColor(zone.status),
                    fillOpacity: 0.2,
                    color: getZoneColor(zone.status),
                    weight: 2,
                    opacity: 0.8
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{zone.name}</h3>
                      <p className="text-sm text-gray-600">{zone.area}</p>
                      <Badge className={`mt-2 ${
                        zone.status === 'legal' ? 'bg-green-100 text-green-800' :
                        zone.status === 'illegal' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {zone.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="mt-2 text-sm">
                        <div>Vendors: {zone.current_vendors}/{zone.max_vendors}</div>
                        <div>Avg Hygiene: {zone.hygiene_avg?.toFixed(1) || 'N/A'}/5</div>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

            {/* Vendor Markers */}
            {vendors.map((vendor) => (
              <Marker
                key={vendor.id}
                position={[vendor.latitude, vendor.longitude]}
                icon={createCustomIcon('#4f46e5', vendor.zone_status)}
                eventHandlers={{
                  click: () => setSelectedVendor(vendor)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-48">
                    <h3 className="font-bold text-lg">{vendor.business_name || vendor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{vendor.food_type.replace('_', ' ')}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(vendor.zone_status)}
                      <span className={`text-sm font-medium ${
                        vendor.zone_status === 'legal' ? 'text-green-600' :
                        vendor.zone_status === 'illegal' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {vendor.zone_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {getHygieneStars(vendor.hygiene_score)}
                      <span className="text-sm text-gray-600 ml-1">({vendor.hygiene_score}/5)</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {vendor.phone}
                    </div>

                    <Button 
                      className="w-full mt-3 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                      size="sm"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Hygiene Issue Markers */}
            {reports.map((report) => (
              <Circle
                key={report.id}
                center={[report.latitude, report.longitude]}
                radius={50}
                pathOptions={{
                  fillColor: report.severity === 'critical' ? '#dc2626' : 
                           report.severity === 'high' ? '#ea580c' :
                           report.severity === 'medium' ? '#d97706' : '#65a30d',
                  fillOpacity: 0.4,
                  color: report.severity === 'critical' ? '#dc2626' : 
                         report.severity === 'high' ? '#ea580c' :
                         report.severity === 'medium' ? '#d97706' : '#65a30d',
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-red-600">Hygiene Issue</h4>
                    <p className="text-sm">{report.description}</p>
                    <Badge className={`mt-1 ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.severity.toUpperCase()}
                    </Badge>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-200/50">
            <h4 className="font-semibold mb-3 text-gray-900">Zone Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span>Legal Vending Zones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span>Illegal/No-Vend Zones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span>Pending Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                <span>Street Vendors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600 opacity-40"></div>
                <span>Hygiene Issues</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Details Panel */}
        <AnimatePresence>
          {selectedVendor && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-white/95 backdrop-blur-sm border-l border-orange-200/50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Vendor Details</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedVendor(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <Card className="mb-4 border-orange-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{selectedVendor.business_name || selectedVendor.name}</CardTitle>
                  <p className="text-gray-600">{selectedVendor.food_type.replace('_', ' ').toUpperCase()}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Legal Status</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedVendor.zone_status)}
                        <Badge className={`${
                          selectedVendor.zone_status === 'legal' ? 'bg-green-100 text-green-800' :
                          selectedVendor.zone_status === 'illegal' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedVendor.zone_status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Hygiene Rating</span>
                      <div className="flex items-center gap-1">
                        {getHygieneStars(selectedVendor.hygiene_score)}
                        <span className="text-sm font-medium ml-1">({selectedVendor.hygiene_score}/5)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Phone</span>
                      <span className="text-sm font-medium">{selectedVendor.phone}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-medium">{selectedVendor.area}</span>
                    </div>

                    {selectedVendor.license_number && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">License</span>
                        <span className="text-sm font-medium">{selectedVendor.license_number}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Complaints</span>
                      <span className="text-sm font-medium">{selectedVendor.total_complaints || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedVendor.zone_status === 'illegal' && (
                <Card className="mb-4 border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Compliance Alert</h4>
                        <p className="text-sm text-red-700 mt-1">
                          This vendor is operating in an illegal zone and faces eviction risk. 
                          Recommend relocation to nearby legal zones.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => window.open(`tel:${selectedVendor.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Vendor
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-orange-200 hover:bg-orange-50"
                  onClick={() => window.open(`https://maps.google.com/?q=${selectedVendor.latitude},${selectedVendor.longitude}`)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
