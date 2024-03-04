const plugin = require("tailwindcss/plugin");
const { default: toColorValue } = require("tailwindcss/lib/util/toColorValue");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const {
  default: withAlphaVariable,
} = require("tailwindcss/lib/util/withAlphaVariable");

module.exports = plugin(({ matchUtilities, theme, corePlugins }) => {
  // add bg-mix utility
  matchUtilities(
    {
      "bg-mix": (value) => {
        const { mixColor, ...rest } = withAlphaVariable({
          color: value,
          property: "mixColor",
          variable: "--tw-bg-mix-opacity",
        });

        return {
          ...rest,
          "background-color": `color-mix(var(--tw-bg-mix-method, in srgb), ${mixColor} var(--tw-bg-mix-amount, 100%), var(--tw-bg-base))`,
        };
      },
    },
    {
      values: flattenColorPalette(theme("backgroundColor")),
      type: ["color", "any"],
    }
  );

  // add bg-mix-amount utility
  matchUtilities(
    {
      "bg-mix-amount": (value) => ({
        "--tw-bg-mix-amount": value,
      }),
    },
    {
      values: Object.fromEntries(
        Object.entries(theme("backgroundOpacity")).map(([key, value]) => [
          key,
          `${value * 100}%`,
        ])
      ),
    }
  );

  // add bg-mix-space utility
  matchUtilities(
    {
      "bg-mix-method": (value) => ({
        "--tw-bg-mix-method": value,
      }),
    },
    {
      values: {
        srgb: "in srgb",
        "shorter-hue": "in hsl shorter hue",
        "longer-hue": "in hsl longer hue",
      },
    }
  );

  // add --tw-bg-base to bg-utility
  matchUtilities(
    {
      bg: (value) => {
        if (!corePlugins("backgroundOpacity")) {
          return {
            "background-color": toColorValue(value),
          };
        }

        return withAlphaVariable({
          color: value,
          property: "--tw-bg-base",
          variable: "--tw-bg-opacity",
        });
      },
    },
    {
      values: flattenColorPalette(theme("backgroundColor")),
      type: ["color", "any"],
    }
  );
});
