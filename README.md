<p align="center">
  <img src="/apps/web/public/twitter-og.jpg" alt="image" width="600" />
</p>
<p align="center">
  <a href="https://athera.blog">Home</a> ·
  <a href="https://athera.blog/signup">Sign Up</a>
</p>

<p align="center">
   <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/ArivAfonso/athera?label=collaborators">
   <a href="https://github.com/ArivAfonso/athera/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-purple" alt="License"></a>
   <a href="https://github.com/ArivAfonso/athera/pulse"><img src="https://img.shields.io/github/commit-activity/m/ArivAfonso/athera" alt="Commits-per-month"></a>
</p>

Athera is an open source blogging social network similar to Medium, Dev and HashNode. Users can create an share content on the platform
</br> </br>

## Feature Roadmap

-   [ ] More sources (a never ending pursuit)
-   [ ] Article Recommendations
-   [ ] AI Voiceovers
-   [ ] PWA support

## Tech Stack

-   [![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF)]() - Language
-   [![Next.js](https://img.shields.io/badge/NextJS-black?&logo=next.js&logoColor=white)]() - Framework
-   [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)]() [![Sass](https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff)]() ![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white) - CSS
-   [![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff)]() - Database
-   [![Turborepo](https://img.shields.io/badge/-Turborepo-EF4444?style=flat&logo=turborepo&logoColor=white)]() - Monorepo System
-   [![PNPM](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)]() - Package Manager
-   [![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)]() - Deployment

## Quick start

> Before installing Athera, make sure your machine should have the following software installed:
>
> -   Docker
> -   NodeJS
> -   Supabase CLI
> -   Python 3.8+

</br>
Want to get up and running quickly? Follow these steps:

1. [Fork this repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) to your GitHub account.

After forking the repository, clone it to your local device by using the following command:

```sh
git clone https://github.com/<your-username>/athera
```

2. Run `npm run db:start` and copy the generated values into .env.example in the `apps/web` folder
    - This will spin up a postgres database and inbucket mailserver in a docker container.
3. Rename `.env.example` to `.env.test`

4. Run `npm run dev:local` in the root directory

### Crawler Setup

1. Copy the values from `npm run db:start` and store them in `.env.example` renaming it to `.env`

2. Choose a suitable AI model for summarisation, popular choices include:

-  Gemini 2.0 Flash Lite
- Gpt 4o-mini


The API url should be compatible with OpenAI's python libaries

#### Access Points for Your Application

1. **App** - http://localhost:3000
2. **Incoming Mail Access** - http://localhost:54324
3. **Database Connection Details**

    - **Port**: 54320
    - **Connection**: Use your favorite database client to connect using the provided port.

4. **Supabase Dashboard** - http://localhost:54323

## License

This repository is available under the [GNU Affero General Public License](LICENSE)
