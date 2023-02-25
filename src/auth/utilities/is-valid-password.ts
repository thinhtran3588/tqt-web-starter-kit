export default function isValidPassword(
  rule:
    | 'validLength'
    | 'hasAtLeastOneUppercaseLetter'
    | 'hasAtLeastOneLowercaseLetter'
    | 'hasAtLeastOneDigit'
    | 'hasAtLeastOneSpecialCharacter',
  password: string,
) {
  let regExp: RegExp;
  switch (rule) {
    case 'validLength':
      regExp = /.{6,20}/;
      break;
    case 'hasAtLeastOneUppercaseLetter':
      regExp = /[A-Z]/;
      break;
    case 'hasAtLeastOneLowercaseLetter':
      regExp = /[a-z]/;
      break;
    case 'hasAtLeastOneDigit':
      regExp = /\d/;
      break;
    case 'hasAtLeastOneSpecialCharacter':
      regExp = /[^A-Za-z0-9]/;
      break;
    default:
      return false;
  }
  return regExp.test(password);
}
