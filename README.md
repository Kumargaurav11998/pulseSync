# PulseSync ❤️📡

A real-time remote patient monitoring mobile application built with React Native.

PulseSync connects wearable devices via Bluetooth Low Energy (BLE) and streams patient health data such as heart rate, SpO2, and sleep analytics in real time. The application is designed with a scalable architecture, reusable components, and Firebase integration to support future doctor dashboards, alerts, and WebRTC consultations.

---

## 🚀 Features

### ✅ Patient Module
- **BLE wearable device connection:** Seamlessly connect to BLE health devices.
- **Real-time heart rate monitoring:** Track heart rate with live graph visualization.
- **SpO2 monitoring:** Monitor blood oxygen levels.
- **Sleep analytics:** Track sleep quality and patterns.
- **Alerts screen:** View critical health alerts.
- **Profile management:** Manage patient details.

### 🔥 Upcoming Features
- **Doctor dashboard:** Specialized UI for healthcare professionals.
- **Multi-patient monitoring:** Monitor multiple patients simultaneously.
- **Firebase real-time sync:** Instant data synchronization.
- **Push notifications:** Critical alerts delivered to your device.
- **WebRTC doctor consultation:** In-app video appointments.
- **AI-based health alerts:** Predictive health monitoring.
- **Offline sync support:** Data storage when offline and sync when online.

---

## 🧠 Tech Stack

### 📱 Mobile
- **React Native**
- **TypeScript**
- **Redux Toolkit**
- **React Navigation**
- **React Native BLE PLX**
- **React Native Gifted Charts**
- **Firebase**

---

## 🔧 Architecture

PulseSync follows strict architectural principles to ensure scalability and maintainability:
- **Modular feature-based structure:** Organized by feature (Patient, Doctor, Auth).
- **Reusable component system:** Centralized shared UI components.
- **Centralized theme management:** Consistent styling across the app.
- **Clean separation:** Decoupled UI, logic, and external services.

### 📁 Project Structure

```text
src/
 ├── navigation/
 ├── screens/
 │    ├── patient/
 │    ├── doctor/
 │    └── auth/
 ├── components/
 ├── redux/
 ├── services/
 │    ├── bluetooth/
 │    └── firebase/
 ├── utils/
 ├── theme/
 └── types/
```

---

## 🎨 Design System

PulseSync uses a centralized theme system to manage:
- **Colors**
- **Typography**
- **Spacing**
- **Reusable UI components**

### 🎨 Brand Colors

| Type | Color |
|---|---|
| **Primary** | `#1DA1F2` |
| **Secondary** | `#6C2BD9` |
| **Background** | `#F8FAFC` |
| **Success** | `#00C9A7` |
| **Danger** | `#EF4444` |

---

## 📡 BLE Integration

PulseSync uses `react-native-ble-plx` for comprehensive Bluetooth communication:
- Device scanning
- BLE connection
- Real-time heart rate monitoring
- Characteristic subscriptions

### 🔄 Real-Time Data Flow
```text
[Wearable Device] 
      ↓ Bluetooth (BLE)
[React Native App]
      ↓
[Redux Store]
      ↓
[Firebase]
      ↓
[Doctor Dashboard (Future)]
```

---

## 🏗️ Architecture Principles

### ✅ Reusable Components
Shared UI components like `AppText`, `Card`, `Button`, and `Header` are extensively used to maintain consistency.

### ✅ Modular Design
Features are logically separated into `Patient`, `Doctor`, and `Auth` modules.

### ✅ Single Responsibility
Each file and component is designed to handle one clear responsibility.

---

## 📊 Core Modules

### Patient Dashboard
- Live heart rate monitoring.
- Dynamic graph visualization.
- Connected device status.

### Device Connection
- Scan for nearby BLE devices.
- Connect to wearables.
- Start monitoring health metrics.

### Alerts
- High heart rate warnings.
- Low oxygen level warnings.

---

## 🔐 Authentication

**Firebase Authentication:**
- Email/password login.
- Future role-based login:
  - Patient
  - Doctor

---

## 📦 Installation

**1. Clone Project**
```bash
git clone <repo-url>
```

**2. Install Dependencies**
```bash
npm install
```

**3. iOS Setup**
```bash
cd ios && pod install
```

---

## ▶️ Run Project

**Android**
```bash
npm run android
```

**iOS**
```bash
npm run ios
```

---

## 🔥 Development Rules

- **✅ Reuse Existing Components:** Always check existing components in `src/components/` before creating new ones.
- **✅ No Hardcoded Styling:** Always use `theme.colors`, `theme.spacing`, and `theme.typography` from the centralized theme.
- **✅ Keep Files Small:** Ensure code is modular, reusable, and easy to maintain.

---

## 🎯 Project Goal

PulseSync aims to provide:
- Affordable remote patient monitoring.
- Real-time wearable integration.
- Scalable healthcare infrastructure.
- Mobile-first healthcare accessibility.

### 🚀 Future Vision
- Doctor web dashboard.
- WebRTC video consultation.
- AI-based health predictions.
- Multi-device wearable support.
- Cloud analytics.

---

**Built with ❤️ using React Native and BLE technology.**
