# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo for MarketHub, a delivery/logistics platform for riders. The app handles order management, trip tracking, and rider authentication.

## Development Commands

- `npm start` - Start Expo development server with dev client
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator  
- `npm run web` - Run in web browser

## Architecture

### Core Structure
- **Entry Point**: `index.ts` registers the main `App.tsx` component
- **Navigation**: Stack-based navigation with authentication flow leading to bottom tabs
- **State Management**: Easy Peasy store (`app/util/token.store.ts`) manages global rider profile data
- **Internationalization**: i18next with English and French support, defaults to French
- **Styling**: React Native Paper components with custom color scheme

### Key Directories
- `app/screens/` - Main application screens (Login, Home, Trips, Account, etc.)
- `app/components/` - Reusable UI components for trip management and modals
- `app/tabs/` - Navigation structure with stack and tab navigators
- `app/config/` - Configuration for colors, constants, and API services
- `app/translation/` - i18n setup and language files (English/French)
- `app/util/` - Global state store, interfaces, and helper utilities

### Navigation Flow
Authentication screens (Login → Verification → Terms) → Main app with bottom tabs (Home, Trips, Account). The app navigator conditionally shows auth screens or main tabs based on rider login state.

### State Management
Global state stores rider profile information including ID, contact details, and authentication status. Components access state via typed Easy Peasy hooks (`useStoreState`, `useStoreActions`).

## Key Technologies
- **Expo 53** with React Native 0.79.5
- **React Navigation** for stack and tab navigation
- **Easy Peasy** for state management
- **i18next** for internationalization
- **React Native Paper** for UI components
- **Axios** for API communication
- **Expo Secure Store** for secure token storage