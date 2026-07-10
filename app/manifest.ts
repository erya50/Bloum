import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BLOUM – Woman. Human. Part of the story.",
    short_name: "BLOUM",
    description:
      "Digitale Learning Journeys, Workshops & Events und ein kuratierter Concept Store, um Frauen ganzheitlich zu stärken.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#fbf6ef",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
