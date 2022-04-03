const strings = require('./strings')


function sendKeyboard(bot, chatId, text, keyboard, then) {
    const options = {
        reply_markup: {
            keyboard,
            resize_keyboard: true,
        },
        disable_web_page_preview: 'true',
        parse_mode: 'HTML'
    }

    options.reply_markup = JSON.stringify(options.reply_markup)
    return bot
        .sendMessage(chatId, text, options)
        .then(then)
        .catch(/** todo: handle error */)
}

const sendInline = async(bot, chatId, text, keyboard, then, markdown) => {
    
    const options = {
        reply_markup: { inline_keyboard: keyboard },
        disable_web_page_preview: 'true',
        parse_mode: 'HTML'
    }

    if (markdown) {
        options.parse_mode = 'Markdown'
    }
    options.reply_markup = JSON.stringify(options.reply_markup)


    return  await bot
        .sendMessage(chatId, text, options)
        .then(then)
        .catch(err => console.log(err))
}

const  sendInlineWithHtmlPreview = async(bot, chatId, text, keyboard, then, markdown) => {
    const options = {
        reply_markup: { inline_keyboard: keyboard },
        disable_web_page_preview: 'false',
        parse_mode: 'HTML'
    }

    if (markdown) {
        options.parse_mode = 'Markdown'
    }
    options.reply_markup = JSON.stringify(options.reply_markup)

    return  await bot
        .sendMessage(chatId, text, options)
        .then(then)
        .catch(err => console.log(err))
}


function hideKeyboard(bot, chatId, text) {
     return bot.sendMessage(chatId, text, {
        reply_markup: JSON.stringify({
            hide_keyboard: true,
        }),
        disable_web_page_preview: 'true',
    })
}

function editMessage(bot, chatId, messageId, text, keyboard) {
    return bot
        .editMessageText(text, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard,
            }),
            disable_web_page_preview: 'true',
            parse_mode: 'HTML'
        })
        .catch(/** todo: handle error */)
}

function editMessageReplyMarkup(bot, chatId, messageId, keyboard) {
    return bot
        .editMessageReplyMarkup(
            JSON.stringify({
                inline_keyboard: keyboard,
            }),
            {
                chat_id: chatId,
                message_id: messageId,
            }
        )
        .catch(/** todo: handle error */)
}


module.exports = {
    hideKeyboard,
    sendInline,
    editMessage,
    sendKeyboard,
    editMessageReplyMarkup,
    sendInlineWithHtmlPreview

}