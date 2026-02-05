# TikTok Ads Creative Flow Simulation

🎯 **Focus**: Real-world API integration, conditional logic, and error handling.

This project is a React application that simulates a TikTok Ads creative setup flow, including OAuth integration, music selection logic, and API error messaging.

## Features

- **TikTok OAuth Simulation**: Connect your advertiser account (supports mock error scenarios like geo-restriction).
- **Ad Creation Form**: Full creative setup with real-time validation.
- **Music Selection Logic**: 
    - Option A: Existing Music ID (with async validation).
    - Option B: Upload Simulation (generates mock IDs).
    - Option C: No Music (conditional on Ad Objective).
- **Mobile Preview**: Real-time 9:16 preview of the ad creative.
- **Graceful Error Handling**: Human-readable error messages for API failures (401, 403, 500 etc.).

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite 7
- **Styling**: Tailwind CSS 4
- **State**: React Context + Hooks
- **Icons**: Lucide React
- **Animation**: Tailwind Animate

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

## OAuth Setup Simulation

Since this is a simulation, you don't need real credentials. However, the system handles specific mock inputs to demonstrate error handling:

- **Connect Account**: Use any text to succeed.
- **Simulate Invalid Credentials**: Enter `invalid` in Client ID or Secret.
- **Simulate Geo-Restriction**: Enter `restricted` in Client ID.

## Music Validation Simulation

- **Valid ID**: Any numeric ID (e.g., `12345`).
- **Invalid ID**: Any ID containing the word `error`.
- **Permission Denied (403)**: Use ID `403`.

## Assumptions & Decisions

1. **Authentication**: Implemented via a `AuthContext` to manage token state globally. Simulated token is stored in `localStorage`.
2. **API Mocking**: A dedicated `mockApi` service replicates the latency and failure modes of real TikTok Ads endpoints.
3. **Conditionality**: Objective choice (Traffic vs Conversions) directly affects the "No Music" option availability as per requirements.
4. **Visuals**: Used a dark, high-contrast theme inspired by TikTok's brand identity.
