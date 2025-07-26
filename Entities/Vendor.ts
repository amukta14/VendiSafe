{
  "name": "Vendor",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Vendor's full name"
    },
    "business_name": {
      "type": "string",
      "description": "Street food business name"
    },
    "phone": {
      "type": "string",
      "description": "Contact number"
    },
    "food_type": {
      "type": "string",
      "enum": [
        "chaat",
        "paratha",
        "tea_snacks",
        "fruit",
        "ice_cream",
        "juice",
        "breakfast",
        "lunch",
        "sweets",
        "other"
      ],
      "description": "Type of food sold"
    },
    "latitude": {
      "type": "number",
      "description": "Vendor location latitude"
    },
    "longitude": {
      "type": "number",
      "description": "Vendor location longitude"
    },
    "zone_status": {
      "type": "string",
      "enum": [
        "legal",
        "illegal",
        "pending",
        "relocate_required"
      ],
      "description": "Legal vending status"
    },
    "hygiene_score": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Hygiene rating from 1-5"
    },
    "license_number": {
      "type": "string",
      "description": "Vending license number if applicable"
    },
    "address": {
      "type": "string",
      "description": "Street address"
    },
    "area": {
      "type": "string",
      "description": "Delhi area/locality"
    },
    "verified": {
      "type": "boolean",
      "default": false,
      "description": "Verification status"
    },
    "total_complaints": {
      "type": "number",
      "default": 0,
      "description": "Number of hygiene complaints"
    },
    "last_inspection": {
      "type": "string",
      "format": "date",
      "description": "Last inspection date"
    }
  },
  "required": [
    "name",
    "phone",
    "food_type",
    "latitude",
    "longitude",
    "zone_status",
    "hygiene_score"
  ]
}
