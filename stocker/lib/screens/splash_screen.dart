import 'package:flutter/material.dart';
import 'package:stocker/screens/login_screen.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Schedule a future action to navigate to HomeScreen after 3 seconds.
    Future.delayed(const Duration(seconds: 3), () {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const Login()),
        (route) => false,
      );
    });

    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/launch_screen.png'),
          fit: BoxFit.cover, // Ensures the image covers the entire screen
        ),
      ),
    );
  }
}
