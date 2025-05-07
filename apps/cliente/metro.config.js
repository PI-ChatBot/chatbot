const { getDefaultConfig } = require("@expo/metro-config")

const config = getDefaultConfig(__dirname)

// Permite usar arquivos fora da pasta cliente (como em packages/)
config.watchFolders = [
  // permite o Metro ver a pasta raiz
  require("path").resolve(__dirname, "../../"),
]

module.exports = config
