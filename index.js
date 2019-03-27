function sendSessionData(uid, data, escaped) {
    return (dispatch, getState) => {
      dispatch({
        type: 'SESSION_USER_DATA',
        data,
        effect() {
          // If no uid is passed, data is sent to the active session.
          const targetUid = uid || getState().sessions.activeUid;
  
          window.rpc.emit('data', {uid: targetUid, data, escaped});
        }
      });
    };
}

function unfuck(data) {
    return data
        .replace(/([A-Z]):\\/, match => "/" + match.toLocaleLowerCase())
        .replace(":", "")
        .replace(/\\/g, "/");
}

exports.middleware = (store) => (next) => (action) => {
    if (action.type == 'SESSION_USER_DATA') {
        var foo = /[A-Z]:(?:\\[A-Za-z ._]+)*\\[A-Za-z._]*/g;

        if (foo.test(action.data)) {
            var betterData = action.data.replace(foo, match => { return unfuck(match); });

            sendSessionData(action.uid, betterData)(store.dispatch, store.getState);
            return null;
        }
    }
    
    return next(action);
};