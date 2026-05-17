PulseSync ❤️📡

A real-time remote patient monitoring mobile application built with React Native.

PulseSync connects wearable devices via Bluetooth Low Energy (BLE) and streams patient health data such as heart rate, SpO2, and sleep analytics in real time. The application is designed with scalable architecture, reusable components, and Firebase integration to support future doctor dashboards, alerts, and WebRTC consultations.

🚀 Features
✅ Patient Module
BLE wearable device connection
Real-time heart rate monitoring
Health dashboard with live graphs
SpO2 monitoring
Sleep analytics
Alerts screen
Profile management
🔥 Upcoming Features
Doctor dashboard
Multi-patient monitoring
Firebase real-time sync
Push notifications
WebRTC doctor consultation
AI-based health alerts
Offline sync support
🧠 Tech Stack
📱 Mobile
React Native
TypeScript
Redux Toolkit
React Navigation
React Native BLE PLX
Firebase
React Native Gifted Charts
🔧 Architecture
Modular feature-based structure
Reusable component system
Centralized theme management
Clean separation of UI, logic, and services
📁 Project Structure
src/
 ├── navigation/
 │
 ├── screens/
 │    ├── patient/
 │    ├── doctor/
 │    ├── auth/
 │
 ├── components/
 │
 ├── redux/
 │
 ├── services/
 │    ├── bluetooth/
 │    ├── firebase/
 │
 ├── utils/
 │
 ├── theme/
 │
 ├── types/
🎨 Design System

PulseSync uses a centralized theme system for:

Colors
Typography
Spacing
Reusable UI components
🎨 Brand Colors
Type	Color
Primary	#1DA1F2
Secondary	#6C2BD9
Background	#F8FAFC
Success	#00C9A7
Danger	#EF4444
📡 BLE Integration

PulseSync uses:

react-native-ble-plx

for:

Device scanning
BLE connection
Real-time heart rate monitoring
Characteristic subscriptions
🔄 Real-Time Data Flow
Wearable Device
      ↓
Bluetooth (BLE)
      ↓
React Native App
      ↓
Redux Store
      ↓
Firebase
      ↓
Doctor Dashboard (Future)
🏗️ Architecture Principles
✅ Reusable Components

Shared UI components:

AppText
Card
Button
Header
✅ Modular Design

Features are separated into:

Patient
Doctor
Auth
✅ Single Responsibility

Each file/component has one clear responsibility.

📊 Core Modules
Patient Dashboard
Live heart rate
Graph visualization
Device status
Device Connection
Scan BLE devices
Connect wearable
Start monitoring
Alerts
High heart rate
Low oxygen level
🔐 Authentication

Firebase Authentication:

Email/password login
Future role-based login:
Patient
Doctor
📦 Installation
Clone Project
git clone <repo-url>
Install Dependencies
npm install
iOS Setup
cd ios && pod install
▶️ Run Project
Android
npm run android
iOS
npm run ios
🔥 Development Rules
✅ Reuse Existing Components

Always check existing components before creating new ones.

✅ No Hardcoded Styling

Use:

theme.colors
theme.spacing
theme.typography
✅ Keep Files Small
Modular
Reusable
Easy to maintain
🎯 Project Goal

PulseSync aims to provide:

Affordable remote patient monitoring
Real-time wearable integration
Scalable healthcare infrastructure
Mobile-first healthcare accessibility
🚀 Future Vision
Doctor web dashboard
WebRTC video consultation
AI-based health predictions
Multi-device wearable support
Cloud analytics
👨‍💻 Author

Built with ❤️ using React Native and BLE technology.
