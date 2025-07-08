Stage 1: Build the Next.js application
# Use a Node.js image as the base for building
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock files to install dependencies
# This step is cached if dependencies haven't changed, speeding up builds
COPY package.json yarn.lock* package-lock.json* ./

# Install Node.js dependencies
# Use --frozen-lockfile for Yarn or --ci for npm for reproducible builds
RUN npm install --frozen-lockfile
# If using Yarn: RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
# This command generates the optimized build output in the .next directory
RUN npm run build
# If using Yarn: RUN yarn build

# Stage 2: Create a minimal production image for serving the application
# Use a smaller Node.js image for the final runtime to reduce image size
FROM node:18-alpine

# Set the working directory for the final application
WORKDIR /app

# Copy only the necessary files from the builder stage to the final image
# This includes the built Next.js output, node_modules, and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port on which the Next.js application will run (default is 3000)
EXPOSE 3000

# Define the command to start the Next.js application in production mode
CMD ["npm", "start"]
# If using Yarn: CMD ["yarn", "start"]
