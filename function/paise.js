function paisaToRupees(paisa) {
  const rupees = paisa / 100;

  return rupees;
}
function rupeesToPaisa(amount) {
  var amount = amount * 100;
  return amount;
}
// to avoid errors related to decimal
module.exports = { rupeesToPaisa, paisaToRupees };













