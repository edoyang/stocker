import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // To parse JSON
import 'package:shared_preferences/shared_preferences.dart'; // To store JWT

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  LoginState createState() => LoginState();
}

class LoginState extends State<Login> {
  // Initialize the logger
  final Logger _logger = Logger();

  // Controllers to capture user input
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Function to handle login button press
  Future<void> _handleLogin() async {
    final String username = _usernameController.text;
    final String password = _passwordController.text;

    // Log username and password
    _logger.i('Username: $username');
    _logger.i('Password: $password');

    if (username.isNotEmpty && password.isNotEmpty) {
      try {
        // Construct the login request
        final response = await http.post(
          Uri.parse(
              'https://stocker-server.vercel.app/api/user/login'), // Your server's login endpoint
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, String>{
            'email': username, // Assuming email is used as the login field
            'password': password,
          }),
        );

        if (!mounted) {
          return; // Ensure the widget is still mounted before using the context
        }

        // Capture the context before the async call
        final BuildContext currentContext = context;

        // Check if login is successful
        if (response.statusCode == 200) {
          // Parse the JSON response
          final Map<String, dynamic> responseData = jsonDecode(response.body);

          // Log the JWT token
          _logger.i('JWT Token: ${responseData['token']}');

          // Save the token using shared_preferences
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString('jwtToken', responseData['token']);

          // Show success message
          if (mounted) {
            ScaffoldMessenger.of(currentContext).showSnackBar(
              const SnackBar(content: Text('Login Successful')),
            );
          }

          // Redirect or navigate to another screen after login (e.g., home screen)
          if (mounted) {
            Navigator.pushReplacementNamed(currentContext, '/home');
          }
        } else {
          // If login fails, show an error
          if (mounted) {
            ScaffoldMessenger.of(currentContext).showSnackBar(
              const SnackBar(
                  content: Text('Login Failed. Invalid credentials.')),
            );
          }
        }
      } catch (e) {
        _logger.e('Error during login: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text('An error occurred. Please try again')),
          );
        }
      }
    } else {
      // If fields are empty, show error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter both fields')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Username (Email) field
            TextField(
              controller: _usernameController,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),

            // Password field
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),

            // Login button
            ElevatedButton(
              onPressed: _handleLogin,
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }
}
