<template>
  <div class="loan">
    <h2>Loan List</h2>

    <!-- Filter Options -->
    <div class="filters">
      <label>
        Filter by Amount:
        <input
          type="number"
          v-model="filterAmount"
          placeholder="Enter amount"
        />
      </label>
      <label>
        Filter by Interest Rate:
        <input
          type="number"
          v-model="filterInterestRate"
          placeholder="Enter rate"
        />
      </label>
      <label>
        Filter by Term:
        <input type="number" v-model="filterTerm" placeholder="Enter term" />
      </label>
    </div>

    <!-- Sort Options -->
    <div class="sort-options">
      <label>
        Sort by:
        <select v-model="sortKey">
          <option value="amount">Amount</option>
          <option value="interestRate">Interest Rate</option>
          <option value="term">Term</option>
        </select>
      </label>
      <label>
        Order:
        <select v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>

    <!-- Loan List Table Display -->
    <table class="loan-table">
      <thead>
        <tr>
          <th>Borrower Name</th>
          <th>Amount</th>
          <th>Interest Rate</th>
          <th>Term</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loan in paginatedLoans" :key="loan.id">
          <td>{{ loan.borrower.name }}</td>
          <td>{{ loan.amount }}</td>
          <td>{{ loan.interestRate }}</td>
          <td>{{ loan.term }}</td>
          <td>
            <router-link
              :to="{ name: 'LoanDetail', params: { id: loan.id } }"
              class="btn-details"
            >
              View Details
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
  <LoanChart/>
</template>

<script>
import axios from "axios";
import LoanChart from "../components/LoanChart.vue"
export default {
  name: "LoanList",
  components: {
    LoanChart
  },
  data() {
    return {
      loans: [],
      filterAmount: null,
      filterInterestRate: null,
      filterTerm: null,
      sortKey: "amount",
      sortOrder: "asc",
      currentPage: 1,
      itemsPerPage: 5,
      maxPageButtons: 3,
    };
  },
  computed: {
    filteredLoans() {
      let filtered = this.loans;

      // Apply filters
      if (this.filterAmount) {
        filtered = filtered.filter((loan) => loan.amount == this.filterAmount);
      }
      if (this.filterInterestRate) {
        filtered = filtered.filter(
          (loan) => loan.interestRate == this.filterInterestRate
        );
      }
      if (this.filterTerm) {
        filtered = filtered.filter((loan) => loan.term == this.filterTerm);
      }

      // Sorting
      filtered.sort((a, b) => {
        const modifier = this.sortOrder === "asc" ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });

      return filtered;
    },
    paginatedLoans() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredLoans.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
    },
    pageNumbers() {
      const total = this.totalPages;
      const pages = [];
      const current = this.currentPage;

      if (total <= this.maxPageButtons) {
        // Show all pages if fewer than maxPageButtons
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // Show a subset of pages
        let start = Math.max(current - Math.floor(this.maxPageButtons / 2), 1);
        let end = Math.min(start + this.maxPageButtons - 1, total);

        // Adjust start if end is close to total
        start = Math.max(end - this.maxPageButtons + 1, 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      return pages;
    },
  },
  methods: {
    async fetchLoans() {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/andreascandle/p2p_json_test/main/api/json/loans.json"
        );
        this.loans = response.data;
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
  created() {
    this.fetchLoans();
  },
};
</script>

<style scoped>
.loan {
  margin: 20px auto;
  padding: 20px;
  max-width: 1200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.filters,
.sort-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filters label,
.sort-options label {
  flex: 1;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.filters input,
.sort-options select {
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.loan-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  overflow-x: auto;
}

.loan-table th,
.loan-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.loan-table th {
  background-color: #4caf50;
  color: white;
}

.loan-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.loan-table tr:hover {
  background-color: #ddd;
}

.btn-details {
  display: inline-block;
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.btn-details:hover {
  background-color: #388e3c;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}

.pagination button.active {
  background-color: #388e3c;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filters,
  .sort-options {
    flex-direction: column;
  }

  .filters label,
  .sort-options label {
    min-width: 100%;
  }

  .loan-table th,
  .loan-table td {
    font-size: 14px;
  }

  .btn-details {
    font-size: 12px;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .loan-table th,
  .loan-table td {
    font-size: 12px;
    padding: 8px;
  }
}
</style>
