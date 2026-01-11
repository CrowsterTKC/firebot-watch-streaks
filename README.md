# Firebot Watch Streaks

A Firebot script to add Twitch Watch Streaks functionality to your stream.

## Features

- Add a "Watch Streak" event to Firebot.
- Adds three variables to use in triggered event effects:
  - `$watchStreak`: The number of consecutive streams the viewer has watched to reach their watch streak milestone.
  - `$watchStreakMessage`: The custom message the viewer included when reaching their watch streak milestone.
  - `$watchStreakReward`: The number of channel points rewarded to the viewer for reaching their watch streak milestone.

## Installation

1. Download the `watch-streaks.js` files from the [latest release](https://github.com/CrowsterTKC/firebot-watch-streaks/releases/latest) page.
2. Launch Firebot and click on `File` > `Open Data Folder` (Windows) or `Firebot` > `Open Data Folder` (Mac).
3. Copy the `watch-streaks.js` file into the `scripts` folder.
4. From the Firebot navigation sidebar, click on `Settings` > `Scripts`.
5. Enable custom scripts (if not already enabled).
6. Click on the `Manage Startup Scripts` button and `Add New Script`.
7. In the `Select script` dropdown, select `watch-streaks.js`.
8. Click Save to save the script settings.
9. Close the Manage Startup Scripts dialog.
