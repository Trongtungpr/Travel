import {
  checkWeatherSubmit,
  updateUI,
} from "../src/client/js/formHandler";

describe("Verify the function is exits", () => {
  test("handleSubmit() function", () => {
    expect(checkWeatherSubmit).toBeDefined();
  });

  test("updateUI() function", () => {
    expect(updateUI).toBeDefined();
  });
});
