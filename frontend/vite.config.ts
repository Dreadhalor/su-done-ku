import { defineConfig, PluginOption } from 'vite'; // Import the PluginOption type
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() as PluginOption, tsconfigPaths() as PluginOption], // Cast the plugins to PluginOption
});
