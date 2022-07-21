function timeSince(date) {

    let seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return "Just now";
  }

  module.exports = {
    timeSince
  }