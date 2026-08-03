# 📱 IMC Events app

A modern mobile application built with **React Native (Expo)**, This app dedicated to present eevents and manage them.

---

## 🚀 Features

- Authentification
- Manage profile Data

---

## 🛠️ Tech Stack

- React Native (Expo)
- Redux Toolkit
- Axios

---

## 📂 Project Structure

```
app/
│
├── assets/              # Images, fonts, icons
├── components/          # Reusable components
├── config/              # theme / APIs / toast / Storage servce
├── data/                # Static Data
├── hooks/               # for camera reusable methods
├── reducers/            # 
├── navigation/          # Navigation setup
├── screens/             # App screens
│
├── store/               # Redux configuration
│   └── index.js         # Store setup
│
├── utils/               # Helpers, constants
└── index.js             # Entry point
```

---

## ⚙️ Installation

```bash
git clone https://github.com/smart-wma/ditteReact.git
cd ditteReact
npm install
```

---

## ▶️ Running the App

- For android: without any issues
```bash
npx expo run:android
```

- For IOS: you should be deploy a version using EAS to test the app on development build mode, after that run this command and scran QR code
```bash
npx expo start
```

---

## 🔐 Environment Variables

Change Base URL on app/services/apiPaths.js:

```
baseURL: "http://192.168.1.13:8000/api/"       # change it to your base url
```
---

## 📦 Build APK / AAB

```bash
npx expo prebuild --clean
cd android
./gradlew clean           # clean the project
./gradlew bundleRelease   # build appbundle
```

Make sure keystore is configured in:
android/app/build.gradle

---

## 📸 Screenshots

_Add screenshots here_

