function hexToHsl(hex) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // gray
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 1)); break;
      case g: h = ((b - r) / d + 3); break;
      case b: h = ((r - g) / d + 5); break;
    }
    h *= 60;
  }

  return { h, s, l };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return (
    "#" +
    [f(0), f(8), f(4)]
      .map(x =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function lighten(hex, percent) {
  let { h, s, l } = hexToHsl(hex);
  l = Math.min(100, l * 100 + percent);
  return hslToHex(h, s * 100, l);
}

function darken(hex, percent) {
  let { h, s, l } = hexToHsl(hex);
  l = Math.max(0, l * 100 - percent);
  return hslToHex(h, s * 100, l);
}

function shiftHue(hex, degrees) {
  let { h, s, l } = hexToHsl(hex);
  h = (h + degrees) % 360;
  return hslToHex(h, s * 100, l * 100);
}

export function buildPalette(base) {
  return [
    base,                  // Main SDG color
    darken(base, 20),      // Darker shade
    shiftHue(base, 40)     // Analogous color for contrast
  ];
}
