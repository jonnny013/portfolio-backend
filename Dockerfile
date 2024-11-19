FROM denoland/deno:2.0.6

# The port that your application listens to.
EXPOSE 1993

WORKDIR /app

# Create and set proper permissions for the working directory
RUN mkdir -p /app && chown -R deno:deno /app

# Switch to deno user
USER deno

# Copy dependency files first
COPY --chown=deno:deno . .

# Cache the dependencies
RUN deno cache  main.ts

# Run the application
CMD ["run",  "--allow-net", "--allow-read", "--allow-env",  "main.ts"]