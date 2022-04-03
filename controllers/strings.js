const english = {
    adminId: 860349369,
    groupId: -657821819 ,
    adminMenuOptions: {
        startReferral: 'Start Referral Contest ✅',
        stopReferral: 'Stop Contest ⛔️',
        leaderBoard: 'Leader Board ⭐️'
    },
    selectWinnerInline: 'selectwinnerinline',
    selectWinner: 'Select Winner ✅',
    selectWinnerNotice: 'Please send the ID of the winner !',
    welcomeAdmin: 'Welcome admin',
    noActiveContest: 'There is no active referral contest !',
    activeContest: 'There is an active contest going on !',
    contestStarted: 'Referral Contest has been started ✅',
    sendWinnerId: 'Please send the winner ID !',
    contestFinished: 'The referral contest has finished !',
    contestRank: 'Please send the rank of the winner !',
    cancelText: 'Cancel ❌',
    inputCancelInline: 'inputcancel',
    inlineSeparator: '~',

}

function locale(user) {
    return english
}

module.exports = locale