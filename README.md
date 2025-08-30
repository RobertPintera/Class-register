# Class register
Class Register is a web application built with Vue.js that allows managing students' grades. It provides tools to display detailed statistics about individual students or specific tests. All data is stored locally in the browser, so the app works fully without a backend.

🌐 Access Class Register on GitHub Pages:

## Features

- Store data in IndexedDB
- Create and edit student and test records  
- Display statistics for individual students or tests  
- Sort and filter data in interactive tables
- Configure different ways of editing grades
- Load demo data from settings
- Import and export data in `.json` format

## Tech stack

- **Vue.js** - Core framework for building user interface
- **Typescript** - Typed language that compiles to JavaScript
- **Tailwind CSS** - Utility-first CSS framework for styling and layout
- **Pinia** - State management library for Vue
- **Vue Router** - Client-side routing between pages
- **PrimeVue** - UI components library
- **Chart.js** - Rendering charts and statistics
- **Dexie.js** - Wrapper for IndexedDB, storing data in the browser
- **FileSaver.js** - Exporting data to `.json` files
- **Zod** - Schema validation for forms
- **Uuid** - Generating unique IDs for records

## Configuration

1. **Clone the repository**
```bash
git clone https://github.com/your-username/class-register.git
cd class-register
```
2. **Install dependencies**
```bash
npm install
```
3. **Run development server**
```bash
npm run dev
```
4. **Build for production**
```bash
npm run build
```
5. **Preview production build**
```bash
npm run preview
```

## Preview

### Dashboard
![Peview dashboard](preview/preview_dashboard.png)
### Students list
![Preview students list](preview/preview_studentsList.png)
### Student details
![Preview student details 1](preview/preview_studentDetails_1.png)
![Preview student details 2](preview/preview_studentDetails_2.png)
### Tests list
![Preview tests list](preview/preview_testsList.png)
### Test details
![Preview test details 1](preview/preview_testDetails_1.png)
![Preview test details 2](preview/preview_testDetails_2.png)
### Settings
![Preview settings](preview/preview_settings.png)
