# StorySages

## Overview

StorySages is a dynamic web application developed with Vite.js and Firebase, aiming to provide users with an interactive and real-time storytelling platform. Whether you're an aspiring writer, avid reader, or both, StorySages fosters a community where users can contribute to and enjoy collaborative storytelling experiences.

## Live Demo

Experience StorySages live! Click on the link below: [StorySage Live Demo](https://storysages-kh.web.app/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Firebase Configuration](#firebase-configuration)
  - [Firebase setup and Story working](#firebase-setup-and-stories-feed-Implementation)
  - [Firebase Rules](#Firebase-Rules)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- **Real-time Collaboration:** Seamlessly collaborate with others on storytelling projects with Firebase Realtime Database, ensuring that changes made by one user are instantly reflected for all participants.

- **User Authentication:** Utilize Firebase Authentication to secure user accounts, allowing individuals to log in, create, and manage their stories securely.

- **Efficient Development:** Harness the power of Vite.js for rapid development and efficient bundling, ensuring a smooth and responsive user experience.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 8.19.2 or above)
- npm or yarn

### Installation

1. Clone the repository: `git clone https://github.com/HarshitSinghal33/StorySage`
2. Navigate to the project directory: `cd StorySages`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm run dev` or `yarn dev`

## Usage

After setting up the project, visit the provided local server URL to explore the StorySages application and start creating or participating in captivating stories.

## Firebase Configuration

To integrate Firebase with your project:

1. Set up a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
2. Obtain your Firebase configuration details.
3. Replace the placeholder Firebase configuration in the project with your actual configuration.
4. Configure Firebase security rules by adding the following rules to your Firebase Realtime Database:

### Firebase Setup and Stories Feed Implementation
Story have Three feeds - public, private and unlisted.

The stories feature in the app is designed to include three feeds: public, private, and unlisted.

#### Public Feed:
Anyone can access and read stories from the app. Data is fetched and stored in the Firebase publicstories folder, optimizing data retrieval for the app's homepage and user profiles. To fetch data for a specific user profile, a query is used:

``` await fireDb.child(`publicstories`).orderByChild('userID').equalTo(sageID).once('value') ```

#### Private and Unlisted Feeds:
Only the story owner has access to read private story data, while unlisted stories are accessible only to those with the link. Data for these feeds is stored in the sage folder within the user's UID, contributing to improved app performance by targeting specific data retrieval for the owner.

#### Functionality:

When a user creates a public story, the timestamp serves as its key, ensuring stories are displayed in chronological order with the newest stories at the top. In contrast, private or unlisted stories utilize randomly generated Firebase IDs. If a user transitions a story from private or unlisted to public, the current time is employed to place it higher in the hierarchical order, treating it as a new story. Conversely, if a story is initially set as public and later changed to private or unlisted, it maintains its original timestamp, preserving its position and not being counted as a new story, even if the user reverts it to public again.

### Firebase Rules
```json
{
  "rules": {
    "sage": {
      "$uid": {
        ".write": "$uid === auth.uid",
        "userProfileData": {
          ".read": "true"
        },
        "privatestories": {
          ".read": "$uid === auth.uid"
        },
        "unlistedstories": {
          ".read": "true"
        }
      }
    },
    "publicstories": {
      ".read": "true",
      ".indexOn": ["userID"],
      "$storyId": {
        ".write": "(data.exists() && data.child('userID').val() === auth.uid) || (!data.exists() && newData.child('userID').val() === auth.uid)"
      }
    }
  }
}
```
## Deployment

For deployment, follow these steps:

1. Build the project: `npm run build` or `yarn build`
2. Deploy the generated `dist` directory to your hosting platform of choice.

## Built With

- [Vite.js](https://vitejs.dev/) - A fast web development build tool.
- [Firebase](https://firebase.google.com/) - A comprehensive app development platform.

## Dependencies

The project relies on several key dependencies to enhance its functionality and development experience. Here are some of the most important ones:

### [Firebase](https://firebase.google.com/) (^10.5.2)

Firebase is a comprehensive app development platform that provides various services, including real-time databases and authentication. It plays a crucial role in enabling real-time data synchronization and secure user authentication within our application.

### [React](https://reactjs.org/) (^18.2.0) and [React DOM](https://reactjs.org/docs/react-dom.html) (^18.2.0)

React is a powerful JavaScript library for building user interfaces, and React DOM is responsible for rendering React components in the browser. These libraries are the backbone of our front-end, facilitating the creation of interactive and dynamic user interfaces.

### [React Hook Form](https://react-hook-form.com/) (^7.47.0) and [@hookform/resolvers](https://react-hook-form.com/resolvers/yup) (^3.3.2)

React Hook Form is used for managing forms in React applications, providing efficient and flexible form handling. [@hookform/resolvers](https://react-hook-form.com/resolvers/yup) is a resolver for React Hook Form, and in combination with Yup (noted below), it helps validate and manage form data seamlessly.

### [Yup](https://github.com/jquense/yup) (^1.3.2)

Yup is a JavaScript schema builder for value parsing and validation. It's particularly useful in conjunction with React Hook Form to define and enforce validation rules for form fields.

These dependencies, along with others listed in the `package.json` file, contribute to the robustness and feature-rich nature of our project.

## Contributing

We welcome contributions! To get started, fork the repository, make your changes, and submit a pull request. 

## License

This project is licensed under the [MIT License](LICENSE.md).