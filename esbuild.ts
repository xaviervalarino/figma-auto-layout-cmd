import * as esbuild from "esbuild";

const config = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  outdir: "dist",
};

(async () => {
  if (process.argv[2] === "--watch") {
    const ctx = await esbuild.context({
      ...config,
      plugins: [
        {
          name: "Log Build Start",
          setup(build) {
            build.onStart(() => console.time("build"));
          },
        },
        {
          name: "Log Build End",
          setup(build) {
            build.onEnd(({ errors }) => {
              if (!errors.length) {
                console.clear();
                console.timeEnd("build");
              }
            });
          },
        },
      ],
    });
    const watch = await ctx.watch();
    console.log("watching...");
  } else {
    console.time("build");
    await esbuild.build({ ...config });
    console.timeEnd("build");
  }
})();
