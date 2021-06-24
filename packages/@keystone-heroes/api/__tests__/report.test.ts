import { prisma } from "../jest/prisma";
import { reportHandler } from "../src/functions/report";
import { BAD_REQUEST, SERVICE_UNAVAILABLE } from "../src/utils/statusCodes";
import { testLambda } from "../testUtils/lambda";

const url = "/api/report";
const validReportID = "6WBVqjaxg2HKGm4k";

class ReadableStream implements ReadableStream {
  locked = false;

  cancel = jest.fn();

  getReader = jest.fn();

  pipeThrough = jest.fn();

  tee = jest.fn();

  pipeTo = jest.fn();
}

describe("/api/report", () => {
  test("is protected with isValidReportID-middleware", async () => {
    const response = await testLambda(reportHandler, {
      url,
      searchParams: {
        reportID: "123",
      },
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test("unknown report - warcraftlogs failure", async () => {
    prisma.report.findFirst.mockResolvedValue(null);

    const mockFetch = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      status: 200,
      json: () => Promise.resolve({ data: { report: {} } }),
      ok: true,
      bodyUsed: false,
      blob: jest.fn(),
      arrayBuffer: jest.fn(),
      catch: jest.fn(),
      clone: jest.fn(),
      finally: jest.fn(),
      redirected: false,
      text: jest.fn(),
      then: Promise.resolve(null),
      formData: jest.fn(),
      statusText: "",
      url,
      type: "basic",
      body: new ReadableStream(),
      trailer: Promise.resolve(new Headers()),
    });

    const response = await testLambda(reportHandler, {
      url,
      searchParams: {
        reportID: validReportID,
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [[, requestInit]] = mockFetch.mock.calls;

    const body =
      typeof requestInit?.body === "string" ? requestInit.body : "{}";

    const { query, variables } = JSON.parse(body);

    expect(query).toMatchSnapshot();
    expect(variables).toMatchSnapshot();

    expect(response.status).toBe(SERVICE_UNAVAILABLE);

    const json = await response.json();

    expect(json).toMatchSnapshot();
  });
});
