import nextConfig from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

const config = [...nextConfig, ...nextCoreWebVitals, prettier];

export default config;
