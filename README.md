# exchange-rate-api-dbglobe

## Overview
**exchange-rate-api-dbglobe** is a web application built using Vue.js 3, leveraging tools like PrimeVue for UI components, Chart.js for visualizations, Pinia for state management, and Axios for HTTP requests. The application is scaffolded using Vite, providing a fast development environment.

## Features
- **Vue.js 3**: Progressive JavaScript framework used to build user interfaces.
- **PrimeVue**: A collection of rich UI components for Vue 3, providing a consistent theme across the app.
- **Chart.js**: Powerful visualization library used for creating interactive charts.
- **Pinia**: State management library that allows for a centralized and reactive state management solution.
- **Axios**: Promise-based HTTP client to interact with external APIs.
- **Vite**: Lightning-fast build tool and development server to enhance the workflow.

## Installation and Setup
To get started with the project locally, follow the instructions below:

### Prerequisites
Ensure that you have the following software installed on your local machine:
- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [Yarn](https://yarnpkg.com/) package manager

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd exchange-rate-api-dbglobe
   ```
3. Install dependencies using Yarn:
   ```bash
   yarn install
   ```

## Running the Project
To run the project in development mode, use the following command:
```bash
yarn dev
```
This will start the development server, and you can access the application at `http://localhost:5173` (or the port specified by Vite).

### Building for Production
To create an optimized build for production:
```bash
yarn build
```
The output will be placed in the `dist` directory.

### Previewing the Production Build
To preview the production build locally:
```bash
yarn preview
```

## Project Structure
The project is organized as follows:
- **src/**: Contains the main application source files.
- **public/**: Static assets like images.
- **components/**: Vue components used throughout the app.
- **store/**: Pinia store setup for state management.
- **router/**: Vue Router configuration for navigation.

## Dependencies
Below are the main dependencies used in the project:
- **[@primevue/themes](https://www.primefaces.org/primevue/showcase/themes)**: Provides various UI themes for the application.
- **[axios](https://github.com/axios/axios)**: For making HTTP requests to APIs.
- **[chart.js](https://www.chartjs.org/)**: Used for data visualizations.
- **[pinia](https://pinia.vuejs.org/)**: Simple and effective state management solution.
- **[primeflex](https://www.primefaces.org/primevue/showcase/#/primeflex)**: A CSS utility library for layout.
- **[primeicons](https://www.primefaces.org/primevue/showcase/#/icons)**: Provides icon packs used in the project.
- **[primevue](https://www.primefaces.org/primevue/)**: Rich set of UI components.
- **[vue-router](https://router.vuejs.org/)**: Handling routing for the application.

## Development Tools
- **[@vitejs/plugin-vue](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)**: Integrates Vue support for Vite.
- **[vite](https://vitejs.dev/)**: Provides a fast development environment and efficient build process.

## Contributing
If you want to contribute to this project, feel free to open an issue or submit a pull request. We appreciate all contributions.

## License
This project is private, but please contact the repository owner if you are interested in collaboration.

## Acknowledgments
- [Vue.js](https://vuejs.org/)
- [PrimeVue](https://www.primefaces.org/primevue/)
- [Chart.js](https://www.chartjs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vite](https://vitejs.dev/)

