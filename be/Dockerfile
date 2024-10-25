FROM denoland/deno:latest as base

WORKDIR /app

COPY . ./

# Create a writable directory for Deno cache
RUN mkdir -p /deno-dir && chmod -R 777 /deno-dir

# Set the DENO_DIR environment variable to the writable cache directory
ENV DENO_DIR=/deno-dir

RUN deno cache main.ts

CMD ["task", "start"]