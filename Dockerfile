# Multi-stage Dockerfile for Spring Boot Backend on Cloud Providers (Render, Railway, Fly.io)

# Stage 1: Build Java 21 Maven application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Limit Maven memory to avoid Render 512MB RAM OOM crash
ENV MAVEN_OPTS="-Xmx384m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"

# Copy Maven pom.xml and source code
COPY backend/pom.xml .
COPY backend/src ./src

# Build production jar skipping tests and suppressing progress
RUN mvn clean package -DskipTests --no-transfer-progress

# Stage 2: Minimal Java 21 JRE runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy compiled jar from build stage
COPY --from=build /app/target/spotify-album-finder-0.0.1-SNAPSHOT.jar app.jar

# Expose default port
EXPOSE 8080

# Run Spring Boot application with dynamic PORT and safe DB fallback
ENTRYPOINT ["sh", "-c", "java -Xmx384m -Dserver.port=${PORT:-8080} -Djwt.secret=${JWT_SECRET:-404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970} -Dspring.datasource.url=${DB_URL:-jdbc:h2:mem:spotifydb;DB_CLOSE_DELAY=-1;MODE=MySQL} -Dspring.datasource.driver-class-name=${DB_DRIVER:-org.h2.Driver} -jar app.jar"]
