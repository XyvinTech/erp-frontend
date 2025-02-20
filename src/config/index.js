const config = {
  apiUrl: 'http://localhost:5000/api',
  env: 'development',
  get isProduction() {
    return this.env === 'production';
  },
  get isDevelopment() {
    return this.env === 'development';
  },
};

// Override with environment variables if they exist
if (typeof window !== 'undefined') {
  if (window.__NEXT_DATA__?.props?.pageProps?.env) {
    config.env = window.__NEXT_DATA__.props.pageProps.env;
  }
  if (window.__NEXT_DATA__?.props?.pageProps?.apiUrl) {
    config.apiUrl = window.__NEXT_DATA__.props.pageProps.apiUrl;
  }
}

export default config; 