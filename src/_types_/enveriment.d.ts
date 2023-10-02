declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      NEXT_PUBLIC_CLOUDINARY_APIKEY: string;
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: string;
      NEXT_PUBLIC_CLOUDINARY_SECRET: string;
      NEXT_PUBLIC_CLOUDINARY_URL: string;
      NEXT_PUBLIC_CLOUDINARY_NAME: string;

    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }