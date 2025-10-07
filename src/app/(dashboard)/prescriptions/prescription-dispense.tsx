"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, CheckCircle, AlertTriangle, Calculator } from "lucide-react";
import { PrescriptionDispenseProps, Product, PrescriptionMedication } from "./types";

export function PrescriptionDispense({ 
  prescription, 
  onDispense, 
  onCancel 
}: PrescriptionDispenseProps) {
  const [medications, setMedications] = useState<PrescriptionMedication[]>(prescription.medications || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Mock products data - in real app, this would come from API
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Lisinopril',
      generic_name: 'Lisinopril',
      selling_price: 15.50,
      stock_available: 100,
      batches: [
        { id: 'b1', batch_number: 'LIS001', expiry_date: '2025-12-31', current_quantity: 50 },
        { id: 'b2', batch_number: 'LIS002', expiry_date: '2026-06-30', current_quantity: 50 }
      ]
    },
    {
      id: '2',
      name: 'Metformin',
      generic_name: 'Metformin HCl',
      selling_price: 8.75,
      stock_available: 200,
      batches: [
        { id: 'b3', batch_number: 'MET001', expiry_date: '2025-08-15', current_quantity: 100 },
        { id: 'b4', batch_number: 'MET002', expiry_date: '2026-02-28', current_quantity: 100 }
      ]
    },
    {
      id: '3',
      name: 'Aspirin',
      generic_name: 'Acetylsalicylic Acid',
      selling_price: 3.25,
      stock_available: 500,
      batches: [
        { id: 'b5', batch_number: 'ASP001', expiry_date: '2026-01-15', current_quantity: 250 },
        { id: 'b6', batch_number: 'ASP002', expiry_date: '2026-07-20', current_quantity: 250 }
      ]
    }
  ];

  useEffect(() => {
    calculateTotal();
  }, [medications]);

  const searchProducts = async (medicationName: string) => {
    if (!medicationName.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockProducts.filter(product => 
        product.name.toLowerCase().includes(medicationName.toLowerCase()) ||
        product.generic_name?.toLowerCase().includes(medicationName.toLowerCase())
      );
      setAvailableProducts(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const selectProduct = (medicationId: string, product: Product, batchId: string) => {
    const batch = product.batches.find(b => b.id === batchId);
    if (!batch) return;

    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? {
              ...med,
              product_id: product.id,
              batch_id: batchId,
              unit_price: product.selling_price,
              total_price: product.selling_price * (med.quantity || 1)
            }
          : med
      )
    );
  };

  const updateQuantity = (medicationId: string, quantity: number) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? {
              ...med,
              quantity,
              total_price: med.unit_price ? med.unit_price * quantity : 0
            }
          : med
      )
    );
  };

  const calculateTotal = () => {
    const total = medications.reduce((sum, med) => sum + (med.total_price || 0), 0);
    setTotalAmount(total);
  };

  const handleDispense = () => {
    const dispenseData = {
      medications: medications
        .filter(med => med.product_id && med.batch_id)
        .map(med => ({
          medication_id: med.id,
          product_id: med.product_id!,
          batch_id: med.batch_id!,
          quantity: med.quantity || 1,
          unit_price: med.unit_price!
        }))
    };
    
    onDispense(dispenseData);
  };

  const canDispense = medications.every(med => 
    med.product_id && med.batch_id && med.quantity && med.quantity > 0
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispense Prescription</h1>
          <p className="text-gray-600">
            Prescription #{prescription.prescription_number} - {prescription.patient_name}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Validated
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medications List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prescription Medications</CardTitle>
              <CardDescription>
                Select products and batches for each medication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <Card key={medication.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{medication.medication_name}</h4>
                        <p className="text-sm text-gray-600">
                          {medication.dosage} • {medication.frequency}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={medication.is_dispensed}
                          onCheckedChange={(checked) => 
                            setMedications(prev => 
                              prev.map(med => 
                                med.id === medication.id 
                                  ? { ...med, is_dispensed: checked as boolean }
                                  : med
                              )
                            )
                          }
                        />
                        <Label className="text-sm">Dispensed</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Selection</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                searchProducts(searchTerm);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => searchProducts(searchTerm)}
                            disabled={isSearching}
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {availableProducts.length > 0 && (
                          <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {availableProducts.map(product => (
                              <div key={product.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">{product.generic_name}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${product.selling_price}</p>
                                    <p className="text-sm text-gray-600">Stock: {product.stock_available}</p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <Label className="text-xs">Select Batch:</Label>
                                  <Select onValueChange={(batchId) => selectProduct(medication.id, product, batchId)}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Choose batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {product.batches.map(batch => (
                                        <SelectItem key={batch.id} value={batch.id}>
                                          {batch.batch_number} - Exp: {batch.expiry_date} (Qty: {batch.current_quantity})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={medication.quantity || ''}
                          onChange={(e) => updateQuantity(medication.id, parseInt(e.target.value) || 0)}
                          placeholder="Enter quantity"
                        />
                        
                        {medication.product_id && (
                          <div className="text-sm text-gray-600">
                            <p>Unit Price: ${medication.unit_price?.toFixed(2)}</p>
                            <p>Total: ${medication.total_price?.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {medication.instructions && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <Label className="text-sm font-medium">Instructions:</Label>
                        <p className="text-sm text-gray-700">{medication.instructions}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Dispense Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Patient:</span>
                    <span className="text-sm">{prescription.patient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Doctor:</span>
                    <span className="text-sm">{prescription.doctor_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Prescription #:</span>
                    <span className="text-sm">{prescription.prescription_number}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Medications to Dispense:</h4>
                  <div className="space-y-2">
                    {medications
                      .filter(med => med.product_id && med.batch_id)
                      .map(medication => (
                        <div key={medication.id} className="flex justify-between text-sm">
                          <span>{medication.medication_name}</span>
                          <span>${medication.total_price?.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Stock Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {medications
                  .filter(med => med.product_id && med.batch_id)
                  .map(medication => {
                    const product = mockProducts.find(p => p.id === medication.product_id);
                    const batch = product?.batches.find(b => b.id === medication.batch_id);
                    const isLowStock = batch && medication.quantity && batch.current_quantity < medication.quantity;
                    
                    return (
                      <div key={medication.id} className="flex items-center gap-2 text-sm">
                        {isLowStock ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span className={isLowStock ? 'text-yellow-600' : 'text-green-600'}>
                          {medication.medication_name} - {batch?.current_quantity || 0} available
                        </span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleDispense}
              disabled={!canDispense}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Dispense Prescription
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
