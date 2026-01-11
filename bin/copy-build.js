/**
 *  Copies the built script .js to Firebot's scripts folder
 */

/* global console, process */
/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const fs = require('fs');
const { join, resolve } = require('path');

const packageJson = require('../package.json');

const getFirebotScriptsFolderPath = () => {
  let appDataFolderPath;
  switch (process.platform) {
    case 'win32':
      appDataFolderPath = process.env.APPDATA;
      break;
    case 'darwin':
      appDataFolderPath = join(
        process.env.HOME,
        '/Library/Application Support'
      );
      break;
    case 'linux':
      appDataFolderPath = join(process.env.HOME, '/.config');
      break;
    default:
      throw new Error('Unsupported OS!');
  }

  const firebotDataFolderPath = join(appDataFolderPath, '/Firebot/v5/');
  const firebotGlobalSettings = JSON.parse(
    fs.readFileSync(join(firebotDataFolderPath, 'global-settings.json'), 'utf8')
  );

  if (
    firebotGlobalSettings == null ||
    firebotGlobalSettings.profiles == null ||
    firebotGlobalSettings.profiles.loggedInProfile == null
  ) {
    throw new Error('Unable to determine active profile');
  }

  const activeProfile = firebotGlobalSettings.profiles.loggedInProfile;

  const scriptsFolderPath = join(
    firebotDataFolderPath,
    `/profiles/${activeProfile}/scripts/`
  );
  return scriptsFolderPath;
};

(() => {
  const firebotScriptsFolderPath = getFirebotScriptsFolderPath();
  const scriptName = `${packageJson.scriptOutputName}.js`;
  const srcScriptFilePath = resolve(`./dist/${scriptName}`);
  const destScriptFilePath = join(firebotScriptsFolderPath, `${scriptName}`);

  fs.copyFileSync(srcScriptFilePath, destScriptFilePath);
  console.log(`Successfully copied ${scriptName} to Firebot scripts folder.`);
})();
