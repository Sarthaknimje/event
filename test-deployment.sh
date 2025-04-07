#!/bin/bash

# PCCOE Events Application Deployment Test Script
# Usage: ./test-deployment.sh [deployment-url]
# Example: ./test-deployment.sh https://pccoe-events.vercel.app

# Set default URL if not provided
URL=${1:-"http://localhost:3000"}

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
    
    # Use curl with a timeout to prevent hanging
    response=$(curl -s -o /dev/null -w "%{http_code}" "${URL}${endpoint}" --max-time 10)
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}OK (Status: $response)${NC}"
        return 0
    else
        echo -e "${RED}FAILED (Expected: $expected_status, Got: $response)${NC}"
        return 1
    fi
}

# Track success and failure counts
success_count=0
failure_count=0

# Function to track test results
track_test() {
    if [ $1 -eq 0 ]; then
        ((success_count++))
    else
        ((failure_count++))
    fi
}

# Test main pages
echo -e "${YELLOW}Testing Main Pages:${NC}"
test_endpoint "/" "Home page"
track_test $?

test_endpoint "/events" "Events listing page"
track_test $?

test_endpoint "/auth/login" "Login page"
track_test $?

test_endpoint "/auth/signup" "Signup page"
track_test $?

test_endpoint "/dashboard" "Dashboard redirect page"
track_test $?

# Test API endpoints
echo -e "\n${YELLOW}Testing API Endpoints:${NC}"
test_endpoint "/api/events" "Events API"
track_test $?

test_endpoint "/api/auth/login" "Login API (OPTIONS check)" 204
track_test $?

test_endpoint "/api/auth/signup" "Signup API (OPTIONS check)" 204
track_test $?

# Note about authenticated endpoints
echo -e "\n${YELLOW}Note:${NC} Some endpoints require authentication and might return 401/403."
echo "To test them properly, you should log in through the browser and use the session."
echo "The following tests might fail if you're not authenticated:"

# Test potentially authenticated endpoints
test_endpoint "/api/users" "Users API" 401
track_test $?

test_endpoint "/admin/dashboard" "Admin dashboard" 401 
track_test $?

test_endpoint "/student/dashboard" "Student dashboard" 401
track_test $?

# Summary
echo -e "\n${YELLOW}Deployment Test Summary:${NC}"
echo -e "${GREEN}Successful tests: ${success_count}${NC}"
echo -e "${RED}Failed tests: ${failure_count}${NC}"
echo -e "Basic frontend pages and public API endpoints should be accessible."
echo -e "For full testing, please login through the UI and check all features manually."
echo -e "\nMake sure to set up the following environment variables in Vercel:"
echo -e "  MONGODB_URI: Your MongoDB connection string"
echo -e "  NEXTAUTH_SECRET: Random secure string for auth"
echo -e "  NEXTAUTH_URL: ${URL}"

exit 0 