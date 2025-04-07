#!/bin/bash

# Test script for PCCOE Event Management System API
# Make sure MongoDB is running at mongodb://localhost:27017/clg

# Base URL
BASE_URL="http://localhost:3000/api"
AUTH_TOKEN=""
USER_ID=""
EVENT_ID=""

echo "Testing PCCOE Event Management System API"
echo "----------------------------------------"

# Function to make API requests
function call_api {
  local method=$1
  local endpoint=$2
  local data=$3
  
  if [ -z "$data" ]; then
    curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json"
  else
    curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data"
  fi
}

# Test auth endpoints
echo "Testing auth endpoints..."

# Test signup
echo "1. Testing signup API..."
SIGNUP_RESPONSE=$(call_api "POST" "/auth/signup" '{
  "name": "Test Student",
  "email": "test.student@pccoepune.org",
  "password": "password123",
  "prn": "12345",
  "class": "TE",
  "division": "A"
}')
echo "$SIGNUP_RESPONSE" | grep -q "success"
if [ $? -eq 0 ]; then
  echo "✅ Signup API working"
  USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d':' -f2 | tr -d '"')
else
  echo "❌ Signup API failed"
  echo "$SIGNUP_RESPONSE"
fi

# Test login
echo "2. Testing login API..."
LOGIN_RESPONSE=$(call_api "POST" "/auth/login" '{
  "email": "test.student@pccoepune.org",
  "password": "password123"
}')
echo "$LOGIN_RESPONSE" | grep -q "success"
if [ $? -eq 0 ]; then
  echo "✅ Login API working"
else
  echo "❌ Login API failed"
  echo "$LOGIN_RESPONSE"
fi

# Test events endpoints
echo "Testing events endpoints..."

# Create an event
echo "3. Testing create event API..."
EVENT_RESPONSE=$(call_api "POST" "/events" '{
  "title": "Test Technical Workshop",
  "description": "This is a test event for API testing",
  "date": "2023-12-30",
  "time": "10:00 AM",
  "location": "Seminar Hall 1, PCCOE",
  "category": "technical",
  "organizer": "Computer Department",
  "registrationDeadline": "2023-12-25",
  "capacity": 50
}')
echo "$EVENT_RESPONSE" | grep -q "success"
if [ $? -eq 0 ]; then
  echo "✅ Create event API working"
  EVENT_ID=$(echo "$EVENT_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d':' -f2 | tr -d '"')
else
  echo "❌ Create event API failed"
  echo "$EVENT_RESPONSE"
fi

# Get all events
echo "4. Testing get all events API..."
EVENTS_RESPONSE=$(call_api "GET" "/events")
echo "$EVENTS_RESPONSE" | grep -q "success"
if [ $? -eq 0 ]; then
  echo "✅ Get all events API working"
else
  echo "❌ Get all events API failed"
  echo "$EVENTS_RESPONSE"
fi

# Get single event 
if [ ! -z "$EVENT_ID" ]; then
  echo "5. Testing get single event API..."
  EVENT_DETAIL_RESPONSE=$(call_api "GET" "/events/$EVENT_ID")
  echo "$EVENT_DETAIL_RESPONSE" | grep -q "success"
  if [ $? -eq 0 ]; then
    echo "✅ Get single event API working"
  else
    echo "❌ Get single event API failed"
    echo "$EVENT_DETAIL_RESPONSE"
  fi
fi

# Register for event
if [ ! -z "$EVENT_ID" ] && [ ! -z "$USER_ID" ]; then
  echo "6. Testing event registration API..."
  REGISTER_RESPONSE=$(call_api "POST" "/events/$EVENT_ID/register" "{\"userId\": \"$USER_ID\"}")
  echo "$REGISTER_RESPONSE" | grep -q "success"
  if [ $? -eq 0 ]; then
    echo "✅ Event registration API working"
  else
    echo "❌ Event registration API failed"
    echo "$REGISTER_RESPONSE"
  fi
fi

# Update event
if [ ! -z "$EVENT_ID" ]; then
  echo "7. Testing update event API..."
  UPDATE_RESPONSE=$(call_api "PUT" "/events/$EVENT_ID" '{
    "title": "Updated Test Workshop",
    "capacity": 60
  }')
  echo "$UPDATE_RESPONSE" | grep -q "success"
  if [ $? -eq 0 ]; then
    echo "✅ Update event API working"
  else
    echo "❌ Update event API failed"
    echo "$UPDATE_RESPONSE"
  fi
fi

# Test users API
echo "Testing users endpoints..."

# Get all users
echo "8. Testing get all users API..."
USERS_RESPONSE=$(call_api "GET" "/users")
echo "$USERS_RESPONSE" | grep -q "success"
if [ $? -eq 0 ]; then
  echo "✅ Get all users API working"
else
  echo "❌ Get all users API failed"
  echo "$USERS_RESPONSE"
fi

# Get user by ID
if [ ! -z "$USER_ID" ]; then
  echo "9. Testing get user by ID API..."
  USER_RESPONSE=$(call_api "GET" "/users/$USER_ID")
  echo "$USER_RESPONSE" | grep -q "success"
  if [ $? -eq 0 ]; then
    echo "✅ Get user by ID API working"
  else
    echo "❌ Get user by ID API failed"
    echo "$USER_RESPONSE"
  fi
fi

# Clean up - Delete the test event
if [ ! -z "$EVENT_ID" ]; then
  echo "10. Testing delete event API..."
  DELETE_RESPONSE=$(call_api "DELETE" "/events/$EVENT_ID")
  echo "$DELETE_RESPONSE" | grep -q "success"
  if [ $? -eq 0 ]; then
    echo "✅ Delete event API working"
  else
    echo "❌ Delete event API failed"
    echo "$DELETE_RESPONSE"
  fi
fi

# Done
echo "----------------------------------------"
echo "API testing completed!"
echo "Run MongoDB instance and start the Next.js app with 'npm run dev' before using this script." 