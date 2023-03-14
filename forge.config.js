module.exports = {
  packagerConfig: {
    targets: [
      {
        target: "zip",
        arch: "x64",
      },
      {
        target: "nsis",
        arch: "x64",
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "codeGeneratorInstaller",
      },
    },
    {
      name: "@electron-forge/maker-zip",
    },
    // {
    //   name: "@electron-forge/maker-deb",
    //   config: {},
    // },
    // {
    //   name: "@electron-forge/maker-rpm",
    //   config: {},
    // },
  ],
};
