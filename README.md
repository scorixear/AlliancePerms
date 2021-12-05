# AllianceRoles bot

Connect Guilds and Members from Albion with your Discord server.

## Usage

- `/addguild <GuildName>` adds a guild to this bot
- `/removeguild <GuildName>` removes Guild from this bot
- `/register <IngameName>` registers yourself with the given ingame name

## Features

Checks against the Albion API with the ingame character is in one of the guilds.
Adds an alliance role to the user if above applies.
Removes the alliance roles from user that are not in the any guild.
Updates automatically if a user switches guilds within the alliance.

## Setup

1. Pull this repo to your hosting solution
2. Copy the `.env.sample` file and fill out the informations accordingly
3. Edit the `/src/config.json` to fit with the Alliance Role and Permissions Roles
4. Create a Database for this bot (and user if needed)
5. Invite the bot to your server with the permissions given in `/src/config.json - permissions`
6. Authorize the Bot with the scope `applications.commmands` _so the bot can create Slashcommands in your server_
7. Start the bot with `npm run start`
