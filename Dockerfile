# ---- Build C++ ----
FROM gcc:13-bookworm AS build
WORKDIR /app
COPY cpp_engine ./cpp_engine
RUN g++ -O3 -std=c++17 \
    cpp_engine/main.cpp \
    cpp_engine/menu.cpp \
    cpp_engine/pricing_models.cpp \
    -o cpp_engine/pricer

# ---- Run Node ----
FROM node:20-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server.js ./
COPY web_interface ./web_interface
COPY --from=build /app/cpp_engine ./cpp_engine

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
