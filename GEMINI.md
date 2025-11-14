# Project: PortaGen

## Project Overview

PortaGen is a Next.js application that allows users to create and customize their own pixel-art-themed digital portfolios. The application provides a desktop-like experience where users can customize their wallpaper, arrange icons, and embed music. It uses Clerk for user authentication, Drizzle ORM for interacting with a PostgreSQL database, and Tailwind CSS for styling. The frontend is built with React and utilizes various libraries, including GSAP for animations, Radix UI for accessible components, and shadcn/ui for UI components.

## Building and Running

To get the project up and running, follow these steps:

1.  **Install dependencies:**
    ```bash
    yarn install
    ```

2.  **Run the development server:**
    ```bash
    yarn dev
    ```

3.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Database

The project uses Drizzle ORM to manage the database schema and queries. The following scripts are available for database management:

*   `yarn db:generate`: Generates a new migration based on schema changes.
*   `yarn db:push`: Pushes the schema changes to the database.
*   `yarn db:migrate`: Applies all pending migrations.

**Note:** The database connection string in `drizzle.config.ts` contains sensitive credentials and should be moved to a secure environment variable.

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** Reusable components are located in the `src/components` directory.
*   **Authentication:** User authentication is handled by Clerk.
*   **Database:** Drizzle ORM is used for all database interactions. The database schema is defined in `src/lib/db/schema.ts`.
*   **Linting:** The project uses ESLint for code linting. Run `yarn lint` to check for linting errors.
