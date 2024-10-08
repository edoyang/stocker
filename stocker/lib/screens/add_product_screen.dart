import 'package:flutter/material.dart';
import 'package:barcode_scan2/barcode_scan2.dart';
import 'package:stocker/services/product_service.dart';
import 'package:intl/intl.dart';

class AddProductScreen extends StatefulWidget {
  const AddProductScreen({super.key});

  @override
  AddProductScreenState createState() => AddProductScreenState();
}

class AddProductScreenState extends State<AddProductScreen> {
  final ProductService _productService = ProductService();
  final TextEditingController _barcodeController = TextEditingController();
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _productNameController = TextEditingController();
  final TextEditingController _productImageController = TextEditingController();

  bool isExpired = false;
  bool isProductFound = false;

  @override
  void dispose() {
    _barcodeController.dispose();
    _dateController.dispose();
    _productNameController.dispose();
    _productImageController.dispose();
    super.dispose();
  }

  Future<void> _fetchProductDetails(String barcode) async {
    final productData = await _productService.fetchProductDetails(barcode);

    if (productData != null) {
      setState(() {
        _productNameController.text = productData['productName'];
        isExpired = productData['expired'];
        _dateController.text = productData['expiryDate'] ?? '';
        _productImageController.text = productData['productImage'] ?? '';
        isProductFound = true;
      });
    } else {
      setState(() {
        isProductFound = false;
      });
      _showAlert('Product not found', 'Please add the product');
    }
  }

  Future<void> _addProduct() async {
    final productData = {
      'productName': _productNameController.text,
      'productBarcode': int.tryParse(_barcodeController.text) ?? 0,
      'productImage': _productImageController.text,
      'expired': isExpired,
      'expiryDate': isExpired ? _dateController.text : null,
    };

    final success = await _productService.addProduct(productData);
    if (success) {
      _showAlert('Success', 'Product added successfully');
    } else {
      _showAlert('Error', 'Failed to add product');
    }
  }

  Future<void> _updateProduct() async {
    final barcode = _barcodeController.text;
    final productData = {
      'productName': _productNameController.text,
      'expired': isExpired,
      'expiryDate': isExpired ? _dateController.text : null,
    };

    final success = await _productService.updateProduct(barcode, productData);
    if (success) {
      _showAlert('Success', 'Product updated successfully');
    } else {
      _showAlert('Error', 'Failed to update product');
    }
  }

  void _showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Product')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBarcodeField(),
            const SizedBox(height: 10),
            _buildProductNameField(),
            const SizedBox(height: 10),
            _buildExpiredSwitch(),
            const SizedBox(height: 10),
            if (isExpired) _buildExpiryDateField(),
            const SizedBox(height: 10),
            _buildProductImageField(),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: isProductFound ? _updateProduct : _addProduct,
              child: Text(isProductFound ? 'Update Product' : 'Add Product'),
            ),
          ],
        ),
      ),
    );
  }

  TextField _buildBarcodeField() {
    return TextField(
      controller: _barcodeController,
      decoration: const InputDecoration(
        prefixIcon: Icon(Icons.qr_code),
        filled: true,
        labelText: 'Barcode',
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.deepPurple),
        ),
      ),
      readOnly: true,
      onTap: _scanBarcode,
    );
  }

  TextField _buildProductNameField() {
    return TextField(
      controller: _productNameController,
      decoration: const InputDecoration(
        labelText: 'Product Name',
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.deepPurple),
        ),
      ),
    );
  }

  Row _buildExpiredSwitch() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Expired'),
        Switch(
          value: isExpired,
          onChanged: (value) {
            setState(() {
              isExpired = value;
            });
          },
        ),
      ],
    );
  }

  TextField _buildExpiryDateField() {
    return TextField(
      controller: _dateController,
      decoration: const InputDecoration(
        labelText: 'Expiry Date',
        prefixIcon: Icon(Icons.calendar_today),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.deepPurple),
        ),
      ),
      readOnly: true,
      onTap: _selectDate,
    );
  }

  TextField _buildProductImageField() {
    return TextField(
      controller: _productImageController,
      decoration: const InputDecoration(
        labelText: 'Product Image Link',
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.deepPurple),
        ),
      ),
    );
  }

  Future<void> _scanBarcode() async {
    try {
      var result = await BarcodeScanner.scan();
      if (result.rawContent.isNotEmpty) {
        setState(() {
          _barcodeController.text = result.rawContent;
        });
        await _fetchProductDetails(result.rawContent);
      }
    } catch (e) {
      debugPrint('Error scanning barcode: $e');
    }
  }

  Future<void> _selectDate() async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2024),
      lastDate: DateTime(2030),
    );

    if (picked != null) {
      setState(() {
        // Format the selected date to 'dd-MM-yy'
        _dateController.text = DateFormat('dd-MM-yy').format(picked);
      });
    }
  }
}
