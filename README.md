![cover-v5-optimized](apps\web\public\twitter-og.jpg)

<p align="center">
  <a href="https://cloud.athera.blog">Home</a> ·
  <a href="https://docs.athera.blog/getting-started/install-self-hosted">Self-hosting</a> ·
  <a href="https://docs.athera.blog">Documentation</a> ·
  <a href="https://udify.app/chat/22L1zSxg6yW1cWQg">Sign Up</a>
</p>

<p align="center">
    <a href="https://athera.blog" target="_blank">
        <img alt="Static Badge" src="https://img.shields.io/badge/Product-F04438"></a>
    <a href="https://athera.blog/pricing" target="_blank">
        <img alt="Static Badge" src="https://img.shields.io/badge/free-pricing?logo=free&color=%20%23155EEF&label=pricing&labelColor=%20%23528bff"></a>
   <a href="https://github.com/documenso/documenso/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-purple" alt="License"></a>
</p>

Athera is an open source blogging social network similar to Medium, Dev and HashNode. Users can create an share content on the platform
</br> </br>

## Feature Roadmap

-   [ ] Mercury
-   [x] Venus
-   [x] Earth (Orbit/Moon)
-   [x] Mars
-   [ ] Jupiter
-   [ ] Saturn
-   [ ] Uranus
-   [ ] Neptune
-   [ ] Comet Haley

## Tech Stack

-   [![TypeScript](https://img.shields.io/badge/Typescript-4.4.2-blue)](https://www.typescriptlang.org/) - Language
-   [![Next.js](https://img.shields.io/badge/Next.js-12.0.0-black)](https://nextjs.org/) - Framework
-   [![Prisma](https://img.shields.io/badge/Prisma-3.0.2-green)](https://www.prisma.io/) - ORM
-   [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-2.2.16-blue)](https://tailwindcss.com/) - CSS
-   [![shadcn/ui](https://img.shields.io/badge/shadcn--ui-0.2.0-yellow)](https://ui.shadcn.com/) - Component Library
-   [![NextAuth.js](https://img.shields.io/badge/NextAuth.js-3.3.1-orange)](https://next-auth.js.org/) - Authentication
-   [![react-email](https://img.shields.io/badge/react--email-0.0.1-lightgrey)](https://react.email/) - Email Templates
-   [![tRPC](https://img.shields.io/badge/tRPC-10.0.0-red)](https://trpc.io/) - API
-   [![documenso/pdf-sign](https://img.shields.io/badge/documenso%2Fpdf--sign-launching%20soon-red)](https://www.npmjs.com/package/@documenso/pdf-sign) - PDF Signatures (launching soon)
-   [![React-PDF](https://img.shields.io/badge/React--PDF-5.0.0-yellow)](https://github.com/wojtekmaj/react-pdf) - Viewing PDFs
-   [![PDF-Lib](https://img.shields.io/badge/PDF--Lib-1.17.1-lightgreen)](https://github.com/Hopding/pdf-lib) - PDF manipulation
-   [![Stripe](https://img.shields.io/badge/Stripe-Payments-blue)](https://stripe.com/) - Payments
-   [![Vercel](https://img.shields.io/badge/Vercel-Deployment-black)](https://vercel.com)

## Quick start

> Before installing Athera, make sure your machine should have the following software installed:
>
> -   Docker
> -   NodeJS

</br>
Want to get up and running quickly? Follow these steps:

1. [Fork this repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) to your GitHub account.

After forking the repository, clone it to your local device by using the following command:

```sh
git clone https://github.com/<your-username>/documenso
```

2. Set up your `.env` file using the recommendations in the `.env.example` file. Alternatively, just run `cp .env.example .env` to get started with our handpicked defaults.

3. Run `npm run dx` in the root directory

    - This will spin up a postgres database and inbucket mailserver in a docker container.

4. Run `npm run dev` in the root directory

#### Access Points for Your Application

1. **App** - http://localhost:3000
2. **Incoming Mail Access** - http://localhost:9000
3. **Database Connection Details**

    - **Port**: 54320
    - **Connection**: Use your favorite database client to connect using the provided port.

4. **S3 Storage Dashboard** - http://localhost:9001

## Contributing

For those who'd like to contribute code, see our [Contribution Guide](https://github.com/langgenius/dify/blob/main/CONTRIBUTING.md).

## License

This repository is available under the [Athera Open Source License](LICENSE), which is essentially Apache 2.0 with a few additional restrictions.
