# Multi-stage Dockerfile for Spring Boot Backend on Cloud Providers (Render, Railway, Fly.io)

# Stage 1: Build Java 21 Maven application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven pom.xml and source code
COPY backend/pom.xml .
COPY backend/src ./src

# Build production jar skipping tests
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java 21 JRE runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy compiled jar from build stage
COPY --from=build /app/target/spotify-album-finder-0.0.1-SNAPSHOT.jar app.jar

# Expose default port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
