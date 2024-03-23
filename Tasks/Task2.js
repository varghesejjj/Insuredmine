const cron = require('node-cron');

const Message = require('../Models/Message');

exports.scheduleMessage = async (req, res) => {
    const { message, day, time } = req.body;
    const [hour, minute] = time.split(':'); // Split the time into hour and minute The time is in HH:MM format
    const [year, month, date] = day.split('-'); // Split the date into year, month, and date The date is in YYYY-MM-DD format

    // Schedule the task using node-cron
    cron.schedule(`${minute} ${hour} ${date} ${month} *`, () => {
        const newMessage = new Message({ content: message, date: new Date(year, month - 1, date, hour, minute) });
        newMessage.save()
            .then(() => console.log('Message saved to the database at the scheduled time.'))
            .catch(err => console.error('Error saving message:', err));
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });

    res.send('Message scheduling set up successfully.');
};