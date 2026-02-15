import { RestController } from "../helper/RestController.js";
import { COLLECTIONS } from "../db/connection.js";

export class HrAnalyticsController extends RestController {
  constructor() {
    super(COLLECTIONS.HR_ANALYTICS);
  }
}
