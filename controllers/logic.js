const bot = require('./telegramBot');
const strings = require('./strings');
const keyboards = require('./keyboards');
const check = require('./messageParser');
const profile = require('./profile');
const User = require('../models/User');
const RefferalInfo = require('../models/ReferralInfo');
const eventManager = require('./eventManager');


bot.on('message', async (msg) =>  {

    // Leave chat if the bot is added to another group
    if(msg.new_chat_participant) {

        if(msg.chat.id != strings().groupId && msg.new_chat_participant.id == 5276811697) { 
        
            bot.leaveChat(msg.chat.id)

        }

    }

    const checkReferral = await RefferalInfo.find({});

    if(checkReferral.length !== 0) {

        const existingReferral = await RefferalInfo.findOne({_id: checkReferral[0]._id});

        if(existingReferral.isActive) {

            if(msg.new_chat_participant) { 
        
                    if(!msg.new_chat_participant.is_bot) {
        
                        if(msg.from.id == msg.new_chat_participant.id) {
                            return
                        }
        
                        const invitee = await User.findOne({id: msg.new_chat_participant.id})
        
                        if(!invitee) {
                            await User.create({
                                id: msg.new_chat_participant.id,
                                firstName: msg.new_chat_participant.first_name,
                                invitedBy: msg.from.id
        
                            });
                        } else {
        
                            invitee.invitedBy = msg.from.id;
                            await invitee.save();
        
                        }
        
                        const inviter = await User.findOne({id: msg.from.id})
        
                        if(!inviter) {
                            await User.create({
                                id: msg.from.id,
                                firstName: msg.from.first_name,
                                invitationScore: 1
                            });
        
                        } else {
                            inviter.invitationScore = inviter.invitationScore + 1;
        
                            await inviter.save();
                        }
        
                    } 
        
                
            } else if(msg.left_chat_participant) { 
        
                if(!msg.left_chat_participant.is_bot) {
        
                    const invitee = await User.findOne({id: msg.left_chat_participant.id})
        
                    if(invitee) { 
        
                        const inviter = await User.findOne({id: invitee.invitedBy})
        
                        if(inviter) {
        
                            inviter.invitationScore = inviter.invitationScore - 1;
                            invitee.invitedBy = undefined;
        
                            await invitee.save();
                            await inviter.save();
        
                        }
                    }
        
                    // await User.deleteOne({id: invitee.id});
        
                }
        
            }

        }

    }

    

    await profile.textInputCheck(msg, async (isTextInput, user) => {

        if( await check.botCommandStart(msg)) {

            const createdUser = await profile.createProfile(bot, msg);

            const checkReferral = await RefferalInfo.find({});

            if(checkReferral.length == 0 || checkReferral == undefined) {
                const createdRefferal = await RefferalInfo.create({})

                if(msg.chat.id == strings().adminId) {
                    await keyboards.sendKeyboard(bot, msg.chat.id, `${strings().welcomeAdmin}. ${strings().noActiveContest}`, [
                        [
                            { text: strings().adminMenuOptions.startReferral }
                        ]
                    ])
                } else {
                    await keyboards.sendInline(bot, msg.chat.id, strings().noActiveContest, [])
                }

                
                
            } else {

                const existingReferral = await RefferalInfo.findOne({_id: checkReferral[0]._id});

                
                if(existingReferral.isActive) {

                    if(msg.chat.id == strings().adminId) {
                        await keyboards.sendKeyboard(bot, msg.chat.id, strings().activeContest, [
                            [
                                { text: strings().adminMenuOptions.leaderBoard },
                                { text: strings().adminMenuOptions.stopReferral }
                            ]
                        ])
                    } else {

                        const leaderBoard = await User.find({}).sort({invitationScore: -1}).limit(10);

                        if(leaderBoard.length == 0 || leaderBoard == undefined) {
                            return await keyboards.sendInline(bot, msg.chat.id, 'There are no competitors !', [])
                        }

                        var leaderBoardText = '⭐️ <b> Referral contest leader board </b> ⭐️ \n\n';

                        leaderBoard.forEach(async function(person, index) {
                            leaderBoardText += `${index+1} : <a href="tg://user?id=${person.id}">${person.firstName} </a> ➡️ ${person.invitationScore} invites \n\n`
                        })

                        await keyboards.sendInline(bot, msg.chat.id, leaderBoardText, [])

                    }

                } else {

                    if(msg.chat.id == strings().adminId) {
                        await keyboards.sendKeyboard(bot, msg.chat.id, `${strings().welcomeAdmin}. ${strings().noActiveContest}`, [
                            [
                                { text: strings().adminMenuOptions.startReferral }
                            ]
                        ])
                    } else {
                        await keyboards.sendInline(bot, msg.chat.id, strings().noActiveContest, [])
                    }

                }

            }
            

        } else if(msg.entities) {
            
            if(msg.entities[0].type === 'bot_command') {

                console.log(msg)
                if(msg.text == '/competition@Apolloinvites_bot' || msg.text == '/competition') {

                    const checkReferral = await RefferalInfo.find({});
                    const existingReferral = await RefferalInfo.findOne({_id: checkReferral[0]._id});

                    if(existingReferral.isActive) {

                        const leaderBoard = await User.find({}).sort({invitationScore: -1}).limit(10);

                        if(leaderBoard.length == 0 || leaderBoard == undefined) {
                            return await keyboards.sendInline(bot, msg.chat.id, 'There are no competitors !', [])
                        }
                
                        var leaderBoardText = '⭐️ <b> Referral contest leader board </b> ⭐️ \n\n';
                
                        leaderBoard.forEach(async function(person, index) {
                            leaderBoardText += `${index+1} : <a href="tg://user?id=${person.id}">${person.firstName} </a> ➡️ ${person.invitationScore} invites \n\n`
                        })
                
                        await keyboards.sendInline(bot, msg.chat.id, leaderBoardText, [])

                        } else {
                            await keyboards.sendInline(bot, msg.chat.id, strings().noActiveContest, [])
                        }

            }

            }
            
        }else if (isTextInput) {

            global.eventEmitter.emit(isTextInput, { msg, user, bot });

        } else if (check.replyMarkup(msg)) {

            if(!msg.text) {
                return
            }
            handleKeyboard(msg); 
        }

    });

});

bot.on('callback_query', (msg) => {

    

    const options = msg.data.split(strings().inlineSeparator);
    const inlineQuery = options[0];
    console.log(inlineQuery)
    global.eventEmitter.emit(inlineQuery, { bot, msg });
});

async function handleKeyboard(msg) {

    const adminMenuOptions = strings().adminMenuOptions;

    if(msg.text == adminMenuOptions.startReferral) {

        if(msg.chat.id == strings().adminId) {

            const updateContestantsScore = await User.updateMany({invitationScore: {$gt: 0}}, {invitationScore: 0});

            const updateInvitedBy = await User.updateMany({invitationScore: 0}, {invitedBy: null});

            const checkReferral = await RefferalInfo.find({});
            const existingReferral = await RefferalInfo.findOne({_id: checkReferral[0]._id});

            if(existingReferral.isActive) {
                return await keyboards.sendKeyboard(bot, msg.chat.id, strings().activeContest, [
                    [
                        { text: strings().adminMenuOptions.leaderBoard },
                        { text: strings().adminMenuOptions.stopReferral }
                    ]
                ])
            } else {
                existingReferral.isActive = true;
                await existingReferral.save();

                await keyboards.sendKeyboard(bot, strings().groupId, strings().contestStarted, []);

                await keyboards.sendKeyboard(bot, msg.chat.id, strings().contestStarted, [
                    [
                        { text: strings().adminMenuOptions.leaderBoard },
                        { text: strings().adminMenuOptions.stopReferral }
                    ]
                ])
            }
        }

    } else if(msg.text == adminMenuOptions.stopReferral) {

        if(msg.chat.id == strings().adminId) {

            const adminUser = await User.findOne({id: msg.chat.id});

            adminUser.input_state = strings().selectWinnerInline;

            await adminUser.save();

            await keyboards.sendInline(bot, msg.chat.id, strings().contestRank, [
                [{
                    text: strings().cancelText,
                    callback_data: `${strings().inputCancelInline}${strings().inlineSeparator}`,
                }]
            ])

        }

        

    } else if(msg.text == adminMenuOptions.leaderBoard) {

        const leaderBoard = await User.find({}).sort({invitationScore: -1}).limit(10);

        if(leaderBoard.length == 0 || leaderBoard == undefined) {
            return await keyboards.sendInline(bot, msg.chat.id, 'There are no competitors !', [])
        }

        var leaderBoardText = '⭐️ <b> Referral contest leader board </b> ⭐️ \n\n';

        leaderBoard.forEach(async function(person, index) {
            leaderBoardText += `${index+1} : <a href="tg://user?id=${person.id}">${person.firstName} </a> ➡️ ${person.invitationScore} invites \n\n`
        })

        await keyboards.sendInline(bot, msg.chat.id, leaderBoardText, [])

    }

}

