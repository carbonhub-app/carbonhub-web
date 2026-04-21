<div align="center">
  <table border="1">
    <tr>
      <td align="center" style="padding: 20px;">
        <h3>📢 Domain & Email Migration Notice</h3>
        <p>Since <b>19 March 2026</b>, Carbonhub has transitioned to new domains as <code>carbonhub.app</code> was not renewed:</p>
        <p>🌐 <b>Website:</b> <a href="https://carbonhub.faizath.com">carbonhub.faizath.com</a> (formerly <i>carbonhub.app</i>)<br>
        ⚙️ <b>API:</b> <a href="https://carbonhub-api.faizath.com">carbonhub-api.faizath.com</a> (formerly <i>api.carbonhub.app</i>)<br>
        📧 <b>Email:</b> <a href="mailto:contact@carbonhub.faizath.com">contact@carbonhub.faizath.com</a> (formerly <i>contact@carbonhub.app</i>)<br>
        🛰️ <b>CDN:</b> <a>carbonhub-cdn.faizath.com</a> (formerly <i>cdn.carbonhub.app</i>)<br>
        📈 <b>Status Pages:</b> <a href="https://status.faizath.com/status/carbonhub">https://status.faizath.com/status/carbonhub</a> (formerly <i>status.carbonhub.app</i>)
        </p>
      </td>
    </tr>
  </table>
</div>

# CarbonHub Frontend

CarbonHub is a modern web application built with Next.js that provides a platform for carbon credit trading and management. This repository contains the frontend implementation of the CarbonHub platform.

## 🌟 Features

- Modern and responsive user interface
- Real-time carbon credit trading
- Solana blockchain integration
- Interactive charts and data visualization
- Dark/Light theme support
- Form validation and handling
- Toast notifications
- Beautiful animations and transitions

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: [Next.js 15.3.2](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)

### UI Components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Data visualization
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

### Blockchain Integration
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [SPL Token](https://spl.solana.com/token)

### Additional Tools
- [Next Themes](https://github.com/pacocoursey/next-themes) - Theme management
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [Date-fns](https://date-fns.org/) - Date manipulation
- [GSAP](https://greensock.com/gsap/) - Advanced animations

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/carbonhub-app/carbonhub-fe.git
cd carbonhub-fe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint