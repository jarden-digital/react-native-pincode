Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = dismissKeyboard;

var _reactNative = require('react-native');

var TextInputState = _reactNative.TextInput.State;

function dismissKeyboard() {
  TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
}

module.exports = exports.default;