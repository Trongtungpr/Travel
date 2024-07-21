import { isValidData, getCurrentDate, isEndDateValid } from "../src/client/js/formValidate";

describe("Verify the function is exits", () => {
  test("isValidData() function", () => {
    expect(isValidData).toBeDefined();
  });

  test('return 1 when text is not empty', () => {
      expect(isValidData('some random text')).toBe(1);
  });

  test('return 0 when text is empty', () => {
      expect(isValidData('')).toBe(0);
  });

  // isEndDateValid
  test('return 0 when end date is in the pass', () => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 1); // Subtract 1 day from today
    const formattedPastDate = pastDate.toISOString().slice(0, 10);
    expect(isEndDateValid(formattedPastDate)).toBe(0);
  });

  test('return 1 when end date is current date', () => {
    const currentDate = getCurrentDate();
    expect(isEndDateValid(currentDate)).toBe(1);
  });

  test('return 1 when end date is in the future', () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 1); // Add 1 day to today
    const formattedFutureDate = futureDate.toISOString().slice(0, 10);
    expect(isEndDateValid(formattedFutureDate)).toBe(1); 
  });
});