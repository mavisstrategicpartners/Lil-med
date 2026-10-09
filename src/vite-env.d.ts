/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
declare module "*.svg" { const s: string; export default s }
declare module "*.webp" { const s: string; export default s }
declare module "*.png" { const s: string; export default s }
declare module "*.jpg" { const s: string; export default s }
