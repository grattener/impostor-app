#!/usr/bin/env python3
"""
Extract specific Apple Color Emoji glyphs from .ttc font file as PNGs
at multiple resolutions for responsive web loading.
"""

import os
import struct
from fontTools.ttLib import TTCollection

FONT_PATH = "/Volumes/box/PROYECTOS/IMPOSTOR/Apple Color Emoji.ttc"
OUTPUT_DIR = "/Volumes/box/PROYECTOS/IMPOSTOR/public/emojis"

# Emoji codepoints we need, mapped to filenames
# Format: { "filename": [codepoint_sequence] }
EMOJIS = {
    "detective":       [0x1F575, 0xFE0F],           # 🕵️
    "detective-male":  [0x1F575, 0xFE0F, 0x200D, 0x2642, 0xFE0F],  # 🕵️‍♂️
    "party":           [0x1F389],                     # 🎉
    "checkmark":       [0x2705],                      # ✅
    "skull":           [0x1F480],                      # 💀
    "anxious":         [0x1F630],                      # 😰
    "scales":          [0x2696, 0xFE0F],              # ⚖️
    "cross":           [0x274C],                       # ❌
    "ballot":          [0x1F5F3, 0xFE0F],             # 🗳️
    "speech":          [0x1F4AC],                      # 💬
    "people":          [0x1F465],                      # 👥
    "phone":           [0x1F4F1],                      # 📱
    "warning":         [0x26A0, 0xFE0F],              # ⚠️
    "target":          [0x1F3AF],                      # 🎯
}

# Sizes to extract: small (mobile), medium (desktop), large (retina)
SIZES = [32, 64, 160]

def codepoints_to_glyph_name(codepoints):
    """Convert a list of Unicode codepoints to possible glyph name formats."""
    names = []
    
    # Format: u1F575.FE0F.200D.2642.FE0F (dot-separated hex)
    hex_parts = [f"{cp:04X}" for cp in codepoints]
    names.append("u" + ".".join(hex_parts))
    
    # Without variation selectors (FE0F)
    filtered = [cp for cp in codepoints if cp != 0xFE0F]
    if filtered != codepoints:
        hex_parts_nofv = [f"{cp:04X}" for cp in filtered]
        names.append("u" + ".".join(hex_parts_nofv))
    
    # Without ZWJ and variation selectors
    filtered2 = [cp for cp in codepoints if cp not in (0xFE0F, 0x200D)]
    if filtered2 != filtered:
        hex_parts_simple = [f"{cp:04X}" for cp in filtered2]
        names.append("u" + ".".join(hex_parts_simple))
    
    # Single codepoint format
    if len(codepoints) >= 1:
        names.append(f"u{codepoints[0]:04X}")
    
    return names

def find_glyph_in_cmap(font, codepoints):
    """Try to find the glyph name for given codepoints using the cmap table."""
    cmap = font.getBestCmap()
    if not cmap:
        return None
    
    # For single codepoints, direct lookup
    if len(codepoints) == 1 or (len(codepoints) == 2 and codepoints[-1] == 0xFE0F):
        base_cp = codepoints[0]
        if base_cp in cmap:
            return cmap[base_cp]
    
    # For sequences, try the full sequence first
    # Check if there's a GSUB table for ligatures
    return None

def extract_emojis():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for size in SIZES:
        os.makedirs(os.path.join(OUTPUT_DIR, str(size)), exist_ok=True)
    
    print(f"Loading font: {FONT_PATH}")
    tc = TTCollection(FONT_PATH)
    font = tc.fonts[0]  # Use first font in collection
    
    sbix = font['sbix']
    cmap = font.getBestCmap()
    
    # Get all available glyph names
    glyph_order = font.getGlyphOrder()
    print(f"Total glyphs: {len(glyph_order)}")
    
    # Print available strike sizes
    print(f"Available sizes: {sorted(sbix.strikes.keys())}")
    
    # Build reverse lookup: see what glyph names look like
    emoji_glyphs = [g for g in glyph_order if g.startswith('u')]
    print(f"Emoji-like glyphs (starting with 'u'): {len(emoji_glyphs)}")
    
    # Show some examples
    print(f"Sample glyph names: {emoji_glyphs[:20]}")
    
    extracted = 0
    not_found = []
    
    for emoji_name, codepoints in EMOJIS.items():
        glyph_name = None
        
        # Strategy 1: Try possible generated names
        possible_names = codepoints_to_glyph_name(codepoints)
        for name in possible_names:
            if name in glyph_order:
                glyph_name = name
                break
        
        # Strategy 2: Try cmap lookup
        if not glyph_name:
            base_cp = codepoints[0]
            if base_cp in cmap:
                candidate = cmap[base_cp]
                if candidate in glyph_order:
                    glyph_name = candidate
        
        # Strategy 3: Search by partial match
        if not glyph_name:
            hex_base = f"{codepoints[0]:04X}"
            matches = [g for g in emoji_glyphs if hex_base in g]
            if matches:
                # Prefer exact or shortest match
                matches.sort(key=len)
                glyph_name = matches[0]
                print(f"  Found via partial match: {emoji_name} -> {glyph_name} (from {len(matches)} candidates)")
        
        if not glyph_name:
            print(f"  ❌ NOT FOUND: {emoji_name} (tried: {possible_names})")
            not_found.append(emoji_name)
            continue
        
        print(f"  ✅ {emoji_name} -> glyph: {glyph_name}")
        
        # Extract at each size
        for size in SIZES:
            if size not in sbix.strikes:
                # Find nearest available size
                available = sorted(sbix.strikes.keys())
                nearest = min(available, key=lambda x: abs(x - size))
                actual_size = nearest
            else:
                actual_size = size
            
            strike = sbix.strikes[actual_size]
            if glyph_name in strike.glyphs:
                glyph_data = strike.glyphs[glyph_name]
                if glyph_data.imageData and len(glyph_data.imageData) > 0:
                    # Determine file extension from graphicType
                    ext = 'png'
                    if hasattr(glyph_data, 'graphicType'):
                        if glyph_data.graphicType == 'png ':
                            ext = 'png'
                    
                    output_path = os.path.join(OUTPUT_DIR, str(size), f"{emoji_name}.png")
                    with open(output_path, 'wb') as f:
                        f.write(glyph_data.imageData)
                    
                    file_size = len(glyph_data.imageData)
                    print(f"    Saved: {size}px ({file_size} bytes) -> {output_path}")
                    extracted += 1
                else:
                    print(f"    ⚠️ Empty image data for {emoji_name} at {actual_size}px")
            else:
                print(f"    ⚠️ Glyph {glyph_name} not in strike {actual_size}")
    
    print(f"\n{'='*50}")
    print(f"Extracted: {extracted} images")
    if not_found:
        print(f"Not found: {not_found}")
    print(f"Output: {OUTPUT_DIR}")

if __name__ == "__main__":
    extract_emojis()
