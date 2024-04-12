import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";

// src/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (err, req, res) => {
  const { validation, validationContext } = err;
  if (err instanceof ZodError) {
    return res.status(400).send({
      message: "Error during validation",
      errors: err.flatten().fieldErrors
    });
  }
  if (err instanceof BadRequest) {
    return res.status(400).send({ message: err.message });
  }
  return res.status(500).send({ message: "Internal server error!" });
};

export {
  errorHandler
};
