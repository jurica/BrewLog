# BrewLog

<p align="center">
    <a href="https://github.com/jurica/BrewLog/actions/workflows/build-and-test.yml" target="_blank" rel="noopener"><img src="https://github.com/jurica/BrewLog/actions/workflows/build-and-test.yml/badge.svg?branch=main" alt="build-and-test" /></a>
    <a href="https://github.com/jurica/BrewLog/releases" target="_blank" rel="noopener"><img src="https://img.shields.io/github/release/jurica/BrewLog.svg" alt="Latest releases" /></a>
</p>

A mobile-first web application for tracking coffee bean inventory and brewing activities.

## Overview

BrewLog helps coffee enthusiasts manage their coffee collection and track brewing sessions. Track multiple open bags simultaneously, log individual cups with detailed brewing parameters.

## Status

**MVP** - Core features implemented and (mostly) functional

## Key Features

- **Roaster Management**: Track coffee roasters with website and picture
- **Bean Library**: Reusable library for coffee varieties
- **Bag Management**: Track coffee bags from purchase through opening to finishing
- **Cup Logging**: Record each brew with detailed brewing parameters, rating and pictures
- **Mobile-First**: Optimized for smartphone usage with PWA capabilities

## Core Entities

The application manages four core entities:
- **Roaster**: Coffee roasters with contact information
- **Bean**: Reusable picture library for coffee products
- **Bag**: Coffee bean packages with lifecycle tracking (unopened → open → finished)
- **Cup**: Individual brewed servings logged against bags

## Tech Stack

- **Frontend**: Svelte 5 + TypeScript + Tailwind CSS + shadcn-svelte + sv-router + wuchale (i18n)
- **Backend**: Custom PocketBase implementation
- **Deployment**: Docker with multi-stage build (single binary deployment)
- **PWA**: Manifest and icons configured for installability
- **Playwright**: End-to-end testing

## Getting Started

### Development

**Backend:**
```bash
cd frontend
npm run backend
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Testsuite:**
```bash
cd frontend
npm run test:codegen
npm run test:ui
```

**Update dependencies:**
```bash
cd backend
go get -u -t
go mod tidy

cd frontend
npm outdated
-> check output and update versions
```

### Production Deployment

Build and run with Docker:
```bash
docker build -t brewlog .
docker run -p 8090:8090 -v $(pwd)/pb_data:/app/pb_data brewlog
```

The application will be available at `http://localhost:8090`

## Contributing

This is a personal project. Contributions, suggestions, and feedback are welcome!

## References
- https://github.com/s-petr/longhabit/tree/main
- https://github.com/pocketbase/pocketbase/discussions/7088
- https://puvvadi.net/posts/deploy-pocketbase-with-docker-behind-traefik/
- https://github.com/colinlienard/sv-router
- https://github.com/wuchalejs/wuchale
- https://github.com/pocketbase/js-sdk
- https://github.com/lucide-icons/lucide
- https://github.com/pocketbase/pocketbase
- https://github.com/sveltejs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
