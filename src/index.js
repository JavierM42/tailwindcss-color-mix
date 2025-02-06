const plugin = require("tailwindcss/plugin");
const { default: toColorValue } = require("tailwindcss/lib/util/toColorValue");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const {
  default: withAlphaVariable,
  withAlphaValue,
} = require("tailwindcss/lib/util/withAlphaVariable");

const DEFAULTS = {
  bgMix: "bg-mix",
  bgMixAmount: "bg-mix-amount",
  bgMixMethod: "bg-mix-method",
};

module.exports = (options = {}) =>
  plugin(({ matchUtilities, theme, corePlugins }) => {
    const { bgMix, bgMixAmount, bgMixMethod } = { ...DEFAULTS, ...options };

    // add --tw-bg-base to bg-utility
    matchUtilities(
      {
        bg: (value) => {
          if (!corePlugins("backgroundOpacity")) {
            return {
              "background-color": toColorValue(value),
            };
          }

          return {
            backgroundColor: "var(--tw-bg-base)",
            ...withAlphaVariable({
              color: value,
              property: "--tw-bg-base",
              variable: "--tw-bg-opacity",
            }),
          };
        },
      },
      { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
    );

    // add bg-mix utility
    matchUtilities(
      {
        [bgMix]: (value) => {
          const { mixColor, ...rest } = withAlphaVariable({
            color: value,
            property: "mixColor",
            variable: "--tw-bg-mix-opacity",
          });

          return {
            ...rest,
            "background-color": `color-mix(var(--tw-bg-mix-method, in srgb), ${mixColor} calc(var(--tw-bg-mix-amount, 0) * 1%), var(--tw-bg-base))`,
          };
        },
      },
      { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
    );

    // add bg-mix-amount utility
    matchUtilities(
      {
        [bgMixAmount]: (value) => ({
          "--tw-bg-mix-amount": value,
        }),
      },
      {
        values: Object.fromEntries(
          Object.entries(theme("backgroundOpacity")).map(([key, value]) => [
            key,
            `${value * 100}`,
          ])
        ),
      }
    );

    // add bg-mix-space utility
    matchUtilities(
      {
        [bgMixMethod]: (value) => ({
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
  });
