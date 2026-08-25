<h1 align="center">🌿 Prostore</h1>
<a name="readme-top"></a>

<div align="center">

</div>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [❓ FAQ](#faq)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 Prostore <a name="about-project"></a>

> **Prostore** is a full-stack e-commerce platform for plant lovers. It lets customers browse and buy plants online, and gives admins a dashboard to manage the store's catalog and orders end to end.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client & Server</summary>
  <ul>
    <li><a href="https://nextjs.org/">Next.js</a> (App Router)</li>
    <li><a href="https://react.dev/">React</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://ui.shadcn.com/">shadcn/ui</a></li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
    <li><a href="https://orm.drizzle.team/">Drizzle ORM</a></li>
  </ul>
</details>

<details>
  <summary>Forms & Validation</summary>
  <ul>
    <li><a href="https://react-hook-form.com/">React Hook Form</a></li>
    <li><a href="https://zod.dev/">Zod</a></li>
  </ul>
</details>

<details>
  <summary>Other Tools</summary>
  <ul>
    <li>Auth.js for authentication</li>
    <li><a href="https://uploadthing.com/">UploadThing</a> for image uploads</li>
    <li><a href="https://sonner.emilkowal.ski/">Sonner</a> for toast notifications</li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

> The main features of the application include:

- **Browsing the plant catalog** with product details, images, and pricing.
- **Cart & checkout flow**, including shipping address and payment method selection.
- **Order history and order tracking** for signed-in users.
- **User authentication** with sign up, sign in, and profile management.
- **Admin dashboard** to create, update, and delete products.
- **Image uploads** for product photos and featured banners.
- **Featured products** highlighted on the homepage.
- **Responsive design** across desktop, tablet, and mobile.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

> To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/) database (local or hosted, e.g. Neon/Supabase)
- npm or yarn

### Setup

Clone this repository to your desired folder:

```sh
git clone git@github.com:your-username/prostore.git
cd prostore
```

Install dependencies:

```sh
npm install
```

Create a `.env` file in the project root with your environment variables:

```env
DATABASE_URL=your_postgres_connection_string
AUTH_SECRET=your_auth_secret
UPLOADTHING_TOKEN=your_uploadthing_token
```

Push the database schema:

```sh
npx drizzle-kit push
```

### Usage

To run the project in development mode, execute:

```sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Run tests

Tests for this project will be added in the future.

### Deployment

You can deploy this project using:

1. Choose a hosting provider (e.g., Vercel, Netlify).
2. Set up your environment variables on the hosting platform.
3. Connect your PostgreSQL database (e.g., Neon, Supabase, Railway).
4. Push your code to the connected repository to trigger a deployment.
5. Access your deployed store using the provided URL or domain.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

# 👥 Authors <a name="authors"></a>

👤 **Your Name**
- GitHub: [@your-github-handle](https://github.com/your-github-handle)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/your-linkedin-handle/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

> Planned future features include:

- Product reviews and ratings.
- Wishlist / favorites.
- Search and filtering by category, price, and availability.
- Discount codes and promotions.
- Order status notifications via email.
- Automated test suite.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/prostore/issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

> If you find this project helpful or you like it, please give it a star ⭐️.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGEMENTS -->

## 🙏 Acknowledgements <a name="acknowledgements"></a>

> Thanks to the open-source community behind Next.js, Drizzle ORM, and shadcn/ui for the tools that made this project possible.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FAQ -->

## ❓ FAQ <a name="faq"></a>

> - **Do I need an account to buy plants?**

  - You can browse the catalog freely, but you'll need to sign up or sign in to complete checkout and view your order history.

> - **Can I manage my own plant listings as a regular user?**

  - No, only admin accounts have access to the product management dashboard. Regular users can browse and purchase products.

> - **What payment methods are supported?**

  - Payment methods are configurable; check the checkout page for the currently supported options.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

> This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>