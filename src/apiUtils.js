import { API } from "aws-amplify";

jobs() {
  return API.get("jobs", "/jobs");
}
