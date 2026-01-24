FROM node:25-alpine3.23 AS builder

# setup go toolchain
# see https://github.com/docker-library/golang/blob/master/1.25/alpine3.23/Dockerfile
RUN apk add --no-cache ca-certificates
ENV GOLANG_VERSION=1.25.6
ENV GOTOOLCHAIN=local
ENV GOPATH=/go
ENV PATH=$GOPATH/bin:/usr/local/go/bin:$PATH
COPY --from=golang:1.25-alpine3.23 --link /usr/local/go /usr/local/go
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 1777 "$GOPATH"

#build BrewLog
COPY . /build
WORKDIR /build
RUN npm install
RUN npm run build

FROM alpine:latest AS runner
WORKDIR /app
COPY --from=builder /build/backend/BrewLog .
RUN chmod +x /app/BrewLog

EXPOSE 8090

CMD ["/app/BrewLog", "serve", "--http=0.0.0.0:8090"]
