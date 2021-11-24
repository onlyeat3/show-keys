import keycode from 'keycode';

export default {
  parseKeyName (event) {
    let keyName = keycode(event.rawcode);
    if (event.metaKey && event.rawcode == 91) {
      let alias = 'Windws';
      if (process.platform == 'darwin') {
        alias = '⌘';
      }
      keyName = alias;
    }

    if (event.altKey && event.rawcode == 164) {
      keyName = `Alt`;
    }

    if (event.shiftKey && event.rawcode == 160) {
      keyName = `Shift`;
    }

    if (event.ctrlKey && event.rawcode == 162) {
      keyName = `Ctrl`;
    }

    if (keyName) {
      keyName = keyName.toUpperCase();
      //美化
      if (keyName == 'LEFT') {
        keyName = '←';
      }
      if (keyName == 'RIGHT') {
        keyName = '→';
      }
      if (keyName == 'UP') {
        keyName = '↑';
      }

      if (keyName == 'DOWN') {
        keyName = '↓';
      }

      /**
       *  'windows': number;
          '⇧': number;
          '⌥': number;
          '⌃': number;
          '⌘': number;
       */
    }
    return keyName;
  }
}