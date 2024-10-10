import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stocker/screens/add_product_screen.dart';
import 'product_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen> with WidgetsBindingObserver {
  Future<int>? _expiredProductCount;
  String _username = 'User'; // Default username

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _fetchUsername();
    _fetchExpiredProductCount();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _fetchExpiredProductCount();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _fetchExpiredProductCount();
  }

  void _fetchExpiredProductCount() {
    setState(() {
      _expiredProductCount = fetchExpiredProductCount();
    });
  }

  // Fetch username from SharedPreferences
  Future<void> _fetchUsername() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? storedUsername =
        prefs.getString('username'); // Assuming 'username' is stored
    setState(() {
      _username = storedUsername ?? 'User'; // Default to 'User' if not found
    });
  }

  Future<int> fetchExpiredProductCount() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('jwtToken');

    if (token == null) {
      throw Exception('No JWT token found');
    }

    final response = await http.get(
      Uri.parse('https://stocker-server.vercel.app/api/products/expired'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.length;
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized - Invalid token');
    } else {
      throw Exception('Failed to load expired products');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddProductScreen()),
          );
          _fetchExpiredProductCount();
        },
        child: const Icon(Icons.add),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 22),
            _greetings(context),
            const SizedBox(height: 16),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1,
                  ),
                  itemCount: _aisleItems.length,
                  itemBuilder: (context, index) {
                    final item = _aisleItems[index];
                    return _buildAisleButton(item['name']!, item['icon']!);
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Padding _greetings(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Hello $_username', // Display the fetched username
            style: GoogleFonts.manrope(
              fontSize: 24,
              fontWeight: FontWeight.w800,
            ),
          ),
          Stack(
            children: [
              IconButton(
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const ProductScreen()),
                  );
                  _fetchExpiredProductCount();
                },
                icon: SvgPicture.asset(
                  'assets/icons/package.svg',
                  colorFilter:
                      const ColorFilter.mode(Colors.black, BlendMode.srcIn),
                ),
              ),
              Positioned(
                right: 4,
                top: 4,
                child: FutureBuilder<int>(
                  future: _expiredProductCount,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const SizedBox(
                        height: 16,
                        width: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      );
                    } else if (snapshot.hasError) {
                      return Container();
                    } else {
                      return Container(
                        height: 16,
                        width: 16,
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(15 / 2),
                        ),
                        child: Text(
                          snapshot.data.toString(),
                          style: GoogleFonts.mPlus1(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: Colors.white),
                          textAlign: TextAlign.center,
                        ),
                      );
                    }
                  },
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  final List<Map<String, String>> _aisleItems = [
    {'name': 'Japanese', 'icon': 'assets/icons/japanese.svg'},
    {'name': 'Korean', 'icon': 'assets/icons/korean.svg'},
    {'name': 'Drinks', 'icon': 'assets/icons/drinks.svg'},
    {'name': 'Snacks', 'icon': 'assets/icons/snacks.svg'},
    {'name': 'Noodles', 'icon': 'assets/icons/noodles.svg'},
    {'name': 'Frozen', 'icon': 'assets/icons/frozen.svg'},
  ];

  Widget _buildAisleButton(String name, String iconPath) {
    return GestureDetector(
      onTap: () {
        // Handle aisle button tap
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset(
            iconPath,
            height: 50,
            width: 50,
            colorFilter: const ColorFilter.mode(Colors.black, BlendMode.srcIn),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            style: GoogleFonts.manrope(
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
