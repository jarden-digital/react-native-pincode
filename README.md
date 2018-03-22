# react-native-pin
_A customizable PIN Code component for react native_
ADD LIBRARIES USED

## Installation
```
npm install --save react-native-pin
```
or
```
yarn add react-native-pin
```

## Demo

# ![demo](https://cloud.githubusercontent.com/assets/378279/8047315/0237ca2c-0e44-11e5-9a16-1da052406eb0.gif)

## Usage
Basic usage requires choosing between the _**choose**_, _**enter**_ and _**locked**_ modes.
* _**choose**_ : requires the user to choose and to confirm a PIN code
* _**enter**_ : requires the user to enter the PIN code he previously chose
* _**locked**_ : prints a locked screen for a given time if the user failed to enter his/her PIN code too many times

```
import PINCode from 'react-native-pin'
<PINCode status={'choose'}/>
```

## Options
| Key | Description | Default | Required |
|---|---|---|---|
|**`buttonComponentLockedPage`**|Button component to be used at the bottom of the page on the locked application page|TouchableOpacity exit button killing the application|`false`|
|**`buttonDeleteComponent`**|Button component to be used at the bottom right of the PIN panel to delete a previous entry|TouchableHighlight button with a `delete` text and the `backspace` material icon|`false`|
|**`buttonNumberComponent`**|Button component to be used on the PIN panel to select a character for the PIN|TouchableHighlight button with a number text|`false`|
|**`colorPassword`**|Color of the dots used for the password component|`turquoise`|`false`|
|**`handleResultEnterPin`**|Function to be used to handle the PIN code entered by the user. To be used with the **`pinCodeStatus`** props|Functions that checks the validity of the give PIN code, stores the number of failed attempts in the `AsyncStorage` and the time the application was locked if needed|`false`|
|**`iconComponentLockedPage`**|View component to be used between the timer and the text on the locked application page|A circular red View using the `lock` material icon|`false`|
|**`maxAttempts`**|Number of attempts the user is given before locking the application|`3`|`false`|
|**`numbersButtonOverlayColor`**|Color of the PIN panel buttons when `highlighted`|`turquoise`|`false`|
|**`onClickButtonLockedPage`**|Function to be used when the user taps the button on the locked application page|Kills the app by throwing `Quit application`|`false`|
|**`openAppLockedScreen`**|||`false`|
|**`passwordComponent`**|||`false`|
|**`passwordLength`**|||`false`|
|**`pinAttemptsAsyncStorageName`**|||`false`|
|**`pinCodeKeychainName`**|||`false`|
|**`pinCodeStatus`**|||`false`|
|**`pinStatus`**|||`false`|
|**`pinStatusExternal`**|||`false`|
|**`previousPin`**|||`false`|
|**`status`**|Indicates the mode that should be used (see _Usage_ section for the different modes available)|*None*|`true`|
|**`storedPin`**|||`false`|
|**`storePin`**|Function that will be used to store the PIN (pin is given as a string argument)|*Stores the PIN in Keychain/Keystore*|`false`|
|**`subtitleChoose`**|||`false`|
|**`subtitleComponent`**|||`false`|
|**`subtitleConfirm`**|||`false`|
|**`subtitleEnter`**|||`false`|
|**`subtitleError`**|||`false`|
|**`textButtonLockedPage`**|||`false`|
|**`textDescriptionLockedPage`**|||`false`|
|**`textTitleLockedPage`**|||`false`|
|**`timeLocked`**|||`false`|
|**`timePinLockedAsyncStorageName`**|||`false`|
|**`timerComponentLockedPage`**|||`false`|
|**`titleAttemptFailed`**|||`false`|
|**`titleChoose`**|||`false`|
|**`titleComponent`**|||`false`|
|**`titleComponentLockedPage`**|||`false`|
|**`titleConfirm`**|||`false`|
|**`titleConfirmFailed`**|||`false`|
|**`titleEnter`**|||`false`|
|**`touchIDSentence`**|||`false`|

## Contributing

Pull requests are welcome.