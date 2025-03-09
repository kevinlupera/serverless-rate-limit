import type {
  APIGatewayProxyEventV2,
  Handler,
} from "aws-lambda";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { configDotenv } from "dotenv";

configDotenv();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

export const handler: Handler = async (
  event: APIGatewayProxyEventV2
) => {
  try {
    const timeStart = Date.now();
    const identifier = event.requestContext.http.sourceIp;
    console.time('ratelimit');
    const { success, limit, remaining, pending } = await ratelimit.limit(
      identifier
    );
    console.timeEnd('ratelimit');
    const timeEnd = Date.now();
    console.log(`Time taken: ${timeEnd - timeStart} milliseconds`);
    const timeResult = timeEnd - timeStart;
    const response = {
      success: success,
      limit: limit,
      remaining: remaining,
      timeResult: `${timeResult} milliseconds`,
    };

    // pending is a promise for handling the analytics submission
    await pending;

    if (!success) {
      return {
        statusCode: 429,
        body: JSON.stringify(response),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};