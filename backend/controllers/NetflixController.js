import { RestController } from "../helper/RestController.js";
import { COLLECTIONS } from "../db/connection.js";

export class NetflixController extends RestController {
  constructor() {
    super(COLLECTIONS.NETFLIX);
  }
}
