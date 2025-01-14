# Golden Rat - Lottery Management App

Golden Rat is a mobile application designed to manage lottery sales, results, and user authentication. This project uses **Ionic**, **Angular**, **Auth0**, and **SQLite** to provide a seamless user experience for lottery management.

## Features

1. **User Authentication**:
   - Login using Auth0 (email/password or social login).
   - Session management stored locally using SQLite.

2. **Lottery Management**:
   - Create, edit, and delete lotteries.
   - Types of lotteries supported: Numbers and Animalitos.
   - Define schedules for lottery draws.

3. **Sales Management**:
   - Register lottery sales by selecting a lottery, an option (number or animalito), and an amount.
   - View a history of registered sales.

4. **Income Reports**:
   - Calculate total income from sales for a specific period.

5. **Results and Prizes**:
   - Record lottery results.
   - Determine and display winning options.

## Technology Stack

- **Framework**: Ionic + Angular
- **Backend**: No backend required for MVP (SQLite used for local data storage)
- **Authentication**: Auth0
- **Database**: SQLite (using Ionic Storage for web testing)
- **Deployment**: Android and iOS

## Project Setup

### Prerequisites

- **Node.js** (v18 or later)
- **Ionic CLI**
- **Capacitor**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bemonio/golden-rat.git
   cd golden-rat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add Ionic Storage:
   ```bash
   npm install @ionic/storage-angular
   npm install cordova-sqlite-storage
   ```

4. Add Auth0:
   ```bash
   npm install @auth0/auth0-spa-js
   ```

### Running the App

#### Web Version

```bash
ionic serve
```

#### Android/iOS Version

1. Add the platform:
   ```bash
   ionic capacitor add android
   ionic capacitor add ios
   ```
2. Open the platform-specific project:
   ```bash
   ionic capacitor open android
   ionic capacitor open ios
   ```
3. Run the app on an emulator or connected device.

### Environment Configuration

Create an `environment.ts` file in the `src/environments` folder with the following structure:

```typescript
export const environment = {
  production: false,
  auth0: {
    domain: '<YOUR_AUTH0_DOMAIN>',
    clientId: '<YOUR_AUTH0_CLIENT_ID>',
    callbackUrl: 'https://<YOUR_APP_URL>/callback'
  }
};
```

Replace `<YOUR_AUTH0_DOMAIN>`, `<YOUR_AUTH0_CLIENT_ID>`, and `<YOUR_APP_URL>` with your Auth0 credentials.

### Folder Structure

```
/golden-rat
├── src
│   ├── app
│   │   ├── components   # Reusable components (e.g., menu)
│   │   ├── pages        # Individual pages (e.g., home, settings, history)
│   │   ├── services     # Application services (e.g., auth, lottery, sales)
│   │   ├── models       # Data models (e.g., User, Lottery)
│   │   └── app.module.ts
│   ├── environments     # Environment-specific configuration
│   └── index.html
├── capacitor.config.ts  # Capacitor configuration
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please contact Billy Yanez.

---

Happy coding! 🚀

