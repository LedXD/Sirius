const { Interaction, InteractionType } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                try {
                    await command.execute(interaction, client);
                } catch (error) {
                    console.log(error);
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    });
                }
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error(`There is no code for this button`);
    
            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isUserSelectMenu()) {
        const { selectMenus } = client;
        const { customId } = interaction;
        const menu = selectMenus.get(customId);
        if (!menu) return new Error(`There is no code for this Menu`);

        try {
            await menu.execute(interaction, client);

        } catch (error) {
            console.error(error);
        }

        } else if (interaction.type == InteractionType.ModalSubmit) {
           const { modals } = client;
           const { customId } = interaction;
           const modal = modals.get(customId);
           if (!modal) return new Error(`There is no code for this Modal`);

           try {
            await modal.execute(interaction, client);
           } catch (error) {
            console.error(error);
           }
        }
    },
};
