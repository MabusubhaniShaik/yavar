import { RestController } from "../helper/RestController.js";
import { COLLECTIONS } from "../db/connection.js";

export class NetflixController extends RestController {
  constructor() {
    super(COLLECTIONS.NETFLIX);
  }

  // Example of overriding a hook if needed
  // async preSave(data) {
  //   // Custom validation or transformation
  //   return data;
  // }
}
