import { Request } from "express";

// interfaces
export interface AuthRequest extends Request {
  user?: any;
  file?: any;
  parsedFilterParams?: any;
  query: any;
  locals?: any;
}
