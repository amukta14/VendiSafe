{
  "name": "HygieneReport",
  "type": "object",
  "properties": {
    "vendor_id": {
      "type": "string",
      "description": "Related vendor ID"
    },
    "reporter_name": {
      "type": "string",
      "description": "Name of person reporting"
    },
    "reporter_phone": {
      "type": "string",
      "description": "Reporter contact"
    },
    "issue_type": {
      "type": "string",
      "enum": [
        "garbage_disposal",
        "water_contamination",
        "food_safety",
        "cleanliness",
        "drainage",
        "other"
      ],
      "description": "Type of hygiene issue"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of issue"
    },
    "severity": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "description": "Severity level"
    },
    "latitude": {
      "type": "number",
      "description": "Issue location latitude"
    },
    "longitude": {
      "type": "number",
      "description": "Issue location longitude"
    },
    "status": {
      "type": "string",
      "enum": [
        "open",
        "investigating",
        "resolved",
        "dismissed"
      ],
      "default": "open",
      "description": "Report status"
    },
    "photo_url": {
      "type": "string",
      "description": "Photo evidence URL"
    },
    "resolved_date": {
      "type": "string",
      "format": "date",
      "description": "Resolution date"
    }
  },
  "required": [
    "issue_type",
    "description",
    "severity",
    "latitude",
    "longitude"
  ]
}
