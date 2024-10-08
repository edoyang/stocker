import 'package:http/http.dart' as http;
import 'dart:convert';

class ProductService {
  static const baseUrl = 'https://stocker-server.vercel.app/api';

  Future<Map<String, dynamic>?> fetchProductDetails(String barcode) async {
    final url = '$baseUrl/product/$barcode';

    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      throw Exception('Failed to fetch product details');
    }
    return null;
  }

  Future<bool> addProduct(Map<String, dynamic> productData) async {
    const url = '$baseUrl/products';

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(productData),
      );
      return response.statusCode == 201;
    } catch (e) {
      throw Exception('Failed to add product');
    }
  }

  Future<bool> updateProduct(
      String barcode, Map<String, dynamic> productData) async {
    final url = '$baseUrl/product-update/$barcode';

    try {
      final response = await http.patch(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(productData),
      );
      return response.statusCode == 200;
    } catch (e) {
      throw Exception('Failed to update product');
    }
  }
}
