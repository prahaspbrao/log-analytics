FROM node:18-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy Prisma schema BEFORE generate
COPY prisma ./prisma

# 3. Generate Prisma Client INSIDE container
RUN npx prisma generate

# 4. Copy application code
COPY src ./src

EXPOSE 4002

CMD ["node", "src/index.js"]
