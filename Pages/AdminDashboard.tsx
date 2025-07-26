import React, { useState, useEffect } from "react";
import { Vendor, Zone, HygieneReport } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Users, 
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [vendors, setVendors] = useState([]);
  const [zones, setZones] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [stats, setStats] = useState({
    totalVendors: 0,
    legalVendors: 0,
    illegalVendors: 0,
    totalZones: 0,
    openReports: 0,
    criticalReports: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [vendorData, zoneData, reportData] = await Promise.all([
      Vendor.list(),
      Zone.list(),
      HygieneReport.list('-created_date')
    ]);
    
    setVendors(vendorData);
    setZones(zoneData);
    setReports(reportData);
    
    // Calculate stats
    setStats({
      totalVendors: vendorData.length,
      legalVendors: vendorData.filter(v => v.zone_status === 'legal').length,
      illegalVendors: vendorData.filter(v => v.zone_status === 'illegal').length,
      totalZones: zoneData.length,
      openReports: reportData.filter(r => r.status === 'open').length,
      criticalReports: reportData.filter(r => r.severity === 'critical' && r.status === 'open').length
    });
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await HygieneReport.update(reportId, { 
        status: newStatus,
        resolved_date: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : null
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'legal': return 'bg-green-100 text-green-800';
      case 'illegal': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'relocate_required': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
            Zone Management Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Monitor vendor compliance, manage zones, and handle hygiene reports
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.totalVendors}</div>
                  <div className="text-xs text-blue-600">Total Vendors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">{stats.legalVendors}</div>
                  <div className="text-xs text-green-600">Legal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-700">{stats.illegalVendors}</div>
                  <div className="text-xs text-red-600">Illegal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-700">{stats.totalZones}</div>
                  <div className="text-xs text-purple-600">Total Zones</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-700">{stats.openReports}</div>
                  <div className="text-xs text-orange-600">Open Reports</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-700">{stats.criticalReports}</div>
                  <div className="text-xs text-red-600">Critical</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-orange-200/50">
            <TabsTrigger value="vendors" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-green-100">
              <Users className="w-4 h-4 mr-2" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="zones" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-green-100">
              <MapPin className="w-4 h-4 mr-2" />
              Zones
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-green-100">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Vendor Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hygiene</TableHead>
                        <TableHead>Complaints</TableHead>
                        <TableHead>Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id} className="hover:bg-orange-50/50">
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>{vendor.business_name || '-'}</TableCell>
                          <TableCell>{vendor.area}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(vendor.zone_status)}>
                              {vendor.zone_status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{vendor.hygiene_score}</span>
                              <span className="text-gray-500">/5</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={vendor.total_complaints > 3 ? "destructive" : vendor.total_complaints > 0 ? "secondary" : "outline"}>
                              {vendor.total_complaints || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{vendor.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zones Tab */}
          <TabsContent value="zones">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Zone Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zone Name</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Avg Hygiene</TableHead>
                        <TableHead>Notification Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {zones.map((zone) => (
                        <TableRow key={zone.id} className="hover:bg-green-50/50">
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell>{zone.area}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(zone.status)}>
                              {zone.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{zone.current_vendors || 0}/{zone.max_vendors || 0}</span>
                              {(zone.current_vendors || 0) >= (zone.max_vendors || 0) && (
                                <Badge variant="destructive" className="text-xs">FULL</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {zone.hygiene_avg ? `${zone.hygiene_avg.toFixed(1)}/5` : 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {zone.notification_date ? new Date(zone.notification_date).toLocaleDateString() : 'Pending'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Hygiene Reports Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.slice(0, 20).map((report) => (
                        <TableRow key={report.id} className="hover:bg-red-50/50">
                          <TableCell className="text-sm">
                            {new Date(report.created_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.reporter_name || 'Anonymous'}</div>
                              <div className="text-xs text-gray-500">{report.reporter_phone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {report.issue_type.replace('_', ' ').toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(report.severity)}>
                              {report.severity.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getReportStatusColor(report.status)}>
                              {report.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedReport(report)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              {report.status === 'open' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateReportStatus(report.id, 'investigating')}
                                    className="text-xs text-yellow-600 hover:text-yellow-700"
                                  >
                                    Investigate
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateReportStatus(report.id, 'resolved')}
                                    className="text-xs text-green-600 hover:text-green-700"
                                  >
                                    Resolve
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Report Detail Modal */}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Report Details</h3>
                <Button variant="ghost" onClick={() => setSelectedReport(null)}>×</Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Reporter</label>
                    <p className="font-semibold">{selectedReport.reporter_name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="font-semibold">{selectedReport.reporter_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issue Type</label>
                    <p className="font-semibold">{selectedReport.issue_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Severity</label>
                    <Badge className={getSeverityColor(selectedReport.severity)}>
                      {selectedReport.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="bg-gray-50 p-3 rounded-lg mt-1">{selectedReport.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <p className="font-mono text-sm">{selectedReport.latitude}, {selectedReport.longitude}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={getReportStatusColor(selectedReport.status)}>
                      {selectedReport.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {selectedReport.photo_url && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Photo Evidence</label>
                    <img 
                      src={selectedReport.photo_url} 
                      alt="Report evidence" 
                      className="w-full max-w-md mx-auto rounded-lg mt-2"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => window.open(`https://maps.google.com/?q=${selectedReport.latitude},${selectedReport.longitude}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  {selectedReport.status === 'open' && (
                    <>
                      <Button
                        onClick={() => {
                          updateReportStatus(selectedReport.id, 'investigating');
                          setSelectedReport(null);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Mark Investigating
                      </Button>
                      <Button
                        onClick={() => {
                          updateReportStatus(selectedReport.id, 'resolved');
                          setSelectedReport(null);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
