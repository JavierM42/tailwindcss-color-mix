const colorMix = require("../src/index");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");

const theme = {
  colors: {
    black: "#000000",
    white: "#ffffff",
  },
};

describe("tailwindcss-color-mix", () => {
  it("bg-mix overrides background-color", () => {
    const config = {
      content: [{ raw: "bg-mix-black" }],
      theme,
      plugins: [colorMix],
    };

    let utilitiesCSS = postcss([tailwindcss(config)]).process(
      "@tailwind utilities"
    ).css;

    expect(utilitiesCSS.replace(/\n|\s|\t/g, "")).toBe(
      `
      .bg-mix-black {
        --tw-bg-mix-opacity: 1;
        background-color: color-mix(
          var(--tw-bg-mix-method, in srgb),
          rgb(0 0 0 / var(--tw-bg-mix-opacity)) var(--tw-bg-mix-amount, 100%),
          var(--tw-bg-base)
        )
      }
    `.replace(/\n|\s|\t/g, "")
    );
  });

  it("bg-mix-amount defines --tw-bg-mix-amount", () => {
    const config = {
      content: [{ raw: "bg-mix-amount-50" }],
      theme,
      plugins: [colorMix],
    };

    let utilitiesCSS = postcss([tailwindcss(config)]).process(
      "@tailwind utilities"
    ).css;

    expect(utilitiesCSS.replace(/\n|\s|\t/g, "")).toBe(
      `
      .bg-mix-amount-50 {
        --tw-bg-mix-amount: 50%
      }
    `.replace(/\n|\s|\t/g, "")
    );
  });

  it("bg defines --tw-bg-base", () => {
    const config = {
      content: [{ raw: "bg-white" }],
      theme,
      plugins: [colorMix],
    };

    let utilitiesCSS = postcss([tailwindcss(config)]).process(
      "@tailwind utilities"
    ).css;

    expect(utilitiesCSS.replace(/\n|\s|\t/g, "")).toBe(
      // first background-color comes from base config
      `
      .bg-white {
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        --tw-bg-opacity: 1;
        --tw-bg-base: rgb(255 255 255 / var(--tw-bg-opacity))
      }
    `.replace(/\n|\s|\t/g, "")
    );
  });

  it("bg-mixmethod defines --tw-bg-mix-method", () => {
    const config = {
      content: [
        {
          raw: "bg-mix-method-srgb bg-mix-method-shorter-hue bg-mix-method-longer-hue",
        },
      ],
      theme,
      plugins: [colorMix],
    };

    let utilitiesCSS = postcss([tailwindcss(config)]).process(
      "@tailwind utilities"
    ).css;

    expect(utilitiesCSS.replace(/\n|\s|\t/g, "")).toBe(
      `
        .bg-mix-method-srgb {
          --tw-bg-mix-method: in srgb
        }
        .bg-mix-method-shorter-hue {
          --tw-bg-mix-method: in hsl shorter hue
        }
        .bg-mix-method-longer-hue {
          --tw-bg-mix-method: in hsl longer hue
        }
      `.replace(/\n|\s|\t/g, "")
    );
  });
});
