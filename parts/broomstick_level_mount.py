# /// script
# requires-python = ">=3.12"
# dependencies = ["manifold3d==3.5.4", "numpy==2.5.3", "trimesh==5.1.1", "scipy==1.18.1", "pillow==12.3.0"]
# ///
"""Generate millimetre STL parts: uv run parts/broomstick_level_mount.py.

The stick axis is Z; the level's reference floor is the XY plane at Z=3.
Both parts export already oriented with their flat bottoms on the print bed.
"""
from pathlib import Path
from math import sqrt

import manifold3d as cad
import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFont

# Measured hardware; adjust these to regenerate for another stick or level.
STICK_DIAMETER = 27.5
LEVEL_DIAMETER = 65.6
LEVEL_HEIGHT = 10.5
# Clearances are diametral, not radial. Tighten the split clamp to grip.
STICK_CLEARANCE = 0.4
LEVEL_CLEARANCE = 0.6
CLAMP_HEIGHT = 48.0
CLAMP_WALL = 4.05
SPLIT_GAP = 1.0
FLOOR = 3.0
TRAY_WALL = 3.0
TRAY_RIM_HEIGHT = 7.0
LEVEL_OFFSET = 66.0
BOLT_DIAMETER = 4.5  # clearance for M4
BOLT_X = 23.0
BOLT_Z = (12.0, 36.0)
EAR_INNER_X = 14.0
EAR_OUTER_X = 28.0
EAR_DEPTH = 8.0
SEGMENTS = 192
OUT = Path(__file__).resolve().parent


def box(size, position):
    return cad.Manifold.cube(size).translate(position)


def cylinder(radius, height, position=(0, 0, 0)):
    return cad.Manifold.cylinder(height, radius, circular_segments=SEGMENTS).translate(position)


def xz_prism(points, y_start, depth):
    # A polygon in X/Z, extruded toward -Y from y_start + depth.
    return cad.CrossSection([points]).extrude(depth).rotate((90, 0, 0)).translate((0, y_start + depth, 0))


def bolt_hole(x, z):
    # Circular clearance with a 45-degree roof, avoiding supports in the bore.
    r = BOLT_DIAMETER / 2
    circle = cad.CrossSection.circle(r, circular_segments=SEGMENTS)
    roof = cad.CrossSection([[(-r / sqrt(2), r / sqrt(2)),
                              (r / sqrt(2), r / sqrt(2)),
                              (0, r * sqrt(2))]])
    return (circle + roof).extrude(40).rotate((90, 0, 0)).translate((x, 20, z))


def build():
    bore_r = (STICK_DIAMETER + STICK_CLEARANCE) / 2
    clamp_r = bore_r + CLAMP_WALL
    pocket_r = (LEVEL_DIAMETER + LEVEL_CLEARANCE) / 2
    tray_r = pocket_r + TRAY_WALL
    assert LEVEL_OFFSET - tray_r > EAR_OUTER_X, "Tray must clear the removable clamp half."
    assert LEVEL_HEIGHT > TRAY_RIM_HEIGHT, "Level must remain accessible above the rim."

    collar = cylinder(clamp_r, CLAMP_HEIGHT)
    for x0 in (EAR_INNER_X, -EAR_OUTER_X):
        collar += box((EAR_OUTER_X - EAR_INNER_X, 2 * EAR_DEPTH, CLAMP_HEIGHT),
                      (x0, -EAR_DEPTH, 0))
    collar -= cylinder(bore_r, CLAMP_HEIGHT + 2, (0, 0, -1))
    main_half = collar ^ box((100, 100, CLAMP_HEIGHT + 2), (-50, SPLIT_GAP / 2, -1))
    cap = collar ^ box((100, 100, CLAMP_HEIGHT + 2), (-50, -100 - SPLIT_GAP / 2, -1))

    tray = cylinder(tray_r, FLOOR + TRAY_RIM_HEIGHT, (LEVEL_OFFSET, 0, 0))
    # Keep the neck on the main side of the split; it cannot collide with the cap.
    neck = box((LEVEL_OFFSET - 12, 10 - SPLIT_GAP / 2, 6), (12, SPLIT_GAP / 2, 0))
    gusset = xz_prism([(14, FLOOR), (44, FLOOR), (14, 25)], 1, 6)
    main = main_half + tray + neck + gusset
    # These final cuts keep the entire seating floor flat and the stick bore clear.
    main -= cylinder(pocket_r, CLAMP_HEIGHT + 2, (LEVEL_OFFSET, 0, FLOOR))
    main -= cylinder(bore_r, CLAMP_HEIGHT + 2, (0, 0, -1))
    for x in (-BOLT_X, BOLT_X):
        for z in BOLT_Z:
            hole = bolt_hole(x, z)
            main -= hole
            cap -= hole
    level = cylinder(LEVEL_DIAMETER / 2, LEVEL_HEIGHT, (LEVEL_OFFSET, 0, FLOOR))
    return main, cap, level


def mesh(solid):
    data = solid.to_mesh()
    result = trimesh.Trimesh(vertices=np.asarray(data.vert_properties)[:, :3],
                             faces=np.asarray(data.tri_verts), process=True)
    # STL uses float32: exact boolean tangencies can collapse to zero-area faces.
    result.update_faces(result.nondegenerate_faces())
    result.remove_unreferenced_vertices()
    return result


def verify(main, cap, level):
    meshes = []
    for name, solid in (("holder", main), ("clamp_cap", cap)):
        result = mesh(solid)
        assert solid.status() == cad.Error.NoError, (name, solid.status())
        assert result.is_watertight and result.is_winding_consistent, name
        assert len(result.split()) == 1 and result.volume > 0, name
        assert abs(result.bounds[0, 2]) < 1e-6, "Print bottom must be Z=0"
        assert all(result.extents <= np.array([250, 210, 210])), "Exceeds MK3S print volume"
        meshes.append(result)
        print(f"{name}: watertight, one solid; {result.extents.round(2)} mm; "
              f"{result.volume / 1000:.2f} cm³")
    assert (main ^ cap).is_empty(), "Clamp parts collide"
    assert (main ^ level).is_empty(), "Level collides with its seat"
    assert (cap ^ level).is_empty(), "Level collides with clamp cap"
    # Probe the actual seating plane, not just the outer tray dimensions.
    floor_probe = cylinder(LEVEL_DIAMETER / 2 - 0.1, 0.1, (LEVEL_OFFSET, 0, FLOOR - 0.1))
    assert abs((main ^ floor_probe).volume() - floor_probe.volume()) < 1e-5
    pocket_probe = cylinder(LEVEL_DIAMETER / 2, LEVEL_HEIGHT, (LEVEL_OFFSET, 0, FLOOR + 0.01))
    assert (main ^ pocket_probe).is_empty()
    stick = cylinder(STICK_DIAMETER / 2, CLAMP_HEIGHT + 20, (0, 0, -10))
    assert ((main + cap) ^ stick).is_empty(), "Nominal stick does not fit"
    for x in (-BOLT_X, BOLT_X):
        for z in BOLT_Z:
            shaft = cylinder(2, 30).rotate((90, 0, 0)).translate((x, 15, z))
            assert ((main + cap) ^ shaft).is_empty(), "M4 shaft interference"
    # Simulate taking up the 0.4 mm diametral clearance: the halves must not bottom out.
    tightened_main = main.translate((0, -STICK_CLEARANCE / 2, 0))
    tightened_cap = cap.translate((0, STICK_CLEARANCE / 2, 0))
    assert (tightened_main ^ tightened_cap).is_empty(), "Clamp bottoms out before gripping"
    print("Fit checks: stick, level, four M4 paths, flat seating floor, and clamp closing clearance OK.")
    return meshes


def preview(main, cap, level):
    """Render a shaded assembly illustration; not a picture of a printed part."""
    pixels = np.full((1000, 1400, 3), (244, 246, 248), dtype=np.uint8)
    depth_buffer = np.full((1000, 1400), -np.inf)
    right = np.array([0.83, 0.56, 0.0])
    up = np.array([-0.31, 0.46, 0.83])
    toward_camera = np.cross(right, up)
    light = np.array([0.1, -0.3, 0.95])
    light /= np.linalg.norm(light)
    items = [(main, (45, 123, 170)), (cap, (240, 153, 68)),
             (level, (183, 210, 205)),
             (cylinder(STICK_DIAMETER / 2, 105, (0, 0, -5)), (156, 128, 93))]
    for solid, color in items:
        obj = mesh(solid)
        for vertices, normal in zip(obj.triangles, obj.face_normals):
            if np.dot(normal, toward_camera) <= 0:
                continue
            shade = 0.65 + 0.35 * max(0.0, np.dot(normal, light))
            fill = np.array([int(c * shade) for c in color], dtype=np.uint8)
            xy = np.column_stack((vertices @ right, -(vertices @ up))) * 6
            xy += [300, 690]
            low = np.maximum(np.floor(xy.min(axis=0)).astype(int), [0, 0])
            high = np.minimum(np.ceil(xy.max(axis=0)).astype(int), [1399, 999])
            if np.any(high < low):
                continue
            px, py = np.meshgrid(np.arange(low[0], high[0] + 1) + 0.5,
                                 np.arange(low[1], high[1] + 1) + 0.5)
            (x0, y0), (x1, y1), (x2, y2) = xy
            determinant = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
            if abs(determinant) < 1e-9:
                continue
            a = ((y1 - y2) * (px - x2) + (x2 - x1) * (py - y2)) / determinant
            b = ((y2 - y0) * (px - x2) + (x0 - x2) * (py - y2)) / determinant
            c = 1 - a - b
            depths = vertices @ toward_camera
            depth = a * depths[0] + b * depths[1] + c * depths[2]
            region = np.s_[low[1]:high[1] + 1, low[0]:high[0] + 1]
            visible = (a >= 0) & (b >= 0) & (c >= 0) & (depth > depth_buffer[region])
            depth_buffer[region][visible] = depth[visible]
            pixels[region][visible] = fill
    image = Image.fromarray(pixels)
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(size=28)
    small = ImageFont.load_default(size=22)
    draw.text((45, 30), "Broomstick bubble-level mount", fill="#182737", font=font)
    draw.text((45, 75), "Assembly illustration | mm | not a physical fit test", fill="#485969", font=small)
    draw.text((940, 310), "27.5 mm stick", fill="#534532", font=small)
    draw.text((940, 350), "Blue: holder + tray", fill="#236a96", font=small)
    draw.text((940, 390), "Orange: clamp cap", fill="#a15b19", font=small)
    draw.text((940, 430), "65.6 x 10.5 mm level", fill="#41655f", font=small)
    draw.text((940, 470), "4 x M4 x 25 bolts", fill="#182737", font=small)
    draw.text((45, 935), "Tray floor perpendicular to stick axis. Both STL parts print bottom-down, without supports.",
              fill="#485969", font=small)
    image.save(OUT / "broomstick_level_mount.png")


if __name__ == "__main__":
    main, cap, level = build()
    holder_mesh, cap_mesh = verify(main, cap, level)
    holder_mesh.export(OUT / "broomstick_level_holder.stl")
    # Centre the separate cap on XY for convenient independent slicing.
    cap_mesh.apply_translation((-cap_mesh.bounds[:, 0].mean(), -cap_mesh.bounds[:, 1].mean(), 0))
    cap_mesh.export(OUT / "broomstick_level_clamp_cap.stl")
    preview(main, cap, level)
    print(f"Saved STL files and assembly illustration in {OUT}")
