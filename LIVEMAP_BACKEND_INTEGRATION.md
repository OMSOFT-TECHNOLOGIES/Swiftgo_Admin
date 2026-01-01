# LiveMap Backend Integration

## Location Data Requirements

The LiveMap component now expects the backend API to return rider location data in the following format:

### API Endpoint
```
GET /api/admin/riders?include_location=true
```

### Expected Response Format
```json
{
  "message": "Riders retrieved successfully",
  "riders": [
    {
      "id": "rider-123",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "ACTIVE",
      "availability": true,
      "total_deliveries": 150,
      "completed_deliveries": 140,
      "average_rating": 4.8,
      "is_verified": true,
      "location": {
        "latitude": 5.6037,
        "longitude": -0.1870,
        "last_updated": "2025-09-07T10:30:00Z"
      },
      "created_at": "2024-01-15T08:00:00Z",
      "updated_at": "2025-09-07T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_riders": 1,
    "limit": 100
  }
}
```

### Location Object Schema
```typescript
location?: {
  latitude: number;    // GPS latitude coordinate
  longitude: number;   // GPS longitude coordinate
  last_updated?: string; // ISO timestamp of last location update
}
```

## Fallback Behavior

When riders don't have location data from the backend:
- The map will show fallback locations around Accra, Ghana
- Popup will indicate "Fallback Location" vs "Live GPS Location"
- Location status is shown in the rider list panel

## Frontend Changes Made

1. **Updated Types**: Added `location` property to `Rider` interface
2. **API Integration**: Added `include_location` parameter to API requests
3. **Map Display**: Real GPS data takes precedence over fallback locations
4. **UI Indicators**: Shows GPS availability status in the interface

## Backend Implementation Notes

To fully enable live tracking, the backend should:

1. **Accept `include_location` parameter** in the riders endpoint
2. **Store rider GPS coordinates** from mobile apps
3. **Return location data** when the parameter is present
4. **Update locations** in real-time as riders move
5. **Consider privacy** and only share locations of active riders

## Testing

- Without real location data: Map shows fallback locations
- With real location data: Map shows actual rider positions
- Mixed data: Shows real locations where available, fallback for others
