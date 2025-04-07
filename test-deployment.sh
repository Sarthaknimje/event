#!/bin/bash

# PCCOE Events Application Deployment Test Script
# Usage: ./test-deployment.sh [deployment-url]
# Example: ./test-deployment.sh https://pccoe-events.vercel.app

# Set default URL if not provided
URL=${1:-"http://localhost:3003"}

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}PCCOE Events Deployment Test Script${NC}"
echo -e "Testing deployment at: ${URL}\n"

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -e "Testing: ${description}"
    echo -n "  Checking ${URL}${endpoint} ... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "${URL}${endpoint}")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}OK (Status: $response)${NC}"
        return 0
    else
        echo -e "${RED}FAILED (Expected: $expected_status, Got: $response)${NC}"
        return 1
    fi
}

# Test main pages
test_endpoint "/" "Home page"
test_endpoint "/events" "Events listing page"
test_endpoint "/auth/login" "Login page"
test_endpoint "/auth/signup" "Signup page"

# Test API endpoints
echo -e "\n${YELLOW}Testing API Endpoints:${NC}"
test_endpoint "/api/events" "Events API"
test_endpoint "/api/events/count" "Events count API"

# Note about authenticated endpoints
echo -e "\n${YELLOW}Note:${NC} Some endpoints require authentication and might return 401/403."
echo "To test them properly, you should log in through the browser and use the session."
echo "The following tests might fail if you're not authenticated:"

# Test potentially authenticated endpoints
test_endpoint "/api/users/me" "Current user API" 401
test_endpoint "/admin/dashboard" "Admin dashboard" 401
test_endpoint "/student/dashboard" "Student dashboard" 401

# Summary
echo -e "\n${YELLOW}Deployment Test Summary:${NC}"
echo "Basic frontend pages and public API endpoints should be accessible."
echo "For full testing, please login through the UI and check all features manually."
echo "Look for the deployment status indicators on the student and admin dashboards."

exit 0 