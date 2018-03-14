const colors = {
  red: '#FC4349',
  alert: '#FC4349',
  green: '#8CC63F',
  valid: '#8CC63F',
  orange: '#ffa500',
  dark: '#213249',
  light: '#F1F5FC',
  background: '#ffffff',
  white: '#ffffff',
  base: '#445878',
  primary: '#799AE0',
  pink: '#FF87C3',
  grey: '#9dafc8',
  turquoise: '#7BCDD0',
  darkBlue: '#1B4581',
  cash: '#FF87C3',
  nzSecurities: '#799AE0',
  property: '#92CDCF',
  nzEquities: '#8CC63F',
  ausEquities: '#DECD58',
  globalEquities: '#FFAA4A',
  altStrategies: '#FC4349',
  globalDebtSecurities: '#213249'
}

const documentColor = (docType: string) => {
  switch (docType) {
    case 'CUSTODY_REPORT':
      return colors.pink
    case 'TAX_REPORT':
    default:
      return colors.primary
  }
}

export { colors, documentColor }
