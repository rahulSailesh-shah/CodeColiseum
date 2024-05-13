# Use the official Bun image as the base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json  ./

# Install dependencies
RUN bun install

# Copy the Prisma schema 
COPY prisma ./prisma

# Generate the Prisma client
RUN bunx prisma generate

# Copy the rest of the application code
COPY . .

# Expose port 3000 to allow communication to/from server
EXPOSE 3000

# Set the entry point
CMD ["bun", "run", "dev"]