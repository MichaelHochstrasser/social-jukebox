import { CorsConfig } from "../model/CorsConfig";

import { CORS_ALLOWED_ORIGINS } from "./constants";

export const corsEnabledFunctionAuth = (
  req: any,
  res: any,
  config: CorsConfig
) => {
  res.set("Access-Control-Allow-Origin", config.origin || CORS_ALLOWED_ORIGINS);
  res.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", config.methods.join(","));
    res.set("Access-Control-Allow-Headers", "Authorization");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
  }
};
