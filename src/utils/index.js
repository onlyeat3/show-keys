import keycode from 'keycode';

export default {
  parseKeyName (event) {
    let keyName = keycode(event.rawcode);
    if (keyName != undefined) {
      keyName = keyName.toUpperCase();
      if (event.altKey) {
        keyName = `Alt + ${keyName}`;
      }

      if (event.shiftKey) {
        keyName = `Shift + ${keyName}`;
      }

      if (event.ctrlKey) {
        keyName = `Ctrl + ${keyName}`;
      }


    }
    return keyName;
  }
}