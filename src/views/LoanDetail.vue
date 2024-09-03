<template>
  <div class="loan-detail">
    <h2>Loan Details</h2>
    <div v-if="loan">
      <p><strong>Amount:</strong> {{ loan.amount }}</p>
      <p><strong>Interest Rate:</strong> {{ loan.interestRate }}</p>
      <p><strong>Term:</strong> {{ loan.term }}</p>
      <p><strong>Purpose:</strong> {{ loan.purpose }}</p>
      <p><strong>Risk Rating:</strong> {{ loan.riskRating }}</p>
      <p><strong>Borrower Name:</strong> {{ loan.borrower.name }}</p>
      <p><strong>Borrower Email:</strong> {{ loan.borrower.email }}</p>
      <p>
        <strong>Borrower Credit Score:</strong> {{ loan.borrower.creditScore }}
      </p>
      <p><strong>Collateral Type:</strong> {{ loan.collateral.type }}</p>
      <p><strong>Collateral Value:</strong> {{ loan.collateral.value }}</p>
      <div v-if="loan.documents.length">
        <h3>Documents</h3>
        <ul>
          <li v-for="doc in loan.documents" :key="doc.type">
            {{ doc.type }}: <a :href="doc.url" target="_blank">View Document</a>
          </li>
        </ul>
      </div>
      <div v-if="loan.repaymentSchedule.installments.length">
        <h3>Repayment Schedule</h3>
        <table class="repayment-schedule">
          <thead>
            <tr>
              <th>Due Date</th>
              <th>Amount Due</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="installment in loan.repaymentSchedule.installments"
              :key="installment.dueDate"
            >
              <td>{{ installment.dueDate }}</td>
              <td>{{ installment.amountDue }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <button @click="$router.go(-1)">Back to Loan List</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoanDetail",
  data() {
    return {
      loan: null,
    };
  },
  async created() {
    // Fetch loan details based on the route parameter
    const loanId = this.$route.params.id;
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/andreascandle/p2p_json_test/main/api/json/loans.json"
      );
      this.loan = response.data.find((loan) => loan.id === loanId);
    } catch (error) {
      console.error("Error fetching loan details:", error);
    }
  },
};
</script>

<style scoped>
.loan-detail {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.loan-detail h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.loan-detail p {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
}

.loan-detail h3 {
  color: #4caf50;
  margin-top: 20px;
  margin-bottom: 10px;
}

.loan-detail ul {
  list-style-type: none;
  padding: 0;
}

.loan-detail li {
  margin-bottom: 10px;
}

.loan-detail a {
  color: #2196f3;
  text-decoration: none;
}

.loan-detail a:hover {
  text-decoration: underline;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #388e3c;
}

.repayment-schedule {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.repayment-schedule th,
.repayment-schedule td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.repayment-schedule th {
  background-color: #4caf50;
  color: white;
}

.repayment-schedule tr:nth-child(even) {
  background-color: #f9f9f9;
}

.repayment-schedule tr:hover {
  background-color: #f1f1f1;
}

@media (max-width: 768px) {
  .loan-detail {
    padding: 15px;
  }

  .loan-detail p,
  .loan-detail li {
    font-size: 14px;
  }

  button {
    font-size: 14px;
    padding: 8px 16px;
  }

  .repayment-schedule th,
  .repayment-schedule td {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .loan-detail {
    padding: 10px;
  }

  .loan-detail p,
  .loan-detail li {
    font-size: 12px;
  }

  button {
    font-size: 12px;
    padding: 6px 12px;
  }

  .repayment-schedule th,
  .repayment-schedule td {
    font-size: 12px;
    padding: 6px;
  }
}
</style>
