export enum HTTP_METHODS {
  POST,
  GET,
  OPTIONS
}

export interface CorsConfig {
  methods: HTTP_METHODS[];
  origin?: string;
}
