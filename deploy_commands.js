import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

config();

const commands = [
    new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Setup various settings for XFixer")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
]

export async function deploy(id) {
    const rest = new REST({ version: "10" }).setToken(
        `${process.env.DISCORD_TOKEN}`,
    );

    try {
        console.log("Started refreshing global application (/) commands.");

        await rest.put(Routes.applicationCommands(id), { body: commands });

        console.log("Successfully deployed global application (/) commands.");
    } catch (error) {
        console.error(
            "Error deploying global application (/) commands:",
            error,
        );
    }
}