# tailwindcss-color-mix

Build new colors by mixing two existing TailwindCSS shades.

Use `bg-red-500 bg-mix-black bg-mix-amount-50` to partially overlay `black` over the original `red-500` shade.

This is achieved with native CSS [color-mix](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix), so all colors in the palette can be mixed with each other.

## Installation

`npm install --save tailwindcss-color-mix`

`tailwind.config.js`
```
  const colorMix = require('tailwindcss-color-mix');

  module.exports = {
    ...
    plugins: [
      ...,
      colorMix
    ]
  }

```

## Usage

- `bg-red-500` will yield normal results (red background).
- `bg-red-500 bg-mix-black` will mix black into red and yield black, as default mix is 100%.
- `bg-red-500 bg-mix-black bg-mix-mount-50` will mix 50% black into red (`color-mix(in srgb, black 50%, red)`).
- `bg-red-500 bg-mix-black/50` will mix black at 50% **opacity** into red (`color-mix(in srgb rgb(0 0 0 / 0.5) 100%, red)`).

<!-- TODO explain with examples -->

You can also use arbitrary percentage values for amount such as `bg-mix-amount-[42%]`.

## Interpolation method

Default interpolation method is `srgb` but you can also use `hsl shorter hue` or `hsl-longer-hue` with the `bg-mix-method-shorter-hue` and `bg-mix-method-longer-hue` utilities.

## Example: interaction states

The plugin is usage-agnostic, but the original motivation behind it was the concept of [state layers](https://m3.material.io/foundations/interaction/states/state-layers) from Material Design 3.

The system defines interactive surfaces given their background color and their text color. When hovered or pressed, the background on an interacive surface is overlayed with a predetermined opacity of its text color. This helps to create consistent interaction states with no extra effort.

In vanilla Tailwind syntax, though, that would force us to define extra shades for every combination of background and text colors we need.

With the plugin, an interactive surface can be defined as `bg-red-800 text-white bg-mix-white bg-mix-amount-0 hover:bg-mix-amount-8 active:bg-mix-amount-12`, assuming 8 and 12 exist in the background opacity theme config.
