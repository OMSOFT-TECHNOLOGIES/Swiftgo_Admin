# 🚀 VSCode Setup Guide - GlobeSwiftGo Dashboard (Tailwind v3)

## Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **VSCode** - Download from [code.visualstudio.com](https://code.visualstudio.com/)
- **Git** (optional but recommended)

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies
Open terminal in VSCode (`Ctrl+`` `) and run:
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

### 🔐 Demo Login Credentials
- **Email:** Any valid email format (e.g., `admin@globeswiftgo.com.gh`)
- **Password:** Any password with 6+ characters (e.g., `password123`)

## 🎨 Features You'll See

### ✅ Working Features:
- **Professional Login System** - Ghana-focused branding with form validation
- **Responsive Dashboard** - Modern admin interface with dark/light themes
- **Interactive Sidebar** - Collapsible navigation with Ghana-specific sections
- **Real-time Elements** - Live badges, notifications, and status indicators
- **Analytics Dashboard** - Charts and KPIs for delivery management
- **Ghana-Specific Design** - Local currency (₵), phone formats (+233), locations

### 📱 Responsive Pages:
- **Dashboard** - Overview with key metrics
- **Orders** - Order management and tracking
- **Riders** - Rider onboarding and management system
- **Live Map** - Real-time location tracking
- **Customers** - Customer management
- **Analytics & Reports** - Advanced insights
- **Notifications** - Push notification management

## 🛠 Recommended VSCode Extensions

### Essential for React + Tailwind Development:
1. **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
2. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
3. **TypeScript Importer** - `pmneo.tsimporter`
4. **Auto Rename Tag** - `formulahendry.auto-rename-tag`
5. **Prettier - Code formatter** - `esbenp.prettier-vscode`
6. **GitLens** - `eamodio.gitlens`

### Install Extensions:
**Method 1: Via VSCode UI**
1. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
2. Search for each extension and click "Install"

**Method 2: Via Command Line**
```bash
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension pmneo.tsimporter
code --install-extension formulahendry.auto-rename-tag
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

## 📁 Project Structure
```
GlobeSwiftGo Dashboard/
├── App.tsx                 # Main application component
├── main.tsx               # React entry point
├── index.html             # HTML template
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Dashboard.tsx     # Dashboard overview
│   ├── Login.tsx         # Authentication
│   ├── Orders.tsx        # Order management
│   ├── Riders.tsx        # Rider management
│   └── ...               # Other feature components
├── styles/               # Global styles
│   └── globals.css       # Tailwind CSS v3 + theme variables
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind v3 configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.ts        # Vite build configuration
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v3.4.0** - Stable utility-first styling
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **Recharts** - Interactive charts
- **Vite** - Fast development and building
- **Motion** - Smooth animations

## 🎯 Tailwind CSS v3 Features

Your project uses **Tailwind CSS v3.4.0 (Stable)** with:

- **Class-based configuration** - Traditional Tailwind config file
- **CSS custom properties** - Dynamic theming with CSS variables
- **Responsive design** - Mobile-first responsive utilities
- **Dark mode support** - Class-based dark mode switching

### Key v3 Features in Your Project:
- **Dark/Light Theme Support** - Automatic theme switching
- **Custom Color System** - Professional design tokens
- **Component Styling** - Enhanced base typography
- **Stable Production Build** - Reliable for production deployment

## 🚨 Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- --port 3001
```

### Module Resolution Issues
1. Clear cache:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Restart TypeScript in VSCode:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "TypeScript: Restart TS Server"

### Tailwind Not Working
1. Ensure Tailwind CSS extension is installed
2. Check `styles/globals.css` imports `@tailwind` directives
3. Verify `tailwind.config.js` configuration
4. Restart development server

### Build Errors
1. Check TypeScript errors in VSCode
2. Ensure all imports are correct
3. Verify component exports
4. Check for missing dependencies

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎯 Customization Guide

### 1. Replace Logo
Replace the data URI in both `App.tsx` and `components/Login.tsx` with your actual logo:
```tsx
const globeSwiftGoLogo = '/path/to/your/logo.png';
```

### 2. Update Branding
- Modify company name in multiple files
- Update color scheme in `styles/globals.css`
- Customize theme variables in CSS custom properties

### 3. Add New Pages
1. Create component in `components/`
2. Add to navigation in `App.tsx`
3. Add route handling in `renderContent()`

### 4. Connect to Backend
- Replace mock data with API calls
- Add authentication endpoints
- Implement real-time updates

## 📝 Important Notes

### Figma Asset Migration
- All `figma:asset` imports have been replaced with fallback logos
- Replace the data URI logos with your actual brand assets
- Images are now using base64 encoded SVG placeholders

### Tailwind v3 vs v4
- Project has been downgraded from Tailwind v4 alpha to v3.4.0 stable
- Configuration uses traditional JavaScript config file
- CSS custom properties work with v3 HSL color format
- All components remain fully functional

## 🆘 Getting Help

If you encounter issues:

1. **Check browser console** for JavaScript errors
2. **Check VSCode terminal** for build errors  
3. **Restart development server** (`Ctrl+C` then `npm run dev`)
4. **Clear browser cache** and reload page
5. **Restart VSCode** if IntelliSense stops working

## 🎊 Success Indicators

You'll know everything is working when you see:

✅ **Login page** loads with Ghana-themed branding  
✅ **Theme toggle** switches between light/dark modes  
✅ **Authentication** works with any email/password  
✅ **Dashboard** shows with sidebar navigation  
✅ **Responsive design** works on different screen sizes  
✅ **No console errors** in browser dev tools  
✅ **Tailwind classes** apply correctly  

## 🚀 Next Steps

After successful setup:

1. **Explore the interface** - Try all sidebar navigation items
2. **Test responsiveness** - Resize browser window
3. **Check dark mode** - Toggle theme in top bar
4. **Review code structure** - Understand component organization
5. **Plan customizations** - Identify what needs modification
6. **Connect to backend** - Replace mock data with real APIs
7. **Deploy to production** - Build and deploy your dashboard

---

**Happy coding! 🇬🇭 Made with ❤️ for Ghana's delivery ecosystem**