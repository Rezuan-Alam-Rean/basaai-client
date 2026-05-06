import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["react-router"] = path.resolve(__dirname, "src/lib/compat/react-router.tsx");
    config.resolve.alias["react-router-dom"] = path.resolve(__dirname, "src/lib/compat/react-router-dom.tsx");
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;