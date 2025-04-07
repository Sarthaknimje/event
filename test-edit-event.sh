#!/bin/bash

echo "PCCOE Event Management System - API Test Script"
echo "----------------------------------------------"
echo

# Base URL
BASE_URL="http://localhost:3000/api"

# Test variable
EVENT_ID=""

# Test 1: Create a test event
echo "Test 1: Creating a new test event..."
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "title": "Test Event for Edit",
  "description": "This is a test event created via API to test edit functionality",
  "date": "2025-04-25",
  "time": "10:00 AM",
  "location": "Test Location",
  "category": "technical",
  "image": "/technical-event.svg",
  "organizer": "Test Organizer",
  "registrationDeadline": "2025-04-20",
  "capacity": 50
}' $BASE_URL/events)

echo $RESPONSE

# Extract the event ID from the response
EVENT_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$EVENT_ID" ]; then
  echo "Failed to create test event!"
  echo "Response: $RESPONSE"
  exit 1
else
  echo "✅ Test event created successfully with ID: $EVENT_ID"
fi

# Test 2: Get the created event
echo 
echo "Test 2: Fetching the created event..."
curl -s -X GET $BASE_URL/events/$EVENT_ID

# Test 3: Update the event
echo
echo "Test 3: Updating the event..."
curl -s -X PUT -H "Content-Type: application/json" -d '{
  "title": "Updated Test Event",
  "description": "This event was updated through the API test script",
  "location": "Updated Location",
  "capacity": 75
}' $BASE_URL/events/$EVENT_ID

# Test 4: Verify the update
echo
echo "Test 4: Verifying the update..."
curl -s -X GET $BASE_URL/events/$EVENT_ID

# Test 5: Update event category
echo
echo "Test 5: Updating event category..."
curl -s -X PUT -H "Content-Type: application/json" -d '{
  "category": "workshop",
  "image": "/workshop-event.svg"
}' $BASE_URL/events/$EVENT_ID

# Test 6: Verify category update
echo
echo "Test 6: Verifying category update..."
curl -s -X GET $BASE_URL/events/$EVENT_ID

# Test 7: Delete the event
echo
read -p "Press Enter to delete the test event (ID: $EVENT_ID)..."
echo "Test 7: Deleting the test event..."
curl -s -X DELETE $BASE_URL/events/$EVENT_ID

# Test 8: Verify deletion
echo
echo "Test 8: Verifying deletion (should return 404)..."
curl -s -X GET $BASE_URL/events/$EVENT_ID

echo
echo "All tests completed!" 