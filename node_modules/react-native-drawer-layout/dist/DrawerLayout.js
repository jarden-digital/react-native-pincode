Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();var _class, _temp;
var _react = require('react');var _react2 = _interopRequireDefault(_react);
var _reactNativeDismissKeyboard = require('react-native-dismiss-keyboard');var _reactNativeDismissKeyboard2 = _interopRequireDefault(_reactNativeDismissKeyboard);
var _reactNative = require('react-native');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}









var MIN_SWIPE_DISTANCE = 3;
var DEVICE_WIDTH = parseFloat(_reactNative.Dimensions.get('window').width);
var THRESHOLD = DEVICE_WIDTH / 2;
var VX_MAX = 0.1;

var IDLE = 'Idle';
var DRAGGING = 'Dragging';
var SETTLING = 'Settling';var








































DrawerLayout = (_temp = _class = function (_Component) {_inherits(DrawerLayout, _Component);


















  function DrawerLayout(props, context) {_classCallCheck(this, DrawerLayout);var _this = _possibleConstructorReturn(this, (DrawerLayout.__proto__ || Object.getPrototypeOf(DrawerLayout)).call(this,
    props, context));_this.





















































































































    _onOverlayClick = function (e) {
      e.stopPropagation();
      if (!_this._isLockedClosed() && !_this._isLockedOpen()) {
        _this.closeDrawer();
      }
    };_this.

    _emitStateChanged = function (newState) {
      if (_this.props.onDrawerStateChanged) {
        _this.props.onDrawerStateChanged(newState);
      }
    };_this.

    openDrawer = function () {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _this._emitStateChanged(SETTLING);
      _reactNative.Animated.spring(_this.state.openValue, _extends({
        toValue: 1,
        bounciness: 0,
        restSpeedThreshold: 0.1,
        useNativeDriver: _this.props.useNativeAnimations },
      options)).

      start(function () {
        if (_this.props.onDrawerOpen) {
          _this.props.onDrawerOpen();
        }
        _this._emitStateChanged(IDLE);
      });
    };_this.

    closeDrawer = function () {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _this._emitStateChanged(SETTLING);
      _reactNative.Animated.spring(_this.state.openValue, _extends({
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        useNativeDriver: _this.props.useNativeAnimations },
      options)).

      start(function () {
        if (_this.props.onDrawerClose) {
          _this.props.onDrawerClose();
        }
        _this._emitStateChanged(IDLE);
      });
    };_this.

    _handleDrawerOpen = function () {
      if (_this.props.onDrawerOpen) {
        _this.props.onDrawerOpen();
      }
    };_this.

    _handleDrawerClose = function () {
      if (_this.props.onDrawerClose) {
        _this.props.onDrawerClose();
      }
    };_this.

    _shouldSetPanResponder = function (
    e, _ref)

    {var moveX = _ref.moveX,dx = _ref.dx,dy = _ref.dy;
      if (!dx || !dy || Math.abs(dx) < MIN_SWIPE_DISTANCE) {
        return false;
      }

      if (_this._isLockedClosed() || _this._isLockedOpen()) {
        return false;
      }

      if (_this.getDrawerPosition() === 'left') {
        var overlayArea = DEVICE_WIDTH - (
        DEVICE_WIDTH - _this.props.drawerWidth);

        if (_this._lastOpenValue === 1) {
          if (
          dx < 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX > overlayArea)
          {
            _this._isClosing = true;
            _this._closingAnchorValue = _this._getOpenValueForX(moveX);
            return true;
          }
        } else {
          if (moveX <= 35 && dx > 0) {
            _this._isClosing = false;
            return true;
          }

          return false;
        }
      } else {
        var _overlayArea = DEVICE_WIDTH - _this.props.drawerWidth;

        if (_this._lastOpenValue === 1) {
          if (
          dx > 0 && Math.abs(dx) > Math.abs(dy) * 3 || moveX < _overlayArea)
          {
            _this._isClosing = true;
            _this._closingAnchorValue = _this._getOpenValueForX(moveX);
            return true;
          }
        } else {
          if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
            _this._isClosing = false;
            return true;
          }

          return false;
        }
      }
    };_this.

    _panResponderGrant = function () {
      _this._emitStateChanged(DRAGGING);
    };_this.

    _panResponderMove = function (e, _ref2) {var moveX = _ref2.moveX;
      var openValue = _this._getOpenValueForX(moveX);

      if (_this._isClosing) {
        openValue = 1 - (_this._closingAnchorValue - openValue);
      }

      if (openValue > 1) {
        openValue = 1;
      } else if (openValue < 0) {
        openValue = 0;
      }

      _this.state.openValue.setValue(openValue);
    };_this.

    _panResponderRelease = function (
    e, _ref3)

    {var moveX = _ref3.moveX,vx = _ref3.vx;
      var previouslyOpen = _this._isClosing;
      var isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

      if (_this.getDrawerPosition() === 'left') {
        if (
        vx > 0 && moveX > THRESHOLD ||
        vx >= VX_MAX ||
        isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD)
        {
          _this.openDrawer({ velocity: vx });
        } else if (
        vx < 0 && moveX < THRESHOLD ||
        vx < -VX_MAX ||
        isWithinVelocityThreshold && !previouslyOpen)
        {
          _this.closeDrawer({ velocity: vx });
        } else if (previouslyOpen) {
          _this.openDrawer();
        } else {
          _this.closeDrawer();
        }
      } else {
        if (
        vx < 0 && moveX < THRESHOLD ||
        vx <= -VX_MAX ||
        isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD)
        {
          _this.openDrawer({ velocity: -1 * vx });
        } else if (
        vx > 0 && moveX > THRESHOLD ||
        vx > VX_MAX ||
        isWithinVelocityThreshold && !previouslyOpen)
        {
          _this.closeDrawer({ velocity: -1 * vx });
        } else if (previouslyOpen) {
          _this.openDrawer();
        } else {
          _this.closeDrawer();
        }
      }
    };_this.

    _isLockedClosed = function () {
      return _this.props.drawerLockMode === 'locked-closed' &&
      !_this.state.drawerShown;
    };_this.

    _isLockedOpen = function () {
      return _this.props.drawerLockMode === 'locked-open' &&
      _this.state.drawerShown;
    };_this.state = { accessibilityViewIsModal: false, drawerShown: false, openValue: new _reactNative.Animated.Value(0) };return _this;}_createClass(DrawerLayout, [{ key: 'getDrawerPosition', value: function getDrawerPosition() {var drawerPosition = this.props.drawerPosition;var rtl = _reactNative.I18nManager.isRTL;return rtl ? drawerPosition === 'left' ? 'right' : 'left' : drawerPosition;} }, { key: 'componentWillMount', value: function componentWillMount() {var _this2 = this;var openValue = this.state.openValue;openValue.addListener(function (_ref4) {var value = _ref4.value;var drawerShown = value > 0;var accessibilityViewIsModal = drawerShown;if (drawerShown !== _this2.state.drawerShown) {_this2.setState({ drawerShown: drawerShown, accessibilityViewIsModal: accessibilityViewIsModal });}if (_this2.props.keyboardDismissMode === 'on-drag') {(0, _reactNativeDismissKeyboard2.default)();}_this2._lastOpenValue = value;if (_this2.props.onDrawerSlide) {_this2.props.onDrawerSlide({ nativeEvent: { offset: value } });}});this._panResponder = _reactNative.PanResponder.create({ onMoveShouldSetPanResponder: this._shouldSetPanResponder, onPanResponderGrant: this._panResponderGrant, onPanResponderMove: this._panResponderMove, onPanResponderTerminationRequest: function onPanResponderTerminationRequest() {return false;}, onPanResponderRelease: this._panResponderRelease, onPanResponderTerminate: function onPanResponderTerminate() {} });} }, { key: 'render', value: function render() {var _state = this.state,accessibilityViewIsModal = _state.accessibilityViewIsModal,drawerShown = _state.drawerShown,openValue = _state.openValue;var _props = this.props,drawerBackgroundColor = _props.drawerBackgroundColor,drawerWidth = _props.drawerWidth,drawerPosition = _props.drawerPosition;var dynamicDrawerStyles = { backgroundColor: drawerBackgroundColor, width: drawerWidth, left: drawerPosition === 'left' ? 0 : null, right: drawerPosition === 'right' ? 0 : null };var outputRange = void 0;if (this.getDrawerPosition() === 'left') {outputRange = [-drawerWidth, 0];} else {outputRange = [drawerWidth, 0];}var drawerTranslateX = openValue.interpolate({ inputRange: [0, 1], outputRange: outputRange, extrapolate: 'clamp' });var animatedDrawerStyles = { transform: [{ translateX: drawerTranslateX }] };var overlayOpacity = openValue.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7], extrapolate: 'clamp' });var animatedOverlayStyles = { opacity: overlayOpacity };var pointerEvents = drawerShown ? 'auto' : 'none';return _react2.default.createElement(_reactNative.View, _extends({ style: { flex: 1, backgroundColor: 'transparent' } }, this._panResponder.panHandlers), _react2.default.createElement(_reactNative.Animated.View, { style: styles.main }, this.props.children), _react2.default.createElement(_reactNative.TouchableWithoutFeedback, { pointerEvents: pointerEvents, onPress: this._onOverlayClick }, _react2.default.createElement(_reactNative.Animated.View, { pointerEvents: pointerEvents, style: [styles.overlay, animatedOverlayStyles] })), _react2.default.createElement(_reactNative.Animated.View, { accessibilityViewIsModal: accessibilityViewIsModal, style: [styles.drawer, dynamicDrawerStyles, animatedDrawerStyles] }, this.props.renderNavigationView()));} }, { key: '_getOpenValueForX', value: function _getOpenValueForX(

    x) {var
      drawerWidth = this.props.drawerWidth;

      if (this.getDrawerPosition() === 'left') {
        return x / drawerWidth;
      }


      return (DEVICE_WIDTH - x) / drawerWidth;
    } }]);return DrawerLayout;}(_react.Component), _class.defaultProps = { drawerWidth: 0, drawerPosition: 'left', useNativeAnimations: false }, _class.positions = { Left: 'left', Right: 'right' }, _temp);exports.default = DrawerLayout;


var styles = _reactNative.StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1001 },

  main: {
    flex: 1,
    zIndex: 0 },

  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000 } });