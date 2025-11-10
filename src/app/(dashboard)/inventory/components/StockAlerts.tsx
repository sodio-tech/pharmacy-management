"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, RefreshCw, AlertTriangle, Package, Check, Bell, Calendar } from "lucide-react";
import { toast } from "react-toastify";

interface StockAlertsProps {
  onClose: () => void;
  onRefresh: () => void;
}

interface StockAlert {
  productId: string;
  sku: string;
  name: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  suggestedQty: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  price: number;
  expiringSoonStock: number;
  stockStatus: "LOW_STOCK" | "OUT_OF_STOCK";
  daysToStockout: number;
}

interface AlertsSummary {
  totalAlerts: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  outOfStock: number;
}

interface AlertsData {
  summary: AlertsSummary;
  alerts: StockAlert[];
  generatedAt: string;
}

export function StockAlerts({ onClose, onRefresh }: StockAlertsProps) {
  const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAlerts();
    
    // Set up browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/alerts/low-stock");
      if (response.ok) {
        const data = await response.json();
        setAlertsData(data);
        
        // Show browser notifications for high priority alerts
        if (data.summary.highPriority > 0 && Notification.permission === 'granted') {
          new Notification('High Priority Stock Alert!', {
            body: `${data.summary.highPriority} products need immediate attention`,
            icon: '/favicon.ico',
          });
        }
      }
    } catch (error: any) {
      console.error("Error loading alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAlerts = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/alerts/low-stock?forceRefresh=true");
      if (response.ok) {
        const data = await response.json();
        setAlertsData(data);
        onRefresh(); // Update parent component stats
        toast.success("Alerts refreshed successfully");
      }
    } catch (error: any) {
      console.error("Error refreshing alerts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkProcessed = async (productId: string) => {
    setProcessingIds(prev => new Set(prev).add(productId));
    
    try {
      const response = await fetch("/api/alerts/low-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          action: "mark_processed",
        }),
      });

      if (response.ok) {
        // Remove the alert from the list
        setAlertsData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            alerts: prev.alerts.filter(alert => alert.productId !== productId),
            summary: {
              ...prev.summary,
              totalAlerts: prev.summary.totalAlerts - 1,
            },
          };
        });
        toast.success("Alert marked as processed");
      }
    } catch (error: any) {
      console.error("Error processing alert:", error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "LOW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "OUT_OF_STOCK" 
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-orange-100 text-orange-800 border-orange-200";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Loading alerts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900" data-testid="stock-alerts-title">
                Stock Alerts
              </h2>
              <p className="text-gray-600 text-sm">
                Products requiring immediate attention
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefreshAlerts}
              disabled={refreshing}
              data-testid="refresh-alerts-btn"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-alerts-btn">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {alertsData && (
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{alertsData.summary.totalAlerts}</div>
                  <div className="text-sm text-gray-600">Total Alerts</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{alertsData.summary.highPriority}</div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{alertsData.summary.mediumPriority}</div>
                  <div className="text-sm text-gray-600">Medium Priority</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{alertsData.summary.lowPriority}</div>
                  <div className="text-sm text-gray-600">Low Priority</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-800">{alertsData.summary.outOfStock}</div>
                  <div className="text-sm text-gray-600">Out of Stock</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Alerts List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {alertsData && alertsData.alerts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Suggested Order</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Expiring Soon</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertsData.alerts.map((alert) => (
                    <TableRow key={alert.productId} data-testid={`alert-row-${alert.productId}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{alert.name}</div>
                            <div className="text-sm text-gray-600">
                              SKU: {alert.sku} • {alert.category}
                            </div>
                            <div className="text-xs text-gray-500">
                              ₹{alert.price.toFixed(2)} per {alert.unit}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getStatusColor(alert.stockStatus)} variant="outline">
                          {alert.stockStatus === "OUT_OF_STOCK" ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {alert.currentStock} {alert.unit}
                          </div>
                          <div className="text-sm text-gray-600">
                            Reorder at: {alert.reorderLevel}
                          </div>
                          {alert.stockStatus === "LOW_STOCK" && (
                            <div className="text-xs text-orange-600">
                              ~{alert.daysToStockout} days left
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium text-blue-600">
                          {alert.suggestedQty} {alert.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          ≈ ₹{(alert.suggestedQty * alert.price).toFixed(2)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={getPriorityColor(alert.priority)} variant="outline">
                          {alert.priority}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {alert.expiringSoonStock > 0 ? (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{alert.expiringSoonStock} {alert.unit}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkProcessed(alert.productId)}
                          disabled={processingIds.has(alert.productId)}
                          data-testid={`mark-processed-${alert.productId}`}
                        >
                          {processingIds.has(alert.productId) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Processed
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">
                Great! All your products are adequately stocked.
              </p>
              <Button
                variant="outline"
                onClick={handleRefreshAlerts}
                className="mt-4"
                data-testid="refresh-no-alerts-btn"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {alertsData && (
          <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600">
            Last updated: {new Date(alertsData.generatedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}