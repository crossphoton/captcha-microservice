FROM node:16.9.0

WORKDIR /app
COPY . .
RUN yarn install
EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:${PORT}/healthz || exit 1

CMD ["yarn", "start"]
