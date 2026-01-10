FROM node:25-alpine3.22 AS builder-node
COPY . /build
WORKDIR /build/frontend
RUN npm install
RUN npm run build


FROM golang:1.25-alpine AS builder-go
COPY --from=builder-node /build /build
WORKDIR /build/backend
RUN go mod download
RUN go build -tags production

FROM alpine:latest AS runner
WORKDIR /app
COPY --from=builder-go /build/backend/BrewLog .
RUN chmod +x /app/BrewLog

EXPOSE 8090

CMD ["/app/BrewLog", "serve", "--http=0.0.0.0:8090"]
