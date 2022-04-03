const strings = require('./strings');
const User = require('../models/User');
const profile = require('./profile');
const keyboards = require('./keyboards');
const RefferalInfo = require('../models/ReferralInfo');


global.eventEmitter.on(strings().selectWinnerInline, async ({bot, msg}) => {


    if(msg.text.match(/^-?\d+$/)){
        //valid integer (positive or negative)
    }else{
        return keyboards.sendInline(bot, msg.chat.id, 'Please enter a valid number', [
            [{
                text: strings().cancelText,
                callback_data: `${strings().inputCancelInline}${strings().inlineSeparator}`,
            }]
        ]);
    }

    if(parseInt(msg.text) > 10 || parseInt(msg.text) < 1){

        return keyboards.sendInline(bot, msg.chat.id, 'Please enter a number between 1-10', [
            [{
                text: strings().cancelText,
                callback_data: `${strings().inputCancelInline}${strings().inlineSeparator}`,
            }]
        ]);

    }

    const leaderBoard = await User.find({}).sort({invitationScore: -1}).limit(10);

    if(leaderBoard.length == 0 || leaderBoard == undefined) {
        return await keyboards.sendInline(bot, msg.chat.id, 'There are no competitors !', [])
    }

    const winnerTemplate = `
    
    The winner of the competition is 🏆 <a href="tg://user?id=${leaderBoard[parseInt(msg.text -1)].id}"> ${leaderBoard[parseInt(msg.text - 1)].firstName} </a> 🏆
    
    `;

   
    await keyboards.sendInline(bot, strings().groupId, winnerTemplate, [])

    await await keyboards.sendKeyboard(bot, msg.chat.id, winnerTemplate, [
        [
            { text: strings().adminMenuOptions.startReferral }
        ]
    ])

    const adminUser = await User.findOne({id: msg.chat.id});

    adminUser.input_state = undefined;

    await adminUser.save();

    const updateContestantsScore = await User.updateMany({invitationScore: {$gt: 0}}, {invitationScore: 0});

    const updateInvitedBy = await User.updateMany({invitationScore: 0}, {invitedBy: null});


    const checkReferral = await RefferalInfo.find({});
    const existingReferral = await RefferalInfo.findOne({_id: checkReferral[0]._id});

    existingReferral.isActive = false;

    await existingReferral.save();

});


global.eventEmitter.on(strings().inputCancelInline, async ({bot, msg}) => {


    const adminUser = await User.findOne({id: msg.message.chat.id});

    adminUser.input_state = undefined;

    await adminUser.save();

    keyboards.editMessage(bot,msg.message.chat.id, msg.message.message_id, 'The process has been cancelled', [])

});


