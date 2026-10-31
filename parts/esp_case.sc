{
  "format": "solidcraft/46",
  "format_pending": [
    "link-file-digests"
  ],
  "name": "Untitled",
  "units": "mm",
  "params": [
    {
      "name": "case_length",
      "expr": "99 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "case_width",
      "expr": "78 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "case_height",
      "expr": "20.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "outer_corner_radius",
      "expr": "11.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "wall_thickness",
      "expr": "1.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "floor_thickness",
      "expr": "0.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_left_inset",
      "expr": "6.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_right_inset",
      "expr": "7 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_end_inset",
      "expr": "6.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_diameter",
      "expr": "7 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "screw_bore_diameter",
      "expr": "5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "rail_height_above_floor",
      "expr": "8 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "left_rail_width",
      "expr": "4.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "center_rail_width",
      "expr": "5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "right_rail_width",
      "expr": "5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "center_rail_x",
      "expr": "4.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "compartment_rim_thickness",
      "expr": "1 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "left_rim_height_above_floor",
      "expr": "5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "right_rim_height_above_floor",
      "expr": "6 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "left_compartment_back_y",
      "expr": "27.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "right_compartment_back_extension",
      "expr": "0.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "rectangular_port_width",
      "expr": "11 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "rectangular_port_height",
      "expr": "7 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "rectangular_port_x",
      "expr": "-17.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "rectangular_port_center_z",
      "expr": "12 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "circular_port_diameter",
      "expr": "7 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "circular_port_x",
      "expr": "12 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "circular_port_center_z",
      "expr": "13.5 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "cut_clearance",
      "expr": "1 mm",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_left_x",
      "expr": "-case_length/2+boss_left_inset",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_right_x",
      "expr": "case_length/2-boss_right_inset",
      "unit": "mm",
      "model": false
    },
    {
      "name": "boss_y",
      "expr": "case_width/2-boss_end_inset",
      "unit": "mm",
      "model": false
    },
    {
      "name": "left_compartment_left_x",
      "expr": "boss_left_x+left_rail_width",
      "unit": "mm",
      "model": false
    },
    {
      "name": "left_compartment_right_x",
      "expr": "center_rail_x-center_rail_width/2",
      "unit": "mm",
      "model": false
    },
    {
      "name": "right_compartment_left_x",
      "expr": "center_rail_x+center_rail_width/2",
      "unit": "mm",
      "model": false
    },
    {
      "name": "right_compartment_right_x",
      "expr": "boss_right_x-right_rail_width",
      "unit": "mm",
      "model": false
    },
    {
      "name": "right_compartment_back_y",
      "expr": "boss_y+right_compartment_back_extension",
      "unit": "mm",
      "model": false
    },
    {
      "name": "d2",
      "expr": "outer_corner_radius",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d3",
      "expr": "(case_length/2)-(-case_length/2)-2*(outer_corner_radius)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d4",
      "expr": "(case_width/2)-(-case_width/2)-2*(outer_corner_radius)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d5",
      "expr": "-(-case_length/2)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d6",
      "expr": "-(-case_width/2)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d9",
      "expr": "outer_corner_radius-wall_thickness",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d10",
      "expr": "(case_length/2-wall_thickness)-(-case_length/2+wall_thickness)-2*(outer_corner_radius-wall_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d11",
      "expr": "(case_width/2-wall_thickness)-(-case_width/2+wall_thickness)-2*(outer_corner_radius-wall_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d12",
      "expr": "-(-case_length/2+wall_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d13",
      "expr": "-(-case_width/2+wall_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d16",
      "expr": "boss_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d17",
      "expr": "-(boss_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d18",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d19",
      "expr": "screw_bore_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d20",
      "expr": "boss_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d21",
      "expr": "-(boss_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d22",
      "expr": "boss_y",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d23",
      "expr": "screw_bore_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d24",
      "expr": "boss_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d25",
      "expr": "boss_right_x",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d26",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d27",
      "expr": "screw_bore_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d28",
      "expr": "boss_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d29",
      "expr": "boss_right_x",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d30",
      "expr": "boss_y",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d31",
      "expr": "screw_bore_diameter",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d34",
      "expr": "(left_compartment_left_x)-(boss_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d35",
      "expr": "(boss_y)-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d36",
      "expr": "-(boss_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d37",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d40",
      "expr": "(right_compartment_left_x)-(left_compartment_right_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d41",
      "expr": "(boss_y)-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d42",
      "expr": "left_compartment_right_x",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d43",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d46",
      "expr": "(boss_right_x)-(right_compartment_right_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d47",
      "expr": "(boss_y)-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d48",
      "expr": "right_compartment_right_x",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d49",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d52",
      "expr": "(left_compartment_right_x)-(left_compartment_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d53",
      "expr": "(left_compartment_back_y)-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d54",
      "expr": "-(left_compartment_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d55",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d58",
      "expr": "(left_compartment_right_x-compartment_rim_thickness)-(left_compartment_left_x+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d59",
      "expr": "(left_compartment_back_y-compartment_rim_thickness)-(-boss_y+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d60",
      "expr": "-(left_compartment_left_x+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d61",
      "expr": "-(-boss_y+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d64",
      "expr": "(right_compartment_right_x)-(right_compartment_left_x)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d65",
      "expr": "(right_compartment_back_y)-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d66",
      "expr": "right_compartment_left_x",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d67",
      "expr": "-(-boss_y)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d70",
      "expr": "(right_compartment_right_x-compartment_rim_thickness)-(right_compartment_left_x+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d71",
      "expr": "(right_compartment_back_y-compartment_rim_thickness)-(-boss_y+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d72",
      "expr": "right_compartment_left_x+compartment_rim_thickness",
      "unit": "mm",
      "model": true
    },
    {
      "name": "d73",
      "expr": "-(-boss_y+compartment_rim_thickness)",
      "unit": "mm",
      "model": true
    }
  ],
  "features": [
    {
      "id": 1,
      "name": "OuterShellProfile",
      "suppressed": false,
      "param_names": [
        "d1"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "0 mm"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p5",
            "pos": [
              -38.0,
              -39.0
            ],
            "fixed": false
          },
          {
            "id": "p6",
            "pos": [
              -49.5,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "a1.center",
            "pos": [
              -38.0,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "p7",
            "pos": [
              38.0,
              -39.0
            ],
            "fixed": false
          },
          {
            "id": "p8",
            "pos": [
              49.5,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "a2.center",
            "pos": [
              38.0,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "p9",
            "pos": [
              49.5,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "p10",
            "pos": [
              38.0,
              39.0
            ],
            "fixed": false
          },
          {
            "id": "a3.center",
            "pos": [
              38.0,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "p11",
            "pos": [
              -38.0,
              39.0
            ],
            "fixed": false
          },
          {
            "id": "p12",
            "pos": [
              -49.5,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "a4.center",
            "pos": [
              -38.0,
              27.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 4,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 5,
            "b": 7,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 8,
            "b": 10,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 11,
            "b": 2,
            "construction": false
          },
          {
            "id": "a1",
            "type": "arc",
            "c": 3,
            "a": 2,
            "b": 1,
            "construction": false
          },
          {
            "id": "a2",
            "type": "arc",
            "c": 6,
            "a": 4,
            "b": 5,
            "construction": false
          },
          {
            "id": "a3",
            "type": "arc",
            "c": 9,
            "a": 7,
            "b": 8,
            "construction": false
          },
          {
            "id": "a4",
            "type": "arc",
            "c": 12,
            "a": 10,
            "b": 11,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "tangent",
            "a": 0,
            "b": 4
          },
          {
            "id": "k6",
            "type": "tangent",
            "a": 3,
            "b": 4
          },
          {
            "id": "k7",
            "type": "radius",
            "c": 4,
            "value": 11.5,
            "param": "d2"
          },
          {
            "id": "k8",
            "type": "tangent",
            "a": 0,
            "b": 5
          },
          {
            "id": "k9",
            "type": "tangent",
            "a": 1,
            "b": 5
          },
          {
            "id": "k10",
            "type": "equal",
            "a": 4,
            "b": 5
          },
          {
            "id": "k11",
            "type": "tangent",
            "a": 1,
            "b": 6
          },
          {
            "id": "k12",
            "type": "tangent",
            "a": 2,
            "b": 6
          },
          {
            "id": "k13",
            "type": "equal",
            "a": 4,
            "b": 6
          },
          {
            "id": "k14",
            "type": "tangent",
            "a": 2,
            "b": 7
          },
          {
            "id": "k15",
            "type": "tangent",
            "a": 3,
            "b": 7
          },
          {
            "id": "k16",
            "type": "equal",
            "a": 4,
            "b": 7
          },
          {
            "id": "k17",
            "type": "length",
            "l": 0,
            "value": 76.0,
            "param": "d3"
          },
          {
            "id": "k18",
            "type": "length",
            "l": 3,
            "value": 55.0,
            "param": "d4"
          },
          {
            "id": "k19",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 49.5,
            "param": "d5"
          },
          {
            "id": "k20",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 39.0,
            "param": "d6"
          }
        ],
        "counters": {
          "a": 4,
          "k": 20,
          "l": 4,
          "p": 12
        }
      }
    },
    {
      "id": 2,
      "name": "Rounded Enclosure Blank",
      "suppressed": false,
      "body_names": [
        "ESP Case"
      ],
      "param_names": [
        "d7"
      ],
      "type": "extrude",
      "sketch": 1,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "case_height",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "new_body"
    },
    {
      "id": 3,
      "name": "OpenCavityProfile",
      "suppressed": false,
      "param_names": [
        "d8"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p5",
            "pos": [
              -38.0,
              -37.5
            ],
            "fixed": false
          },
          {
            "id": "p6",
            "pos": [
              -48.0,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "a1.center",
            "pos": [
              -38.0,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "p7",
            "pos": [
              38.0,
              -37.5
            ],
            "fixed": false
          },
          {
            "id": "p8",
            "pos": [
              48.0,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "a2.center",
            "pos": [
              38.0,
              -27.5
            ],
            "fixed": false
          },
          {
            "id": "p9",
            "pos": [
              48.0,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "p10",
            "pos": [
              38.0,
              37.5
            ],
            "fixed": false
          },
          {
            "id": "a3.center",
            "pos": [
              38.0,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "p11",
            "pos": [
              -38.0,
              37.5
            ],
            "fixed": false
          },
          {
            "id": "p12",
            "pos": [
              -48.0,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "a4.center",
            "pos": [
              -38.0,
              27.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 4,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 5,
            "b": 7,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 8,
            "b": 10,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 11,
            "b": 2,
            "construction": false
          },
          {
            "id": "a1",
            "type": "arc",
            "c": 3,
            "a": 2,
            "b": 1,
            "construction": false
          },
          {
            "id": "a2",
            "type": "arc",
            "c": 6,
            "a": 4,
            "b": 5,
            "construction": false
          },
          {
            "id": "a3",
            "type": "arc",
            "c": 9,
            "a": 7,
            "b": 8,
            "construction": false
          },
          {
            "id": "a4",
            "type": "arc",
            "c": 12,
            "a": 10,
            "b": 11,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "tangent",
            "a": 0,
            "b": 4
          },
          {
            "id": "k6",
            "type": "tangent",
            "a": 3,
            "b": 4
          },
          {
            "id": "k7",
            "type": "radius",
            "c": 4,
            "value": 10.0,
            "param": "d9"
          },
          {
            "id": "k8",
            "type": "tangent",
            "a": 0,
            "b": 5
          },
          {
            "id": "k9",
            "type": "tangent",
            "a": 1,
            "b": 5
          },
          {
            "id": "k10",
            "type": "equal",
            "a": 4,
            "b": 5
          },
          {
            "id": "k11",
            "type": "tangent",
            "a": 1,
            "b": 6
          },
          {
            "id": "k12",
            "type": "tangent",
            "a": 2,
            "b": 6
          },
          {
            "id": "k13",
            "type": "equal",
            "a": 4,
            "b": 6
          },
          {
            "id": "k14",
            "type": "tangent",
            "a": 2,
            "b": 7
          },
          {
            "id": "k15",
            "type": "tangent",
            "a": 3,
            "b": 7
          },
          {
            "id": "k16",
            "type": "equal",
            "a": 4,
            "b": 7
          },
          {
            "id": "k17",
            "type": "length",
            "l": 0,
            "value": 76.0,
            "param": "d10"
          },
          {
            "id": "k18",
            "type": "length",
            "l": 3,
            "value": 55.0,
            "param": "d11"
          },
          {
            "id": "k19",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 48.0,
            "param": "d12"
          },
          {
            "id": "k20",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 37.5,
            "param": "d13"
          }
        ],
        "counters": {
          "a": 4,
          "k": 20,
          "l": 4,
          "p": 12
        }
      }
    },
    {
      "id": 4,
      "name": "Open Top Cavity",
      "suppressed": false,
      "param_names": [
        "d14"
      ],
      "type": "extrude",
      "sketch": 3,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "case_height",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "cut",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 5,
      "name": "CornerBossRings",
      "suppressed": false,
      "param_names": [
        "d15"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "c1.center",
            "pos": [
              -43.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "c2.center",
            "pos": [
              -43.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "c3.center",
            "pos": [
              -43.0,
              32.5
            ],
            "fixed": false
          },
          {
            "id": "c4.center",
            "pos": [
              -43.0,
              32.5
            ],
            "fixed": false
          },
          {
            "id": "c5.center",
            "pos": [
              42.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "c6.center",
            "pos": [
              42.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "c7.center",
            "pos": [
              42.5,
              32.5
            ],
            "fixed": false
          },
          {
            "id": "c8.center",
            "pos": [
              42.5,
              32.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "c1",
            "type": "circle",
            "c": 1,
            "r": 3.5,
            "construction": false
          },
          {
            "id": "c2",
            "type": "circle",
            "c": 2,
            "r": 2.5,
            "construction": false
          },
          {
            "id": "c3",
            "type": "circle",
            "c": 3,
            "r": 3.5,
            "construction": false
          },
          {
            "id": "c4",
            "type": "circle",
            "c": 4,
            "r": 2.5,
            "construction": false
          },
          {
            "id": "c5",
            "type": "circle",
            "c": 5,
            "r": 3.5,
            "construction": false
          },
          {
            "id": "c6",
            "type": "circle",
            "c": 6,
            "r": 2.5,
            "construction": false
          },
          {
            "id": "c7",
            "type": "circle",
            "c": 7,
            "r": 3.5,
            "construction": false
          },
          {
            "id": "c8",
            "type": "circle",
            "c": 8,
            "r": 2.5,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "diameter",
            "c": 0,
            "value": 7.0,
            "param": "d16"
          },
          {
            "id": "k2",
            "type": "distance_x",
            "p": 0,
            "q": 1,
            "value": 43.0,
            "param": "d17"
          },
          {
            "id": "k3",
            "type": "distance_y",
            "p": 0,
            "q": 1,
            "value": 32.5,
            "param": "d18"
          },
          {
            "id": "k4",
            "type": "coincident",
            "p": 1,
            "q": 2
          },
          {
            "id": "k5",
            "type": "diameter",
            "c": 1,
            "value": 5.0,
            "param": "d19"
          },
          {
            "id": "k6",
            "type": "diameter",
            "c": 2,
            "value": 7.0,
            "param": "d20"
          },
          {
            "id": "k7",
            "type": "distance_x",
            "p": 0,
            "q": 3,
            "value": 43.0,
            "param": "d21"
          },
          {
            "id": "k8",
            "type": "distance_y",
            "p": 0,
            "q": 3,
            "value": 32.5,
            "param": "d22"
          },
          {
            "id": "k9",
            "type": "coincident",
            "p": 3,
            "q": 4
          },
          {
            "id": "k10",
            "type": "diameter",
            "c": 3,
            "value": 5.0,
            "param": "d23"
          },
          {
            "id": "k11",
            "type": "diameter",
            "c": 4,
            "value": 7.0,
            "param": "d24"
          },
          {
            "id": "k12",
            "type": "distance_x",
            "p": 0,
            "q": 5,
            "value": 42.5,
            "param": "d25"
          },
          {
            "id": "k13",
            "type": "distance_y",
            "p": 0,
            "q": 5,
            "value": 32.5,
            "param": "d26"
          },
          {
            "id": "k14",
            "type": "coincident",
            "p": 5,
            "q": 6
          },
          {
            "id": "k15",
            "type": "diameter",
            "c": 5,
            "value": 5.0,
            "param": "d27"
          },
          {
            "id": "k16",
            "type": "diameter",
            "c": 6,
            "value": 7.0,
            "param": "d28"
          },
          {
            "id": "k17",
            "type": "distance_x",
            "p": 0,
            "q": 7,
            "value": 42.5,
            "param": "d29"
          },
          {
            "id": "k18",
            "type": "distance_y",
            "p": 0,
            "q": 7,
            "value": 32.5,
            "param": "d30"
          },
          {
            "id": "k19",
            "type": "coincident",
            "p": 7,
            "q": 8
          },
          {
            "id": "k20",
            "type": "diameter",
            "c": 7,
            "value": 5.0,
            "param": "d31"
          }
        ],
        "counters": {
          "c": 8,
          "k": 20
        }
      }
    },
    {
      "id": 6,
      "name": "Four Corner Screw Bosses",
      "suppressed": false,
      "param_names": [
        "d32"
      ],
      "type": "extrude",
      "sketch": 5,
      "profiles": {
        "type": "curves",
        "loops": [
          [
            "c1"
          ],
          [
            "c3"
          ],
          [
            "c5"
          ],
          [
            "c7"
          ]
        ]
      },
      "extent": {
        "distance": "case_height-floor_thickness",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "join",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 7,
      "name": "LeftRailProfile",
      "suppressed": false,
      "param_names": [
        "d33"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              -43.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              -38.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              -38.5,
              32.5
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              -43.0,
              32.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 4.5,
            "param": "d34"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 65.0,
            "param": "d35"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 43.0,
            "param": "d36"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 32.5,
            "param": "d37"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 8,
      "name": "Left Floor Rail",
      "suppressed": false,
      "param_names": [
        "d38"
      ],
      "type": "extrude",
      "sketch": 7,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "rail_height_above_floor",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "join",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 9,
      "name": "CenterRailProfile",
      "suppressed": false,
      "param_names": [
        "d39"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              2.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              7.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              7.0,
              32.5
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              2.0,
              32.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 5.0,
            "param": "d40"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 65.0,
            "param": "d41"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 2.0,
            "param": "d42"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 32.5,
            "param": "d43"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 10,
      "name": "Center Floor Rail",
      "suppressed": false,
      "param_names": [
        "d44"
      ],
      "type": "extrude",
      "sketch": 9,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "rail_height_above_floor",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "join",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 11,
      "name": "RightRailProfile",
      "suppressed": false,
      "param_names": [
        "d45"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              37.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              42.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              42.5,
              32.5
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              37.5,
              32.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 5.0,
            "param": "d46"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 65.0,
            "param": "d47"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 37.5,
            "param": "d48"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 32.5,
            "param": "d49"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 12,
      "name": "Right Floor Rail",
      "suppressed": false,
      "param_names": [
        "d50"
      ],
      "type": "extrude",
      "sketch": 11,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "rail_height_above_floor",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "join",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 13,
      "name": "LeftCompartmentOuterProfile",
      "suppressed": false,
      "param_names": [
        "d51"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              -38.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              2.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              2.0,
              27.5
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              -38.5,
              27.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 40.5,
            "param": "d52"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 60.0,
            "param": "d53"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 38.5,
            "param": "d54"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 32.5,
            "param": "d55"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 14,
      "name": "Left Compartment Rim Blank",
      "suppressed": false,
      "param_names": [
        "d56"
      ],
      "type": "extrude",
      "sketch": 13,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "left_rim_height_above_floor",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "join",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 15,
      "name": "LeftCompartmentCavityProfile",
      "suppressed": false,
      "param_names": [
        "d57"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              -37.5,
              -31.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              1.0,
              -31.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              1.0,
              26.5
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              -37.5,
              26.5
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 38.5,
            "param": "d58"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 58.0,
            "param": "d59"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 37.5,
            "param": "d60"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 31.5,
            "param": "d61"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 16,
      "name": "Left Compartment Cavity",
      "suppressed": false,
      "param_names": [
        "d62"
      ],
      "type": "extrude",
      "sketch": 15,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "left_rim_height_above_floor+cut_clearance",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "cut",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 17,
      "name": "RightCompartmentOuterProfile",
      "suppressed": false,
      "param_names": [
        "d63"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              7.0,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              37.5,
              -32.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              37.5,
              33.0
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              7.0,
              33.0
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 30.5,
            "param": "d64"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 65.5,
            "param": "d65"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 7.0,
            "param": "d66"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 32.5,
            "param": "d67"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 18,
      "name": "Right Compartment Rim Blank",
      "suppressed": false,
      "param_names": [
        "d68"
      ],
      "type": "extrude",
      "sketch": 17,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "right_rim_height_above_floor",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "join",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 19,
      "name": "RightCompartmentCavityProfile",
      "suppressed": false,
      "param_names": [
        "d69"
      ],
      "type": "sketch",
      "plane": {
        "type": "offset",
        "base": {
          "type": "origin",
          "name": "XY"
        },
        "distance": "floor_thickness"
      },
      "sketch": {
        "points": [
          {
            "id": "origin",
            "pos": [
              0.0,
              0.0
            ],
            "fixed": true
          },
          {
            "id": "p1",
            "pos": [
              8.0,
              -31.5
            ],
            "fixed": false
          },
          {
            "id": "p2",
            "pos": [
              36.5,
              -31.5
            ],
            "fixed": false
          },
          {
            "id": "p3",
            "pos": [
              36.5,
              32.0
            ],
            "fixed": false
          },
          {
            "id": "p4",
            "pos": [
              8.0,
              32.0
            ],
            "fixed": false
          }
        ],
        "curves": [
          {
            "id": "l1",
            "type": "line",
            "a": 1,
            "b": 2,
            "construction": false
          },
          {
            "id": "l2",
            "type": "line",
            "a": 2,
            "b": 3,
            "construction": false
          },
          {
            "id": "l3",
            "type": "line",
            "a": 3,
            "b": 4,
            "construction": false
          },
          {
            "id": "l4",
            "type": "line",
            "a": 4,
            "b": 1,
            "construction": false
          }
        ],
        "constraints": [
          {
            "id": "k1",
            "type": "horizontal",
            "l": 0
          },
          {
            "id": "k2",
            "type": "horizontal",
            "l": 2
          },
          {
            "id": "k3",
            "type": "vertical",
            "l": 1
          },
          {
            "id": "k4",
            "type": "vertical",
            "l": 3
          },
          {
            "id": "k5",
            "type": "length",
            "l": 0,
            "value": 28.5,
            "param": "d70"
          },
          {
            "id": "k6",
            "type": "length",
            "l": 3,
            "value": 63.5,
            "param": "d71"
          },
          {
            "id": "k7",
            "type": "point_line_distance",
            "p": 0,
            "l": 3,
            "value": 8.0,
            "param": "d72"
          },
          {
            "id": "k8",
            "type": "point_line_distance",
            "p": 0,
            "l": 0,
            "value": 31.5,
            "param": "d73"
          }
        ],
        "counters": {
          "k": 8,
          "l": 4,
          "p": 4
        }
      }
    },
    {
      "id": 20,
      "name": "Right Compartment Cavity",
      "suppressed": false,
      "param_names": [
        "d74"
      ],
      "type": "extrude",
      "sketch": 19,
      "profiles": {
        "type": "all"
      },
      "extent": {
        "distance": "right_rim_height_above_floor+cut_clearance",
        "convention": "total_distance",
        "direction": "positive"
      },
      "operation": "cut",
      "targets": [
        "ESP Case"
      ]
    },
    {
      "id": 21,
      "name": "Rectangular Side Connector Opening",
      "suppressed": false,
      "param_names": [
        "d75",
        "d76",
        "d77"
      ],
      "participants": [
        "ESP Case"
      ],
      "type": "box",
      "corner": [
        "(rectangular_port_x) - (rectangular_port_width) / 2",
        "(case_width/2-wall_thickness/2) - (wall_thickness+2*cut_clearance) / 2",
        "(rectangular_port_center_z) - (rectangular_port_height) / 2"
      ],
      "length": "rectangular_port_width",
      "width": "wall_thickness+2*cut_clearance",
      "height": "rectangular_port_height",
      "operation": "cut"
    },
    {
      "id": 22,
      "name": "Circular Side Connector Opening",
      "suppressed": false,
      "param_names": [
        "d78",
        "d79"
      ],
      "participants": [
        "ESP Case"
      ],
      "type": "cylinder",
      "base": [
        "circular_port_x",
        "case_width/2-wall_thickness-cut_clearance",
        "circular_port_center_z"
      ],
      "axis": [
        0.0,
        1.0,
        0.0
      ],
      "radius": "(circular_port_diameter) / 2",
      "height": "wall_thickness+2*cut_clearance",
      "operation": "cut"
    }
  ],
  "next_id": 23,
  "next_component_color_index": 0
}