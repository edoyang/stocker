import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key});

  @override
  ProductScreenState createState() => ProductScreenState();
}

class ProductScreenState extends State<ProductScreen> {
  List<dynamic> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<String?> _getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwtToken');
  }

  // Fetch product data from the API
  Future<void> fetchProducts() async {
    String? token = await _getToken();

    if (token != null) {
      setState(() {
        isLoading = true;
      });

      final response = await http.get(
        Uri.parse('https://stocker-server.vercel.app/api/products/expired'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> productList = json.decode(response.body);
        setState(() {
          products = productList;
          isLoading = false;
        });
      } else if (response.statusCode == 401) {
        _showAlert(
            "Authorization Error", "Session expired. Please log in again.");
      } else {
        setState(() {
          isLoading = false;
        });
        _showAlert("Error", "Failed to load products");
      }
    } else {
      _showAlert("Authorization Error", "User is not logged in");
    }
  }

  // Collect product based on barcode
  Future<void> collectProduct(String barcode) async {
    String? token = await _getToken();

    if (token != null) {
      final url = Uri.parse(
          'https://stocker-server.vercel.app/api/product/collect/$barcode');

      try {
        final response = await http.post(
          url,
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
          },
        );

        if (response.statusCode == 200) {
          _showAlert('Success', 'Item collected successfully');
          await fetchProducts(); // Refresh the products after collection
        } else if (response.statusCode == 401) {
          _showAlert(
              'Authorization Error', 'Session expired. Please log in again.');
        } else {
          _showAlert('Error', 'Failed to collect the item');
        }
      } catch (e) {
        _showAlert('Error', 'An error occurred while collecting the item');
      }
    } else {
      _showAlert('Authorization Error', 'User is not logged in');
    }
  }

  // Function to show confirmation dialog
  void _showConfirmationDialog(BuildContext context, String barcode) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Collect this item?'),
          content: const Text('Are you sure you want to collect this item?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Dismiss the dialog
              },
              child: const Text('No'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Dismiss the dialog
                collectProduct(barcode); // Call the API to collect the product
              },
              child: const Text('Yes'),
            ),
          ],
        );
      },
    );
  }

  // Function to show alert dialog
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
                Navigator.of(context).pop(); // Dismiss the dialog
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
    // Calculate the childAspectRatio based on the available screen width
    double cardHeight = 300;
    double gridWidth =
        MediaQuery.of(context).size.width / 2 - 20; // 2 columns with padding
    double aspectRatio = gridWidth / cardHeight;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
      ),
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, // 2 columns
                  mainAxisSpacing: 10, // Space between rows
                  crossAxisSpacing: 10, // Space between columns
                  childAspectRatio: aspectRatio, // Dynamic aspect ratio
                ),
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final product = products[index];
                  return GestureDetector(
                    onTap: () => _showConfirmationDialog(
                        context, product['productBarcode'].toString()),
                    child: ProductCard(
                      productName: product['productName'] ?? 'Unknown',
                      productImage: product['productImage'] ??
                          'https://via.placeholder.com/150',
                      productBarcode: product['productBarcode'].toString(),
                      productExpiryDate: product['expiryDate'] ?? 'Unknown',
                    ),
                  );
                },
              ),
            ),
    );
  }
}

class ProductCard extends StatelessWidget {
  final String productName;
  final String productImage;
  final String productBarcode;
  final String productExpiryDate;

  const ProductCard({
    super.key,
    required this.productName,
    required this.productImage,
    required this.productBarcode,
    required this.productExpiryDate,
  });

  // Method to format date
  String _formatDate(String date) {
    try {
      DateTime parsedDate = DateTime.parse(date);
      return DateFormat('dd-MM-yy').format(parsedDate);
    } catch (e) {
      return 'Invalid Date'; // Handle invalid date string
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Image.network(
            productImage,
            height: 150, // Image height
            width: 150,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => Image.network(
              'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
              height: 150,
              width: 150,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            productName,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 8),
          Text(
            productBarcode,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Expiry Date: ${_formatDate(productExpiryDate)}',
            style: const TextStyle(fontSize: 12, color: Colors.red),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
