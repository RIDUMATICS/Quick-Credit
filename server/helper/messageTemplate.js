class messageTemplate {
  static loanApproval(loan) {
    return `<p>Dear Sir/Madam,</p>
    <p>Congratulations! Based on the information furnished by you, we are pleased to inform you that you have been
    approved for a loan with the following parameters:</p>
    <ul>
      <li>Loan Amount: &#x20A6;${loan.amount}</li>
      <li>Monthly Installment: &#x20A6;${loan.paymentInstallment}</li>
      <li>Term of Loan: ${loan.tenor} months</li>
      <li>Interest: &#x20A6;${loan.interest}</li>
      <li>Total Amount: &#x20A6;${loan.balance}</li>
    </ul>
    <p>Manager Operations,<br/>
    QuickCredit, Nigeria.</p>
  `;
  }

  static loanRejection(loan) {
    return `<p>Dear Sir/Madam,</p>
    <p>It give us a pain to appraise you that your request for the loan of &#x20A6;${loan.amount} has
    been rejected by the board of directors of our company.</p>
    <p>Anyhow, we would always be available to serve you in other matters.</p>
    <p>Hoping to serve you in a better way.</p>
    <p>Manager Operations,<br/>
    QuickCredit, Nigeria.</p>
  `;
  }
}

export default messageTemplate;
