# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Depoyment Steps
To deploy Nova, you have many diffrent options depending on where you want to deploy it.

# Deploy Via Pnpm

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3000
git clone https://github.com/sriail/Nova
cd Nova
pnpm i
pnpm build
pnpm tsx server.ts
```

# Deploy Via Vps (Uses pm2)
```bash
#!/bin/bash
# Run this script on your fresh Ubuntu/Debian VPS

set -e

echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Installing pnpm..."
sudo npm install -g pnpm

echo "Installing PM2..."
sudo npm install -g pm2

echo "Installing build essentials..."
sudo apt install -y build-essential git

echo "Server setup complete!"
node --version
pnpm --version
pm2 --version
```

```bash
#!/bin/bash
# Deployment script for EmeraldModern

set -e

APP_NAME="emerald-modern"
APP_DIR="/var/www/emerald-modern"
REPO_URL="https://github.com/sriail/EmeraldModern.git"
BRANCH="main"

echo "Starting deployment of $APP_NAME..."

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    echo "Creating application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
fi

# Navigate to app directory
cd $APP_DIR

# Clone or pull latest code
if [ ! -d ".git" ]; then
    echo "Cloning repository..."
    git clone $REPO_URL .
else
    echo "Pulling latest changes..."
    git fetch origin
    git reset --hard origin/$BRANCH
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ".env file not found!"
    echo "Creating .env template..."
    cat > .env << 'EOF'
OPENROUTER_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=production
EOF
    echo "Please edit .env file with your actual API key!"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build the application
echo "Building application..."
pnpm build

# Stop existing PM2 process
echo "Stopping existing process..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start tsx --name $APP_NAME -- server.ts

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (run once)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "Deployment complete!"
echo "View logs with: pm2 logs $APP_NAME"
echo "Monitor status: pm2 monit"
echo "Restart app: pm2 restart $APP_NAME"
# Deploy On Docker
```
