# react-native-pincode

[![npm](https://img.shields.io/npm/v/@haskkor/react-native-pincode.svg)](https://www.npmjs.com/package/@haskkor/react-native-pincode) [![npm](https://img.shields.io/npm/dt/@haskkor/react-native-pincode.svg)](https://www.npmjs.com/package/@haskkor/react-native-pincode) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

_A customizable PIN Code component for react native_

Using:
* _**[react-native-keychain](https://github.com/oblador/react-native-keychain)**_ to store the pin in Keychain/Keystore
* _**[react-native-touch-id](https://github.com/naoufal/react-native-touch-id)**_ to authenticate users with FaceID/TouchID
* _**[react-move](https://github.com/react-tools/react-move)**_ for animations
* _**[react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)**_ to use the material icons

## Installation

```
npm install --save @haskkor/react-native-pincode
```
or
```
yarn add @haskkor/react-native-pincode
```

**Please note that:**

Async storage uses the [react-native-async-storage](https://github.com/react-native-community/react-native-async-storage) library which has to be linked

```
react-native link @react-native-community/async-storage
```

If you wish to use the `TouchID/FaceID` authentication you will have to link the [library](https://github.com/naoufal/react-native-touch-id):

```
react-native link react-native-touch-id
```

If you wish to use `Keychain/Keystore` to store the PIN code you will have to link the [library](https://github.com/oblador/react-native-keychain):

```
react-native link react-native-keychain
```

If you wish to use FaceID you'll need to add the permission in your info.plist

```
<key>NSFaceIDUsageDescription</key>
<string>Enabling Face ID allows you quick and secure access to your account.</string>
```

_Please note that you might have to link those libraries manually._

**IMPORTANT:**
_If you decide not to use `Keychain/Keystore`, you will have to provide a **`storePin`** property to the `PINCode` component._

The library uses the `Vibration` from [React Native](https://facebook.github.io/react-native/docs/vibration).
_Please note that on Android it requires the Vibrate permission as stated in the doc. (add <uses-permission android:name="android.permission.VIBRATE"/> to AndroidManifest.xml)_

## Demo

![choose-confirm](https://user-images.githubusercontent.com/10620919/37805052-bdefa610-2e9c-11e8-8290-fe2d695020a5.gif)   ![enter-locked](https://user-images.githubusercontent.com/10620919/37805092-f443c8fe-2e9c-11e8-9524-1e0b6a93fc78.gif)

## Usage

Basic usage requires choosing between the _**choose**_, _**enter**_ and _**locked**_ modes.
* _**choose**_ : requires the user to choose and to confirm a PIN code
* _**enter**_ : requires the user to enter the PIN code he previously chose
* _**locked**_ : prints a locked screen for a given time if the user failed to enter his/her PIN code too many times

```
import PINCode from '@haskkor/react-native-pincode'
<PINCode status={'choose'}/>
```

Package provides a promise to know if a PIN code has been set by the user.
The `serviceName` parameter is optional. If provided, it should match the `pinCodeKeychainName` property.

```
import {hasUserSetPinCode} from '@haskkor/react-native-pincode'
await hasUserSetPinCode(serviceName)
```

One can also use a provided function to delete a PIN code previously set in the Keychain.
The `service name` parameter is optional. If provided, it should match the `pinCodeKeychainName` property.

``` 
import {deleteUserPinCode} from '@haskkor/react-native-pincode'
await deleteUserPinCode(serviceName)
```

If needed, the internal states that record `the number of attemps` and `time of last attempt` can be reset in addition to user pin code deletion.

``` 
import {resetPinCodeInternalStates} from '@haskkor/react-native-pincode'
await resetPinCodeInternalStates()
```

## Options

| Key | Description | Default | Required | Type |
|---|---|---|---|---|
|**`alphabetCharsVisible`**|Boolean to hide/show English alphabet on PIN panel|`false`|`false`|`boolean`|
|**`bottomLeftComponent`**|Component to replace the empty space at the bottom left of the numpad|Empty space|`false`|`any`|
|**`buttonComponentLockedPage`**|Button component to be used at the bottom of the page on the locked application page|TouchableOpacity exit button killing the application|`false`|`any`|
|**`buttonDeleteComponent`**|Button component to be used at the bottom right of the PIN panel to delete a previous entry|TouchableHighlight button with a `delete` text and the `backspace` material icon|`false`|`any`|
|**`buttonDeleteText`**|Text of the of the button used to delete a previous entry on the PIN panel|`delete`|`false`|`string`|
|**`buttonNumberComponent`**|Button component to be used on the PIN panel to select a character for the PIN|TouchableHighlight button with a number text|`false`|`any`|
|**`callbackErrorTouchId`**|Callback to be used when the TouchID authenticate method throws an error|`console.log('TouchID error', e)`|`false`|`(error: Error) => void`|
|**`customBackSpaceIcon`**|Function, that returns custom backspace component to be used to replace the default backspace one on the PIN screen|`Function`|
|**`disableLockScreen`**|Boolean to disable the lock screen|`false`|`false`|`boolean`|
|**`endProcessFunction`**|Function to handle the end of the process|`None`|`false`|`(pinCode: string) => void`|
|**`finishProcess`**|Function to be used when the user enters the right PIN code|Removes the values in AsyncStorage and set the status to `success`|`false`|`(pinCode?: string) => void`|
|**`getCurrentPinLength`**|Function returning the length of the current PIN code|`None`|`false`|`(length: number) => void`|
|**`handleResultEnterPin`**|Function to be used to handle the PIN code entered by the user. Can be used for external-custom pin validation, return boolean to override internal pin validation| undefined |`false`|(pinCode?: string) => bool or undefined|
|**`iconComponentLockedPage`**|View component to be used between the timer and the text on the locked application page|A circular red View using the `lock` material icon|`false`|`any`| 
|**`iconButtonDeleteDisabled`**|Boolean to remove the icon on the delete button of the PIN panel|`false`|`false`|`boolean`|
|**`launchTouchID`**|Function to manually trigger the touchID|`undefined`|`false`|`() => void`|
|**`lockedIconComponent`**|Component to replace the locked icon on the locked application page|`Material lock icon`|`false`|`any`|
|**`lockedPage`**|View component used as a locked page if the user fails to provide the correct PIN code `maxAttempts` times|A application locked page with a timer indicating to the user the remaining time locked and a button closing the application|`false`|`any`|
|**`maxAttempts`**|Number of attempts the user is given before locking the application|`3`|`false`|`number`|
|**`onClickButtonLockedPage`**|Function to be used when the user taps the button on the locked application page|Kills the app by throwing `Quit application`|`false`|`any`|
|**`onFail`**|Function to be used when the user enters the wrong PIN code|Returns number of failed attempts|`false`|`any`|
|**`passwordComponent`**|Component to be used to indicate to the user how many characters he/she typed. To be used with the **`getCurrentPinLength`** prop|Dots growing or shrinking when the user adds or removes a character in the PIN code|`false`|`any`|
|**`passwordLength`**|Length of the password the user has to enter|`4`|`false`|`number`|
|**`pinAttemptsAsyncStorageName`**|String to be used as a key in AsyncStorage to store the number of attempts the user already made|`pinAttemptsRNPin`|`false`|`string`|
|**`pinCodeKeychainName`**|String to be used as a key to store the PIN code in Keychain/Keystore|`reactNativePinCode`|`false`|`string`|
|**`pinCodeVisible`**|Boolean to show/hide the PIN code typed by the user|*None*|`false`|`boolean`|
|**`pinStatus`**|Status coming back to the PIN component after the **`handleResultEnterPin`** function. The status type is a value of the `PinResultStatus` enum (`initial`, `success`, `failure`, `locked`)|`None`|`false`|`PinResultStatus` enum|
|**`status`**|Indicates the mode that should be used (see _Usage_ section for the different modes available)|*None*|`true`|`choose` or `enter` or `locked`|
|**`storedPin`**|The PIN code previously stored with the `storePin` function|The PIN Code previously stored in the Keychain/Keystore|`false`|`string`|
|**`storePin`**|Function that will be used to store the PIN (pin is given as a string argument)|Stores the PIN in Keychain/Keystore|`false`|`any`|
|**`subtitleChoose`**|String used as a subtitle on the PIN code choose page|`to keep your information secure`|`false`|`string`|
|**`subtitleComponent`**|Component to be used as a subtitle on all the PIN code pages|Light grey Text component|`false`|`any`|
|**`subtitleConfirm`**|String used as a subtitle on the PIN code confirmation page|`None`|`false`|`string`|
|**`subtitleEnter`**|String used as a subtitle on the PIN code enter page|`None`|`false`|`string`|
|**`subtitleError`**|String used as a subtitle on the PIN code pages when an error occurs (wrong PIN code used for `enter` or `confirm` modes)|`Please try again`|`false`|`string`|
|**`textButtonLockedPage`**|String to be used as text on the button in the locked application page|`Quit`|`false`|`string`|
|**`textCancelButtonTouchID`**|String to be used as text on the cancel button of the touchID popup. Only for Android|`Cancel`|`false`|`string`|
|**`textDescriptionLockedPage`**|String to be used as a description on the locked application page|`To protect your information, access has been locked for {timeLocked} minutes.`|`false`|`string`|
|**`textSubDescriptionLockedPage`**|String to be used as a subtitle on the locked application page|`Come back later and try again.`|`false`|`string`|
|**`textPasswordVisibleFamily`**|Font to be used for the PIN code numbers when `pinCodeVisible` is true|`system font`|`false`|`string`|
|**`textPasswordVisibleSize`**|Size of the font used for the PIN code numbers when `pinCodeVisible` is true|`22`|`false`|`number`|
|**`textTitleLockedPage`**|String to be used as a title on the locked application page|`Maximum attempts reached`|`false`|`string`|
|**`timeLocked`**|Number of milliseconds where the application should be locked after `maxAttempts` failed attempts from the user|`300000` (5 minutes)|`false`|`number`|
|**`timePinLockedAsyncStorageName`**|String to be used as a key in AsyncStorage to store the time when the user locks the application|`timePinLockedRNPin`|`false`|`string`|
|**`timerComponentLockedPage`**|Component to be used on the application locked page to indicates the remaining locked time to the user|A Text component displaying a timer with the remaining locked time on the application locked page|`false`|`any`|
|**`titleAttemptFailed`**|String used as a title on the PIN enter page when the user enters a wrong PIN code|`Incorrect PIN Code`|`false`|`string`|
|**`titleChoose`**|String used as a title on the PIN choose page|`1 - Enter a PIN Code`|`false`|`string`|
|**`titleComponent`**|Component to be used as a title on all the PIN code pages|Light grey Text component|`false`|`any`|
|**`titleComponentLockedPage`**|Component to be used as a title on the application locked page|Light grey Text component|`false`|`any`|
|**`titleConfirm`**|String used as a title on the PIN confirm page|`2 - Confirm your PIN Code`|`false`|`string`|
|**`titleConfirmFailed`**|String used as a title on the PIN confirm page when the user enters a wrong PIN code|`Your entries did not match`|`false`|`string`|
|**`titleEnter`**|String used as a title on the PIN enter page|`Enter your PIN Code`|`false`|`string`|
|**`titleValidationFailed`**|String used as a title on the PIN choose page when the PIN code entered by the user does not match the provided RegExp (use with `validationRegex` property|`PIN code unsafe`|`false`|`string`|
|**`touchIDDisabled`**|Boolean disabling the TouchID/FaceID on the PIN code enter page|`false`|`false`|`boolean`|
|**`touchIDSentence`**|String to be used in the TouchID/FaceID popup|`To unlock your application`|`false`|`string`|
|**`touchIDTitle`**|ANDROID ONLY. String to be used in the TouchID/FaceID popup title.|`Authentication Required`|`false`|`string`|
|**`validationRegex`**|Regex to be used to validate the PIN code entered by the user on `choose` mode|*None*|`false`|`RegExp`|
|**`vibrationEnabled`**|Boolean enabling vibration feedback when an incorrect PIN is entered|`true`|`false`|`boolean`
|**`delayBetweenAttempts`**|Delay when an incorrect PIN is entered|`3000`|`false`|`number`

## Styles

| Key | Description | Default | Type |
|---|---|---|---|
|**`colorCircleButtons`**|Color of the circle buttons|`rgb(242, 245, 251)`|`string`|
|**`colorPassword`**|Color of the dots used for the password component|`turquoise`|`string`|
|**`colorPasswordEmpty`**|Color of the dots used for the password component when small|`turquoise`|`string`|
|**`colorPasswordError`**|Color of the dots used for the password component on error state|`#9DAFC8`|`string`|
|**`numbersButtonOverlayColor`**|Color of the PIN panel buttons when `highlighted`|`turquoise`|`string`|
|**`styleAlphabet`**|Text of English letters on PIN panel. (First, set `alphabetCharsVisible={true}`)|`fontSize: grid.unit/2, fontWeight: "300"`|`StyleProp<TextStyle>`|
|**`styleMainContainer`**|Main container of index file|`flex: 1, justifyContent: 'center', alignItems: 'center'`|`StyleProp<ViewStyle>`|
|**`stylePinCodeChooseContainer`**|Main container of PinCodeChoose file|`flex: 1, justifyContent: 'center', alignItems: 'center'`|`StyleProp<ViewStyle>`|
|**`stylePinCodeEnterContainer`**|Main container of PinCodeEnter file|`flex: 1, justifyContent: 'center', alignItems: 'center'`|`StyleProp<ViewStyle>`|
|**`styleLockScreenButton`**|Button of the lock screen|`backgroundColor: colors.turquoise, borderRadius: grid.border, paddingLeft: grid.unit * 2, paddingRight: grid.unit * 2, paddingBottom: grid.unit, paddingTop: grid.unit`|`StyleProp<ViewStyle>`|
|**`styleLockScreenColorIcon`**|Color of the icon on the lock screen|`white`|`string`|
|**`styleLockScreenMainContainer`**|Main container of the lock screen|`position: 'absolute', top: 0, backgroundColor: colors.background, flexBasis: 0, left: 0, height: '100%', width: '100%', alignItems: 'center', flex: 1, justifyContent: 'center'`|`StyleProp<ViewStyle>`|
|**`styleLockScreenNameIcon`**|Name of the material icon to be used on the lock screen|`lock`|`string`|
|**`styleLockScreenSizeIcon`**|Size of the icon on the lock screen|`24`|`number`|
|**`styleLockScreenText`**|Text on the lock screen (Come back..., To protect...)|`fontSize: grid.unit, color: colors.base, lineHeight: grid.unit * grid.lineHeight, textAlign: 'center'`|`StyleProp<TextStyle>`|
|**`styleLockScreenTextButton`**|Text of the button of the lock screen|`color: colors.white, fontWeight: 'bold', fontSize: 14`|`StyleProp<TextStyle>`|
|**`styleLockScreenTextTimer`**|Text of the timer of the lock screen|`fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 20, color: colors.base`|`StyleProp<TextStyle>`|
|**`styleLockScreenTitle`**|Title of the lock screen|`fontSize: grid.navIcon, color: colors.base, opacity: grid.mediumOpacity, fontWeight: '200', marginBottom: grid.unit * 4`|`StyleProp<TextStyle>`|
|**`styleLockScreenViewCloseButton`**|View of the button close of the lock screen|`alignItems: 'center', opacity: grid.mediumOpacity, justifyContent: 'center', marginTop: grid.unit * 2`|`StyleProp<ViewStyle>`|
|**`styleLockScreenViewIcon`**|View containing the icon of the lock screen|`width: grid.unit * 4, justifyContent: 'center', alignItems: 'center', height: grid.unit * 4, borderRadius: grid.unit * 2, opacity: grid.mediumOpacity, backgroundColor: colors.alert, overflow: 'hidden', marginBottom: grid.unit * 4`|`StyleProp<ViewStyle>`|
|**`styleLockScreenViewTextLock`**|View containing all the text of the lock screen|`justifyContent: 'center', alignItems: 'center', paddingLeft: grid.unit * 3, paddingRight: grid.unit * 3, flex: 3`|`StyleProp<ViewStyle>`|
|**`styleLockScreenViewTimer`**|View of the timer of the lock screen|`paddingLeft: 30, paddingRight: 30, paddingBottom: 10, paddingTop: 10, borderRadius: 4, borderWidth: 2, borderColor: 'rgb(230, 231, 233)', marginBottom: grid.unit * 4`|`StyleProp<ViewStyle>`|
|**`stylePinCodeButtonCircle`**|Circle button TouchableHighlight of the PinCode file|`alignItems: 'center', justifyContent: 'center', width: grid.unit * 4, height: grid.unit * 4, backgroundColor: 'rgb(242, 245, 251)', borderRadius: grid.unit * 2`|`StyleProp<ViewStyle>`|
|**`stylePinCodeButtonNumber`**|Color of the number buttons on the Pin code page|'white'|`string`|
|**`stylePinCodeButtonNumberPressed`**|Color of the number buttons on the Pin code page when pressed|`#9DAFC8`|`string`|
|**`stylePinCodeCircle`**|Style of the pinCode dots|`left, height, width, opacity, borderRadius, marginLeft, marginRight, and backgroundColor inherited from the animation`|`StyleProp<ViewStyle>`|
|**`stylePinCodeColorSubtitle`**|Color of the PinCode page subtitle in normal state|`#9DAFC8`|`string`|
|**`stylePinCodeColorSubtitleError`**|Color of the the PinCode page subtitle in error state|`#FC4349`|`string`|
|**`stylePinCodeColorTitle`**|Color of the the PinCode page title in normal state|`#9DAFC8`|`string`|
|**`stylePinCodeColorTitleError`**|Color of the the PinCode page title in error state|`#9DAFC8`|`string`|
|**`stylePinCodeColumnButtons`**|Column of buttons of the PinCode file|`alignItems: 'center', width: 'auto'`|`StyleProp<ViewStyle>`|
|**`stylePinCodeColumnDeleteButton`**|Column of the delete button of the PinCode file|`width: grid.unit * 4, height: grid.unit * 4, marginLeft: grid.unit / 2, marginRight: grid.unit / 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'`|`StyleProp<ViewStyle>`|
|**`stylePinCodeDeleteButtonColorHideUnderlay`**|Color of the delete button when underlay is hidden of the PinCode file|`rgb(211, 213, 218)`|`string`|
|**`stylePinCodeDeleteButtonColorShowUnderlay`**|Color of the delete button when underlay is shown of the PinCode file|`colors.turquoise`|`string`|
|**`stylePinCodeDeleteButtonIcon`**|Name of the icon of the delete button of the PinCode file|`backspace`|`string`|
|**`stylePinCodeDeleteButtonSize`**|Size of the icon of the delete button of the PinCode file|`30`|`number`|
|**`stylePinCodeDeleteButtonText`**|Text of the delete button of the PinCode file|`fontWeight: '200', marginTop: 5`|`StyleProp<TextStyle>`|
|**`stylePinCodeEmptyColumn`**|Empty column of the last line of buttons of the PinCode file|`width: grid.unit * 4, height: grid.unit * 4`|`StyleProp<ViewStyle>`|
|**`stylePinCodeHiddenPasswordCircle`**|Circle representing the hidden password of the PinCode file|`flexDirection: 'row', height: 'auto', justifyContent: 'center', alignItems: 'center'`|`StyleProp<ViewStyle>`|
|**`stylePinCodeHiddenPasswordSizeEmpty`**|Size of the circle representing the hidden password of the PinCode file when empty|`4`|`number`|
|**`stylePinCodeHiddenPasswordSizeFull`**|Size of the circle representing the hidden password of the PinCode file when full|`8`|`number`|
|**`stylePinCodeMainContainer`**|Main container of the PinCode file|`flex: 1, justifyContent: 'center', alignItems: 'center'`|`StyleProp<ViewStyle>`|
|**`stylePinCodeRowButtons`**|Row of buttons of the PinCode file|`justifyContent: 'center', alignItems: 'center', width: '100%', height: grid.unit * 5.5`|`StyleProp<ViewStyle>`|
|**`stylePinCodeTextButtonCircle`**|Text of circle button TouchableHighlight of the PinCode file|`fontSize: grid.unit * 2, fontWeight: '200'`|`StyleProp<TextStyle>`|
|**`stylePinCodeTextSubtitle`**|Title of the PinCode file|`fontSize: 20, fontWeight: '200', lineHeight: grid.unit * 2.5`|`StyleProp<TextStyle>`|
|**`stylePinCodeTextTitle`**|Subtitle of the PinCode file|`fontSize: grid.unit, fontWeight: '200', textAlign: 'center'`|`StyleProp<TextStyle>`|
|**`stylePinCodeViewTitle`**|View of the title of the PinCode file|`flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: grid.unit * 4`|`StyleProp<TextStyle>`|

## [Changelog](https://github.com/Haskkor/react-native-pincode/blob/master/CHANGELOG.md)

## Contributing

Pull requests are welcome.

## [License](https://github.com/Haskkor/react-native-pincode/blob/master/LICENSE)
