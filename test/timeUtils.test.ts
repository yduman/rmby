import { calcTimeDiff, TimeUnit } from "../src/timeUtils";

describe("timeUtils", () => {
  describe("calcTimeDiff()", () => {
    test("should calculate correct milliseconds difference", () => {
      // arrange
      const lastModifiedTime = new Date(Date.now() - 500);

      // act
      const diff = calcTimeDiff(TimeUnit.MILLIS, lastModifiedTime);

      // assert
      expect(diff).toBe(500);
    });

    test("should calculate correct seconds difference", () => {
      // arrange
      const lastModifiedTime = new Date(Date.now() - 1000 * 30);

      // act
      const diff = calcTimeDiff(TimeUnit.SECONDS, lastModifiedTime);

      // assert
      expect(diff).toBe(30);
    });

    test("should calculate correct minutes difference", () => {
      // arrange
      const lastModifiedTime = new Date(Date.now() - 1000 * 60 * 15);

      // act
      const diff = calcTimeDiff(TimeUnit.MINUTES, lastModifiedTime);

      // assert
      expect(diff).toBe(15);
    });

    test("should calculate correct hours difference", () => {
      // arrange
      const lastModifiedTime = new Date(Date.now() - 1000 * 60 * 60 * 6);

      // act
      const diff = calcTimeDiff(TimeUnit.HOURS, lastModifiedTime);

      // assert
      expect(diff).toBe(6);
    });
  });
});
