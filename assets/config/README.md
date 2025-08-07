# ByteBunny Discord Channel Configuration

This guide explains how to configure specific Discord channel links for different features on your ByteBunny website.

## Configuration File Location
`assets/config/links.json`

## How to Get Discord Channel Links

### Step 1: Get Your Server ID
1. Open Discord and go to your ByteBunny server
2. Right-click on the server name in the left sidebar
3. Select "Copy Server ID" (you need Developer Mode enabled)
4. Your server ID will look like: `1385975508944027741`

### Step 2: Get Channel IDs
1. Right-click on any channel you want to link to
2. Select "Copy Channel ID"
3. The channel ID will look like: `1386074565205033032`

### Step 3: Format the Links
Discord channel links follow this format:
```
https://discord.com/channels/SERVER_ID/CHANNEL_ID
```

Example:
```
https://discord.com/channels/1385975508944027741/1386074565205033032
```

## Available Channel Configurations

Edit `assets/config/links.json` and replace the placeholder values:

```json
{
  "discord": {
    "server": {
      "main": "https://discord.gg/mcNjvmvkWD",
      "invite": "https://discord.gg/mcNjvmvkWD"
    },
    "channels": {
      "alpha_program": "https://discord.com/channels/YOUR_SERVER_ID/ALPHA_CHANNEL_ID",
      "beta_program": "https://discord.com/channels/YOUR_SERVER_ID/BETA_CHANNEL_ID", 
      "trial_keys": "https://discord.com/channels/YOUR_SERVER_ID/TRIAL_KEYS_CHANNEL_ID",
      "hwid_reset": "https://discord.com/channels/YOUR_SERVER_ID/HWID_RESET_CHANNEL_ID",
      "script_submission": "https://discord.com/channels/YOUR_SERVER_ID/SCRIPT_SUBMISSION_CHANNEL_ID",
      "roadmap_tool": "https://discord.com/channels/YOUR_SERVER_ID/ROADMAP_TOOL_CHANNEL_ID",
      "general_support": "https://discord.com/channels/YOUR_SERVER_ID/SUPPORT_CHANNEL_ID",
      "announcements": "https://discord.com/channels/YOUR_SERVER_ID/ANNOUNCEMENTS_CHANNEL_ID"
    }
  }
}
```

## Example Configuration

Here's an example with real channel IDs (replace with your actual IDs):

```json
{
  "discord": {
    "server": {
      "main": "https://discord.gg/mcNjvmvkWD",
      "invite": "https://discord.gg/mcNjvmvkWD"
    },
    "channels": {
      "alpha_program": "https://discord.com/channels/1385975508944027741/1386074565205033032",
      "beta_program": "https://discord.com/channels/1385975508944027741/1386074565205033033",
      "trial_keys": "https://discord.com/channels/1385975508944027741/1386074565205033034",
      "hwid_reset": "https://discord.com/channels/1385975508944027741/1386074565205033035",
      "script_submission": "https://discord.com/channels/1385975508944027741/1386074565205033036",
      "roadmap_tool": "https://discord.com/channels/1385975508944027741/1386074565205033037",
      "general_support": "https://discord.com/channels/1385975508944027741/1386074565205033038",
      "announcements": "https://discord.com/channels/1385975508944027741/1386074565205033039"
    }
  }
}
```

## How It Works

### Website Button Mapping
- **Alpha Program Button** → `alpha_program` channel
- **Beta Program Button** → `beta_program` channel
- **7-Day Trial Button** → `trial_keys` channel
- **HWID Reset Button** → `hwid_reset` channel
- **Submit Script Button** → `script_submission` channel
- **Roadmap Tool Button** → `roadmap_tool` channel
- **All other Discord links** → `main` server invite

### User Experience
When a user clicks a button:
1. They'll be taken to Discord (opens in new tab)
2. If they're not in the server, they'll be prompted to join
3. Once in the server, they'll automatically navigate to the specific channel
4. This provides a seamless experience directing users to the right place

## Testing Your Configuration

1. Update your channel IDs in `links.json`
2. Save the file
3. Refresh your website
4. Click on different buttons to test the links
5. Verify each button opens the correct Discord channel

## Troubleshooting

### Links Not Working?
- Make sure your server and channel IDs are correct
- Ensure the channels are accessible to your community members
- Check that the JSON file is valid (no syntax errors)

### Still Using Default Links?
- Check browser console for any configuration loading errors
- Verify the file path `assets/config/links.json` is correct
- Make sure the web server can serve JSON files

## Additional Features

The configuration system also supports:
- **GitHub links** for team member profiles
- **Website links** for Terms of Service, Privacy Policy, etc.
- **Click tracking** for analytics (logs to browser console)

## Security Note

This configuration file will be publicly accessible since it's served by your web server. Don't include any sensitive information like bot tokens or private server details.
