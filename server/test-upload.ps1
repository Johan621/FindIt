curl.exe -X POST http://localhost:5000/api/items `
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNGJhNGM3NjNhNGViYjIyZGYxNmQ1YiIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzgzMzQyMzI1LCJleHAiOjE3ODM5NDcxMjV9.os8ecjGkfkvMqWhrpFhAadpvY5tr92xKD600stbOdbo" `
  -F "title=Blue Water Bottle" `
  -F "description=Found near the library entrance" `
  -F "category=Accessories" `
  -F "type=found" `
  -F "location=Main Library" `
  -F "date=2026-07-06" `
  -F "photo=@bottle.jpg"