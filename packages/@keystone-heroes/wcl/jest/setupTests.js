jest.mock("@keystone-heroes/db/prisma", () => {
  return {
    prisma: jest.fn(),
  };
});
