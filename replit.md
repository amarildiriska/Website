# Riska's Finance

## Overview

Riska's Finance is a professional accounting services website that provides financial guidance and tools for clients. The project is a client-facing web application designed to showcase accounting services, provide financial education through step-by-step guidance, and offer an interactive dashboard for expense tracking and financial management.

The website serves as both a marketing platform for the accounting firm and a practical tool for clients to manage their finances, featuring a clean, modern design with responsive navigation and interactive financial tracking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Multi-Page Application**: Built using vanilla HTML, CSS, and JavaScript without frameworks
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox for layout
- **Component-based Navigation**: Consistent header navigation across all pages with active state management
- **Interactive Dashboard**: Client-side expense tracking with local storage persistence

### Design System
- **CSS Custom Properties**: Centralized color scheme and design tokens in CSS variables
- **Typography**: Inter font family with multiple weights for consistent branding
- **Icon System**: Feather Icons CDN for consistent iconography
- **Brand Identity**: Custom SVG logo with shield and checkmark design in primary orange color

### Client-Side Data Management
- **Local Storage**: Browser-based persistence for transaction data
- **In-Memory State**: JavaScript objects for managing dashboard data and UI state
- **Form Validation**: Client-side validation for expense tracking inputs

### Page Structure
- **Home Page**: Landing page with hero section and service overview
- **About Page**: Company information and team details
- **Contact Page**: Contact forms and business information
- **Steps Page**: Educational content for financial success guidance
- **Dashboard Page**: Interactive expense tracking and financial summary tools

### Navigation System
- **Responsive Menu**: Mobile hamburger menu with smooth transitions
- **Active State Management**: Dynamic highlighting of current page in navigation
- **Smooth Scrolling**: Enhanced UX for anchor link navigation
- **Cross-Page Consistency**: Unified navigation component across all pages

## External Dependencies

### Frontend Libraries
- **Google Fonts**: Inter font family hosting via Google Fonts CDN
- **Feather Icons**: Icon library served via cdnjs.cloudflare.com CDN

### External Integrations
- **Google Forms**: External scheduling system integration for appointment booking
- **Print Functionality**: Browser-based printing for financial reports

### Browser APIs
- **Local Storage API**: Client-side data persistence for transaction history
- **DOM APIs**: Standard web APIs for interactive functionality and form handling