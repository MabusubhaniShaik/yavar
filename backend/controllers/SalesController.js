import { RestController } from "../helper/RestController.js";
import { COLLECTIONS } from "../db/connection.js";

export class SalesController extends RestController {
  constructor() {
    super(COLLECTIONS.SALES);
  }
}
