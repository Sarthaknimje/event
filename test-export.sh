#!/bin/bash

echo "PCCOE Event Management System - Export API Test Script"
echo "----------------------------------------------"
echo

# Base URL
BASE_URL="http://localhost:3000/api"

# Test 1: Export users/students data
echo "Test 1: Exporting users data..."
curl -s -X GET $BASE_URL/users/export | jq

echo
echo "All tests completed!" 