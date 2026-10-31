{
  "format": "solidcraft/46",
  "format_pending": [
    "link-file-digests"
  ],
  "name": "Untitled",
  "units": "mm",
  "params": [
    {
      "name": "plate_length",
      "expr": "90 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "plate_width",
      "expr": "50 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "plate_thickness",
      "expr": "8 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "fixing_hole_diameter",
      "expr": "8 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "saddle_length",
      "expr": "20 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "saddle_width",
      "expr": "20 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "saddle_height",
      "expr": "7 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "saddle_center_offset",
      "expr": "plate_length/2-saddle_length/2",
      "unit": "mm",
      "model": false
    },
    {
      "name": "trough_radius",
      "expr": "14 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "trough_web_thickness",
      "expr": "4 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "relief_width",
      "expr": "6 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "relief_height",
      "expr": "3 mm",
      "unit": "mm",
      "model": false
    }
  ],
  "features": [
    {
      "id": 1,
      "name": "Battery Mount",
      "suppressed": false,
      "body_names": [
        "Battery Mount"
      ],
      "param_names": [
        "d1",
        "d2",
        "d3"
      ],
      "type": "box",
      "corner": [
        "(0 mm) - (plate_length) / 2",
        "(0 mm) - (plate_width) / 2",
        "(plate_thickness/2) - (plate_thickness) / 2"
      ],
      "length": "plate_length",
      "width": "plate_width",
      "height": "plate_thickness",
      "operation": "new_body"
    },
    {
      "id": 2,
      "name": "Central Through Hole",
      "suppressed": false,
      "param_names": [
        "d4",
        "d5"
      ],
      "participants": [
        "Battery Mount"
      ],
      "type": "cylinder",
      "base": [
        0.0,
        0.0,
        0.0
      ],
      "axis": [
        0.0,
        0.0,
        1.0
      ],
      "radius": "(fixing_hole_diameter) / 2",
      "height": "plate_thickness",
      "operation": "cut"
    },
    {
      "id": 3,
      "name": "Left Saddle",
      "suppressed": false,
      "param_names": [
        "d6",
        "d7",
        "d8"
      ],
      "participants": [
        "Battery Mount"
      ],
      "type": "box",
      "corner": [
        "(-saddle_center_offset) - (saddle_length) / 2",
        "(0 mm) - (saddle_width) / 2",
        "(plate_thickness+saddle_height/2) - (saddle_height) / 2"
      ],
      "length": "saddle_length",
      "width": "saddle_width",
      "height": "saddle_height",
      "operation": "join"
    },
    {
      "id": 4,
      "name": "Right Saddle",
      "suppressed": false,
      "param_names": [
        "d9",
        "d10",
        "d11"
      ],
      "participants": [
        "Battery Mount"
      ],
      "type": "box",
      "corner": [
        "(saddle_center_offset) - (saddle_length) / 2",
        "(0 mm) - (saddle_width) / 2",
        "(plate_thickness+saddle_height/2) - (saddle_height) / 2"
      ],
      "length": "saddle_length",
      "width": "saddle_width",
      "height": "saddle_height",
      "operation": "join"
    },
    {
      "id": 5,
      "name": "Cylindrical Saddle Troughs",
      "suppressed": false,
      "param_names": [
        "d12",
        "d13"
      ],
      "participants": [
        "Battery Mount"
      ],
      "type": "cylinder",
      "base": [
        "-plate_length/2",
        0.0,
        "plate_thickness+trough_web_thickness+trough_radius"
      ],
      "axis": [
        1.0,
        0.0,
        0.0
      ],
      "radius": "trough_radius",
      "height": "plate_length",
      "operation": "cut"
    },
    {
      "id": 6,
      "name": "Left Under Saddle Relief",
      "suppressed": false,
      "param_names": [
        "d14",
        "d15",
        "d16"
      ],
      "participants": [
        "Battery Mount"
      ],
      "type": "box",
      "corner": [
        "(-saddle_center_offset) - (relief_width) / 2",
        "(0 mm) - (saddle_width) / 2",
        "(plate_thickness+relief_height/2) - (relief_height) / 2"
      ],
      "length": "relief_width",
      "width": "saddle_width",
      "height": "relief_height",
      "operation": "cut"
    },
    {
      "id": 7,
      "name": "Right Under Saddle Relief",
      "suppressed": false,
      "param_names": [
        "d17",
        "d18",
        "d19"
      ],
      "participants": [
        "Battery Mount"
      ],
      "type": "box",
      "corner": [
        "(saddle_center_offset) - (relief_width) / 2",
        "(0 mm) - (saddle_width) / 2",
        "(plate_thickness+relief_height/2) - (relief_height) / 2"
      ],
      "length": "relief_width",
      "width": "saddle_width",
      "height": "relief_height",
      "operation": "cut"
    }
  ],
  "next_id": 8,
  "next_component_color_index": 0
}