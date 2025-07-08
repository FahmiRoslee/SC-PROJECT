# Stage 1: Build the Next.js application
# Use a Node.js image as the base for building
FROM node:18-alpine as builder

WORKDIR /app

# Declare build arguments for Supabase credentials
# These will be passed from the 'docker build' command
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set these as environment variables *inside the container* for the build process
# This makes them available to 'npm run build'
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

COPY package.json yarn.lock* package-lock.json* ./
RUN npm install --frozen-lockfile
# If using Yarn: RUN yarn install --frozen-lockfile

COPY . .

RUN npm run build # This command now has access to the Supabase env vars
# If using Yarn: RUN yarn build

# Stage 2: Create a minimal production image for serving the application
FROM node:18-alpine

WORKDIR /app

# Re-declare and set ENV variables for the final runtime image
# This is important if your app needs them at runtime (which it likely does for client-side Supabase)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}


# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
# If using Yarn: CMD ["yarn", "start"]