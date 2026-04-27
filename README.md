

# FixKro Admin Panel
UPdate
The official administration dashboard for FixKro - Home appliance repair and maintenance services.

## Technologies

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Axios / Fetch with local/production toggle

## Setup

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Run development server**:
   ```sh
   npm run dev
   ```

3. **Build for production**:
   ```sh
   npm run build
   ```

## Configuration

Control the API environment in the `.env` file:
- `VITE_IS_LOCAL=true`: Connects to `localhost:8085`
- `VITE_IS_LOCAL=false`: Connects to Production Lambda
