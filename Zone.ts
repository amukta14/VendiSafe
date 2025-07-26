{
  "name": "Zone",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Zone name/identifier"
    },
    "area": {
      "type": "string",
      "description": "Delhi area/locality"
    },
    "status": {
      "type": "string",
      "enum": [
        "legal",
        "illegal",
        "pending_approval",
        "restricted"
      ],
      "description": "Zone vending status"
    },
    "coordinates": {
      "type": "string",
      "description": "GeoJSON polygon coordinates as string"
    },
    "max_vendors": {
      "type": "number",
      "description": "Maximum allowed vendors"
    },
    "current_vendors": {
      "type": "number",
      "default": 0,
      "description": "Current number of vendors"
    },
    "restrictions": {
      "type": "string",
      "description": "Any specific restrictions"
    },
    "notification_date": {
      "type": "string",
      "format": "date",
      "description": "Official notification date"
    },
    "hygiene_avg": {
      "type": "number",
      "description": "Average hygiene score in zone"
    }
  },
  "required": [
    "name",
    "area",
    "status",
    "coordinates"
  ]
}
