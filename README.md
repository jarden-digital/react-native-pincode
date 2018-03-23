# react-native-pincode

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

## Options

| Key | Description | Default | Required | Type |
|---|---|---|---|---|
|**`buttonComponentLockedPage`**|Button component to be used at the bottom of the page on the locked application page|TouchableOpacity exit button killing the application|`false`|`any`|
|**`buttonDeleteComponent`**|Button component to be used at the bottom right of the PIN panel to delete a previous entry|TouchableHighlight button with a `delete` text and the `backspace` material icon|`false`|`any`|
|**`buttonNumberComponent`**|Button component to be used on the PIN panel to select a character for the PIN|TouchableHighlight button with a number text|`false`|`any`|
|**`colorPassword`**|Color of the dots used for the password component|`turquoise`|`false`|`string`|
|**`finishProcess`**|Function to be used when the user enters the right PIN code|Removes the values in AsyncStorage and set the status to `success`|`false`|`any`|
|**`handleResultEnterPin`**|Function to be used to handle the PIN code entered by the user. To be used with the **`pinStatus`** props|Functions that checks the validity of the give PIN code, stores the number of failed attempts in the `AsyncStorage` and the time the application was locked if needed|`false`|`any`|
|**`iconComponentLockedPage`**|View component to be used between the timer and the text on the locked application page|A circular red View using the `lock` material icon|`false`|`any`|
|**`lockedPage`**|View component used as a locked page if the user fails to provide the correct PIN code `maxAttempts` times|A application locked page with a timer indicating to the user the remaining time locked and a button closing the application|`false`|`any`|
|**`maxAttempts`**|Number of attempts the user is given before locking the application|`3`|`false`|`number`|
|**`numbersButtonOverlayColor`**|Color of the PIN panel buttons when `highlighted`|`turquoise`|`false`|`string`|
|**`onClickButtonLockedPage`**|Function to be used when the user taps the button on the locked application page|Kills the app by throwing `Quit application`|`false`|`any`|
|**`passwordComponent`**|Component to be used to indicate to the user how many characters he/she typed|Dots growing or shrinking when the user adds or removes a character in the PIN code|`false`|`any`|
|**`passwordLength`**|Length of the password the user has to enter|`4`|`false`|`number`|
|**`pinAttemptsAsyncStorageName`**|String to be used as a key in AsyncStorage to store the number of attempts the user already made|`pinAttemptsRNPin`|`false`|`string`|
|**`pinCodeKeychainName`**|String to be used as a key to store the PIN code in Keychain/Keystore|`reactNativePinCode`|`false`|`string`|
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
|**`textDescriptionLockedPage`**|String to be used as a description on the locked application page|`To protect your information, access has been locked for {timeLocked} minutes.`|`false`|`string`|
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
|**`touchIDSentence`**|String to be used in the TouchID/FaceID popup|`To unlock your application`|`false`|`string`|

## Contributing

Pull requests are welcome.
