export enum HTTP_METHODS {
  POST = "POST",
  GET = "GET",
  OPTIONS = "OPTIONS"
}

export interface CorsConfig {
  methods: HTTP_METHODS[];
  origin?: string;
}
