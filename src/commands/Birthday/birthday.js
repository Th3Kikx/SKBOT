import { SlashCommandBuilder, MessageFlags, ChannelType } from 'discord.js';
import { createEmbed, errorEmbed, successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

import birthdaySet from './modules/birthday_set.js';
import birthdayInfo from './modules/birthday_info.js';
import birthdayList from './modules/birthday_list.js';
import birthdayRemove from './modules/birthday_remove.js';
import nextBirthdays from './modules/next_birthdays.js';
import birthdaySetchannel from './modules/birthday_setchannel.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';
export default {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('Comandos del sistema de cumpleaños')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Establece tu cumpleaños')
                .addIntegerOption(option =>
                    option
                        .setName('month')
                        .setDescription('Mes de nacimiento (1-12)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(12)
                )
                .addIntegerOption(option =>
                    option
                        .setName('day')
                        .setDescription('Dia de nacimiento (1-31)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(31)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Ver información de cumpleaños')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('User para comprobar el cumpleaños de')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lista todos los cumpleaños en el servidor')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Quitar tu cumpleaños')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('next')
                .setDescription('Show upcoming birthdays')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setchannel')
                .setDescription('Configura o desactiva el canal para anuncios de cumpleaños. (Se requiere administrar el servidor).')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Canal de texto para anuncios. Déjelo vacío para desactivarlo.')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(false)
                )
        ),

    async execute(interaction, config, client) {
        try {
            const subcommand = interaction.options.getSubcommand();
            
            switch (subcommand) {
                case 'set':
                    return await birthdaySet.execute(interaction, config, client);
                case 'info':
                    return await birthdayInfo.execute(interaction, config, client);
                case 'list':
                    return await birthdayList.execute(interaction, config, client);
                case 'remove':
                    return await birthdayRemove.execute(interaction, config, client);
                case 'next':
                    return await nextBirthdays.execute(interaction, config, client);
                case 'setchannel':
                    return await birthdaySetchannel.execute(interaction, config, client);
                default:
                    return InteractionHelper.safeReply(interaction, {
                        embeds: [errorEmbed('Error', 'Unknown subcommand')],
                        flags: MessageFlags.Ephemeral
                    });
            }
        } catch (error) {
            logger.error('La ejecución del comando de cumpleaños falló', {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'birthday',
                subcommand: interaction.options.getSubcommand()
            });
            await handleInteractionError(interaction, error, {
                commandName: 'birthday',
                source: 'birthday_command'
            });
        }
    }
};
