export type Environment = "development" | "production";

export type EnvironmentConfig<T> = Record<Environment, T>;

export const turnstileSiteKeys: EnvironmentConfig<string> = {
  development: "1x00000000000000000000AA", // Test key for development
  production: "0x4AAAAAACKug4M87x6nUTqC" // Production key (public, safe to commit)
} as const;

export const apiUrls: EnvironmentConfig<string> = {
  development: "http://localhost:8787",
  production: "https://englitune-worker.silvioprog.dev"
} as const;

export const audioUrls: EnvironmentConfig<string> = {
  development: "https://englitune-audio.silvioprog.dev", // We don't have an audio server for development
  production: "https://englitune-audio.silvioprog.dev"
} as const;
