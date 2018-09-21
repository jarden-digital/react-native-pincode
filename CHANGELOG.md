# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [1.6.4] - 2018-09-21
### Added
- Added `getCurrentLength` property to make the `passwordComponent` property usable. Related issue: [Issue 34](https://github.com/fnzc/react-native-pincode/issues/34).


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

### Update
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
