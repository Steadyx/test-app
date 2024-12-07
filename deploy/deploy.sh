#!/bin/bash
set -e

# Define project directory
PROJECT_DIR="/home/${VPS_USER}/websites/test-app"

# Navigate to the websites directory
cd /home/${VPS_USER}/websites || exit

# Check if the project directory exists
if [ ! -d "test-app" ]; then
  echo "Project directory does not exist. Cloning the repository..."
  git clone -b main git@github.com:Steadyx/test-app.git test-app
else
  echo "Project directory exists. Pulling the latest changes from main..."
  cd test-app
  git fetch origin main
  git reset --hard origin/main
fi

cd "$PROJECT_DIR"

# Ensure docker-compose.prod.yml exists
if [ ! -f docker-compose.prod.yml ]; then
  echo "docker-compose.prod.yml not found in the repository. Exiting."
  exit 1
fi

# Remove the existing Docker stack to allow for a new deployment
echo "Removing existing Docker stack..."
docker stack rm test-app || echo "No existing stack to remove."
sleep 10  # Wait for the removal to complete

# Remove network only if it exists
if docker network ls | grep -q "test-app_default"; then
  echo "Network exists, removing it..."
  docker network rm test-app_default || echo "Network already removed or doesn't exist."
  sleep 5  # Wait for the removal of the network
fi

# Deploy the new stack to Docker
echo "Deploying the Docker stack..."
docker stack deploy -c docker-compose.prod.yml test-app

# Optionally, verify that services are running
echo "Verifying service deployment..."
docker stack services test-app

# Optionally, inspect frontend logs for any immediate errors
echo "Checking Frontend logs..."
docker service logs test-app_frontend --tail 100
