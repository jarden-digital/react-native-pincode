# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [1.22.6] - 2021-03-12
### Merged
- Merged `Support external pin validation` PR [PR 170](https://github.com/jarden-digital/react-native-pincode/pull/170) from [leo-maidea](https://github.com/leo-maidea)
### Merged
- Merged `Toggle English alphabet appearing on PIN pad` PR [PR 167](https://github.com/jarden-digital/react-native-pincode/pull/167) from [omorkved](https://github.com/omorkved)


## [1.22.5] - 2020-09-12
### Merged
- Merged `Changes to avoid Keychain Prompt on Login screen (Android)` PR [PR 154](https://github.com/jarden-digital/react-native-pincode/pull/154) from [BeInLife](https://github.com/BeInLife)


## [1.22.4] - 2020-08-16
### Merged
- Merged `updated react-native-vector-icons to latest` PR [PR 148](https://github.com/jarden-digital/react-native-pincode/pull/148) from [emmastead](https://github.com/emmastead)


## [1.22.3] - 2020-06-19
### Merged
- Merged `Feature launch touch id from pin pad` PR [PR 142](https://github.com/jarden-digital/react-native-pincode/pull/142) from [NetPumi2](https://github.com/NetPumi2)
- Merged `Fix keychain error android` [PR 144](https://github.com/jarden-digital/react-native-pincode/pull/144) from [szlezak](https://github.com/szlezak)
### Fixed
- Added a test to prevent TouchID being undefined [Issue 141](https://github.com/jarden-digital/react-native-pincode/issues/141)


## [1.22.2] - 2020-03-09
### Fixed
- Fixed the delete button issue [Issue 130](https://github.com/jarden-digital/react-native-pincode/issues/130)


## [1.22.1] - 2020-03-09
### Bumped
- Bumped react-native-keychain to 5.0.1


## [1.22.0] - 2020-03-09
### Merged
- Merged rn0.61 PR [PR 127](https://github.com/jarden-digital/react-native-pincode/pull/127)


## [1.21.0] - 2019-06-27
### Added
- Added `customBackSpaceIcon` and `lockedIconComponent` properties after [Galimpian](https://github.com/galimpian) pull request. Related issue and pull request: ([Issue 99](https://github.com/jarden-digital/react-native-pincode/issues/99)) ([PR 100](https://github.com/jarden-digital/react-native-pincode/pull/100))


## [1.20.41] - 2019-06-27
### Fixed
- Made an mistake in the previous bug fix.


## [1.20.4] - 2019-06-27
### Fixed
- Fixed an issue with the `colorPasswordEmpty` property. Related issue: ([Issue 98](https://github.com/fnzc/react-native-pincode/issues/98)).


## [1.20.3] - 2019-05-23
### Fixed
- Changed the styling to use the full width. Related issue: ([Issue 84](https://github.com/fnzc/react-native-pincode/issues/84)).


## [1.20.2] - 2019-05-03
### Fixed
- Change the behaviour of the error handling in PinEnter to be consistent with PinChoose. Related issue: ([Issue 82](https://github.com/fnzc/react-native-pincode/issues/82)).


## [1.20.1] - 2019-05-02
### Fixed
- Change the TouchID config to allow the `passcodeFallback`. Related issue: ([Issue 83](https://github.com/fnzc/react-native-pincode/issues/83)).


## [1.20.0] - 2019-04-04
### Added
- Added the `textCancelButtonTouchID` property. Related issue: ([Issue 78](https://github.com/fnzc/react-native-pincode/issues/78)).


## [1.19.1] - 2019-04-04
### Fixed
- Fixed a require cycles warning. Related issue: ([Issue 77](https://github.com/fnzc/react-native-pincode/issues/77)).


## [1.19.0] - 2019-04-04
### Changed
- Changed AsyncStorage to use the react-native-community module. Related issue: ([Issue 76](https://github.com/fnzc/react-native-pincode/issues/76)).


## [1.18.0] - 2019-03-19
### Added
- Added `colorPasswordEmpty` property. Related issue: ([Issue 52](https://github.com/fnzc/react-native-pincode/issues/52)).


## [1.17.0] - 2019-03-19
### Added
- Added `stylePinCodeCircle` property. Related issue: ([Issue 74](https://github.com/fnzc/react-native-pincode/issues/74)).


## [1.16.1] - 2019-03-08
### Merged
- Merged [Kevin Wolf](https://github.com/kevinwolfcr) pull request trying to fix an issue with Keychain ([PR 72](https://github.com/fnzc/react-native-pincode/pull/72)).


## [1.16.0] - 2019-03-06
### Added
- Added a property to change the color of the circle buttons. Related issue: [Issue 69](https://github.com/fnzc/react-native-pincode/issues/69).


## [1.15.0] - 2019-03-06
### Added
- Added a property to trigger a callback on TouchID error. Related issue: [Issue 67](https://github.com/fnzc/react-native-pincode/issues/67).


## [1.14.0] - 2019-03-05
### Merged
- Merged [Will](https://github.com/shuchenliu) pull request adding a function to delete the internal states ([PR 71](https://github.com/fnzc/react-native-pincode/pull/71)).


## [1.13.1] - 2019-02-22
### Updated
- Update react-native-touch-id to v4.4.1


## [1.13.0] - 2019-02-18
### Added
- Added an attribute to change the title of the touchID popup on Android. Related issue: [Issue 65](https://github.com/fnzc/react-native-pincode/issues/65).


## [1.12.3] - 2019-01-24
### Fixed
- Fixed the TouchID trigger to allow to change it in the state. Related issue: [Issue 64](https://github.com/fnzc/react-native-pincode/issues/64).


## [1.12.2] - 2019-01-24
### Fixed
- Added the compiled files from the previous 2 versions. Related issue: [Issue 63](https://github.com/fnzc/react-native-pincode/issues/63).


## [1.12.1] - 2019-01-24
### Fixed
- Added the new `finishProcess` function in PinCodeChoose. Related issue: [Issue 63](https://github.com/fnzc/react-native-pincode/issues/63).

## [1.12.0] - 2019-01-24
### Added
- Added an attribute to the `finishProcess` function to return the pinCode to the user. Related issue: [Issue 63](https://github.com/fnzc/react-native-pincode/issues/63).


## [1.11.0] - 2018-12-10
### Added
- Added an attribute to handle the end process. Related issue: [Issue 59](https://github.com/fnzc/react-native-pincode/issues/59).


## [1.10.8] - 2018-12-09
### Fixed
- Removed unused dependency. Related issue: [Issue 60](https://github.com/fnzc/react-native-pincode/issues/60)


## [1.10.7] - 2018-12-09
### Fixed
- Removed React deprecated methods. Related issue: [Issue 58](https://github.com/fnzc/react-native-pincode/issues/58)


## [1.10.6] - 2018-12-07
### Fixed
- Changed the way the password coming from the keychain is handled. Related issue: [Issue 56](https://github.com/fnzc/react-native-pincode/issues/56)


## [1.10.5] - 2018-12-06
### Merged
- Merged [tombaki](https://github.com/tombaki) pull request fixing a couple of issues.


## [1.10.4] - 2018-12-05
### Fixed
- Fixed an issue after the Keychain function change.


## [1.10.3] - 2018-12-03
### Fixed
- Removed an unused property that could have been confusing.


## [1.10.2] - 2018-11-30
### Fixed
- Fixed the way Keychain was used. `setGenericPassword()` and `getGenericPassword()`. Those functions do not allow the user to provide a service name to store the pincode under, resolving in conflicts if using the Keychain somewhere else in the app. Fixed by using `setInternetCredentials()` and `getInternetCredentials()`. Related issue: [Issue 55](https://github.com/fnzc/react-native-pincode/issues/55).


## [1.10.1] - 2018-11-29
### Fixed
- Fixed an issue caused by the `onFail` property. If the component gets unmounted in the `onFail` method it would result in a warning about setting the state on an unmounted component because of the animation of failure (shake). Added a 1500ms delay to prevent this issue. Related issue: [Issue 54](https://github.com/fnzc/react-native-pincode/issues/54).


## [1.10.0] - 2018-11-26
### Added
- Added an property to disable the lock screen. Related issue: [Issue 51](https://github.com/fnzc/react-native-pincode/issues/51).


## [1.9.0] - 2018-11-21
### Added
- Added an attribute to provide a custom component to replace the bottom left empty space. Related issue: [Issue 49](https://github.com/fnzc/react-native-pincode/issues/49).


## [1.8.0] - 2018-11-20
### Added
- Added a function to allow the user to delete the PIN code stored in the Keychain. Related issue: [Issue 50](https://github.com/fnzc/react-native-pincode/issues/50).


## [1.7.6] - 2018-11-16
### Fixed
- Changed the copyright name on the LICENSE file.


## [1.7.5] - 2018-11-13
### Fixed
- Fixed an issue where the onFail and the handleResultPin functions where not triggered as expected. Related issue: [Issue 48](https://github.com/fnzc/react-native-pincode/issues/48).


## [1.7.4] - 2018-10-23
### Merged
- Merged [Dimon70007](https://github.com/Dimon70007) pull request adding a missing property on PinCodeChoose file.


## [1.7.3] - 2018-10-19
### Merged
- Merged [marla-singer](https://github.com/marla-singer) pull request fixing the timer of the locked page.


## [1.7.2] - 2018-10-18
### Merged
- Merged [tskorupka](https://github.com/tskorupka) pull request adding a property to change the subtitle of the locked page. [Issue 41](https://github.com/fnzc/react-native-pincode/issues/41).


## [1.7.1] - 2018-10-13
### Updated
- Updated react-native-touch-id version to 4.1.0 to get the localization fix. Related issue: [Issue 24](https://github.com/fnzc/react-native-pincode/issues/24).


## [1.7.0] - 2018-10-10
### Added
- Added `validationRegex` and `titleValidationFailed` properties to check the PIN code entered by the user against a provided RegExp. Related issue: [Issue 32](https://github.com/fnzc/react-native-pincode/issues/32).


## [1.6.6] - 2018-10-04
### Added
- Added `pinCodeVisible`, `textPasswordVisibleFamily` and `textPasswordVisibleSize` properties to allow the user to see the PIN code they're entering. Related issue: [Issue 37](https://github.com/fnzc/react-native-pincode/issues/37).


## [1.6.5] - 2018-09-26
### Fixed
- Fixed an issue with the pin code not component not resetting after a lock. Fix provided by [marla-singer](https://github.com/marla-singer). Related issue: [Issue 38](https://github.com/fnzc/react-native-pincode/issues/38).


## [1.6.4] - 2018-09-21
### Added
- Added `getCurrentPinLength` property to make the `passwordComponent` property usable. Related issue: [Issue 34](https://github.com/fnzc/react-native-pincode/issues/34).


## [1.6.3] - 2018-09-05
### Fixed
- Buttons layout broken.

### Added
- Added `stylePinCodeHiddenPasswordSizeEmpty` and `stylePinCodeHiddenPasswordSizeFull` properties. Related issue: [Issue 29](https://github.com/fnzc/react-native-pincode/issues/29).

### Merged
- Merged [Dimon70007](https://github.com/Dimon70007) pull request fixing the align center for the icon in the delete button.


## [1.6.2] - 2018-08-24
### Fixed
- Fixed an issue with the stylePinCodeDeleteButtonColorHideUnderlay property. Related issue: [Issue 25](https://github.com/fnzc/react-native-pincode/issues/25).


## [1.6.1] - 2018-08-15
### Merged
- Merged [marla-singer](https://github.com/marla-singer) pull request updating the version of react-native-easy-grid.


## [1.6.0] - 2018-08-13
### Added
- Exposed a new function `hasUserSetPinCode` to know if a user already set a PIN code with the package.


## [1.5.5] - 2018-08-12
### Merged
- Merged [stephenkopylov](https://github.com/stephenkopylov) pull request adding a onFail function triggered when user enters a wrong password.


## [1.5.4] - 2018-07-20
### Added
- Added a prop to remove the icon on the delete button of the PIN panel. Related issue: [Issue 19](https://github.com/Haskkor/react-native-pincode/issues/19).


## [1.5.3] - 2018-07-19
### Fixed
- Changed the react-native-touch-id version to fix a crash on iOS. Related issue: [Issue 20](https://github.com/Haskkor/react-native-pincode/issues/20).


## [1.5.2] - 2018-07-18
### Added
- Added a prop to change the text of the delete button. Related issue: [Issue 19](https://github.com/Haskkor/react-native-pincode/issues/19).


## [1.5.1] - 2018-07-17
### Merged
- Merged [neutrous](https://github.com/neutrous) pull request allowing to avoid the use of Keychain, and preventing YellowBox.


## [1.5.0] - 2018-07-14
### Added
- License file

### Updated
- Readme

### Merged
- Merged [mikecann](https://github.com/mikecann) pull request adding a finish process function to the choose pin flow.
- Merged [Panda-ref](https://github.com/Panda-ref) pull request fixing the lock page main container style.


## [1.4.1] - 2018-07-12
### Added
- Changelog
- MIT license


## [1.4.0] - 2018-07-07
### Merged
- Merged [stephenkopylov](https://github.com/stephenkopylov) pull request adding color props for dots on error state and color props for buttons (normal and selected state).


## [1.3.0] - 2018-07-06
### Added
- Added props to change the color of the title and the subtitle. Related issue: [Issue 9](https://github.com/Haskkor/react-native-pincode/issues/9).
- Added types for the style props.


## [1.2.0] - 2018-07-03
### Added
- Added props to disable the TouchID/FaceID. Related issue: [Issue 8](https://github.com/Haskkor/react-native-pincode/issues/8).


## [1.1.0] - 2018-06-28
### Added
- Added styling props on the components.


## [1.0.5] - 2018-06-22
### Fixed
- Pincode not resetting after the lock screen. Related issue: [Issue 4](https://github.com/Haskkor/react-native-pincode/issues/4).

### Changed
- Animation on the pincode dots was a bit messy when resetting the password.


## [1.0.4] - 2018-06-22
### Fixed
- Changed the react-native-touch-id again to use a fork fixing the issue.


## [1.0.3] - 2018-06-21
### Fixed
- Changed the react-native-touch-id version to fix a crash on android. Related issue: [Issue 3](https://github.com/Haskkor/react-native-pincode/issues/3).


## [1.0.2] - 2018-06-06
### Added
- .gitignore file

### Removed
- Removed the node_modules and the .idea workspace.


## [1.0.1] - 2018-03-24
### Fixed
- Fixed a bug on the lock page causing the timer to take negative values.


## [1.0.0] - 2018-03-23
### Added
- Added the project as used in my company's React Native application.
