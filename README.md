# Serverless Rate Limit

A serverless rate limiting implementation using AWS Lambda, the Serverless Framework, and Upstash Redis for rate limiting.

## Project Overview

This project demonstrates how to implement rate limiting in serverless functions using Upstash Redis. It provides a simple HTTP API endpoint that limits requests based on the client's IP address.

## Features

- Serverless architecture deployed on AWS Lambda
- Rate limiting using Upstash Redis
- Sliding window rate limit algorithm
- IP-based rate limiting
- Performance tracking for rate limit operations

## Tech Stack

- **Node.js 20.x**: Runtime environment
- **TypeScript**: Programming language
- **Serverless Framework**: For deployment and local development
- **AWS Lambda**: Hosting the serverless function
- **Upstash Redis**: Redis service for rate limiting
- **dotenv**: For environment variable management

## Project Structure

```
serverless-rate-limit/
├── .env                   # Environment variables (Redis connection details)
├── serverless.yml         # Serverless Framework configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── src/
│   └── demo-rate-limit.ts # Main implementation of rate limiting
├── swagger.yaml           # OpenAPI/Swagger documentation (YAML format)
└── swagger.json           # OpenAPI/Swagger documentation (JSON format)
```

## Implementation Details

### Rate Limiting Logic

The project uses the `@upstash/ratelimit` library with a sliding window algorithm configured to:
- Allow 10 requests per 10-second window per IP address
- Track analytics for rate limiting operations
- Return appropriate HTTP status codes (200 for success, 429 for rate limit exceeded)

### Code Explanation

The main implementation in `src/demo-rate-limit.ts`:

1. Sets up a Redis connection using environment variables
2. Configures a rate limiter with a sliding window algorithm
3. Handles API Gateway requests and extracts the source IP
4. Applies rate limiting based on the IP address
5. Returns appropriate responses with rate limit information
6. Includes performance metrics for the rate limiting operation

## API Documentation

The API is documented using the OpenAPI/Swagger specification in both YAML and JSON formats:

- `swagger.yaml` - YAML format of the API documentation
- `swagger.json` - JSON format of the API documentation

### Viewing the Documentation

You can view the API documentation using Swagger UI by:

1. Using the Swagger Editor online:
   - Visit [https://editor.swagger.io/](https://editor.swagger.io/)
   - Import the `swagger.yaml` or `swagger.json` file

2. Using Swagger UI locally:
   ```
   npm install -g swagger-ui-cli
   swagger-ui-cli serve ./swagger.yaml
   ```

3. Using the Redoc UI:
   ```
   npx redoc-cli serve ./swagger.yaml
   ```

### API Endpoints Documentation

The Swagger documentation provides detailed information about:
- Available endpoints
- Request parameters
- Response formats
- Status codes
- Example responses

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Set up environment variables in `.env`:
   ```
   UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
   UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
   ```

## Usage

### Local Development

To run the service locally:

```
pnpm dev
```

This starts the serverless-offline plugin to simulate AWS Lambda and API Gateway locally.

### Deployment

To deploy to AWS:

```
pnpm deploy
```

This deploys the service to AWS with the "test" stage.

## API Endpoints

### GET /api/v1/demo

Rate-limited endpoint that demonstrates the rate limiting functionality.

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "limit": 10,
  "remaining": 9,
  "timeResult": "123 milliseconds"
}
```

#### Response (Rate Limited - 429 Too Many Requests)

```json
{
  "success": false,
  "limit": 10,
  "remaining": 0,
  "timeResult": "82 milliseconds"
}
```

## Performance

The code includes timing measurements to track the performance of rate limiting operations. These metrics are logged to help understand the impact of the rate limiting on the overall function performance.
