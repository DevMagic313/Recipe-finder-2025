// vite.config.ts
import { defineConfig } from "file:///F:/Programming/Recipe-finder-2025-main/node_modules/vite/dist/node/index.js";
import react from "file:///F:/Programming/Recipe-finder-2025-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "F:\\Programming\\Recipe-finder-2025-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Optimize build output
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-toast"
          ]
        }
      }
    },
    // Generate source maps for production (helps with debugging)
    sourcemap: true
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxQcm9ncmFtbWluZ1xcXFxSZWNpcGUtZmluZGVyLTIwMjUtbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxcUHJvZ3JhbW1pbmdcXFxcUmVjaXBlLWZpbmRlci0yMDI1LW1haW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L1Byb2dyYW1taW5nL1JlY2lwZS1maW5kZXItMjAyNS1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyBPcHRpbWl6ZSBidWlsZCBvdXRwdXRcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBTcGxpdCBjaHVua3MgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIHVpOiBbXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWFjY29yZGlvbicsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWFsZXJ0LWRpYWxvZycsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWFzcGVjdC1yYXRpbycsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWF2YXRhcicsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWNoZWNrYm94JyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWxhYmVsJyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlcicsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCcsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlcGFyYXRvcicsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLFxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCdcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIEdlbmVyYXRlIHNvdXJjZSBtYXBzIGZvciBwcm9kdWN0aW9uIChoZWxwcyB3aXRoIGRlYnVnZ2luZylcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBTLFNBQVMsb0JBQW9CO0FBQ3ZVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2pDLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2pELElBQUk7QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxXQUFXO0FBQUEsRUFDYjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
