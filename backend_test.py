#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid

class InventoryAPITester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'InventoryTester/1.0'
        })
        
        # Authentication
        self.auth_token = None
        self.authenticated = False
        
        # Test data storage
        self.test_data = {
            'suppliers': [],
            'products': [],
            'batches': []
        }
        
        # Test results
        self.results = {
            'total_tests': 0,
            'passed_tests': 0,
            'failed_tests': 0,
            'errors': [],
            'test_details': []
        }

    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Dict = None):
        """Log test results"""
        self.results['total_tests'] += 1
        
        if success:
            self.results['passed_tests'] += 1
            status = "✅ PASS"
        else:
            self.results['failed_tests'] += 1
            status = "❌ FAIL"
            self.results['errors'].append(f"{test_name}: {details}")
        
        test_result = {
            'test_name': test_name,
            'status': status,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        
        if response_data:
            test_result['response_data'] = response_data
            
        self.results['test_details'].append(test_result)
        print(f"{status} - {test_name}: {details}")

    def test_api_endpoint(self, method: str, endpoint: str, data: Dict = None, expected_status: int = 200) -> tuple:
        """Generic API test method"""
        url = f"{self.base_url}/api/{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url)
            else:
                return False, f"Unsupported method: {method}", {}

            success = response.status_code == expected_status
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}
            
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            if not success:
                details += f", Response: {response.text[:200]}"
                
            return success, details, response_data
            
        except Exception as e:
            return False, f"Request failed: {str(e)}", {}

    def test_suppliers_api(self):
        """Test Suppliers API endpoints"""
        print("\n🏢 Testing Suppliers API...")
        
        # Test GET suppliers (empty list initially)
        success, details, response_data = self.test_api_endpoint('GET', 'suppliers')
        self.log_test("GET /api/suppliers", success, details, response_data)
        
        # Test POST create supplier
        supplier_data = {
            "name": "Test Supplier Ltd",
            "email": "supplier@test.com",
            "phone": "1234567890",
            "address": "123 Test Street, Test City",
            "gstNumber": "GST123456789",
            "contactPerson": "John Doe"
        }
        
        success, details, response_data = self.test_api_endpoint('POST', 'suppliers', supplier_data, 201)
        self.log_test("POST /api/suppliers", success, details, response_data)
        
        if success and 'supplier' in response_data:
            self.test_data['suppliers'].append(response_data['supplier'])
        
        # Test duplicate supplier creation (should fail)
        success, details, response_data = self.test_api_endpoint('POST', 'suppliers', supplier_data, 400)
        self.log_test("POST /api/suppliers (duplicate)", success, details, response_data)

    def test_products_api(self):
        """Test Products API endpoints"""
        print("\n📦 Testing Products API...")
        
        # Test GET products (empty list initially)
        success, details, response_data = self.test_api_endpoint('GET', 'products')
        self.log_test("GET /api/products", success, details, response_data)
        
        # Test POST create product
        product_data = {
            "sku": f"TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "name": "Test Medicine",
            "description": "Test medicine for API testing",
            "category": "OTC",
            "unit": "tablets",
            "hsnCode": "HSN123",
            "gstRate": 12,
            "price": 25.50,
            "reorderLevel": 10
        }
        
        success, details, response_data = self.test_api_endpoint('POST', 'products', product_data, 201)
        self.log_test("POST /api/products", success, details, response_data)
        
        if success and 'product' in response_data:
            self.test_data['products'].append(response_data['product'])
        
        # Test duplicate SKU (should fail)
        success, details, response_data = self.test_api_endpoint('POST', 'products', product_data, 400)
        self.log_test("POST /api/products (duplicate SKU)", success, details, response_data)
        
        # Test GET products with filters
        success, details, response_data = self.test_api_endpoint('GET', 'products?category=OTC')
        self.log_test("GET /api/products?category=OTC", success, details, response_data)
        
        success, details, response_data = self.test_api_endpoint('GET', 'products?search=Test')
        self.log_test("GET /api/products?search=Test", success, details, response_data)

    def test_batches_api(self):
        """Test Batches API endpoints"""
        print("\n📋 Testing Batches API...")
        
        if not self.test_data['products'] or not self.test_data['suppliers']:
            self.log_test("Batches API", False, "No products or suppliers available for batch testing")
            return
        
        # Test GET batches (empty list initially)
        success, details, response_data = self.test_api_endpoint('GET', 'batches')
        self.log_test("GET /api/batches", success, details, response_data)
        
        # Test POST create batch
        product = self.test_data['products'][0]
        supplier = self.test_data['suppliers'][0]
        
        batch_data = {
            "batchNumber": f"BATCH-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "productId": product['id'],
            "supplierId": supplier['id'],
            "mfgDate": (datetime.now() - timedelta(days=30)).isoformat(),
            "expiryDate": (datetime.now() + timedelta(days=365)).isoformat(),
            "quantity": 100,
            "costPrice": 20.00,
            "sellingPrice": 25.50
        }
        
        success, details, response_data = self.test_api_endpoint('POST', 'batches', batch_data, 201)
        self.log_test("POST /api/batches", success, details, response_data)
        
        if success and 'batch' in response_data:
            self.test_data['batches'].append(response_data['batch'])
        
        # Test batch with invalid dates (should fail)
        invalid_batch_data = batch_data.copy()
        invalid_batch_data['expiryDate'] = (datetime.now() - timedelta(days=1)).isoformat()  # Past expiry
        
        success, details, response_data = self.test_api_endpoint('POST', 'batches', invalid_batch_data, 400)
        self.log_test("POST /api/batches (invalid expiry)", success, details, response_data)
        
        # Test GET batches with filters
        success, details, response_data = self.test_api_endpoint('GET', f'batches?productId={product["id"]}')
        self.log_test("GET /api/batches?productId=X", success, details, response_data)

    def test_inventory_stock_api(self):
        """Test Inventory Stock API"""
        print("\n📊 Testing Inventory Stock API...")
        
        # Test GET stock summary
        success, details, response_data = self.test_api_endpoint('GET', 'inventory/stock')
        self.log_test("GET /api/inventory/stock", success, details, response_data)
        
        # Test GET stock for specific product
        if self.test_data['products']:
            product = self.test_data['products'][0]
            success, details, response_data = self.test_api_endpoint('GET', f'inventory/stock?productId={product["id"]}')
            self.log_test("GET /api/inventory/stock?productId=X", success, details, response_data)
        
        # Test GET stock with filters
        success, details, response_data = self.test_api_endpoint('GET', 'inventory/stock?lowStock=true')
        self.log_test("GET /api/inventory/stock?lowStock=true", success, details, response_data)
        
        success, details, response_data = self.test_api_endpoint('GET', 'inventory/stock?expiringSoon=true')
        self.log_test("GET /api/inventory/stock?expiringSoon=true", success, details, response_data)

    def test_alerts_api(self):
        """Test Low Stock Alerts API"""
        print("\n🚨 Testing Low Stock Alerts API...")
        
        # Test GET alerts
        success, details, response_data = self.test_api_endpoint('GET', 'alerts/low-stock')
        self.log_test("GET /api/alerts/low-stock", success, details, response_data)
        
        # Test GET alerts with force refresh
        success, details, response_data = self.test_api_endpoint('GET', 'alerts/low-stock?forceRefresh=true')
        self.log_test("GET /api/alerts/low-stock?forceRefresh=true", success, details, response_data)
        
        # Test POST mark alert as processed
        if self.test_data['products']:
            product = self.test_data['products'][0]
            alert_data = {
                "productId": product['id'],
                "action": "mark_processed"
            }
            
            success, details, response_data = self.test_api_endpoint('POST', 'alerts/low-stock', alert_data)
            self.log_test("POST /api/alerts/low-stock (mark processed)", success, details, response_data)

    def test_barcode_api(self):
        """Test Barcode API"""
        print("\n🔍 Testing Barcode API...")
        
        if not self.test_data['products']:
            self.log_test("Barcode API", False, "No products available for barcode testing")
            return
        
        product = self.test_data['products'][0]
        
        # Test GET product by barcode (using SKU)
        success, details, response_data = self.test_api_endpoint('GET', f'products/barcode?barcode={product["sku"]}')
        self.log_test("GET /api/products/barcode?barcode=X", success, details, response_data)
        
        # Test GET with non-existent barcode
        success, details, response_data = self.test_api_endpoint('GET', 'products/barcode?barcode=NONEXISTENT', expected_status=404)
        self.log_test("GET /api/products/barcode (not found)", success, details, response_data)
        
        # Test POST update barcode
        barcode_data = {
            "productId": product['id'],
            "barcode": f"BARCODE-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        }
        
        success, details, response_data = self.test_api_endpoint('POST', 'products/barcode', barcode_data)
        self.log_test("POST /api/products/barcode", success, details, response_data)

    def test_database_connectivity(self):
        """Test basic database connectivity through API"""
        print("\n🗄️ Testing Database Connectivity...")
        
        # Test if APIs are responding (indicates DB connection)
        endpoints_to_test = [
            'products',
            'suppliers', 
            'batches',
            'inventory/stock',
            'alerts/low-stock'
        ]
        
        for endpoint in endpoints_to_test:
            success, details, response_data = self.test_api_endpoint('GET', endpoint)
            self.log_test(f"DB Connectivity via {endpoint}", success, f"Database accessible via {endpoint}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Inventory Management API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test database connectivity first
        self.test_database_connectivity()
        
        # Test all API endpoints
        self.test_suppliers_api()
        self.test_products_api()
        self.test_batches_api()
        self.test_inventory_stock_api()
        self.test_alerts_api()
        self.test_barcode_api()
        
        # Print final results
        self.print_results()
        
        return self.results['failed_tests'] == 0

    def print_results(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed_tests']} ✅")
        print(f"Failed: {self.results['failed_tests']} ❌")
        print(f"Success Rate: {(self.results['passed_tests']/self.results['total_tests']*100):.1f}%")
        
        if self.results['errors']:
            print("\n❌ FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        print("\n📋 DETAILED RESULTS:")
        for test in self.results['test_details']:
            print(f"  {test['status']} {test['test_name']}")
            if test['details']:
                print(f"    └─ {test['details']}")

    def save_results_to_file(self, filename: str = None):
        """Save test results to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"/app/test_reports/backend_test_results_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
        
        print(f"\n💾 Results saved to: {filename}")
        return filename

def main():
    """Main test execution"""
    tester = InventoryAPITester()
    
    try:
        success = tester.run_all_tests()
        results_file = tester.save_results_to_file()
        
        # Return appropriate exit code
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)